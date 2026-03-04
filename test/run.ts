#!/usr/bin/env npx tsx
/**
 * Executable integration test runner for the League Broadcast Client.
 *
 * Run against a live backend:
 *   npx tsx test/run.ts
 *   npx tsx test/run.ts --host 127.0.0.1 --port 58869
 *   npx tsx test/run.ts --skip-ws          # REST-only
 *   npx tsx test/run.ts --skip-rest        # WebSocket-only
 *   npx tsx test/run.ts --timeout 30000    # wait up to 30s for WS data
 *
 * Requires the backend to be running.
 */

import {
  LeagueBroadcastClient,
  GameState,
  ApiError,
  shallowEqual,
  type ingameFrontendData,
  type champSelectStateData,
  type GameStateSnapshot,
  type ChampSelectSnapshot,
} from "../src/index.js";

// ─── CLI args ────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name: string, fallback: string) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
  };
  const has = (name: string) => args.includes(`--${name}`);

  return {
    host: get("host", "localhost"),
    port: Number(get("port", "58869")),
    skipWs: has("skip-ws"),
    skipRest: has("skip-rest"),
    wsTimeout: Number(get("timeout", "15000")),
    help: has("help") || has("h"),
  };
}

// ─── Logging helpers ─────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

let passed = 0;
let failed = 0;
let skipped = 0;

function log(msg: string) {
  console.log(msg);
}

function heading(title: string) {
  log(`\n${BOLD}${CYAN}══ ${title} ══${RESET}`);
}

function pass(name: string, detail?: string) {
  passed++;
  const extra = detail ? ` ${DIM}(${detail})${RESET}` : "";
  log(`  ${GREEN}✓${RESET} ${name}${extra}`);
}

function fail(name: string, error: unknown) {
  failed++;
  const msg = error instanceof Error ? error.message : String(error);
  log(`  ${RED}✗${RESET} ${name}`);
  log(`    ${RED}${msg}${RESET}`);
}

function skip(name: string, reason?: string) {
  skipped++;
  const extra = reason ? ` — ${reason}` : "";
  log(`  ${YELLOW}○${RESET} ${name}${DIM}${extra}${RESET}`);
}

function summary() {
  log(`\n${BOLD}── Summary ──${RESET}`);
  log(
    `  ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : ""}${failed} failed${RESET}  ${YELLOW}${skipped} skipped${RESET}`,
  );
  return failed === 0;
}

// ─── Test helpers ────────────────────────────────────────────────────────────

async function runTest(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    fail(name, e);
  }
}

/**
 * Like runTest but treats specific HTTP status codes as an expected skip
 * rather than a failure (e.g. 404 when no game is running).
 */
async function runTestAllowHttpStatus(
  name: string,
  allowedStatuses: number[],
  fn: () => Promise<void>,
) {
  try {
    await fn();
    pass(name);
  } catch (e) {
    if (e instanceof ApiError && allowedStatuses.includes(e.status)) {
      skip(name, `${e.status} ${e.statusText} (expected when resource doesn't exist)`);
    } else {
      fail(name, e);
    }
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertDefined<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined)
    throw new Error(`Expected ${label} to be defined, got ${value}`);
  return value;
}

function assertType(value: unknown, expected: string, label: string) {
  const actual = typeof value;
  if (actual !== expected)
    throw new Error(
      `Expected ${label} to be ${expected}, got ${actual} (${JSON.stringify(value)})`,
    );
}

/**
 * Wait for a specific condition to become true within a timeout.
 * Resolves with the first truthy value returned by `predicate`.
 */
function waitFor<T>(
  predicate: () => T | null | undefined | false,
  timeoutMs: number,
  description: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const result = predicate();
      if (result) return resolve(result);
      if (Date.now() - start > timeoutMs)
        return reject(
          new Error(`Timed out waiting for: ${description} (${timeoutMs}ms)`),
        );
      setTimeout(check, 250);
    };
    check();
  });
}

