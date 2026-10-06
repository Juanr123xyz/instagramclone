import { localDatabase } from '../database/LocalDatabase';
import { networkMonitor } from './NetworkMonitor';
import { OfflineSyncAction, ActionType } from '../types';

type QueueListener = (pendingCount: number, isSyncing: boolean) => void;

class OfflineSyncQueue {
  private static instance: OfflineSyncQueue;
  private isProcessing: boolean = false;
  private listeners: Set<QueueListener> = new Set();

  private constructor() {
    // Listen for network reconnects to auto-flush queue in background
    networkMonitor.subscribe((isOnline) => {
      if (isOnline) {
        console.log('[OfflineSyncQueue] Network restored! Initiating background synchronization...');
        this.processQueue();
      }
    });
  }

  public static getInstance(): OfflineSyncQueue {
    if (!OfflineSyncQueue.instance) {
      OfflineSyncQueue.instance = new OfflineSyncQueue();
    }
    return OfflineSyncQueue.instance;
  }

  /**
   * Enqueues an optimistic action for background synchronization
   */
  public async enqueueAction(type: ActionType, payload: Record<string, any>): Promise<OfflineSyncAction> {
    const action: OfflineSyncAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    await localDatabase.insertSyncAction(action);
    this.notifyListeners();

    // If online, trigger queue sync immediately in background thread
    if (networkMonitor.isOnline()) {
      this.processQueue();
    }

    return action;
  }

  /**
   * Background processor: Flushes queue in strict chronological order
   */
  public async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    if (!networkMonitor.isOnline()) return;

    this.isProcessing = true;
    this.notifyListeners();

    try {
      const pendingActions = await localDatabase.getPendingActions();
      console.log(`[OfflineSyncQueue] Found ${pendingActions.length} pending actions to sync.`);

      for (const action of pendingActions) {
        if (!networkMonitor.isOnline()) {
          console.log('[OfflineSyncQueue] Network dropped mid-sync. Pausing queue processing.');
          break;
        }

        await localDatabase.updateActionStatus(action.id, 'syncing');

        try {
          // Simulate HTTP / Backend request execution with potential network delay
          await this.executeRemoteAction(action);
          
          await localDatabase.updateActionStatus(action.id, 'completed');
          console.log(`[OfflineSyncQueue SUCCESS] Synced action ${action.type} (${action.id})`);
        } catch (error: any) {
          console.error(`[OfflineSyncQueue ERROR] Failed to sync ${action.type}:`, error);
          
          if (action.retryCount >= 3) {
            // Conflict resolution / max retries reached: Mark failed safely without crashing remote state
            await localDatabase.updateActionStatus(action.id, 'failed');
          } else {
            await localDatabase.updateActionStatus(action.id, 'pending', true);
          }
        }
      }
    } finally {
      this.isProcessing = false;
      this.notifyListeners();
    }
  }

  private async executeRemoteAction(action: OfflineSyncAction): Promise<void> {
    // Simulate backend network latency (300ms - 600ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Conflict Resolution rules based on action type
    switch (action.type) {
      case 'LIKE_POST':
      case 'UNLIKE_POST':
        // State is idempotent in backend
        break;
      case 'ADD_COMMENT':
        if (!action.payload.text || action.payload.text.trim() === '') {
          throw new Error('Conflict: Comment empty or deleted before sync.');
        }
        break;
      case 'SEND_MESSAGE':
        break;
      case 'REQUEST_FOLLOW':
      case 'APPROVE_FOLLOW':
      case 'REJECT_FOLLOW':
        break;
    }
  }

  public async getPendingCount(): Promise<number> {
    const actions = await localDatabase.getPendingActions();
    return actions.length;
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async notifyListeners(): Promise<void> {
    const count = await this.getPendingCount();
    this.listeners.forEach((listener) => listener(count, this.isProcessing));
  }
}

export const offlineSyncQueue = OfflineSyncQueue.getInstance();
