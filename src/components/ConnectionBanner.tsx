import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { networkMonitor } from '../offline/NetworkMonitor';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';

export const ConnectionBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(networkMonitor.isOnline());
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const unsubNet = networkMonitor.subscribe((online) => setIsOnline(online));
    const unsubQueue = offlineSyncQueue.subscribe((count, syncing) => {
      setPendingCount(count);
      setIsSyncing(syncing);
    });

    offlineSyncQueue.getPendingCount().then(setPendingCount);

    return () => {
      unsubNet();
      unsubQueue();
    };
  }, []);

  const toggleNetwork = () => {
    networkMonitor.toggleConnectivity();
  };

  return (
    <View style={[styles.container, isOnline ? styles.onlineBg : styles.offlineBg]}>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>
          {isOnline ? '🌐 En Línea (Online)' : '📡 Modo Offline (Sin Red)'}
        </Text>
        {pendingCount > 0 && (
          <Text style={styles.queueText}>
            {isSyncing
              ? `🔄 Sincronizando ${pendingCount} acciones...`
              : `📦 ${pendingCount} acciones pendientes en SQLite`}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.toggleBtn} onPress={toggleNetwork} activeOpacity={0.8}>
        <Text style={styles.toggleText}>{isOnline ? 'Simular Offline' : 'Restablecer Red'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  onlineBg: {
    backgroundColor: '#1b382b',
  },
  offlineBg: {
    backgroundColor: '#4a151b',
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  queueText: {
    color: '#FFCC00',
    fontSize: 11,
    marginTop: 2,
  },
  toggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  toggleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
