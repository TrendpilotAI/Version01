export interface AirbyteSource {
  sourceId: string;
  name: string;
  sourceDefinitionId: string;
  workspaceId: string;
  connectionConfiguration: Record<string, any>;
}

export interface AirbyteConnection {
  connectionId: string;
  name: string;
  sourceId: string;
  destinationId: string;
  syncCatalog: Record<string, any>;
  status: string;
}

export interface AirbyteSyncJob {
  jobId: string;
  connectionId: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  bytesSynced: number;
  recordsSynced: number;
}

export interface AirbyteSourceDefinition {
  sourceDefinitionId: string;
  name: string;
  dockerRepository: string;
  dockerImageTag: string;
  documentationUrl: string;
  icon?: string;
}