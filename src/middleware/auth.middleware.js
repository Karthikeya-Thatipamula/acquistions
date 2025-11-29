import { jwttoken } from '#utils/jwt.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Accept token from multiple common sources:
    // 1. Cookie named `auth_token`
    // 2. Cookie named `token` (Postman sometimes uses this)
    // 3. Authorization header: "Bearer <token>"
    // 4. Raw Cookie header fallback (parse manually)
    const cookieToken = req.cookies?.auth_token || req.cookies?.token;
    let headerToken = undefined;
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0]))
        headerToken = parts[1];
    }

    // Try to parse token from raw Cookie header if cookieParser didn't run or name differs
    let rawCookieToken = undefined;
    const rawCookieHeader = req.headers?.cookie;
    if (!cookieToken && rawCookieHeader) {
      // simple parse: look for auth_token= or token=
      const match = rawCookieHeader.match(
        /(?:^|;\s*)(?:auth_token|token)=([^;]+)/i
      );
      if (match) rawCookieToken = decodeURIComponent(match[1]);
    }

    const token = cookieToken || headerToken || rawCookieToken;

    // In development, log which source provided the token (don't log full token)
    const source = cookieToken
      ? 'cookie'
      : headerToken
        ? 'authorization_header'
        : rawCookieToken
          ? 'raw_cookie_header'
          : 'none';
    if (process.env.NODE_ENV !== 'production') {
      const tokenPreview = token ? `${String(token).slice(0, 8)}...` : null;
      logger.info('Auth token lookup', {
        source,
        tokenPreview,
        path: req.path,
        ip: req.ip,
      });
    }

    if (!token) {
      logger.warn('No token provided', {
        ip: req.ip,
        path: req.path,
      });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const decoded = jwttoken.verify(token);
    req.user = decoded;
    next();
  } catch (e) {
    logger.error('Token verification failed', e);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = roles => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (!roles.includes(req.user.role)) {
        logger.warn('Insufficient permissions', {
          userId: req.user.id,
          requiredRoles: roles,
          userRole: req.user.role,
          path: req.path,
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions',
        });
      }

      next();
    } catch (e) {
      logger.error('Role verification failed', e);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error checking user permissions',
      });
    }
  };
};
