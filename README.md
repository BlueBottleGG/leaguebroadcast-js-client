# League Broadcast Client

A TypeScript/JavaScript client library for connecting to the League Broadcast backend and receiving real-time game data.

## Features

- 🔌 Automatic WebSocket connection management with reconnection
- 📊 Real-time game state and data updates — in-game **and** pre-game (champion select)
- 🎮 Event-driven architecture for game events (kills, objectives, pick/ban actions, etc.)
- ⚡ **Framework-agnostic reactive store** with fine-grained subscriptions
- 🔄 Works seamlessly with React, Vue, Svelte, Solid, Angular, and vanilla JS
- 📦 TypeScript support with full type definitions

## Installation

```bash
npm install @bluebottle_gg/league-broadcast-client
```

## Quick Start

```typescript
import {
  LeagueBroadcastClient,
  GameState,
} from "@bluebottle_gg/league-broadcast-client";

// Create client instance
const client = new LeagueBroadcastClient({
  host: "localhost",
  port: 58869,
  autoConnect: true,
});

// Listen for state updates
client.onIngameStateUpdate((gameData) => {
  console.log("Game time:", gameData.gameTime);
  console.log("Scoreboard:", gameData.scoreboard);
});

// Listen for game status changes
client.onIngameStatusChange((status, isTestingEnv) => {
  if (status === GameState.InGame) {
    console.log("Game started!");
  } else if (status === GameState.OutOfGame) {
    console.log("Game ended!");
  }
});

// Listen for game events
client.onIngameEvents({
  onKillFeedEvent: (event) => {
    console.log("Kill event:", event);
  },
  onObjectiveEvent: (event) => {
    console.log("Objective taken:", event);
  },
  onPlayerEvent: (event) => {
    console.log("Player event:", event);
  },
});
```

## Pre-Game Quick Start

The same `LeagueBroadcastClient` also connects to the pre-game WebSocket
(`/ws/pre`) automatically — no second client needed.

```typescript
import {
  LeagueBroadcastClient,
  PickBanPhase,
} from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({
  host: "localhost",
  port: 58869,
  autoConnect: true,
});

// Receive state updates every time the server pushes new champ-select data
client.onChampSelectUpdate((data) => {
  if (!data.isActive) return;
  console.log("Phase:", PickBanPhase[data.timer.phaseName]);
  console.log("Time remaining:", data.timer.timeRemaining);
  console.log(
    "Blue picks:",
    data.blueTeam.slots.map((s) => s.champion?.name),
  );
});

// High-level lifecycle events
client.onChampSelectEvents({
  onChampSelectStart: () => console.log("Draft started!"),
  onChampSelectEnd: () => console.log("Champions locked — game loading"),
  onAction: (action) => console.log("Pick/ban action:", action),
  onRouteUpdate: (uri) => console.log("Frontend route:", uri),
});

// Reactive selector (works with React useSyncExternalStore, Svelte $, Vue ref, etc.)
const timer = client.selectChampSelect((s) => s.champSelectData.timer);
client.watchChampSelect(
  (s) => s.champSelectData.blueTeam.slots,
  (slots) => console.log("Blue picks updated:", slots),
);
```

## API Reference

### LeagueBroadcastClient

#### Constructor

```typescript
new LeagueBroadcastClient(config: LeagueBroadcastClientConfig)
```

**Config Options:**

| Option           | Type      | Default      | Description                            |
| ---------------- | --------- | ------------ | -------------------------------------- |
| `host`           | `string`  | **required** | Backend server hostname or IP          |
| `port`           | `number`  | `58869`      | Backend server port                    |
| `ingameWsRoute`  | `string`  | `/ws/in`     | In-game WebSocket endpoint route       |
| `preGameWsRoute` | `string`  | `/ws/pre`    | Pre-game WebSocket endpoint route      |
| `apiRoute`       | `string`  | `/api`       | API endpoint route                     |
| `cacheRoute`     | `string`  | `/cache`     | Cache endpoint route                   |
| `useHttps`       | `boolean` | `false`      | Use WSS/HTTPS instead of WS/HTTP       |
| `autoConnect`    | `boolean` | `true`       | Automatically connect on instantiation |

