import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';

function getBearerToken(authorizationHeader) {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return null;
  }

  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, google_id, email, name, avatar_url, role, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function authenticateRequest(req, _res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return next(Object.assign(new Error('Missing authorization token.'), { statusCode: 401 }));
    }

    if (!env.jwtSecret) {
      return next(Object.assign(new Error('JWT secret is not configured.'), { statusCode: 500 }));
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return next(Object.assign(new Error('Invalid authorization token.'), { statusCode: 401 }));
    }

    const user = await getUserById(decoded.id);

    if (!user) {
      return next(Object.assign(new Error('User not found.'), { statusCode: 401 }));
    }

    req.auth = {
      token,
      user,
      userId: user.id,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(Object.assign(error instanceof Error ? error : new Error('Unauthorized'), { statusCode: 401 }));
  }
}

export function requireAuth(req, res, next) {
  if (!req.auth) {
    return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
  }

  return next();
}

export function requireAdmin(req, _res, next) {
  if (!req.auth) {
    return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
  }

  if (req.auth.role !== 'admin') {
    return next(Object.assign(new Error('Admin access required.'), { statusCode: 403 }));
  }

  return next();
}
