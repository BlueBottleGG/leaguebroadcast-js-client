/**
 * WebSocket connection manager for League Broadcast backend
 */
export class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string = "";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 5000;
  private reconnectTimeout: number | null = null;
  private messageHandlers: Set<(data: any) => void> = new Set();
  private connectionHandlers: Set<() => void> = new Set();
  private disconnectionHandlers: Set<() => void> = new Set();
  private errorHandlers: Set<(error: Event) => void> = new Set();

  /**
   * Connect to the WebSocket server
   */
  connect(url: string): Promise<void> {
    this.url = url;
    this.cleanup();

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log("[WebSocketManager] Connected to", url);
          this.reconnectAttempts = 0;
          this.connectionHandlers.forEach((handler) => handler());
          resolve();
        };

        this.socket.onmessage = (event: MessageEvent) => {
          // Ignore keep-alive messages
          if (event.data === "KeepAlive") {
            return;
          }

          try {
            const data = JSON.parse(event.data);
            this.messageHandlers.forEach((handler) => handler(data));
          } catch (error) {
            console.error(
              "[WebSocketManager] Failed to parse message:",
              event.data,
            );
          }
        };

        this.socket.onclose = () => {
          console.log("[WebSocketManager] Disconnected");
          this.disconnectionHandlers.forEach((handler) => handler());
          this.attemptReconnect();
        };

        this.socket.onerror = (error: Event) => {
          console.error("[WebSocketManager] Error:", error);
          this.errorHandlers.forEach((handler) => handler(error));
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Check if connected to the WebSocket server
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Send a message to the server
   */
  send(message: string | object): void {
    if (!this.isConnected()) {
      console.warn("[WebSocketManager] Cannot send message: not connected");
      return;
    }

    const data =
      typeof message === "string" ? message : JSON.stringify(message);
    this.socket!.send(data);
  }

  /**
   * Register a message handler
   */
  onMessage(handler: (data: any) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register a connection handler
   */
  onConnect(handler: () => void): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  /**
   * Register a disconnection handler
   */
  onDisconnect(handler: () => void): () => void {
    this.disconnectionHandlers.add(handler);
    return () => this.disconnectionHandlers.delete(handler);
  }

  /**
   * Register an error handler
   */
  onError(handler: (error: Event) => void): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Attempt to reconnect to the server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[WebSocketManager] Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[WebSocketManager] Reconnecting in ${this.reconnectDelay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect(this.url).catch((error) => {
        console.error("[WebSocketManager] Reconnect failed:", error);
      });
    }, this.reconnectDelay);
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close();
      }

      this.socket = null;
    }
  }
}
