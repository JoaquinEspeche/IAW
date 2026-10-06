export interface Account {
  _id: string;
  name: string;
  email: string;
  apiKey: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Site {
  _id: string;
  accountId: string;
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  documentExtractor: string;
  pageResolver?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSiteInput {
  accountId: string;
  name: string;
  url: string;
  maxDepth: number;
  frequency: string;
  documentExtractor: string;
  pageResolver?: string;
}

export interface UpdateSiteInput {
  name?: string;
  url?: string;
  maxDepth?: number;
  frequency?: string;
  documentExtractor?: string;
  pageResolver?: string;
}

export interface Snapshot {
  _id: string;
  siteId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  extractedDocumentsCount: number;
  errorMessage?: string;
  startedAt: string;
  finishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExtractedDocument {
  _id: string;
  snapshotId: string;
  siteId: string;
  url: string;
  title: string;
  description?: string;
  content?: string;
  rawText?: string;
  extractedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResult {
  _id: string;
  siteId: string;
  snapshotId: string;
  url: string;
  title: string;
  description?: string;
  score?: number;
  highlight?: string;
}