// ─── REST API tests ──────────────────────────────────────────────────────────

async function testRestApi(client: LeagueBroadcastClient) {
  heading("REST API — Ingame");

  await runTest("GET ingame/status returns a number", async () => {
    const status = await client.api.ingame.getGameState();
    assertType(status, "number", "gameState");
  });

  await runTest("GET ingame/mock returns a boolean", async () => {
    const mocking = await client.api.ingame.getMockingStatus();
    assertType(mocking, "boolean", "mockingStatus");
  });

  await runTest("GET ingame/frontend returns a string", async () => {
    const url = await client.api.ingame.getFrontendUrl();
    assertType(url, "string", "frontendUrl");
  });

  heading("REST API — Season");

  await runTest("GET season returns an array", async () => {
    const seasons = await client.api.season.getAllSeasons();
    assert(Array.isArray(seasons), "seasons should be an array");
    pass("seasons count", `${seasons.length} season(s)`);
  });

  let currentSeasonId: number | undefined;
  await runTest("GET season/current/id returns a number", async () => {
    currentSeasonId = await client.api.season.getCurrentSeasonId();
    assertType(currentSeasonId, "number", "currentSeasonId");
    pass("current season id", `${currentSeasonId}`);
  });

  await runTest("GET season/current returns season data", async () => {
    const season = await client.api.season.getCurrentSeason();
    assertDefined(season, "currentSeason");
    assert(
      typeof season.seasonName === "string",
      "season.seasonName should be a string",
    );
  });

  await runTest("GET season/current/teams returns an array", async () => {
    const teams = await client.api.season.getCurrentSeasonTeams();
    assert(Array.isArray(teams), "teams should be an array");
    pass("teams count", `${teams.length} team(s)`);
  });

  heading("REST API — Match");

  await runTest("GET match/current returns match data", async () => {
    const match = await client.api.match.getCurrentMatch();
    assertDefined(match, "currentMatch");
  });

  await runTest("GET match/current/id returns a number", async () => {
    const id = await client.api.match.getCurrentMatchId();
    assertType(id, "number", "currentMatchId");
    pass("current match id", `${id}`);
  });

  await runTest("GET match/current/bestof returns a value", async () => {
    const bestOf = await client.api.match.getCurrentMatchBestOf();
    assertDefined(bestOf, "bestOf");
  });

  await runTest("GET match/current/teams returns an array", async () => {
    const teams = await client.api.match.getCurrentMatchTeams();
    assert(Array.isArray(teams), "teams should be an array");
  });

  heading("REST API — Game");

  await runTestAllowHttpStatus(
    "GET game/current returns game data",
    [404],
    async () => {
      const game = await client.api.game.getCurrentGame();
      assertDefined(game, "currentGame");
    },
  );

  heading("REST API — PreGame");

  await runTest("GET championselect/mock returns a boolean", async () => {
    const mocking = await client.api.preGame.getMockingStatus();
    assertType(mocking, "boolean", "pregameMockingStatus");
  });

  await runTest("GET championselect/frontend returns a string", async () => {
    const url = await client.api.preGame.getFrontendUrl();
    assertType(url, "string", "pregameFrontendUrl");
  });
}

// ─── URL construction tests ──────────────────────────────────────────────────

async function testUrls(
  client: LeagueBroadcastClient,
  host: string,
  port: number,
) {
  heading("URL Construction");

  await runTest("getApiUrl() forms correct URL", () => {
    const url = client.getApiUrl();
    assert(
      url === `http://${host}:${port}/api`,
      `expected http://${host}:${port}/api, got ${url}`,
    );
  });

  await runTest("getCacheUrl() forms correct base URL", () => {
    const url = client.getCacheUrl();
    assert(
      url === `http://${host}:${port}/cache`,
      `expected http://${host}:${port}/cache, got ${url}`,
    );
  });

  await runTest("getCacheUrl(path) resolves path", () => {
    const url = client.getCacheUrl("/champions/aatrox.png");
    assert(
      url === `http://${host}:${port}/cache/champions/aatrox.png`,
      `got ${url}`,
    );
  });

  await runTest("getCacheUrl() strips leading /cache prefix", () => {
    const url = client.getCacheUrl("cache/items/1001.png");
    assert(url.endsWith("/cache/items/1001.png"), `got ${url}`);
    assert(!url.includes("/cache/cache/"), `double cache prefix in ${url}`);
  });

  await runTest("getCacheUrl() passes through fully-qualified URLs", () => {
    const external = "https://cdn.example.com/image.png";
    const url = client.getCacheUrl(external);
    assert(url === external, `expected passthrough, got ${url}`);
  });
}

