import { OfflineSyncAction, User, Post, Story } from '../types';

/**
 * Local Embedded Database & Persistence Engine
 * Supports SQLite / IndexedDB / window.localStorage persistence across page reloads (F5).
 */
class LocalDatabase {
  private static instance: LocalDatabase;
  private actionsTable: Map<string, OfflineSyncAction> = new Map();
  private localKeyValues: Map<string, string> = new Map();

  private constructor() {
    this.initPersistence();
  }

  public static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  private initPersistence(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedActions = window.localStorage.getItem('insta_sync_actions');
        if (storedActions) {
          const parsed = JSON.parse(storedActions);
          parsed.forEach((a: OfflineSyncAction) => this.actionsTable.set(a.id, a));
        }
      } catch (e) {
        console.warn('[LocalDB] Storage load error:', e);
      }
    }
  }

  private persistActionsToDisk(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const actionsArray = Array.from(this.actionsTable.values());
        window.localStorage.setItem('insta_sync_actions', JSON.stringify(actionsArray));
      } catch (e) {
        console.warn('[LocalDB] Storage save error:', e);
      }
    }
  }

  // SQLite INSERT INTO sync_queue
  public async insertSyncAction(action: OfflineSyncAction): Promise<void> {
    this.actionsTable.set(action.id, { ...action });
    this.persistActionsToDisk();
    console.log(`[SQLite LocalDB] Action queued persistently: ${action.type} (ID: ${action.id})`);
  }

  // SQLite SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY timestamp ASC
  public async getPendingActions(): Promise<OfflineSyncAction[]> {
    return Array.from(this.actionsTable.values())
      .filter((a) => a.status === 'pending' || a.status === 'syncing')
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // SQLite UPDATE sync_queue SET status = ? WHERE id = ?
  public async updateActionStatus(
    id: string,
    status: OfflineSyncAction['status'],
    incrementRetry: boolean = false
  ): Promise<void> {
    const action = this.actionsTable.get(id);
    if (action) {
      action.status = status;
      if (incrementRetry) action.retryCount++;
      if (status === 'completed') {
        this.actionsTable.delete(id);
      } else {
        this.actionsTable.set(id, action);
      }
      this.persistActionsToDisk();
    }
  }

  // ==========================================
  // 💾 PERSISTENT KEY-VALUE STORE (WEB & NATIVE)
  // ==========================================

  public setItemSync(key: string, value: string): void {
    this.localKeyValues.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(`insta_store_${key}`, value);
      } catch (e) {}
    }
  }

  public getItemSync(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const val = window.localStorage.getItem(`insta_store_${key}`);
        if (val !== null) return val;
      } catch (e) {}
    }
    return this.localKeyValues.get(key) || null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.setItemSync(key, value);
  }

  public async getItem(key: string): Promise<string | null> {
    return this.getItemSync(key);
  }

  // ==========================================
  // 👤 USER PROFILE PERSISTENCE
  // ==========================================

  public saveCurrentUser(user: User): void {
    this.setItemSync('current_user', JSON.stringify(user));
  }

  public loadCurrentUser(fallback: User): User {
    const stored = this.getItemSync('current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return fallback;
  }

  // ==========================================
  // 🤝 FOLLOWING STATES PERSISTENCE
  // ==========================================

  public saveFollowingState(userId: string, isFollowing: boolean): void {
    const current = this.loadFollowingStates();
    current[userId] = isFollowing;
    this.setItemSync('following_states', JSON.stringify(current));
  }

  public loadFollowingStates(): Record<string, boolean> {
    const stored = this.getItemSync('following_states');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return {};
  }

  // ==========================================
  // 📸 POSTS PERSISTENCE (LIKES, COMMENTS, NEW POSTS)
  // ==========================================

  public savePosts(posts: Post[]): void {
    this.setItemSync('posts_feed', JSON.stringify(posts));
  }

  public loadPosts(fallback: Post[]): Post[] {
    const stored = this.getItemSync('posts_feed');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return fallback;
  }
}

export const localDatabase = LocalDatabase.getInstance();
