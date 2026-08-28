export type Result<T> =
  | { ok: true; data: T; error?: never }
  | { ok: false; data?: never; error: string };

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const { method = "GET", params, body, headers = {} } = options;

  const targetUrl = new URL(url);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        targetUrl.searchParams.set(key, String(value));
      }
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: method as string,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network request failed",
    };
  }
}