// ─── Reactive store tests (synchronous, no backend data needed) ──────────────

async function testReactiveStores(client: LeagueBroadcastClient) {
  heading("Reactive Stores — Ingame");

  await runTest("ingameStore.getSnapshot() returns a frozen snapshot", () => {
    const snap = client.ingameStore.getSnapshot();
    assertDefined(snap, "snapshot");
    assertType(snap.version, "number", "snapshot.version");
    assert(Object.isFrozen(snap), "snapshot should be frozen");
  });

  await runTest("ingameStore.getVersion() returns a number", () => {
    const version = client.ingameStore.getVersion();
    assertType(version, "number", "version");
  });

  await runTest("selectIngame() returns a Subscribable", () => {
    const slice = client.selectIngame((s) => s.gameData.gameTime);
    assertDefined(slice, "slice");
    assertType(slice.subscribe, "function", "slice.subscribe");
    assertType(slice.getSnapshot, "function", "slice.getSnapshot");
  });

  await runTest("selectIngame() subscribe/unsubscribe works", () => {
    const slice = client.selectIngame((s) => s.gameState);
    let called = false;
    const unsub = slice.subscribe(() => {
      called = true;
    });
    assertType(unsub, "function", "unsubscribe");
    unsub();
    // After unsub, calling it again should not throw
    unsub();
  });

  await runTest("watchIngame() returns unsubscribe function", () => {
    const unsub = client.watchIngame(
      (s) => s.gameData.gameTime,
      () => {},
    );
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  heading("Reactive Stores — PreGame");

  await runTest("preGameStore.getSnapshot() returns a frozen snapshot", () => {
    const snap = client.preGameStore.getSnapshot();
    assertDefined(snap, "snapshot");
    assertType(snap.version, "number", "snapshot.version");
    assert(Object.isFrozen(snap), "snapshot should be frozen");
  });

  await runTest("selectChampSelect() returns a Subscribable", () => {
    const slice = client.selectChampSelect((s) => s.isActive);
    assertDefined(slice, "slice");
    assertType(slice.subscribe, "function", "slice.subscribe");
    assertType(slice.getSnapshot, "function", "slice.getSnapshot");
  });

  await runTest("watchChampSelect() returns unsubscribe function", () => {
    const unsub = client.watchChampSelect(
      (s) => s.champSelectData.timer,
      () => {},
    );
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });
}

// ─── WebSocket connection tests ──────────────────────────────────────────────

async function testWebSocketConnection(
  client: LeagueBroadcastClient,
  timeoutMs: number,
) {
  heading("WebSocket — Connection");

  await runTest("ingame WS is connected", () => {
    assert(client.isIngameConnected(), "ingame WS should be connected");
  });

  await runTest("pregame WS is connected", () => {
    assert(client.isPreGameConnected(), "pregame WS should be connected");
  });

  heading("WebSocket — Event Handlers");

  await runTest("onIngameStateUpdate registers and unregisters", () => {
    let received = false;
    const unsub = client.onIngameStateUpdate(() => {
      received = true;
    });
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  await runTest("onIngameStatusChange registers and unregisters", () => {
    const unsub = client.onIngameStatusChange(() => {});
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  await runTest("onChampSelectUpdate registers and unregisters", () => {
    const unsub = client.onChampSelectUpdate(() => {});
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  await runTest("onIngameConnect registers and unregisters", () => {
    const unsub = client.onIngameConnect(() => {});
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  await runTest("onPreGameConnect registers and unregisters", () => {
    const unsub = client.onPreGameConnect(() => {});
    assertType(unsub, "function", "unsubscribe");
    unsub();
  });

  // ── Live data tests ──
  // If neither in-game nor champ-select is active, try enabling mocking via
  // the REST API so we actually have data flowing through the WebSockets.
  // We set up event listeners BEFORE enabling mocking to avoid racing the
  // first WS message.

  heading("WebSocket — Live Data");

  let enabledIngameMocking = false;
  let enabledPreGameMocking = false;

  // -- Ingame ----------------------------------------------------------------

  let gameState = client.getIngameState();
  let isInGame =
    gameState === GameState.Running || gameState === GameState.Paused;

  if (!isInGame) {
    try {
      // Set up a listener BEFORE enabling mocking so we catch the first push
      const ingameReady = new Promise<void>((resolve) => {
        const unsub = client.onIngameStatusChange((status) => {
          if (status === GameState.Running || status === GameState.Paused) {
            gameState = status;
            isInGame = true;
            unsub();
            resolve();
          }
        });
        // Also listen for state updates (mocking may push data before status)
        const unsub2 = client.onIngameStateUpdate((data) => {
          if (data.gameTime > 0) {
            isInGame = true;
            unsub();
            unsub2();
            resolve();
          }
        });
        setTimeout(() => { unsub(); unsub2(); resolve(); }, Math.min(timeoutMs, 10000));
      });

      const alreadyMocking = await client.api.ingame.getMockingStatus();
      if (!alreadyMocking) {
        log(`  ${DIM}No active game — enabling ingame mocking via API...${RESET}`);
        await client.api.ingame.mockIngame(true);
        enabledIngameMocking = true;
      } else {
        log(`  ${DIM}Ingame mocking already active — waiting for data...${RESET}`);
      }

      await ingameReady;
    } catch {
      // API call failed — skip gracefully
    }
  }

  if (isInGame) {
    await runTest("getIngameData() returns populated data during game", () => {
      const data = client.getIngameData();
      assertDefined(data, "ingameData");
      assert(data.gameTime > 0, `gameTime should be > 0, got ${data.gameTime}`);
    });

    await runTest(
      "ingameStore receives live updates via selectIngame",
      async () => {
        const slice = client.selectIngame((s) => s.gameData.gameTime);
        const initial = slice.getSnapshot();

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("No gameTime update within timeout")),
            Math.min(timeoutMs, 5000),
          );
          const unsub = slice.subscribe(() => {
            const next = slice.getSnapshot();
            if (next !== initial) {
              clearTimeout(timer);
              unsub();
              resolve();
            }
          });
        });
      },
    );

    await runTest(
      "watchIngame fires callback on game data change",
      async () => {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("No watchIngame callback within timeout")),
            Math.min(timeoutMs, 5000),
          );
          const unsub = client.watchIngame(
            (s) => s.gameData.gameTime,
            (val) => {
              clearTimeout(timer);
              unsub();
              resolve();
            },
          );
        });
      },
    );
  } else {
    skip(
      "Live ingame data tests",
      `game state is ${GameState[gameState] ?? gameState} — mocking did not produce game data`,
    );
  }

  // -- Champion select -------------------------------------------------------

  let champSelectActive = client.isChampSelectActive();
  let champSelectHasData = champSelectActive;

  if (!champSelectActive) {
    try {
      // Set up listeners BEFORE enabling mocking so we catch the first push.
      // Accept any state update — the mock may push isActive=false first.
      const champSelectReady = new Promise<void>((resolve) => {
        const unsub = client.onChampSelectUpdate((data) => {
          champSelectHasData = true;
          if (data.isActive) {
            champSelectActive = true;
          }
          unsub();
          resolve();
        });
        setTimeout(() => { unsub(); resolve(); }, Math.min(timeoutMs, 10000));
      });

      const alreadyMocking = await client.api.preGame.getMockingStatus();
      if (!alreadyMocking) {
        log(`  ${DIM}No active draft — enabling pregame mocking via API...${RESET}`);
        await client.api.preGame.mockChampionSelect(true, 3000);
        enabledPreGameMocking = true;
      } else {
        log(`  ${DIM}Pregame mocking already active — waiting for data...${RESET}`);
      }

      await champSelectReady;

      // If we got data but isActive was false, wait a bit more for it to become active
      if (champSelectHasData && !champSelectActive) {
        log(`  ${DIM}Got champ-select data (isActive=false), waiting for active state...${RESET}`);
        await new Promise<void>((resolve) => {
          const unsub = client.onChampSelectUpdate((data) => {
            if (data.isActive) {
              champSelectActive = true;
              unsub();
              resolve();
            }
          });
          setTimeout(() => { unsub(); resolve(); }, Math.min(timeoutMs, 8000));
        });
      }
    } catch {
      // API call failed — skip gracefully
    }
  }

  if (champSelectActive) {
    await runTest(
      "getChampSelectData() returns active data during draft",
      () => {
        const data = client.getChampSelectData();
        assertDefined(data, "champSelectData");
        assert(data.isActive, "champ select should be active");
      },
    );

    await runTest(
      "preGameStore receives live updates via selectChampSelect",
      async () => {
        const slice = client.selectChampSelect(
          (s) => s.champSelectData.timer.timeRemaining,
        );
        const initial = slice.getSnapshot();

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("No timer update within timeout")),
            Math.min(timeoutMs, 10000),
          );
          const unsub = slice.subscribe(() => {
            const next = slice.getSnapshot();
            if (next !== initial) {
              clearTimeout(timer);
              unsub();
              resolve();
            }
          });
        });
      },
    );

    await runTest(
      "watchChampSelect fires callback on champ-select change",
      async () => {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new Error("No watchChampSelect callback within timeout")),
            Math.min(timeoutMs, 5000),
          );
          const unsub = client.watchChampSelect(
            (s) => s.champSelectData.timer.timeRemaining,
            () => {
              clearTimeout(timer);
              unsub();
              resolve();
            },
          );
        });
      },
    );
  } else if (champSelectHasData) {
    skip(
      "Live champ-select data tests",
      "champ-select data received but isActive is false",
    );
  } else {
    skip(
      "Live champ-select data tests",
      "no champ-select data received — mocking may not be available",
    );
  }

  // -- Cleanup mocking -------------------------------------------------------

  if (enabledIngameMocking) {
    log(`  ${DIM}Disabling ingame mocking...${RESET}`);
    await client.api.ingame.mockIngame(false).catch(() => {});
  }
  if (enabledPreGameMocking) {
    log(`  ${DIM}Disabling pregame mocking...${RESET}`);
    await client.api.preGame.mockChampionSelect(false).catch(() => {});
  }
}

