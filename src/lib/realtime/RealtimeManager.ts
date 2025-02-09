import { createChannelManager } from './channel-manager';
import { createErrorHandler } from './error-handler';
import { createEventManager } from './event-manager';
import type { RealtimeManagerOptions } from './types';

export class RealtimeManager {
  private channelManager;
  private errorHandler;
  private eventManager;

  constructor(workspaceId: string, options?: RealtimeManagerOptions) {
    this.errorHandler = createErrorHandler(options?.errorConfig);
    this.channelManager = createChannelManager(workspaceId, this.errorHandler);
    this.eventManager = createEventManager(workspaceId, this.errorHandler);
  }

  public async setupChannel(name: string, handler: Function) {
    return this.channelManager.setupChannel(name, handler);
  }

  public cleanup() {
    this.channelManager.cleanup();
    this.eventManager.cleanup();
  }
}

export const createRealtimeManager = (workspaceId: string, options?: RealtimeManagerOptions) => {
  return new RealtimeManager(workspaceId, options);
};