const { Unauthorized, Forbidden } = require('../utils/Errors.js');

const requireRole = (...allowedRoles) => {
  const normalizedRoles = new Set(allowedRoles.map((role) => String(role)));

  return (req, res, next) => {
    if (!req.user) {
      return next(new Unauthorized('Authentication is required'));
    }

    if (!normalizedRoles.has(String(req.user.role))) {
      return next(new Forbidden('You do not have permission for this action'));
    }

    return next();
  };
};

module.exports = {
  requireRole,
};
