import type { AuthUser } from '../context/auth-context';

function base64UrlToBase64(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  return normalized + (padding ? '='.repeat(4 - padding) : '');
}

export function decodeJwt(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(base64UrlToBase64(parts[1])));

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return {
      id: String(payload.id || ''),
      email: String(payload.email || ''),
      name: String(payload.name || ''),
      avatar_url: payload.avatar_url ? String(payload.avatar_url) : null,
      role: payload.role === 'admin' ? 'admin' : 'user',
      created_at: payload.created_at ? String(payload.created_at) : undefined,
    };
  } catch {
    return null;
  }
}
