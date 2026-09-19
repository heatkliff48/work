class WebError extends Error {
  constructor(status, error) {
    const message =
      error instanceof Error ? error.message : error || 'Unexpected error';

    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.error = message;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

class Unprocessable extends WebError {
  constructor(error) {
    super(422, error);
  }
}

class Conflict extends WebError {
  constructor(error) {
    super(409, error);
  }
}

class NotFound extends WebError {
  constructor(error) {
    super(404, error);
  }
}

class Forbidden extends WebError {
  constructor(error) {
    super(403, error);
  }
}

class Unauthorized extends WebError {
  constructor(error) {
    super(401, error);
  }
}

class BadRequest extends WebError {
  constructor(error) {
    super(400, error);
  }
}

class ErrorUtils {
  static catchError(res, error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;

    const message = error?.error || error?.message || 'Internal Server Error';

    if (status >= 500) {
      console.error(error);
    }

    return res.status(status).json({
      status,
      error: message,
    });
  }
}

module.exports = {
  Unprocessable,
  Conflict,
  NotFound,
  Forbidden,
  Unauthorized,
  BadRequest,
  ErrorUtils,
};
