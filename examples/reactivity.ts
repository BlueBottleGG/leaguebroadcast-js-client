/**
 * Reactivity Examples for League Broadcast Client
 *
 * This file demonstrates how to use the reactive store API
 * in various JavaScript frameworks and environments.
 */

import { LeagueBroadcastClient, shallowEqual } from "../src";

// ============================================================================
// Example 1: Vanilla JavaScript / Node.js
// ============================================================================

function vanillaJsExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Watch a specific value and get callbacks when it changes
  const unsubscribe1 = client.watchIngame(
    (s) => s.gameData.scoreboard?.teams[0]?.kills,
    (kills, prevKills) => {
      console.log(`Blue team kills: ${prevKills} → ${kills}`);
    },
  );

  // Watch multiple values with a selector that returns an object
  // Use shallowEqual to avoid triggering on the same values
  const unsubscribe2 = client.watchIngame(
    (s) => ({
      blueKills: s.gameData.scoreboard?.teams[0]?.kills ?? 0,
      redKills: s.gameData.scoreboard?.teams[1]?.kills ?? 0,
      gameTime: s.gameData.gameTime,
    }),
    (current, prev) => {
      console.log(`Game at ${current.gameTime}s:`, current);
    },
    shallowEqual, // Only trigger when values actually change
  );

  // Watch game state changes
  const unsubscribe3 = client.watchIngame(
    (s) => s.gameState,
    (state) => {
      console.log("Game state changed:", state);
    },
  );

  // Clean up when done
  // unsubscribe1();
  // unsubscribe2();
  // unsubscribe3();
}

// ============================================================================
// Example 2: React 18+ with useSyncExternalStore
// ============================================================================

// React example (requires React 18+)
/*
import { useSyncExternalStore } from 'react';
import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

// Create client instance outside component (or use context)
const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

function BlueTeamKills() {
  // Select just the blue team kills
  const slice = client.selectIngame(s => s.gameData.scoreboard?.teams[0]?.kills);
  
  // Subscribe to changes with useSyncExternalStore
  const kills = useSyncExternalStore(
    slice.subscribe,
    slice.getSnapshot,
  );

  return <div>Blue Kills: {kills ?? 0}</div>;
}

function Scoreboard() {
  // Select the entire scoreboard
  const slice = client.selectIngame(s => s.gameData.scoreboard);
  const scoreboard = useSyncExternalStore(
    slice.subscribe,
    slice.getSnapshot,
  );

  if (!scoreboard) return <div>No game data</div>;

  return (
    <div>
      <div>Blue: {scoreboard.teams[0]?.kills} - {scoreboard.teams[0]?.towers}</div>
      <div>Red: {scoreboard.teams[1]?.kills} - {scoreboard.teams[1]?.towers}</div>
      <div>Time: {scoreboard.gameTime}s</div>
    </div>
  );
}

// Custom hook for convenience
function useGameState<T>(
  selector: (snapshot: import('@bluebottle_gg/league-broadcast-client').GameStateSnapshot) => T,
  equalityFn?: import('@bluebottle_gg/league-broadcast-client').EqualityFn<T>,
) {
  const slice = client.selectIngame(selector, equalityFn);
  return useSyncExternalStore(slice.subscribe, slice.getSnapshot);
}

// Usage with custom hook
function GameTimer() {
  const gameTime = useGameState(s => s.gameData.gameTime);
  return <div>Game Time: {gameTime}s</div>;
}
*/

// ============================================================================
// Example 3: Vue 3 with Composition API
// ============================================================================

