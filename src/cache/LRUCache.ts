import { CacheEntry } from '../types';

export class LRUCache<T> {
  private capacity: number;
  private maxSizeBytes: number;
  private currentSizeBytes: number = 0;
  private cache: Map<string, CacheEntry<T>> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  constructor(capacity: number = 50, maxSizeBytes: number = 20 * 1024 * 1024) { // 20 MB max
    this.capacity = capacity;
    this.maxSizeBytes = maxSizeBytes;
  }

  public get(key: string): T | null {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    this.hits++;
    const entry = this.cache.get(key)!;
    // Refresh position for LRU eviction (re-insert at the end of iteration order)
    this.cache.delete(key);
    entry.lastAccessed = Date.now();
    this.cache.set(key, entry);
    return entry.data;
  }

  public put(key: string, data: T, sizeBytes: number = 1024): void {
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentSizeBytes -= existing.sizeBytes;
      this.cache.delete(key);
    }

    // Evict items until capacity and size limits are satisfied
    while (
      (this.cache.size >= this.capacity || this.currentSizeBytes + sizeBytes > this.maxSizeBytes) &&
      this.cache.size > 0
    ) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry<T> = {
      key,
      data,
      sizeBytes,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.currentSizeBytes += sizeBytes;
  }

  private evictLeastRecentlyUsed(): void {
    // The first key in Map insertion order is the least recently used
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        this.currentSizeBytes -= entry.sizeBytes;
      }
      this.cache.delete(oldestKey);
      this.evictions++;
      console.log(`[LRUCache RAM Eviction] Cleared oldest entry: ${oldestKey}`);
    }
  }

  public clear(): void {
    this.cache.clear();
    this.currentSizeBytes = 0;
  }

  public getStats() {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      currentSizeBytes: this.currentSizeBytes,
      maxSizeBytes: this.maxSizeBytes,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses) * 100).toFixed(1) + '%' : '0%',
      evictions: this.evictions,
    };
  }
}
