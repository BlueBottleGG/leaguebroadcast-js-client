import type { champSelectStateData } from "#types/pregame/champselectstatedata";

/**
 * A subscribable slice of state produced by `select()`.
 *
 * Compatible with:
 *  - React 18+ `useSyncExternalStore(slice.subscribe, slice.getSnapshot)`
 *  - Vue `watchEffect(() => slice.getSnapshot())`
 *  - Svelte `readable` / custom store contract
 *  - Solid `createEffect(() => slice.getSnapshot())`
 *  - Vanilla JS `slice.subscribe(() => console.log(slice.getSnapshot()))`
 */
export type { Subscribable, EqualityFn } from "./GameStateStore";

// Re-import locally for use within this file
import type { Subscribable, EqualityFn } from "./GameStateStore";

/**
 * Reactive store for League Broadcast champion-select (pre-game) state.
 *
 * Follows the same selector-based model as {@link GameStateStore} but holds
 * `champSelectStateData` instead of ingame data.
 *
 * @example Vanilla JS
 * ```ts
 * const timer = store.select(s => s.champSelectData.timer);
 * timer.subscribe(() => {
 *   console.log('Timer changed:', timer.getSnapshot());
 * });
 * ```
 *
 * @example React 18+
 * ```tsx
 * function Timer() {
 *   const timer = useSyncExternalStore(
 *     store.select(s => s.champSelectData.timer).subscribe,
 *     store.select(s => s.champSelectData.timer).getSnapshot,
 *   );
 *   return <div>{timer?.timeRemaining}</div>;
 * }
 * ```
 */
export class ChampSelectStateStore {
  /** Current immutable snapshot. Replaced (never mutated) on every update. */
  private snapshot: ChampSelectSnapshot;

  /** Global listeners — called on every state change regardless of selector. */
  private listeners = new Set<() => void>();

  /** Monotonically increasing version — used for cheap stale checks. */
  private version = 0;

  constructor(initialState: champSelectStateData) {
    this.snapshot = Object.freeze({
      champSelectData: initialState,
      isActive: initialState.isActive,
      version: this.version,
    });
  }

  // ---------------------------------------------------------------------------
  // Core API
  // ---------------------------------------------------------------------------

  /** Return the current full snapshot. */
  getSnapshot(): ChampSelectSnapshot {
    return this.snapshot;
  }

  /** Return the current version number. */
  getVersion(): number {
    return this.version;
  }

  /**
   * Subscribe to **all** state changes (unfiltered).
   * Returns an unsubscribe function.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ---------------------------------------------------------------------------
  // Selectors
  // ---------------------------------------------------------------------------

  /**
   * Create a **subscribable slice** that only triggers when the selected
   * value changes according to `equalityFn` (defaults to `===`).
   */
  select<S>(
    selector: (snapshot: ChampSelectSnapshot) => S,
    equalityFn: EqualityFn<S> = Object.is,
  ): Subscribable<S> {
    let currentValue: S = selector(this.snapshot);
    let lastVersion: number = this.version;
    const sliceListeners = new Set<() => void>();

    const getSnapshot = (): S => {
      if (lastVersion !== this.version) {
        const next = selector(this.snapshot);
        if (!equalityFn(currentValue, next)) {
          currentValue = next;
        }
        lastVersion = this.version;
      }
      return currentValue;
    };

    const subscribe = (listener: () => void): (() => void) => {
      sliceListeners.add(listener);

      const unsub = this.subscribe(() => {
        const prev = currentValue;
        const next = selector(this.snapshot);
        lastVersion = this.version;
        if (!equalityFn(prev, next)) {
          currentValue = next;
          listener();
        }
      });

      return () => {
        sliceListeners.delete(listener);
        unsub();
      };
    };

    return { subscribe, getSnapshot };
  }

  // ---------------------------------------------------------------------------
  // Convenience helpers
  // ---------------------------------------------------------------------------

  /**
   * Watch a derived value and invoke `callback` whenever it changes.
   * Returns an unsubscribe function.
   */
  watch<S>(
    selector: (snapshot: ChampSelectSnapshot) => S,
    callback: (value: S, prev: S) => void,
    equalityFn: EqualityFn<S> = Object.is,
  ): () => void {
    let prev: S = selector(this.snapshot);
    return this.subscribe(() => {
      const next = selector(this.snapshot);
      if (!equalityFn(prev, next)) {
        const old = prev;
        prev = next;
        callback(next, old);
      }
    });
  }

  /**
   * Watch a derived value and invoke `callback` whenever it changes,
   * **and** invoke it immediately with the current value.
   */
  watchImmediate<S>(
    selector: (snapshot: ChampSelectSnapshot) => S,
    callback: (value: S, prev: S | undefined) => void,
    equalityFn: EqualityFn<S> = Object.is,
  ): () => void {
    const current = selector(this.snapshot);
    callback(current, undefined);
    return this.watch(selector, callback, equalityFn);
  }

  // ---------------------------------------------------------------------------
  // Internal — called by LeagueBroadcastClient
  // ---------------------------------------------------------------------------

  /** @internal Replace champ-select data snapshot and notify listeners. */
  _setChampSelectData(data: champSelectStateData): void {
    this.version++;
    this.snapshot = Object.freeze({
      champSelectData: data,
      isActive: data.isActive,
      version: this.version,
    });
    this.emit();
  }

  /** @internal Replace entire snapshot (used on champ select end / reset). */
  _reset(data: champSelectStateData): void {
    this.version++;
    this.snapshot = Object.freeze({
      champSelectData: data,
      isActive: data.isActive,
      version: this.version,
    });
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((l) => l());
  }
}

// ---------------------------------------------------------------------------
// Snapshot type
// ---------------------------------------------------------------------------

export interface ChampSelectSnapshot {
  readonly champSelectData: champSelectStateData;
  /** Whether champ select is currently active. */
  readonly isActive: boolean;
  /** Monotonic version counter — useful for cheap stale checks. */
  readonly version: number;
}
