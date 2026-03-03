/**
 * Base HTTP client for League Broadcast REST API calls.
 *
 * Provides typed `get`, `post`, `put`, `patch`, and `delete` helpers that
 * handle JSON serialization, error responses, and empty bodies.
 *
 * Used internally by the generated API modules — you normally access this
 * through `LeagueBroadcastClient.api.*` rather than constructing it directly.
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /** Update the base URL (e.g. after reconnecting to a different host/port). */
  updateBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /** Current base URL. */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // ── HTTP verbs ──────────────────────────────────────────────────────────

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T = void>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async put<T = void>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  async patch<T = void>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T = void>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  /**
   * POST with a raw string body (e.g. base64 image data).
   * Sets Content-Type to text/plain instead of application/json.
   */
  async postRaw<T = void>(path: string, rawBody: string): Promise<T> {
    return this.request<T>("POST", path, rawBody, "text/plain");
  }

  /**
   * PUT with a raw string body (e.g. base64 image data).
   * Sets Content-Type to text/plain instead of application/json.
   */
  async putRaw<T = void>(path: string, rawBody: string): Promise<T> {
    return this.request<T>("PUT", path, rawBody, "text/plain");
  }

  // ── Internal ────────────────────────────────────────────────────────────

  private buildUrl(path: string): string {
    // Ensure no double slashes between base and path
    const base = this.baseUrl.endsWith("/")
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${base}/${cleanPath}`;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    contentType?: string,
  ): Promise<T> {
    const url = this.buildUrl(path);

    const headers: Record<string, string> = {};
    let bodyStr: string | undefined;

    if (body !== undefined) {
      if (contentType === "text/plain") {
        headers["Content-Type"] = "text/plain";
        bodyStr = String(body);
      } else {
        headers["Content-Type"] = "application/json";
        bodyStr = JSON.stringify(body);
      }
    }

    const res = await fetch(url, {
      method,
      headers,
      body: bodyStr,
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new ApiError(res.status, res.statusText, errorBody, url);
    }

    return this.parseResponse<T>(res);
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    if (!text || text.length === 0) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      // If it's not JSON, return the raw text (e.g. for string endpoints)
      return text as unknown as T;
    }
  }
}

/**
 * Error thrown when a REST API call returns a non-2xx status.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
    public readonly url: string,
  ) {
    super(`API Error ${status} (${statusText}) at ${url}`);
    this.name = "ApiError";
  }
}
