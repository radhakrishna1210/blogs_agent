export function getBackendBaseUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
}

type ApiRequestOptions = {
  token?: string | null;
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

function parseResponseText(text: string) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

type ApiErrorResponse = {
  ok?: false;
  error?: string;
  code?: string;
  details?: unknown;
  status?: number;
};

function getErrorMessage(parsed: unknown, responseStatus: number) {
  if (parsed && typeof parsed === 'object') {
    const payload = parsed as ApiErrorResponse;
    if (payload.error) {
      return payload.error;
    }
  }

  return `Request failed with status ${responseStatus}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}, fetchOptions: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    method: options.method || (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body,
    ...fetchOptions,
  });

  const parsed = parseResponseText(await response.text());

  if (!response.ok) {
    throw new Error(getErrorMessage(parsed, response.status));
  }

  if (parsed && typeof parsed === 'object' && 'ok' in parsed && parsed.ok === false) {
    throw new Error(String((parsed as { error?: string }).error || 'Request failed'));
  }

  return parsed as T;
}

