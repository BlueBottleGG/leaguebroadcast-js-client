/**
 * Pre-game (Champion Select) Usage Examples
 *
 * This file demonstrates how to use the LeagueBroadcastClient for receiving
 * real-time champion select data via its built-in pre-game WebSocket connection.
 */

import {
  LeagueBroadcastClient,
  GameState,
  champSelectStateData,
  PickBanPhase,
  ActionType,
  ActionSubType,
} from "../src";

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

function basicExample() {
  // A single client connects to both /ws/in and /ws/pre automatically
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
    autoConnect: true,
  });

  // Listen for champ-select state updates (fired on every server push)
  client.onChampSelectUpdate((data: champSelectStateData) => {
    if (!data.isActive) return;

    console.log("Phase:", PickBanPhase[data.timer.phaseName]);
    console.log(
      `Time remaining: ${data.timer.timeRemaining.toFixed(1)}s / ${data.timer.phaseDuration}s`,
    );
    console.log(
      "Blue team bans:",
      data.blueTeam.bans.filter((b) => b.champion).map((b) => b.champion?.name),
    );
    console.log(
      "Red team bans:",
      data.redTeam.bans.filter((b) => b.champion).map((b) => b.champion?.name),
    );
  });

  // React to high-level lifecycle transitions
  client.onChampSelectEvents({
    onChampSelectStart: () => {
      console.log("Draft started!");
    },
    onChampSelectEnd: () => {
      console.log("Draft ended — game is loading.");
    },
  });
}

// ============================================================================
// Example 2: Tracking Pick / Ban Actions
// ============================================================================

function pickBanActionExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  client.onChampSelectEvents({
    onAction: (action) => {
      const actor = `Actor #${action.actorId}`;
      const champion = action.champion?.name ?? "(hovering)";

      switch (action.type) {
        case ActionType[ActionType.BAN]:
          if (action.subType === ActionSubType[ActionSubType.LOCK]) {
            console.log(`🚫 ${actor} banned ${champion}`);
          } else {
            console.log(`🚫 ${actor} is hovering ban: ${champion}`);
          }
          break;

        case ActionType[ActionType.PICK]:
          if (action.subType === ActionSubType[ActionSubType.LOCK]) {
            console.log(`✅ ${actor} locked in ${champion}`);
          } else {
            console.log(`👁️ ${actor} is hovering: ${champion}`);
          }
          break;

        case ActionType[ActionType.TEN_BANS_REVEAL]:
          console.log("📋 Ten bans revealed");
          break;

        case ActionType[ActionType.PHASE_TRANSITION]:
          console.log(`🔄 Phase transition`);
          break;
      }
    },
  });
}

// ============================================================================
// Example 3: Displaying Team Compositions
// ============================================================================

function teamCompositionExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  client.onChampSelectUpdate((data: champSelectStateData) => {
    if (!data.isActive) return;

    console.clear();
    console.log("════════════════════════════════════════");
    console.log(
      `Phase: ${PickBanPhase[data.timer.phaseName]}  |  ${data.timer.timeRemaining.toFixed(0)}s remaining`,
    );
    console.log("════════════════════════════════════════");

    // Blue side picks
    console.log("🔵 Blue Team:");
    data.blueTeam.slots.forEach((slot, i) => {
      const champ = slot.champion?.name ?? "(empty)";
      const player = slot.player || `Slot ${i + 1}`;
      const active = slot.isActive ? " ◄" : "";
      console.log(`  ${i + 1}. ${player}: ${champ}${active}`);
    });

    console.log("\n🔴 Red Team:");
    data.redTeam.slots.forEach((slot, i) => {
      const champ = slot.champion?.name ?? "(empty)";
      const player = slot.player || `Slot ${i + 1}`;
      const active = slot.isActive ? " ◄" : "";
      console.log(`  ${i + 1}. ${player}: ${champ}${active}`);
    });

    // Bans
    const blueBans = data.blueTeam.bans
      .filter((b) => b.champion)
      .map((b) => b.champion!.name)
      .join(", ");
    const redBans = data.redTeam.bans
      .filter((b) => b.champion)
      .map((b) => b.champion!.name)
      .join(", ");

    console.log(`\n🔵 Bans: ${blueBans || "—"}`);
    console.log(`🔴 Bans: ${redBans || "—"}`);
    console.log("════════════════════════════════════════");
  });
}

