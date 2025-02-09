export interface AirbyteConfig {
  name: string;
  sourceType: string;
  credentials: Record<string, any>;
}

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

export interface AirbyteDestination {
  destinationId: string;
  name: string;
  destinationDefinitionId: string;
  workspaceId: string;
  connectionConfiguration: Record<string, any>;
}

export type SourceType = 
  | 'rss'
  | 'medium'
  | 'wordpress'
  | 'ghost'
  | 'substack'
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'instagram';