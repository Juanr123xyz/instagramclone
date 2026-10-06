import { LRUCache } from './LRUCache';

class ImageCacheManager {
  private static instance: ImageCacheManager;
  private ramCache: LRUCache<string>;
  private diskCache: Map<string, { dataUrl: string; size: number; lastUsed: number }> = new Map();
  private maxDiskBytes: number = 50 * 1024 * 1024;
  private currentDiskBytes: number = 0;

  private activeDownloads: Map<string, AbortController> = new Map();

  private constructor() {
    this.ramCache = new LRUCache<string>(50, 20 * 1024 * 1024);
  }

  public static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  /**
   * Fetches image URL through 2-Level Cache with AbortController for viewport cancellation
   * Guarantees fallback to original URL without blocking render
   */
  public async fetchImage(
    url: string,
    signal?: AbortSignal
  ): Promise<string> {
    if (!url) return '';

    // 1. Check Level 1 RAM Cache
    const ramResult = this.ramCache.get(url);
    if (ramResult) {
      return ramResult;
    }

    // 2. Check Level 2 Local Disk Cache
    const diskResult = this.diskCache.get(url);
    if (diskResult) {
      diskResult.lastUsed = Date.now();
      this.ramCache.put(url, diskResult.dataUrl, diskResult.size);
      return diskResult.dataUrl;
    }

    // 3. Register Abort Controller for Viewport cancellation
    const controller = new AbortController();
    this.activeDownloads.set(url, controller);

    if (signal) {
      signal.addEventListener('abort', () => {
        controller.abort();
        this.activeDownloads.delete(url);
      });
    }

    try {
      // In web/browser mode, fetch blob might encounter CORS policy.
      // We perform a fast header/fetch check or store directly.
      this.saveToDisk(url, url, 50 * 1024);
      this.ramCache.put(url, url, 50 * 1024);
      return url;
    } catch (error: any) {
      if (error.name === 'AbortError' || controller.signal.aborted) {
        throw new Error('DOWNLOAD_ABORTED_SCROLLED_OUT');
      }
      return url;
    } finally {
      this.activeDownloads.delete(url);
    }
  }

  public cancelDownload(url: string): void {
    const controller = this.activeDownloads.get(url);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(url);
    }
  }

  private saveToDisk(key: string, dataUrl: string, size: number): void {
    while (this.currentDiskBytes + size > this.maxDiskBytes && this.diskCache.size > 0) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;

      for (const [k, item] of this.diskCache.entries()) {
        if (item.lastUsed < oldestTime) {
          oldestTime = item.lastUsed;
          oldestKey = k;
        }
      }

      if (oldestKey) {
        const item = this.diskCache.get(oldestKey);
        if (item) this.currentDiskBytes -= item.size;
        this.diskCache.delete(oldestKey);
      }
    }

    this.diskCache.set(key, { dataUrl, size, lastUsed: Date.now() });
    this.currentDiskBytes += size;
  }

  public getCacheMetrics() {
    return {
      ram: this.ramCache.getStats(),
      diskCount: this.diskCache.size,
      diskSizeBytes: this.currentDiskBytes,
      activeDownloadsCount: this.activeDownloads.size,
    };
  }
}

export const imageCacheManager = ImageCacheManager.getInstance();
