// Сервер закрывает соединение этим кодом, если сессия недействительна
const UNAUTHORIZED_CLOSE_CODE = 4401;
const PING_INTERVAL = 30000; // Как часто проверяем, что соединение живо
const PONG_TIMEOUT = 5000; // Сколько ждём ответа, прежде чем считать соединение мёртвым

class WebSocketClient {
  constructor({ url, socketOnMessageFunc, onReconnect, onUnauthorized }) {
    this.socketUrl = url;
    this.socketOnMessageFunc = socketOnMessageFunc;
    this.onReconnect = onReconnect; // Вызывается при повторном подключении: за время обрыва могли быть пропущены сообщения
    this.onUnauthorized = onUnauthorized; // Вызывается, когда сервер отклонил подключение из-за истёкшей сессии
    this.socket = null;
    this.reconnectInterval = 1000; // Начальный интервал повторного соединения (1 секунда)
    this.reconnectTimer = null;
    this.pongTimer = null;
    this.hasConnected = false;
    this.isClosed = false; // true после close(): повторное подключение не выполняется

    // Соединение может оборваться молча (сон ноутбука, смена сети), поэтому
    // проверяем его периодически и сразу при возвращении на вкладку / в сеть
    this.handleWake = this.handleWake.bind(this);
    this.pingTimer = setInterval(() => this.checkAlive(), PING_INTERVAL);
    document.addEventListener('visibilitychange', this.handleWake);
    window.addEventListener('online', this.handleWake);

    this.connect(); // Инициализация соединения при создании экземпляра
  }

  close() {
    this.isClosed = true;
    clearTimeout(this.reconnectTimer);
    clearTimeout(this.pongTimer);
    clearInterval(this.pingTimer);
    document.removeEventListener('visibilitychange', this.handleWake);
    window.removeEventListener('online', this.handleWake);
    this.socket?.close();
  }

  connect() {
    const socket = new WebSocket(this.socketUrl);
    this.socket = socket;

    // События от старого сокета, заменённого через reconnectNow(), игнорируем
    const isCurrent = () => socket === this.socket;

    socket.onopen = () => {
      if (!isCurrent()) return;
      console.log("WebSocket connection established");
      this.reconnectInterval = 1000; // Сброс интервала при успешном подключении
      if (this.hasConnected) this.onReconnect?.();
      this.hasConnected = true;
    };

    socket.onmessage = (event) => {
      if (!isCurrent()) return;
      if (event.data === "pong") {
        clearTimeout(this.pongTimer);
        this.pongTimer = null;
        return;
      }
      console.log("Message from server:", event.data); // Обработка входящих сообщений
      this.socketOnMessageFunc(event);
    };

    socket.onclose = (event) => {
      if (!isCurrent()) return;
      console.log("WebSocket connection closed:", event);
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
      if (this.isClosed) return;
      if (event.code === UNAUTHORIZED_CLOSE_CODE) {
        this.close();
        this.onUnauthorized?.();
        return;
      }
      this.reconnect(); // Запуск механизма повторного подключения
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close(); // Закрываем соединение в случае ошибки
    };
  }

  reconnect() {
    console.log(
      `Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`
    );
    this.reconnectTimer = setTimeout(() => {
      this.connect(); // Пытаемся снова подключиться
      this.reconnectInterval = Math.min(this.reconnectInterval * 2, 30000); // Максимум 30 секунд
    }, this.reconnectInterval);
  }

  // Переподключение сразу, без ожидания таймера
  reconnectNow() {
    if (this.isClosed) return;
    clearTimeout(this.reconnectTimer);
    clearTimeout(this.pongTimer);
    this.pongTimer = null;
    this.reconnectInterval = 1000;
    const oldSocket = this.socket;
    this.connect();
    oldSocket?.close();
  }

  checkAlive() {
    if (this.isClosed || this.pongTimer) return;
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send("ping");
    this.pongTimer = setTimeout(() => this.reconnectNow(), PONG_TIMEOUT);
  }

  handleWake() {
    if (this.isClosed || document.visibilityState === "hidden") return;
    const state = this.socket?.readyState;
    if (state === WebSocket.OPEN) this.checkAlive();
    else if (state !== WebSocket.CONNECTING) this.reconnectNow();
  }
}

// Экспортируем класс для использования в других файлах
export default WebSocketClient;