// Vue 3 example
/*
import { ref, watchEffect, onUnmounted } from 'vue';
import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

export default {
  setup() {
    const kills = ref<number | undefined>(undefined);
    const gameTime = ref<number>(0);
    const gameState = ref<number>(0);

    // Subscribe to changes and update refs
    const unsubscribe1 = client.watchIngame(
      s => s.gameData.scoreboard?.teams[0]?.kills,
      (value) => { kills.value = value; }
    );

    const unsubscribe2 = client.watchIngame(
      s => s.gameData.gameTime,
      (value) => { gameTime.value = value; }
    );

    const unsubscribe3 = client.watchIngame(
      s => s.gameState,
      (value) => { gameState.value = value; }
    );

    // Clean up subscriptions
    onUnmounted(() => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    });

    return { kills, gameTime, gameState };
  }
};

// Or use a composable helper with ref
function useGameStateRef<T>(
  selector: (s: import('@bluebottle_gg/league-broadcast-client').GameStateSnapshot) => T
) {
  const value = ref<T>(selector(client.ingameStore.getSnapshot()));
  
  const unsubscribe = client.watchIngame(selector, (newValue) => {
    value.value = newValue;
  });

  onUnmounted(() => unsubscribe());
  
  return value;
}

// Usage with composable
export default {
  setup() {
    const kills = useGameStateRef(s => s.gameData.scoreboard?.teams[0]?.kills);
    const gameTime = useGameStateRef(s => s.gameData.gameTime);
    
    return { kills, gameTime };
  }
};

// Alternative: Using computed() for derived values
import { computed } from 'vue';

function useGameStateComputed<T>(
  selector: (s: import('@bluebottle_gg/league-broadcast-client').GameStateSnapshot) => T
) {
  // Trigger Vue's reactivity by tracking a version number
  const version = ref(client.ingameStore.getVersion());
  
  const unsubscribe = client.ingameStore.subscribe(() => {
    version.value = client.ingameStore.getVersion();
  });

  onUnmounted(() => unsubscribe());

  return computed(() => selector(client.ingameStore.getSnapshot()));
}

// Usage with computed
export default {
  setup() {
    const kills = useGameStateComputed(s => s.gameData.scoreboard?.teams[0]?.kills);
    const gameTime = useGameStateComputed(s => s.gameData.gameTime);
    
    // Computed values are read-only and automatically cached
    const killsDisplay = computed(() => `${kills.value ?? 0} kills`);
    
    return { kills, gameTime, killsDisplay };
  }
};

// Example: Combining patterns for complex derived state
export default {
  setup() {
    // Track version for reactivity
    const version = ref(client.ingameStore.getVersion());
    client.ingameStore.subscribe(() => {
      version.value = client.ingameStore.getVersion();
    });

    // Create computed values that depend on the store
    const blueTeam = computed(() => {
      // Access version to trigger reactivity
      void version.value;
      return client.ingameStore.getSnapshot().gameData.scoreboard?.teams[0];
    });

    const redTeam = computed(() => {
      void version.value;
      return client.ingameStore.getSnapshot().gameData.scoreboard?.teams[1];
    });

    // Derived computed from other computeds
    const killDifference = computed(() => {
      const blue = blueTeam.value?.kills ?? 0;
      const red = redTeam.value?.kills ?? 0;
      return blue - red;
    });

    const leadingTeam = computed(() => {
      return killDifference.value > 0 ? 'Blue' : 
             killDifference.value < 0 ? 'Red' : 'Tied';
    });

    return { blueTeam, redTeam, killDifference, leadingTeam };
  }
};
*/

// ============================================================================
// Example 4: Svelte
// ============================================================================

// Svelte example - the Subscribable interface matches Svelte's store contract!
/*
<script lang="ts">
  import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

  const client = new LeagueBroadcastClient({
    host: 'localhost',
    autoConnect: true,
  });

  // Create subscribable slices
  const kills = client.selectIngame(s => s.gameData.scoreboard?.teams[0]?.kills);
  const gameTime = client.selectIngame(s => s.gameData.gameTime);
  const gameState = client.selectIngame(s => s.gameState);

  // Svelte automatically subscribes/unsubscribes with the $ prefix
</script>

<div>
  <p>Blue Kills: {$kills ?? 0}</p>
  <p>Game Time: {$gameTime}s</p>
  <p>Game State: {$gameState}</p>
</div>
*/

// ============================================================================
// Example 5: Solid.js
// ============================================================================

// Solid.js example
/*
import { createSignal, createEffect, onCleanup } from 'solid-js';
import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

function GameStats() {
  const [kills, setKills] = createSignal<number | undefined>(undefined);
  const [gameTime, setGameTime] = createSignal(0);

  // Subscribe to store changes
  const unsubscribe1 = client.watchIngame(
    s => s.gameData.scoreboard?.teams[0]?.kills,
    (value) => setKills(value)
  );

  const unsubscribe2 = client.watchIngame(
    s => s.gameData.gameTime,
    (value) => setGameTime(value)
  );

  onCleanup(() => {
    unsubscribe1();
    unsubscribe2();
  });

  return (
    <div>
      <p>Blue Kills: {kills() ?? 0}</p>
      <p>Game Time: {gameTime()}s</p>
    </div>
  );
}

// Or create a helper
function createGameState<T>(
  selector: (s: import('@bluebottle_gg/league-broadcast-client').GameStateSnapshot) => T
) {
  const [value, setValue] = createSignal<T>(selector(client.ingameStore.getSnapshot()));
  
  const unsubscribe = client.watchIngame(selector, (newValue) => {
    setValue(() => newValue);
  });

  onCleanup(() => unsubscribe());
  
  return value;
}

// Usage with helper
function GameTimer() {
  const gameTime = createGameState(s => s.gameData.gameTime);
  return <div>Game Time: {gameTime()}s</div>;
}
*/

