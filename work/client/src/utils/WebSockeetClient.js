// Сервер закрывает соединение этим кодом, если сессия недействительна
const UNAUTHORIZED_CLOSE_CODE = 4401;

const PING_INTERVAL = 30000; // Как часто проверяем соединение
const PONG_TIMEOUT = 5000; // Сколько ждём ответ pong

class WebSocketClient {
  constructor({ url, socketOnMessageFunc, onReconnect, onUnauthorized }) {
    this.socketUrl = url;
    this.socketOnMessageFunc = socketOnMessageFunc;
    this.onReconnect = onReconnect;
    this.onUnauthorized = onUnauthorized;

    this.socket = null;

    this.reconnectTimer = null;
    this.pingTimer = null;
    this.pongTimer = null;

    this.reconnectInterval = 1000;
    this.maxReconnectInterval = 30000;

    this.shouldReconnect = true;
    this.hasConnected = false;

    this.handleWake = this.handleWake.bind(this);

    this.pingTimer = setInterval(
      () => this.checkAlive(),
      PING_INTERVAL,
    );

    document.addEventListener('visibilitychange', this.handleWake);
    window.addEventListener('online', this.handleWake);

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

    // Игнорируем события от старого сокета после переподключения
    const isCurrent = () => socket === this.socket;

    socket.onopen = () => {
      if (!isCurrent()) {
        return;
      }

      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      if (!isCurrent()) {
        return;
      }

      // Соединение считается авторизованным только после ответа ready
      if (event.data === 'ready') {
        console.log('WebSocket authorized');

        this.reconnectInterval = 1000;

        if (this.hasConnected) {
          this.onReconnect?.();
        }

        this.hasConnected = true;
        return;
      }

      if (event.data === 'pong') {
        clearTimeout(this.pongTimer);
        this.pongTimer = null;
        return;
      }

      try {
        this.socketOnMessageFunc?.(event);
      } catch (error) {
        console.error(
          'WebSocket message processing error:',
          error,
        );
      }
    };

    socket.onclose = (event) => {
      if (!isCurrent()) {
        return;
      }

      console.log('WebSocket connection closed:', event);

      this.socket = null;

      clearTimeout(this.pongTimer);
      this.pongTimer = null;

      if (!this.shouldReconnect) {
        return;
      }

      // Сервер отклонил соединение из-за недействительной сессии
      if (event.code === UNAUTHORIZED_CLOSE_CODE) {
        this.close();
        this.onUnauthorized?.();
        return;
      }

      this.reconnect();
    };

    socket.onerror = (error) => {
      if (!isCurrent()) {
        return;
      }

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

    console.log(
      `Attempting to reconnect in ${delay / 1000} seconds...`,
    );

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

  // Немедленное переподключение без ожидания reconnectTimer
  reconnectNow() {
    if (!this.shouldReconnect) {
      return;
    }

    clearTimeout(this.reconnectTimer);
    clearTimeout(this.pongTimer);

    this.reconnectTimer = null;
    this.pongTimer = null;
    this.reconnectInterval = 1000;

    const oldSocket = this.socket;

    // События старого сокета теперь будут проигнорированы
    this.socket = null;

    if (
      oldSocket?.readyState === WebSocket.CONNECTING ||
      oldSocket?.readyState === WebSocket.OPEN
    ) {
      oldSocket.close();
    }

    this.connect();
  }

  checkAlive() {
    if (!this.shouldReconnect || this.pongTimer) {
      return;
    }

    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send('ping');

    this.pongTimer = setTimeout(() => {
      this.reconnectNow();
    }, PONG_TIMEOUT);
  }

  handleWake() {
    if (
      !this.shouldReconnect ||
      document.visibilityState === 'hidden'
    ) {
      return;
    }

    const socketState = this.socket?.readyState;

    if (socketState === WebSocket.OPEN) {
      this.checkAlive();
      return;
    }

    if (socketState !== WebSocket.CONNECTING) {
      this.reconnectNow();
    }
  }

  close() {
    this.shouldReconnect = false;

    clearTimeout(this.reconnectTimer);
    clearTimeout(this.pongTimer);
    clearInterval(this.pingTimer);

    this.reconnectTimer = null;
    this.pongTimer = null;
    this.pingTimer = null;

    document.removeEventListener(
      'visibilitychange',
      this.handleWake,
    );

    window.removeEventListener('online', this.handleWake);

    const socket = this.socket;

    // Сначала отвязываем сокет, чтобы его onclose не запустил reconnect
    this.socket = null;

    if (
      socket?.readyState === WebSocket.CONNECTING ||
      socket?.readyState === WebSocket.OPEN
    ) {
      socket.close(1000, 'Client closed connection');
    }
  }
}

export default WebSocketClient;
