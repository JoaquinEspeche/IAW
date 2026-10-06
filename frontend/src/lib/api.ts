import { Site, Account, Snapshot, ExtractedDocument, CreateSiteInput, UpdateSiteInput, SearchResult } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Generic fetch wrapper — no fallbacks, all real backend
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
  }

  return res.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/sites`, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok || res.status === 200;
  } catch {
    return false;
  }
}

export const sitesApi = {
  getAll(accountId?: string): Promise<Site[]> {
    const endpoint = accountId ? `/sites?accountId=${accountId}` : '/sites';
    return fetchApi<Site[]>(endpoint);
  },

  getById(id: string): Promise<Site> {
    return fetchApi<Site>(`/sites/${id}`);
  },

  create(data: CreateSiteInput): Promise<Site> {
    return fetchApi<Site>('/sites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateSiteInput): Promise<Site> {
    return fetchApi<Site>(`/sites/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<{ acknowledged: boolean }> {
    return fetchApi<{ acknowledged: boolean }>(`/sites/${id}`, {
      method: 'DELETE',
    });
  },
};

export const snapshotsApi = {
  getBySite(siteId: string): Promise<Snapshot[]> {
    return fetchApi<Snapshot[]>(`/snapshots/site/${siteId}`);
  },

  getById(id: string): Promise<Snapshot> {
    return fetchApi<Snapshot>(`/snapshots/${id}`);
  },

  triggerCrawl(siteId: string): Promise<Snapshot> {
    return fetchApi<Snapshot>(`/snapshots/site/${siteId}/trigger`, {
      method: 'POST',
    });
  },
};

export const documentsApi = {
  getBySite(siteId: string): Promise<ExtractedDocument[]> {
    return fetchApi<ExtractedDocument[]>(`/documents/site/${siteId}`);
  },

  getBySnapshot(snapshotId: string): Promise<ExtractedDocument[]> {
    return fetchApi<ExtractedDocument[]>(`/documents/snapshot/${snapshotId}`);
  },

  delete(id: string): Promise<{ acknowledged: boolean }> {
    return fetchApi<{ acknowledged: boolean }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

export const searchApi = {
  search(query: string, apiKey: string): Promise<SearchResult[]> {
    return fetchApi<SearchResult[]>(
      `/search?q=${encodeURIComponent(query)}&apiKey=${encodeURIComponent(apiKey)}`
    );
  },
};

export const accountsApi = {
  getAll(): Promise<Account[]> {
    return fetchApi<Account[]>('/accounts');
  },

  getById(id: string): Promise<Account> {
    return fetchApi<Account>(`/accounts/${id}`);
  },

  create(data: { name: string; email: string }): Promise<Account> {
    return fetchApi<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: { name?: string; email?: string }): Promise<Account> {
    return fetchApi<Account>(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<{ acknowledged: boolean }> {
    return fetchApi<{ acknowledged: boolean }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },

  regenerateApiKey(id: string): Promise<Account> {
    return fetchApi<Account>(`/accounts/${id}/regenerate-api-key`, {
      method: 'POST',
    });
  },
};

export const seedApi = {
  runSeed(): Promise<{ message: string }> {
    return fetchApi<{ message: string }>('/seed', {
      method: 'POST',
    });
  },
};