// ============================================================================
// Example 6: Angular with Signals (Angular 16+)
// ============================================================================

// Angular example with signals
/*
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

@Component({
  selector: 'app-game-stats',
  template: `
    <div>
      <p>Blue Kills: {{ kills() ?? 0 }}</p>
      <p>Game Time: {{ gameTime() }}s</p>
    </div>
  `
})
export class GameStatsComponent implements OnInit, OnDestroy {
  private client = new LeagueBroadcastClient({
    host: 'localhost',
    autoConnect: true,
  });

  kills = signal<number | undefined>(undefined);
  gameTime = signal(0);

  private unsubscribers: (() => void)[] = [];

  ngOnInit() {
    // Subscribe to store changes
    this.unsubscribers.push(
      this.client.watchIngame(
        s => s.gameData.scoreboard?.teams[0]?.kills,
        (value) => this.kills.set(value)
      )
    );

    this.unsubscribers.push(
      this.client.watchIngame(
        s => s.gameData.gameTime,
        (value) => this.gameTime.set(value)
      )
    );
  }

  ngOnDestroy() {
    this.unsubscribers.forEach(unsub => unsub());
  }
}
*/

// ============================================================================
// Example 7: Direct store usage (for advanced use cases)
// ============================================================================

function directStoreUsageExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
  });

  // Access the store directly for full control
  const store = client.ingameStore;

  // Get current snapshot
  const snapshot = store.getSnapshot();
  console.log("Current game time:", snapshot.gameData.gameTime);
  console.log("Current game state:", snapshot.gameState);
  console.log("Store version:", snapshot.version);

  // Subscribe to all changes (unfiltered)
  const unsubscribeAll = store.subscribe(() => {
    const snap = store.getSnapshot();
    console.log(`Store updated (v${snap.version}):`, snap);
  });

  // Create custom selectors with custom equality functions
  const scoreboardSlice = store.select(
    (s) => ({
      blueKills: s.gameData.scoreboard?.teams[0]?.kills ?? 0,
      redKills: s.gameData.scoreboard?.teams[1]?.kills ?? 0,
    }),
    shallowEqual, // Only notify when the actual values change
  );

  // Subscribe to the slice
  const unsubscribeSlice = scoreboardSlice.subscribe(() => {
    console.log("Scoreboard changed:", scoreboardSlice.getSnapshot());
  });

  // You can create multiple slices for different parts of the state
  const gameStateSlice = store.select((s) => s.gameState);
  const gameTimeSlice = store.select((s) => s.gameData.gameTime);

  // Clean up
  // unsubscribeAll();
  // unsubscribeSlice();
}

// ============================================================================
// Example 8: Performance patterns
// ============================================================================

function performanceExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
  });

  // ❌ BAD: This will trigger on EVERY update, even if kills didn't change
  client.ingameStore.subscribe(() => {
    const kills =
      client.ingameStore.getSnapshot().gameData.scoreboard?.teams[0]?.kills;
    console.log("Kills:", kills);
  });

  // ✅ GOOD: This only triggers when kills actually changes
  client.watchIngame(
    (s) => s.gameData.scoreboard?.teams[0]?.kills,
    (kills) => {
      console.log("Kills:", kills);
    },
  );

  // ✅ GOOD: For objects, use shallowEqual to compare contents
  client.watchIngame(
    (s) => ({
      kills: s.gameData.scoreboard?.teams[0]?.kills ?? 0,
      deaths: s.gameData.scoreboardBottom?.teams[0]?.players[0]?.deaths ?? 0,
    }),
    (stats) => {
      console.log("Stats:", stats);
    },
    shallowEqual,
  );

  // ✅ GOOD: Select nested objects only when their identity changes
  client.watchIngame(
    (s) => s.gameData.scoreboard?.teams[0],
    (team) => {
      console.log("Blue team changed:", team);
    },
  );
}

// Export examples
export { vanillaJsExample, directStoreUsageExample, performanceExample };