#### Methods

##### Connection Management

```typescript
// Connect to both in-game and pre-game WebSocket endpoints
await client.connect(): Promise<void>

// Disconnect from both endpoints
client.disconnect(): void

// Check in-game connection status
client.isIngameConnected(): boolean

// Check pre-game connection status
client.isPreGameConnected(): boolean
```

##### In-Game Data Access

```typescript
client.getIngameData(): ingameFrontendData
client.getIngameState(): GameState
client.isInTestingEnvironment(): boolean
```

##### Pre-Game Data Access

```typescript
client.getChampSelectData(): champSelectStateData
client.isChampSelectActive(): boolean
```

##### URLs

```typescript
client.getApiUrl(): string
client.getCacheUrl(path?: string): string
```

##### In-Game Event Handlers

```typescript
// State updates - called when in-game data changes
client.onIngameStateUpdate(handler: (state: ingameFrontendData) => void): () => void

// Game status changes - called when game starts/ends
client.onIngameStatusChange(handler: (status: GameState, isTestingEnv: boolean) => void): () => void

// Game events - register handlers for various game events
client.onIngameEvents(handlers: IngameEventHandlers): void

// In-game connection events
client.onIngameConnect(handler: () => void): () => void
client.onIngameDisconnect(handler: () => void): () => void
client.onIngameError(handler: (error: Event) => void): () => void
```

##### Pre-Game Event Handlers

```typescript
// Called on every champ-select state push from the server
client.onChampSelectUpdate(handler: (state: champSelectStateData) => void): () => void

// Register handlers for lifecycle and action events
client.onChampSelectEvents(handlers: ChampSelectEventHandlers): void

// Pre-game connection events
client.onPreGameConnect(handler: () => void): () => void
client.onPreGameDisconnect(handler: () => void): () => void
client.onPreGameError(handler: (error: Event) => void): () => void
```

All event handler registration methods return an unsubscribe function.

##### In-Game Reactive API

```typescript
// Subscribe to a fine-grained slice of in-game state
client.selectIngame<S>(selector: (s: GameStateSnapshot) => S, equalityFn?): Subscribable<S>

// Watch a value imperatively; callback fires on change
client.watchIngame<S>(selector, callback, equalityFn?): () => void

// Direct access to the reactive in-game store
client.ingameStore: GameStateStore
```

##### Pre-Game Reactive API

```typescript
// Subscribe to a fine-grained slice of champ-select state
client.selectChampSelect<S>(selector: (s: ChampSelectSnapshot) => S, equalityFn?): Subscribable<S>

// Watch a value imperatively; callback fires on change
client.watchChampSelect<S>(selector, callback, equalityFn?): () => void

// Direct access to the reactive pre-game store
client.preGameStore: ChampSelectStateStore
```

#### `ChampSelectEventHandlers`

```typescript
interface ChampSelectEventHandlers {
  /** Every pick/ban action (hover, lock, ban reveal, phase transition). */
  onAction?: (action: pickBanActionEventArgs) => void;
  /** Fires when champ select becomes active. */
  onChampSelectStart?: () => void;
  /** Fires when champ select ends (isActive becomes false). */
  onChampSelectEnd?: () => void;
  /** Fires when the backend navigates the frontend to a new route. */
  onRouteUpdate?: (uri: string) => void;
}
```

#### `ChampSelectSnapshot`

The snapshot object passed to `selectChampSelect()` / `watchChampSelect()` selectors:

```typescript
interface ChampSelectSnapshot {
  readonly champSelectData: champSelectStateData; // Full champ-select state
  readonly isActive: boolean; // Whether draft is in progress
  readonly version: number; // Monotonic version counter
}
```

#### WebSocket Message Types

| Message type                   | Handled as                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `champion-select-state-update` | Updates `champSelectStateData`, fires `onChampSelectStart` / `onChampSelectEnd` |
| `champion-select-action`       | Fires `onAction`                                                                |
| `frontend-route-update`        | Fires `onRouteUpdate`                                                           |

---

### IngameEventHandlers