// ─── Data accessor tests ─────────────────────────────────────────────────────

async function testDataAccessors(client: LeagueBroadcastClient) {
  heading("Data Accessors");

  await runTest("getIngameData() returns ingameFrontendData", () => {
    const data = client.getIngameData();
    assertDefined(data, "ingameData");
    // Should have the structural fields even if empty
    assert("gameTime" in data, "should have gameTime property");
    assert("gameVersion" in data, "should have gameVersion property");
  });

  await runTest("getIngameState() returns a GameState value", () => {
    const state = client.getIngameState();
    assert(
      typeof state === "number" || typeof state === "string",
      `gameState should be a number or string, got ${typeof state}`,
    );
  });

  await runTest("isInTestingEnvironment() returns a boolean", () => {
    const testing = client.isInTestingEnvironment();
    assertType(testing, "boolean", "isTestingEnvironment");
  });

  await runTest("getChampSelectData() returns champSelectStateData", () => {
    const data = client.getChampSelectData();
    assertDefined(data, "champSelectData");
    assert("isActive" in data, "should have isActive property");
  });

  await runTest("isChampSelectActive() returns a boolean", () => {
    const active = client.isChampSelectActive();
    assertType(active, "boolean", "isChampSelectActive");
  });
}

// ─── shallowEqual utility tests ──────────────────────────────────────────────

