class WebError {
  constructor(status, error) {
    this.status = status;
    this.error = error;
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
    console.log(error);
    return res.status(error.status || 500).json(error);
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