```typescript
interface IngameEventHandlers {
  onPlayerEvent?: (event: playerEvent) => void;
  onTeamEvent?: (event: teamEvent) => void;
  onObjectiveEvent?: (event: objectiveEvent) => void;
  onFirstTowerEvent?: (event: firstTowerEvent) => void;
  onAnnouncementEvent?: (event: announcerEvent) => void;
  onKillFeedEvent?: (event: killFeedEvent) => void;
}
```

## Reactive API

The client includes a **framework-agnostic reactive store** that enables fine-grained subscriptions to specific parts of the game state. The store is compatible with React, Vue, Svelte, Solid, Angular, and vanilla JavaScript.

### Core Concepts

The reactive API is built around **selectors** — functions that extract a slice of state. The backend sends a full snapshot each update, and `null` values explicitly mean “not available / don’t show”. The client uses **structural sharing** to preserve nested object references when values are unchanged, so selectors only re-fire when their content actually changes (with configurable equality comparison for derived values).

### Quick Examples

#### Vanilla JavaScript

```typescript
// Watch a specific value
const unsubscribe = client.watchIngame(
  (s) => s.gameData.scoreboard?.teams[0]?.kills,
  (kills, prevKills) => {
    console.log(`Blue team kills: ${prevKills} → ${kills}`);
  },
);

// Clean up when done
unsubscribe();
```

#### React 18+

```typescript
import { useSyncExternalStore } from 'react';

function BlueTeamKills() {
  const slice = client.selectIngame(s => s.gameData.scoreboard?.teams[0]?.kills);
  const kills = useSyncExternalStore(slice.subscribe, slice.getSnapshot);

  return <div>Blue Kills: {kills ?? 0}</div>;
}
```

#### Vue 3

```typescript
import { ref, onUnmounted } from "vue";

export default {
  setup() {
    const kills = ref(0);

    const unsubscribe = client.watchIngame(
      (s) => s.gameData.scoreboard?.teams[0]?.kills,
      (value) => {
        kills.value = value ?? 0;
      },
    );

    onUnmounted(() => unsubscribe());

    return { kills };
  },
};
```

#### Svelte

The `Subscribable` returned by `selectIngame()` matches Svelte's store contract:

```svelte
<script lang="ts">
  const kills = client.selectIngame(s => s.gameData.scoreboard?.teams[0]?.kills);
</script>

<div>Blue Kills: {$kills ?? 0}</div>
```

### Reactive Methods

#### `client.selectIngame(selector, equalityFn?)`

Create a subscribable slice that only notifies listeners when the selected value changes.

```typescript
const slice = client.selectIngame(
  (s) => s.gameData.gameTime,
  Object.is, // Default equality function (can use shallowEqual for objects)
);

// Get current value
const currentTime = slice.getSnapshot();

// Subscribe to changes
const unsubscribe = slice.subscribe(() => {
  console.log("Game time changed:", slice.getSnapshot());
});
```

**Parameters:**

- `selector: (snapshot: GameStateSnapshot) => T` — Function to extract value from state
- `equalityFn?: (a: T, b: T) => boolean` — Optional equality comparison (defaults to `Object.is`)

**Returns:** `Subscribable<T>` with:

- `subscribe(listener: () => void): () => void` — Subscribe to changes
- `getSnapshot(): T` — Get current value

#### `client.watchIngame(selector, callback, equalityFn?)`

Imperative API for watching a derived value. Callback is invoked whenever the selected value changes.

```typescript
const unsubscribe = client.watchIngame(
  (s) => s.gameData.scoreboard?.teams[0]?.kills,
  (kills, prevKills) => {
    console.log(`Kills changed: ${prevKills} → ${kills}`);
  },
);
```

**Parameters:**

- `selector: (snapshot: GameStateSnapshot) => T` — Function to extract value
- `callback: (value: T, prev: T) => void` — Called when value changes
- `equalityFn?: (a: T, b: T) => boolean` — Optional equality comparison

**Returns:** `() => void` — Unsubscribe function

#### `client.ingameStore`

Direct access to the `GameStateStore` instance for advanced use cases:

