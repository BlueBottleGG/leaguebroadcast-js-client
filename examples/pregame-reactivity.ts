/**
 * Pre-game Reactivity Examples for League Broadcast Client
 *
 * This file demonstrates how to use the reactive ChampSelectStateStore API
 * exposed by the unified LeagueBroadcastClient for various JavaScript frameworks.
 *
 * The single client internally connects to both `/ws/in` (in-game) and
 * `/ws/pre` (champion select) endpoints, so there is no need for a separate
 * pre-game client.
 */

import { LeagueBroadcastClient, GameState, shallowEqual } from "../src";

// ============================================================================
// Example 1: Vanilla JavaScript / Node.js
// ============================================================================

function vanillaJsExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
    port: 58869,
  });

  // Watch a single pre-game value via the convenience wrapper
  const unsubscribeTimer = client.watchChampSelect(
    (s) => s.champSelectData.timer.timeRemaining,
    (remaining, prev) => {
      console.log(`Timer: ${prev?.toFixed(1)} → ${remaining?.toFixed(1)}s`);
    },
  );

  // Watch a derived object — use shallowEqual to avoid over-firing
  const unsubscribeScores = client.watchChampSelect(
    (s) => ({
      blueScore: s.champSelectData.blueTeam.scoreMatch,
      redScore: s.champSelectData.redTeam.scoreMatch,
    }),
    (scores) => {
      console.log("Scores:", scores);
    },
    shallowEqual,
  );

  // Watch active state
  const unsubscribeActive = client.watchChampSelect(
    (s) => s.isActive,
    (isActive) => {
      console.log("Champ select active:", isActive);
    },
  );

  // Clean up when done
  // unsubscribeTimer();
  // unsubscribeScores();
  // unsubscribeActive();
}

// ============================================================================
// Example 2: React 18+ with useSyncExternalStore
// ============================================================================

/*
import { useSyncExternalStore } from 'react';
import {
  LeagueBroadcastClient,
  type ChampSelectSnapshot,
  type EqualityFn,
  shallowEqual,
} from '@bluebottle_gg/league-broadcast-client';

// Create the client outside of components (or via context)
const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

// Generic hook for subscribing to champ-select state slices
function useChampSelect<T>(
  selector: (snapshot: ChampSelectSnapshot) => T,
  equalityFn?: EqualityFn<T>,
) {
  const slice = client.selectChampSelect(selector, equalityFn);
  return useSyncExternalStore(slice.subscribe, slice.getSnapshot);
}

// -------- Component examples --------

function DraftTimer() {
  const timer = useChampSelect(s => s.champSelectData.timer);

  if (!timer) return null;
  return (
    <div className="timer">
      {timer.timeRemaining.toFixed(0)}s
    </div>
  );
}

function BluePicks() {
  const slots = useChampSelect(s => s.champSelectData.blueTeam.slots);

  return (
    <ul>
      {slots?.map((slot, i) => (
        <li key={slot.id ?? i}>
          {slot.player}: {slot.champion?.name ?? '—'}
          {slot.isActive && ' ◄'}
        </li>
      ))}
    </ul>
  );
}

function BanRow({ team }: { team: 'blue' | 'red' }) {
  const bans = useChampSelect(
    s => team === 'blue'
      ? s.champSelectData.blueTeam.bans
      : s.champSelectData.redTeam.bans,
  );

  return (
    <div className="bans">
      {bans?.map((ban, i) => (
        <img
          key={i}
          src={ban.champion ? client.getCacheUrl(ban.champion.tileImg) : ''}
          alt={ban.champion?.name ?? ''}
        />
      ))}
    </div>
  );
}

// Hook that uses the entire champ-select active state
function useIsChampSelectActive() {
  return useChampSelect(s => s.isActive);
}

// Usage in a page component
function DraftOverlay() {
  const isActive = useIsChampSelectActive();

  if (!isActive) return null;

  return (
    <div className="draft-overlay">
      <BanRow team="blue" />
      <BluePicks />
      <DraftTimer />
    </div>
  );
}
*/

// ============================================================================
// Example 3: Vue 3 with Composition API
// ============================================================================