async function testShallowEqual() {
  heading("Utility \u2014 shallowEqual");

  await runTest("identical references are equal", () => {
    const obj = { a: 1, b: 2 };
    assert(shallowEqual(obj, obj), "same reference should be equal");
  });

  await runTest("same-shape objects are equal", () => {
    assert(
      shallowEqual({ a: 1, b: "x" }, { a: 1, b: "x" }),
      "same keys+values should be equal",
    );
  });

  await runTest("different values are not equal", () => {
    assert(
      !shallowEqual({ a: 1 }, { a: 2 }),
      "different values should not be equal",
    );
  });

  await runTest("different key counts are not equal", () => {
    assert(
      !shallowEqual({ a: 1 } as any, { a: 1, b: 2 } as any),
      "different key count should not be equal",
    );
  });

  await runTest("primitives are compared by value", () => {
    assert(shallowEqual(42, 42), "same numbers should be equal");
    assert(!shallowEqual(42, 43), "different numbers should not be equal");
    assert(shallowEqual("hello", "hello"), "same strings should be equal");
  });

  await runTest("null and undefined handled correctly", () => {
    assert(shallowEqual(null, null), "null === null");
    assert(shallowEqual(undefined, undefined), "undefined === undefined");
    assert(!shallowEqual(null, undefined), "null !== undefined");
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  if (opts.help) {
    log(`
Usage: npx tsx test/run.ts [options]

Options:
  --host <host>       Backend host (default: localhost)
  --port <port>       Backend port (default: 58869)
  --skip-ws           Skip WebSocket tests
  --skip-rest         Skip REST API tests
  --timeout <ms>      WebSocket data timeout in ms (default: 15000)
  --help, -h          Show this help
`);
    process.exit(0);
  }

  log(`${BOLD}League Broadcast Client — Integration Tests${RESET}`);
  log(
    `${DIM}Target: ${opts.host}:${opts.port}  |  WS: ${opts.skipWs ? "skip" : "yes"}  |  REST: ${opts.skipRest ? "skip" : "yes"}  |  timeout: ${opts.wsTimeout}ms${RESET}`,
  );

  // Create client with autoConnect: false so we control the flow
  const client = new LeagueBroadcastClient({
    host: opts.host,
    port: opts.port,
    autoConnect: false,
  });

  // ── Tests that don't require a connection ──

  await testUrls(client, opts.host, opts.port);
  await testShallowEqual();
  await testReactiveStores(client);
  await testDataAccessors(client);

  // ── Connect ──

  if (!opts.skipWs || !opts.skipRest) {
    heading("Connection");
    try {
      log(`  Connecting to ${opts.host}:${opts.port}...`);
      await client.connect();
      pass("Connected to backend");
    } catch (err) {
      fail("Connect to backend", err);
      log(
        `\n${RED}Cannot reach the backend at ${opts.host}:${opts.port}.${RESET}`,
      );
      log(`Make sure the backend is running and try again.\n`);
      summary();
      process.exit(1);
    }
  }

  // ── REST tests ──

  if (!opts.skipRest) {
    try {
      await testRestApi(client);
    } catch (err) {
      fail("REST API test suite", err);
    }
  } else {
    heading("REST API");
    skip("REST API tests", "--skip-rest");
  }

  // ── WebSocket tests ──

  if (!opts.skipWs) {
    try {
      await testWebSocketConnection(client, opts.wsTimeout);
    } catch (err) {
      fail("WebSocket test suite", err);
    }
  } else {
    heading("WebSocket");
    skip("WebSocket tests", "--skip-ws");
  }

  // ── Cleanup ──

  client.disconnect();

  // ── Results ──

  const ok = summary();
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