```typescript
// Get full snapshot
const snapshot = client.ingameStore.getSnapshot();
console.log("Game time:", snapshot.gameData.gameTime);
console.log("Game state:", snapshot.gameState);
console.log("Version:", snapshot.version);

// Subscribe to all changes (unfiltered)
const unsubscribe = client.ingameStore.subscribe(() => {
  console.log("Store updated");
});

// Watch with immediate callback
client.ingameStore.watchImmediate(
  (s) => s.gameData.gameTime,
  (time, prevTime) => {
    console.log(`Time: ${prevTime} → ${time}`);
  },
);
```

### Equality Functions

#### `Object.is` (default)

Uses strict equality (`===`). Best for primitives and object references:

```typescript
client.selectIngame((s) => s.gameData.gameTime); // Uses Object.is by default
```

#### `shallowEqual`

Compares objects by their enumerable properties. Use when selecting objects whose identity changes but contents may not:

```typescript
import { shallowEqual } from "@bluebottle_gg/league-broadcast-client";

const stats = client.selectIngame(
  (s) => ({
    kills: s.gameData.scoreboard?.teams[0]?.kills ?? 0,
    deaths: s.gameData.scoreboardBottom?.teams[0]?.players[0]?.deaths ?? 0,
  }),
  shallowEqual, // Only trigger when values change, not object identity
);
```

### Snapshots

#### `GameStateSnapshot` (in-game)

```typescript
interface GameStateSnapshot {
  readonly gameData: ingameFrontendData; // Full in-game data
  readonly gameState: GameState; // Current game state enum
  readonly version: number; // Monotonic version counter
}
```

#### `ChampSelectSnapshot` (pre-game)

```typescript
interface ChampSelectSnapshot {
  readonly champSelectData: champSelectStateData; // Full champ-select state
  readonly isActive: boolean; // Whether draft is in progress
  readonly version: number; // Monotonic version counter
}
```

### Performance Tips

**✅ DO:** Use selectors to watch specific values

```typescript
client.watchIngame((s) => s.gameData.scoreboard?.teams[0]?.kills, handleKills);
```

**❌ DON'T:** Subscribe to entire store and manually filter

```typescript
// This triggers on EVERY change, even unrelated ones
client.ingameStore.subscribe(() => {
  const kills = client.ingameStore.getSnapshot().gameData.scoreboard?.teams[0]?.kills;
  handleKills(kills);
});
```

**✅ DO:** Use `shallowEqual` for derived objects

```typescript
client.watchIngame(
  (s) => ({ kills: s.gameData.scoreboard?.teams[0]?.kills ?? 0 }),
  handleStats,
  shallowEqual,
);
```

**✅ DO:** Select nested objects by reference (structural sharing keeps stable references when unchanged)

```typescript
// Only triggers when team object reference changes
client.watchIngame((s) => s.gameData.scoreboard?.teams[0], handleTeam);
```

**✅ DO:** Handle `null` as “not available”

```typescript
client.watchIngame(
  (s) => s.gameData.scoreboard,
  (scoreboard) => {
    if (!scoreboard) {
      hideScoreboard();
      return;
    }
    renderScoreboard(scoreboard);
  },
);
```

### Framework Integration Examples

See [examples/reactivity.ts](examples/reactivity.ts) for complete in-game examples with:

- React (with `useSyncExternalStore` and custom hooks)
- Vue 3 (Composition API)
- Svelte (native store contract)
- Solid.js
- Angular (with Signals)
- Vanilla JavaScript

See [examples/pregame-reactivity.ts](examples/pregame-reactivity.ts) for the equivalent examples using pre-game reactive selectors (`selectChampSelect` / `watchChampSelect`).

## Examples

See the [examples/](examples/) directory for full runnable code.

| File                                                             | Description                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [examples/usage.ts](examples/usage.ts)                           | In-game usage: state updates, events, cache URLs, scoreboards           |
| [examples/reactivity.ts](examples/reactivity.ts)                 | In-game reactive API across all major frameworks                        |
| [examples/pregame-usage.ts](examples/pregame-usage.ts)           | Pre-game usage: champ select state, pick/ban actions, team compositions |
| [examples/pregame-reactivity.ts](examples/pregame-reactivity.ts) | Pre-game reactive API across all major frameworks                       |

