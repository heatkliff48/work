import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновите состояние, чтобы при следующем рендере показать запасной UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Вы можете также передать ошибку в сервис логирования ошибок
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Можно отрендерить запасной UI при возникновении ошибки
      return <h1>Что-то пошло не так.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