/*
import { ref, computed, onUnmounted } from 'vue';
import {
  LeagueBroadcastClient,
  type ChampSelectSnapshot,
} from '@bluebottle_gg/league-broadcast-client';

const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

// Composable helper
function useChampSelectRef<T>(
  selector: (s: ChampSelectSnapshot) => T,
) {
  const value = ref<T>(selector(client.preGameStore.getSnapshot()));
  const unsubscribe = client.watchChampSelect(selector, (newValue) => {
    value.value = newValue;
  });
  onUnmounted(() => unsubscribe());
  return value;
}

// Computed helper (for version-based reactivity)
function useChampSelectComputed<T>(
  selector: (s: ChampSelectSnapshot) => T,
) {
  const version = ref(client.preGameStore.getVersion());
  const unsubscribe = client.preGameStore.subscribe(() => {
    version.value = client.preGameStore.getVersion();
  });
  onUnmounted(() => unsubscribe());
  return computed(() => {
    void version.value;
    return selector(client.preGameStore.getSnapshot());
  });
}

// Example component
export default {
  setup() {
    const isActive = useChampSelectRef(s => s.isActive);
    const timer = useChampSelectRef(s => s.champSelectData.timer);
    const blueSlots = useChampSelectRef(s => s.champSelectData.blueTeam.slots);
    const redSlots = useChampSelectRef(s => s.champSelectData.redTeam.slots);

    const blueBanned = computed(() =>
      client.preGameStore.getSnapshot().champSelectData.blueTeam.bans
        .filter(b => b.champion)
        .map(b => b.champion!.name)
    );

    return { isActive, timer, blueSlots, redSlots, blueBanned };
  },
};
*/

// ============================================================================
// Example 4: Svelte
// ============================================================================

// Svelte — the `Subscribable` returned by `selectChampSelect()` matches
// Svelte's store contract, so the $ auto-subscribe syntax works out of the box.

/*
<script lang="ts">
  import { LeagueBroadcastClient } from '@bluebottle_gg/league-broadcast-client';

  const client = new LeagueBroadcastClient({
    host: 'localhost',
    autoConnect: true,
  });

  // These are Svelte-compatible stores
  const isActive  = client.selectChampSelect(s => s.isActive);
  const timer     = client.selectChampSelect(s => s.champSelectData.timer);
  const blueSlots = client.selectChampSelect(s => s.champSelectData.blueTeam.slots);
  const redSlots  = client.selectChampSelect(s => s.champSelectData.redTeam.slots);
  const blueBans  = client.selectChampSelect(s => s.champSelectData.blueTeam.bans);
  const redBans   = client.selectChampSelect(s => s.champSelectData.redTeam.bans);
</script>

{#if $isActive}
  <div class="draft">
    <p>Time: {$timer?.timeRemaining?.toFixed(0)}s</p>

    <section class="blue">
      {#each $blueSlots ?? [] as slot}
        <div class:active={slot.isActive}>
          {slot.player}: {slot.champion?.name ?? '—'}
        </div>
      {/each}
    </section>

    <section class="red">
      {#each $redSlots ?? [] as slot}
        <div class:active={slot.isActive}>
          {slot.player}: {slot.champion?.name ?? '—'}
        </div>
      {/each}
    </section>
  </div>
{/if}
*/

// ============================================================================
// Example 5: Solid.js
// ============================================================================

/*
import { createSignal, createEffect, onCleanup } from 'solid-js';
import {
  LeagueBroadcastClient,
  type ChampSelectSnapshot,
} from '@bluebottle_gg/league-broadcast-client';

const client = new LeagueBroadcastClient({
  host: 'localhost',
  autoConnect: true,
});

function createChampSelectSignal<T>(
  selector: (s: ChampSelectSnapshot) => T,
) {
  const [value, setValue] = createSignal<T>(
    selector(client.preGameStore.getSnapshot()),
  );
  const unsub = client.watchChampSelect(selector, (next) => setValue(() => next));
  onCleanup(() => unsub());
  return value;
}

function DraftView() {
  const isActive = createChampSelectSignal(s => s.isActive);
  const blueSlots = createChampSelectSignal(s => s.champSelectData.blueTeam.slots);
  const redSlots = createChampSelectSignal(s => s.champSelectData.redTeam.slots);
  const timer = createChampSelectSignal(s => s.champSelectData.timer);

  return (
    <div>
      {isActive() && (
        <>
          <p>Time: {timer()?.timeRemaining.toFixed(0)}s</p>
          <ul>
            {blueSlots()?.map(slot => <li>{slot.player}: {slot.champion?.name ?? '—'}</li>)}
          </ul>
          <ul>
            {redSlots()?.map(slot => <li>{slot.player}: {slot.champion?.name ?? '—'}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}
*/

