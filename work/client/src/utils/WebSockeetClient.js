class WebSocketClient {
  constructor({ url, socketOnMessageFunc }) {
    this.socketUrl = url;
    this.socketOnMessageFunc = socketOnMessageFunc;

    this.socket = null;
    this.reconnectTimer = null;

    this.reconnectInterval = 1000;
    this.maxReconnectInterval = 30000;

    this.shouldReconnect = true;

    this.connect();
  }

  connect() {
    if (!this.shouldReconnect) {
      return;
    }

    if (!this.socketUrl) {
      console.error('WebSocket URL is not defined');
      return;
    }

    if (
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    const socket = new WebSocket(this.socketUrl);
    this.socket = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');

      this.reconnectInterval = 1000;
    };

    socket.onmessage = (event) => {
      try {
        this.socketOnMessageFunc(event);
      } catch (error) {
        console.error('WebSocket message processing error:', error);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);

      if (this.socket === socket) {
        this.socket = null;
      }

      if (this.shouldReconnect) {
        this.reconnect();
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }
    };
  }

  reconnect() {
    if (!this.shouldReconnect || this.reconnectTimer) {
      return;
    }

    const delay = this.reconnectInterval;

    console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      if (!this.shouldReconnect) {
        return;
      }

      this.connect();

      this.reconnectInterval = Math.min(
        this.reconnectInterval * 2,
        this.maxReconnectInterval,
      );
    }, delay);
  }

  close() {
    this.shouldReconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const socket = this.socket;
    this.socket = null;

    if (
      socket &&
      (socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN)
    ) {
      socket.close(1000, 'Client closed connection');
    }
  }
}

export default WebSocketClient;
