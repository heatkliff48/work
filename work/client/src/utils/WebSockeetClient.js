class WebSocketClient {
  constructor({ url, socketOnMessageFunc }) {
    this.socketUrl = url;
    this.socketOnMessageFunc = socketOnMessageFunc;
    this.socket = null;
    this.reconnectInterval = 1000; // Начальный интервал повторного соединения (1 секунда)
    this.connect(); // Инициализация соединения при создании экземпляра
  }

  connect() {
    this.socket = new WebSocket(this.socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectInterval = 1000; // Сброс интервала при успешном подключении
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data); // Обработка входящих сообщений
      this.socketOnMessageFunc(event);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.reconnect(); // Запуск механизма повторного подключения
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // this.reconnect()
      this.socket.close(); // Закрываем соединение в случае ошибки
    };
  }

  reconnect() {
    console.log(
      `Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`
    );
    setTimeout(() => {
      this.connect(); // Пытаемся снова подключиться
      this.reconnectInterval = Math.min(this.reconnectInterval * 2, 30000); // Максимум 30 секунд
    }, this.reconnectInterval);
  }
}

// Экспортируем класс для использования в других файлах
export default WebSocketClient;