// ============================================================================
// Example 6: Angular with Signals (Angular 16+)
// ============================================================================

/*
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import {
  LeagueBroadcastClient,
  type champSelectStateData,
} from '@bluebottle_gg/league-broadcast-client';

@Component({
  selector: 'app-draft',
  template: `
    @if (isActive()) {
      <div class="draft">
        <p>Phase: {{ phase() }}</p>
        <p>Time: {{ timeRemaining() }}s</p>

        <div class="blue-picks">
          @for (slot of blueSlots(); track slot.id) {
            <div [class.active]="slot.isActive">
              {{ slot.player }}: {{ slot.champion?.name ?? '—' }}
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class DraftComponent implements OnInit, OnDestroy {
  private client = new LeagueBroadcastClient({
    host: 'localhost',
    autoConnect: true,
  });

  isActive = signal(false);
  phase = signal('');
  timeRemaining = signal(0);
  blueSlots = signal<champSelectStateData['blueTeam']['slots']>([]);

  private unsubs: (() => void)[] = [];

  ngOnInit() {
    this.unsubs.push(
      this.client.watchChampSelect(s => s.isActive, v => this.isActive.set(v)),
      this.client.watchChampSelect(
        s => s.champSelectData.timer.phaseName,
        v => this.phase.set(String(v)),
      ),
      this.client.watchChampSelect(
        s => s.champSelectData.timer.timeRemaining,
        v => this.timeRemaining.set(v),
      ),
      this.client.watchChampSelect(
        s => s.champSelectData.blueTeam.slots,
        v => this.blueSlots.set(v),
      ),
    );
  }

  ngOnDestroy() {
    this.unsubs.forEach(u => u());
    this.client.disconnect();
  }
}
*/

// ============================================================================
// Example 7: Direct store usage (advanced)
// ============================================================================

function directStoreUsageExample() {
  const client = new LeagueBroadcastClient({
    host: "localhost",
  });

  // Access the ChampSelectStateStore directly
  const { preGameStore } = client;

  // Inspect current snapshot synchronously
  const snapshot = preGameStore.getSnapshot();
  console.log("Is active:", snapshot.isActive);
  console.log("Store version:", snapshot.version);

  // Subscribe to ALL changes (unfiltered — use sparingly)
  const unsubscribeAll = preGameStore.subscribe(() => {
    const snap = preGameStore.getSnapshot();
    console.log(`Store v${snap.version} — active: ${snap.isActive}`);
  });

  // Immediate callback on subscribe, then on every change
  preGameStore.watchImmediate(
    (s) => s.champSelectData.timer.phaseName,
    (phase, prev) => {
      console.log(`Phase: ${prev} → ${phase}`);
    },
  );

  // Create a slice for React/Svelte/etc.
  const timerSlice = preGameStore.select((s) => s.champSelectData.timer);
  console.log("Current timer:", timerSlice.getSnapshot());

  // unsubscribeAll();
}

// ============================================================================
// Example 8: Combining in-game + pre-game reactivity (single client)
// ============================================================================

function combinedReactivityExample() {
  // One client handles both in-game and pre-game
  const client = new LeagueBroadcastClient({ host: "localhost" });

  // React to pre-game phase changes
  client.watchChampSelect(
    (s) => s.champSelectData.timer.phaseName,
    (phase) => console.log("New draft phase:", phase),
  );

  // React to in-game state changes
  client.watchIngame(
    (s) => s.gameState,
    (state) => {
      if (state === GameState.OutOfGame) {
        console.log("Returned to lobby");
      }
    },
  );

  // Watch whether either phase is "active"
  const pregameActive = client.selectChampSelect((s) => s.isActive);
  const gameActive = client.selectIngame(
    (s) => s.gameState !== GameState.OutOfGame,
  );

  // Chain to a single UI update
  const logState = () => {
    const inDraft = pregameActive.getSnapshot();
    const inGame = gameActive.getSnapshot();
    console.log(`State — draft: ${inDraft}, in-game: ${inGame}`);
  };

  pregameActive.subscribe(logState);
  gameActive.subscribe(logState);
}

// ============================================================================
// Export examples
// ============================================================================

export { vanillaJsExample, directStoreUsageExample, combinedReactivityExample };