### Basic In-Game Usage

```typescript
import { LeagueBroadcastClient } from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({
  host: "192.168.1.100",
  port: 58869,
});

// Game data is automatically updated in real-time
setInterval(() => {
  const data = client.getIngameData();
  console.log("Current game time:", data.gameTime);
}, 1000);
```

### Basic Pre-Game Usage

```typescript
import {
  LeagueBroadcastClient,
  PickBanPhase,
} from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({ host: "192.168.1.100" });

client.onChampSelectEvents({
  onAction: (action) => {
    console.log(
      `Action: ${action.type} — ${action.champion?.name ?? "hovering"}`,
    );
  },
});

client.watchChampSelect(
  (s) => s.champSelectData.timer.phaseName,
  (phase) => console.log("Phase:", PickBanPhase[phase]),
);
```

### Full Lifecycle (Draft → In-Game)

```typescript
import {
  LeagueBroadcastClient,
  GameState,
} from "@bluebottle_gg/league-broadcast-client";

// One client handles both /ws/in and /ws/pre
const client = new LeagueBroadcastClient({ host: "localhost" });

client.onChampSelectEvents({
  onChampSelectStart: () => console.log("Draft started"),
  onChampSelectEnd: () => console.log("Game loading"),
});

client.onIngameStatusChange((status) => {
  if (status === GameState.OutOfGame) console.log("Returned to lobby");
});
```

### React Integration

```typescript
import { useEffect, useState } from 'react';
import { LeagueBroadcastClient, ingameFrontendData, GameState } from '@bluebottle_gg/league-broadcast-client';

function useLeagueBroadcast(host: string, port: number) {
  const [client] = useState(() => new LeagueBroadcastClient({ host, port }));
  const [gameData, setGameData] = useState<ingameFrontendData | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.OutOfGame);

  useEffect(() => {
    const unsubscribeState = client.onIngameStateUpdate((data) => {
      setGameData(data);
    });

    const unsubscribeStatus = client.onIngameStatusChange((status) => {
      setGameState(status);
    });

    return () => {
      unsubscribeState();
      unsubscribeStatus();
      client.disconnect();
    };
  }, [client]);

  return { gameData, gameState, client };
}

// Usage in component
function GameDisplay() {
  const { gameData, gameState } = useLeagueBroadcast('localhost', 58869);

  if (gameState === GameState.OutOfGame) {
    return <div>No game in progress</div>;
  }

  return (
    <div>
      <h1>Game Time: {gameData?.gameTime}</h1>
      <div>Blue Team Score: {gameData?.scoreboard?.teams[0]?.totalKills}</div>
      <div>Red Team Score: {gameData?.scoreboard?.teams[1]?.totalKills}</div>
    </div>
  );
}
```

### Event Handling

```typescript
import { LeagueBroadcastClient } from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({
  host: "localhost",
  port: 58869,
});

// Handle all game events
client.onIngameEvents({
  onKillFeedEvent: (event) => {
    console.log(`${event.killerName} killed ${event.victimName}`);
  },
  onObjectiveEvent: (event) => {
    console.log(`Objective secured: ${event.objectiveType}`);
  },
  onFirstTowerEvent: (event) => {
    console.log(`First tower taken by team ${event.teamId}`);
  },
  onAnnouncementEvent: (event) => {
    console.log(`Announcement: ${event.announcementType}`);
  },
  onPlayerEvent: (event) => {
    console.log(`Player event: ${event.eventType}`);
  },
  onTeamEvent: (event) => {
    console.log(`Team event: ${event.eventType}`);
  },
});
```

### Manual Connection Control

```typescript
import { LeagueBroadcastClient } from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({
  host: "localhost",
  port: 58869,
  autoConnect: false, // Don't connect automatically
});

// Connect manually when ready
async function connectToGame() {
  try {
    await client.connect();
    console.log("Connected successfully!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

// Disconnect when done
function disconnectFromGame() {
  client.disconnect();
  console.log("Disconnected");
}
```

## License

GPLv3
