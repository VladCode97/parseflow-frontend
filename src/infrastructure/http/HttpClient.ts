const BASE_URL = import.meta.env['VITE_API_URL'] ?? 'http://127.0.0.1:8000';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface RequestOptions {
  signal?: AbortSignal;
}

export async function httpPost<TBody, TResponse>(
  path: string,
  body: TBody,
  options?: RequestOptions,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
  });

  if (!response.ok) {
    let code = 'HTTP_ERROR';
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json() as { detail?: { code?: string; message?: string } };
      code = errorBody.detail?.code ?? code;
      message = errorBody.detail?.message ?? message;
    } catch {
      // keep defaults
    }

    throw new HttpError(response.status, code, message);
  }

  return response.json() as Promise<TResponse>;
}
