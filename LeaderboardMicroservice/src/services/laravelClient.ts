type LaravelClientOptions = {
  baseUrl: string;
};

export class LaravelClient {
  private baseUrl: string;

  constructor(opts: LaravelClientOptions) {
    // remove trailing slash
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
  }

  async getJson<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(this.baseUrl + path);

    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined) continue;
        url.searchParams.set(k, String(v));
      }
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const msg = `[LaravelClient] ${res.status} ${res.statusText} for ${url.toString()}${text ? ` :: ${text}` : ''}`;
      const err = new Error(msg);
      (err as any).status = 502;
      throw err;
    }

    return (await res.json()) as T;
  }
}
