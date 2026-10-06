type NetworkListener = (isOnline: boolean) => void;

class NetworkMonitor {
  private static instance: NetworkMonitor;
  private isConnected: boolean = true; // Default online
  private listeners: Set<NetworkListener> = new Set();

  private constructor() {}

  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  public isOnline(): boolean {
    return this.isConnected;
  }

  public setOnlineStatus(online: boolean): void {
    if (this.isConnected !== online) {
      this.isConnected = online;
      console.log(`[NetworkMonitor] Connectivity state changed: ${online ? 'ONLINE 🌐' : 'OFFLINE 📡❌'}`);
      this.notifyListeners();
    }
  }

  public toggleConnectivity(): boolean {
    this.setOnlineStatus(!this.isConnected);
    return this.isConnected;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isConnected));
  }
}

export const networkMonitor = NetworkMonitor.getInstance();
