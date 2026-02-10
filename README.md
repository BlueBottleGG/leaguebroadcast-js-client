# League Broadcast Client

A TypeScript/JavaScript client library for connecting to the League Broadcast backend and receiving real-time game data.

## Features

- 🔌 Automatic WebSocket connection management with reconnection
- 📊 Real-time game state and data updates
- 🎮 Event-driven architecture for game events (kills, objectives, etc.)
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
client.onStateUpdate((gameData) => {
  console.log("Game time:", gameData.gameTime);
  console.log("Scoreboard:", gameData.scoreboard);
});

// Listen for game status changes
client.onGameStatusChange((status, isTestingEnv) => {
  if (status === GameState.InGame) {
    console.log("Game started!");
  } else if (status === GameState.OutOfGame) {
    console.log("Game ended!");
  }
});

// Listen for game events
client.onGameEvents({
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

## API Reference

### LeagueBroadcastClient

#### Constructor

```typescript
new LeagueBroadcastClient(config: LeagueBroadcastClientConfig)
```

**Config Options:**

| Option        | Type      | Default      | Description                            |
| ------------- | --------- | ------------ | -------------------------------------- |
| `host`        | `string`  | **required** | Backend server hostname or IP          |
| `port`        | `number`  | `58869`      | Backend server port                    |
| `wsRoute`     | `string`  | `/ws/in`     | WebSocket endpoint route               |
| `apiRoute`    | `string`  | `/api`       | API endpoint route                     |
| `cacheRoute`  | `string`  | `/cache`     | Cache endpoint route                   |
| `useHttps`    | `boolean` | `false`      | Use WSS/HTTPS instead of WS/HTTP       |
| `autoConnect` | `boolean` | `true`       | Automatically connect on instantiation |

#### Methods

##### Connection Management

```typescript
// Connect to backend
await client.connect(): Promise<void>

// Disconnect from backend
client.disconnect(): void

// Check connection status
client.isConnected(): boolean
```

##### Data Access

```typescript
// Get current game data
client.getGameData(): ingameFrontendData

// Get current game state
client.getGameState(): GameState

// Check if in testing environment
client.isInTestingEnvironment(): boolean
```

##### URLs

```typescript
// Get API base URL
client.getApiUrl(): string

// Get cache URL (optionally with path)
client.getCacheUrl(path?: string): string
```

##### Event Handlers

```typescript
// State updates - called when game data changes
client.onStateUpdate(handler: (state: ingameFrontendData) => void): () => void

// Game status changes - called when game starts/ends
client.onGameStatusChange(handler: (status: GameState, isTestingEnv: boolean) => void): () => void

// Game events - register handlers for various game events
client.onGameEvents(handlers: GameDataEventHandlers): void

// Connection events
client.onConnect(handler: () => void): () => void
client.onDisconnect(handler: () => void): () => void
client.onError(handler: (error: Event) => void): () => void
```

All event handler registration methods return an unsubscribe function.

### GameDataEventHandlers

```typescript
interface GameDataEventHandlers {
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
const unsubscribe = client.watch(
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
  const slice = client.select(s => s.gameData.scoreboard?.teams[0]?.kills);
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

    const unsubscribe = client.watch(
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

The `Subscribable` returned by `select()` matches Svelte's store contract:

```svelte
<script lang="ts">
  const kills = client.select(s => s.gameData.scoreboard?.teams[0]?.kills);
</script>

<div>Blue Kills: {$kills ?? 0}</div>
```

### Reactive Methods

#### `client.select(selector, equalityFn?)`

Create a subscribable slice that only notifies listeners when the selected value changes.

```typescript
const slice = client.select(
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

#### `client.watch(selector, callback, equalityFn?)`

Imperative API for watching a derived value. Callback is invoked whenever the selected value changes.

```typescript
const unsubscribe = client.watch(
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

#### `client.store`

Direct access to the `GameStateStore` instance for advanced use cases:

```typescript
// Get full snapshot
const snapshot = client.store.getSnapshot();
console.log("Game time:", snapshot.gameData.gameTime);
console.log("Game state:", snapshot.gameState);
console.log("Version:", snapshot.version);

// Subscribe to all changes (unfiltered)
const unsubscribe = client.store.subscribe(() => {
  console.log("Store updated");
});

// Watch with immediate callback
client.store.watchImmediate(
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
client.select((s) => s.gameData.gameTime); // Uses Object.is by default
```

#### `shallowEqual`

Compares objects by their enumerable properties. Use when selecting objects whose identity changes but contents may not:

```typescript
import { shallowEqual } from "@bluebottle_gg/league-broadcast-client";

const stats = client.select(
  (s) => ({
    kills: s.gameData.scoreboard?.teams[0]?.kills ?? 0,
    deaths: s.gameData.scoreboardBottom?.teams[0]?.players[0]?.deaths ?? 0,
  }),
  shallowEqual, // Only trigger when values change, not object identity
);
```

### GameStateSnapshot

The snapshot passed to selectors contains:

```typescript
interface GameStateSnapshot {
  gameData: ingameFrontendData; // Full game data
  gameState: GameState; // Current game state enum
  version: number; // Monotonic version counter
}
```

### Performance Tips

**✅ DO:** Use selectors to watch specific values

```typescript
client.watch((s) => s.gameData.scoreboard?.teams[0]?.kills, handleKills);
```

**❌ DON'T:** Subscribe to entire store and manually filter

```typescript
// This triggers on EVERY change, even unrelated ones
client.store.subscribe(() => {
  const kills = client.store.getSnapshot().gameData.scoreboard?.teams[0]?.kills;
  handleKills(kills);
});
```

**✅ DO:** Use `shallowEqual` for derived objects

```typescript
client.watch(
  (s) => ({ kills: s.gameData.scoreboard?.teams[0]?.kills ?? 0 }),
  handleStats,
  shallowEqual,
);
```

**✅ DO:** Select nested objects by reference (structural sharing keeps stable references when unchanged)

```typescript
// Only triggers when team object reference changes
client.watch((s) => s.gameData.scoreboard?.teams[0], handleTeam);
```

**✅ DO:** Handle `null` as “not available”

```typescript
client.watch(
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

See [examples/reactivity.ts](examples/reactivity.ts) for complete examples with:

- React (with `useSyncExternalStore` and custom hooks)
- Vue 3 (Composition API)
- Svelte (native store contract)
- Solid.js
- Angular (with Signals)
- Vanilla JavaScript

## Examples

### Basic Usage

```typescript
import { LeagueBroadcastClient } from "@bluebottle_gg/league-broadcast-client";

const client = new LeagueBroadcastClient({
  host: "192.168.1.100",
  port: 58869,
});

// Game data is automatically updated in real-time
setInterval(() => {
  const data = client.getGameData();
  console.log("Current game time:", data.gameTime);
}, 1000);
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
    const unsubscribeState = client.onStateUpdate((data) => {
      setGameData(data);
    });

    const unsubscribeStatus = client.onGameStatusChange((status) => {
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
client.onGameEvents({
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
