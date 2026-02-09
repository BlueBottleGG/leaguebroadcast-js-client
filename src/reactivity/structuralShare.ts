/**
 * Structural sharing utility.
 *
 * Creates a new object/array tree from `next`, but reuses references from
 * `prev` when values are deeply equal. This keeps nested references stable
 * across updates, so selectors only re-fire when their content actually
 * changes.
 */
export function structuralShare<T>(prev: T, next: T): T {
  if (Object.is(prev, next)) {
    return prev;
  }

  if (!isObject(prev) || !isObject(next)) {
    return next;
  }

  if (Array.isArray(prev) || Array.isArray(next)) {
    if (!Array.isArray(prev) || !Array.isArray(next)) {
      return next;
    }

    if (prev.length !== next.length) {
      return next.map((value, index) =>
        structuralShare(prev[index] as any, value as any),
      ) as unknown as T;
    }

    let changed = false;
    const shared = next.map((value, index) => {
      const nextValue = structuralShare(prev[index] as any, value as any);
      if (!Object.is(nextValue, prev[index])) {
        changed = true;
      }
      return nextValue;
    });

    return changed ? (shared as unknown as T) : prev;
  }

  const prevObj = prev as Record<string, unknown>;
  const nextObj = next as Record<string, unknown>;
  const nextKeys = Object.keys(nextObj);
  const prevKeys = Object.keys(prevObj);

  let changed = nextKeys.length !== prevKeys.length;
  const result: Record<string, unknown> = Object.create(
    Object.getPrototypeOf(next),
  );

  for (const key of nextKeys) {
    const prevValue = prevObj[key];
    const nextValue = nextObj[key];
    const sharedValue = structuralShare(prevValue as any, nextValue as any);
    result[key] = sharedValue;
    if (!Object.is(sharedValue, prevValue)) {
      changed = true;
    }
  }

  return changed ? (result as T) : prev;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}
