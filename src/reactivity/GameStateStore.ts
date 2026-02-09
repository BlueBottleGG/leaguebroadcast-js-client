import type { ingameFrontendData } from "#types/ingame/ingamefrontenddata";
import type { GameState } from "#types/shared/GameState";

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
export interface Subscribable<T> {
  /** Register a listener that fires when the selected value changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** Return the current value of this slice. */
  getSnapshot(): T;
}

/** Equality function used to compare snapshots. */
export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Reactive store for League Broadcast game state.
 *
 * The store holds an immutable snapshot that is replaced on every update.
 * Fine-grained subscriptions are achieved through **selectors**: a selector
 * derives a slice of the full state and only notifies listeners when the
 * derived value actually changes (compared with a configurable equality
 * function — shallow reference equality by default).
 *
 * @example Vanilla JS
 * ```ts
 * const scoreboard = store.select(s => s.scoreboard);
 * scoreboard.subscribe(() => {
 *   console.log('Scoreboard changed:', scoreboard.getSnapshot());
 * });
 * ```
 *
 * @example React 18+
 * ```tsx
 * function Scoreboard() {
 *   const scoreboard = useSyncExternalStore(
 *     store.select(s => s.scoreboard).subscribe,
 *     store.select(s => s.scoreboard).getSnapshot,
 *   );
 *   return <div>{scoreboard?.teams[0]?.kills}</div>;
 * }
 * // — or use the provided useGameState hook (see docs)
 * ```
 *
 * @example Vue 3
 * ```ts
 * const kills = useGameStateRef(store, s => s.scoreboard?.teams[0]?.kills);
 * ```
 */
export class GameStateStore {
  /** Current immutable snapshot. Replaced (never mutated) on every update. */
  private snapshot: GameStateSnapshot;

  /** Global listeners — called on every state change regardless of selector. */
  private listeners = new Set<() => void>();

  /** Monotonically increasing version — used for cheap stale checks. */
  private version = 0;

  constructor(initialState: ingameFrontendData, initialGameState: GameState) {
    this.snapshot = Object.freeze({
      gameData: initialState,
      gameState: initialGameState,
      version: this.version,
    });
  }

  // ---------------------------------------------------------------------------
  // Core API
  // ---------------------------------------------------------------------------

  /** Return the current full snapshot. */
  getSnapshot(): GameStateSnapshot {
    return this.snapshot;
  }

  /** Return the current version number. */
  getVersion(): number {
    return this.version;
  }

  /**
   * Subscribe to **all** state changes (unfiltered).
   * Returns an unsubscribe function.
   *
   * This satisfies the `subscribe` half of `useSyncExternalStore` when
   * combined with `getSnapshot`.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ---------------------------------------------------------------------------
  // Selectors — the main reactivity primitive
  // ---------------------------------------------------------------------------

  /**
   * Create a **subscribable slice** that only triggers when the selected
   * value changes according to `equalityFn` (defaults to `===`).
   *
   * The returned object satisfies the `useSyncExternalStore` contract and
   * can also be used with `watch()` for callback-style subscriptions.
   *
   * Selector instances are lightweight — create them freely (e.g. inside
   * render functions). Referential identity of the *selector function* is
   * **not** required to be stable.
   */
  select<S>(
    selector: (snapshot: GameStateSnapshot) => S,
    equalityFn: EqualityFn<S> = Object.is,
  ): Subscribable<S> {
    let currentValue: S = selector(this.snapshot);
    let lastVersion: number = this.version;
    const sliceListeners = new Set<() => void>();

    const getSnapshot = (): S => {
      // Re-derive only if the store version bumped since last read
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

      // Subscribe to the root store; filter notifications through equality
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
   *
   * This is the simplest API for imperative / vanilla-JS usage:
   *
   * ```ts
   * store.watch(
   *   s => s.gameData.scoreboard?.teams[0]?.kills,
   *   kills => console.log('Blue kills:', kills),
   * );
   * ```
   */
  watch<S>(
    selector: (snapshot: GameStateSnapshot) => S,
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
    selector: (snapshot: GameStateSnapshot) => S,
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

  /** @internal Replace game data snapshot and notify listeners. */
  _setGameData(data: ingameFrontendData): void {
    this.version++;
    this.snapshot = Object.freeze({
      ...this.snapshot,
      gameData: data,
      version: this.version,
    });
    this.emit();
  }

  /** @internal Replace game state and notify listeners. */
  _setGameState(state: GameState): void {
    if (this.snapshot.gameState === state) return;
    this.version++;
    this.snapshot = Object.freeze({
      ...this.snapshot,
      gameState: state,
      version: this.version,
    });
    this.emit();
  }

  /** @internal Replace entire snapshot (used on game end / reset). */
  _reset(data: ingameFrontendData, state: GameState): void {
    this.version++;
    this.snapshot = Object.freeze({
      gameData: data,
      gameState: state,
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

export interface GameStateSnapshot {
  readonly gameData: ingameFrontendData;
  readonly gameState: GameState;
  /** Monotonic version counter — useful for cheap stale checks. */
  readonly version: number;
}

// ---------------------------------------------------------------------------
// Utility: shallow equality for object slices
// ---------------------------------------------------------------------------

/**
 * Shallow-compare two objects by their own enumerable keys.
 * Useful as `equalityFn` when selecting an object whose identity changes
 * on every update but whose contents may not (e.g. `{ kills: 3, deaths: 1 }`).
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !Object.is((a as any)[key], (b as any)[key])
    ) {
      return false;
    }
  }
  return true;
}
