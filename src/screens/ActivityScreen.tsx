import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { INITIAL_FOLLOW_REQUESTS, INITIAL_NOTIFICATIONS } from '../mock/mockData';
import { FollowRequest, NotificationItem } from '../types';
import { DynamicImage } from '../components/DynamicImage';
import { VerifiedBadge } from '../components/InstagramIcons';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';

export const ActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [requests, setRequests] = useState<FollowRequest[]>(INITIAL_FOLLOW_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleApprove = (req: FollowRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r)));
    req.requester.isFollowing = true;
    offlineSyncQueue.enqueueAction('APPROVE_FOLLOW', { requestId: req.id, requesterId: req.requester.id });
  };

  const handleReject = (req: FollowRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected' } : r)));
    offlineSyncQueue.enqueueAction('REJECT_FOLLOW', { requestId: req.id, requesterId: req.requester.id });
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Follow Requests Section for Private Accounts */}
            {requests.length > 0 && (
              <View style={styles.requestsContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Solicitudes de seguimiento (Cuentas Privadas)</Text>
                  {pendingRequestsCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
                    </View>
                  )}
                </View>

                {requests.map((item) => (
                  <View key={item.id} style={styles.requestRow}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Profile', { userId: item.requester.id })}
                    >
                      <DynamicImage uri={item.requester.avatar} style={styles.avatar} isViewable={true} />
                    </TouchableOpacity>
                    <View style={styles.infoCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.username}>{item.requester.username}</Text>
                        {item.requester.isVerified && <VerifiedBadge size={12} />}
                      </View>
                      <Text style={styles.subtext}>Solicitó seguir tu cuenta privada • {item.createdAt}</Text>
                    </View>

                    {item.status === 'pending' ? (
                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => handleApprove(item)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.approveText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => handleReject(item)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.rejectText}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={item.status === 'approved' ? styles.statusApproved : styles.statusRejected}>
                        {item.status === 'approved' ? '✓ Aprobado' : '✕ Rechazado'}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.timeHeader}>Esta semana</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.notificationRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.user.id })}>
              <DynamicImage uri={item.user.avatar} style={styles.avatar} isViewable={true} />
            </TouchableOpacity>
            <View style={styles.notifTextCol}>
              <Text style={styles.notifText}>
                <Text style={styles.username}>{item.user.username} </Text>
                {item.text} <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </Text>
            </View>
            {item.postImageUrl ? (
              <DynamicImage uri={item.postImageUrl} style={styles.postThumb} isViewable={true} />
            ) : (
              <TouchableOpacity style={styles.followBackBtn} activeOpacity={0.8}>
                <Text style={styles.followBackText}>Seguir</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#121212',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  requestsContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#121212',
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262626',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  subtext: {
    color: '#8E8E8E',
    fontSize: 11,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  approveText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rejectBtn: {
    backgroundColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusApproved: {
    color: '#4CD964',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusRejected: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 12,
  },
  timeHeader: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notifTextCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  notifText: {
    color: '#F5F5F5',
    fontSize: 13,
    lineHeight: 18,
  },
  timeAgo: {
    color: '#737373',
    fontSize: 12,
  },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#262626',
  },
  followBackBtn: {
    backgroundColor: '#0095F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  followBackText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