// ============================================================================
// Example 4: Manual Connection Control
// ============================================================================

async function manualConnectionExample() {
  const client = new LeagueBroadcastClient({
    host: "192.168.1.100",
    port: 58869,
    autoConnect: false, // Don't connect automatically
  });

  try {
    console.log("Connecting to backend (in-game + pre-game)...");
    await client.connect();
    console.log("✅ Connected!");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return;
  }

  client.onChampSelectUpdate((data) => {
    if (data.isActive) {
      console.log(`Patch: ${data.metaData.patch}`);
    }
  });

  // Disconnect when no longer needed
  // client.disconnect();
}

// ============================================================================
// Example 5: Using Cache URLs for Champion Images
// ============================================================================

function champImageExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  client.onChampSelectUpdate((data: champSelectStateData) => {
    if (!data.isActive) return;

    // Build champion tile images for all locked picks
    const pickImages = [...data.blueTeam.slots, ...data.redTeam.slots]
      .filter((slot) => slot.champion)
      .map((slot) => ({
        player: slot.player,
        imageUrl: client.getCacheUrl(slot.champion!.tileImg),
      }));

    // Build ban images
    const banImages = [...data.blueTeam.bans, ...data.redTeam.bans]
      .filter((ban) => ban.champion)
      .map((ban) => ({
        name: ban.champion!.name,
        imageUrl: client.getCacheUrl(ban.champion!.tileImg),
      }));

    console.log("Picks with images:", pickImages);
    console.log("Bans with images:", banImages);
  });
}

// ============================================================================
// Example 6: Fearless Draft — tracking per-game bans
// ============================================================================

function fearlessDraftExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  client.onChampSelectUpdate((data: champSelectStateData) => {
    if (!data.isActive || !data.blueTeam.fearlessBans) return;

    const fearlessBans = data.blueTeam.fearlessBans;
    const gameNumbers = Object.keys(fearlessBans)
      .map(Number)
      .sort((a, b) => a - b);

    console.log("Fearless Draft History (Blue Side):");
    for (const gameNum of gameNumbers) {
      const bans = fearlessBans[gameNum].map((c) => c.name).join(", ");
      console.log(`  Game ${gameNum}: ${bans}`);
    }
  });
}

// ============================================================================
// Example 7: Connection State Management
// ============================================================================

function connectionStateExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // In-game WebSocket connection events
  client.onIngameConnect(() => {
    console.log("✅ Connected to in-game server");
  });
  client.onIngameDisconnect(() => {
    console.log("❌ In-game disconnected — reconnecting...");
  });

  // Pre-game WebSocket connection events
  client.onPreGameConnect(() => {
    console.log("✅ Connected to pre-game server");
  });
  client.onPreGameDisconnect(() => {
    console.log("❌ Pre-game disconnected — reconnecting...");
  });

  setInterval(() => {
    const ingame = client.isIngameConnected() ? "🟢" : "🔴";
    const pregame = client.isPreGameConnected() ? "🟢" : "🔴";
    console.log(`In-game: ${ingame}  |  Pre-game: ${pregame}`);
  }, 5000);
}

// ============================================================================
// Example 8: Full lifecycle — draft → in-game → post-game
// ============================================================================

function fullLifecycleExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Pre-game: champion select
  client.onChampSelectEvents({
    onChampSelectStart: () => {
      console.log("Draft phase started — watching picks and bans");
    },
    onChampSelectEnd: () => {
      console.log("Champions selected — game loading soon");
    },
    onAction: (action) => {
      if (action.subType === ActionSubType[ActionSubType.LOCK]) {
        const type =
          action.type === ActionType[ActionType.BAN] ? "banned" : "picked";
        console.log(`${action.champion?.name ?? "champion"} was ${type}`);
      }
    },
  });

  // In-game: game status
  client.onIngameStatusChange((status) => {
    if (status === GameState.OutOfGame) {
      console.log("Out of game — waiting for next draft");
    } else {
      console.log("In game:", GameState[status]);
    }
  });

  // In-game: live data
  client.onIngameStateUpdate((data) => {
    console.log(`Game time: ${data.gameTime}s`);
  });
}

// ============================================================================
// Run examples
// ============================================================================

// basicExample();
// pickBanActionExample();
// teamCompositionExample();
// manualConnectionExample();
// champImageExample();
// fearlessDraftExample();
// connectionStateExample();
// fullLifecycleExample();
