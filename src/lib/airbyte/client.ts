import { AIRBYTE_CONFIG } from './config';

export class AirbyteClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = AIRBYTE_CONFIG.apiUrl;
    this.apiKey = AIRBYTE_CONFIG.apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Airbyte API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createSource(config: {
    name: string;
    sourceDefinitionId: string;
    workspaceId: string;
    connectionConfiguration: Record<string, any>;
  }) {
    return this.request('/sources', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async createConnection(config: {
    name: string;
    sourceId: string;
    destinationId: string;
    syncCatalog: Record<string, any>;
    schedule?: {
      units: number;
      timeUnit: string;
    };
  }) {
    return this.request('/connections', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getSourceDefinitions() {
    return this.request('/source_definitions');
  }

  async getSourceSchema(sourceId: string) {
    return this.request(`/sources/${sourceId}/schema`);
  }

  async getSyncJobs(connectionId: string) {
    return this.request(`/jobs?connectionId=${connectionId}`);
  }
}