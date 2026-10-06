import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { CURRENT_USER, MOCK_USERS, getUserByIdOrUsername, INITIAL_POSTS, MOCK_HIGHLIGHTS } from '../mock/mockData';
import { User, Post } from '../types';
import { DynamicImage } from '../components/DynamicImage';
import { VerifiedBadge, StoryGradientRing } from '../components/InstagramIcons';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';
import { localDatabase } from '../database/LocalDatabase';
import { copyToClipboard } from '../utils/clipboardHelper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_SIZE = SCREEN_WIDTH / 3 - 2;

export const ProfileScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const userId = route.params?.userId || CURRENT_USER.id;
  const isSelf = userId === CURRENT_USER.id || userId === CURRENT_USER.username;

  // Initialize with persistent user profile or look up exact account from 40+ accounts
  const initialUser: User = isSelf
    ? localDatabase.loadCurrentUser(CURRENT_USER)
    : getUserByIdOrUsername(userId);

  const [user, setUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'saved' | 'tagged'>('grid');

  // Interactive Modals State
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [highlightModalVisible, setHighlightModalVisible] = useState<boolean>(false);
  const [selectedHighlight, setSelectedHighlight] = useState<any>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState<string>(user.name);
  const [editUsername, setEditUsername] = useState<string>(user.username);
  const [editBio, setEditBio] = useState<string>(user.bio);
  const [editWebsite, setEditWebsite] = useState<string>(user.website || '');
  const [editAvatar, setEditAvatar] = useState<string>(user.avatar);

  // Load saved following state and real user info on mount or userId change
  useEffect(() => {
    if (!isSelf) {
      const target = getUserByIdOrUsername(userId);
      const savedFollowingMap = localDatabase.loadFollowingStates();
      const isFol = savedFollowingMap[target.id] !== undefined ? savedFollowingMap[target.id] : target.isFollowing;
      
      setUser({
        ...target,
        isFollowing: isFol,
      });
    } else {
      const persistedSelf = localDatabase.loadCurrentUser(CURRENT_USER);
      setUser(persistedSelf);
      setEditName(persistedSelf.name);
      setEditUsername(persistedSelf.username);
      setEditBio(persistedSelf.bio);
      setEditWebsite(persistedSelf.website || '');
      setEditAvatar(persistedSelf.avatar);
    }
  }, [userId, isSelf]);

  const allPosts = localDatabase.loadPosts(INITIAL_POSTS);
  const userPosts = allPosts.filter((p) => p.userId === user.id || p.user.username === user.username);
  const savedPosts = allPosts.filter((p) => p.isSaved);
  const reelPosts = userPosts.filter((p) => p.isReel);

  const canViewContent = isSelf || !user.isPrivate || user.isFollowing;

  const handleSaveProfile = () => {
    const updatedUser: User = {
      ...user,
      name: editName,
      username: editUsername,
      bio: editBio,
      website: editWebsite,
      avatar: editAvatar,
    };

    setUser(updatedUser);

    if (isSelf) {
      localDatabase.saveCurrentUser(updatedUser);
    }

    setEditModalVisible(false);
  };

  const handleFollowToggle = () => {
    const nextFollowingState = !user.isFollowing;

    if (user.isFollowing) {
      setUser((prev) => ({
        ...prev,
        isFollowing: false,
        followersCount: prev.followersCount - 1,
      }));
      localDatabase.saveFollowingState(user.id, false);
      localDatabase.saveFollowingState(user.username, false);
      offlineSyncQueue.enqueueAction('UNLIKE_POST', { targetUserId: user.id });
    } else if (user.isPrivate) {
      setUser((prev) => ({ ...prev, hasPendingRequest: true }));
      offlineSyncQueue.enqueueAction('REQUEST_FOLLOW', { targetUserId: user.id });
    } else {
      setUser((prev) => ({
        ...prev,
        isFollowing: true,
        followersCount: prev.followersCount + 1,
      }));
      localDatabase.saveFollowingState(user.id, true);
      localDatabase.saveFollowingState(user.username, true);
      offlineSyncQueue.enqueueAction('REQUEST_FOLLOW', { targetUserId: user.id });
    }
  };

  const handleOpenDirectMessage = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('ChatDetail', {
        chat: {
          id: `chat_${user.id}`,
          user,
          unreadCount: 0,
          isTyping: false,
        },
      });
    } else {
      alert(`Abriendo chat privado con @${user.username}`);
    }
  };

  const handleOpenHighlight = (hl: any) => {
    setSelectedHighlight(hl);
    setHighlightModalVisible(true);
  };

  const renderGridPosts = () => {
    let dataToDisplay = userPosts;
    if (activeTab === 'saved') dataToDisplay = savedPosts;
    if (activeTab === 'reels') dataToDisplay = reelPosts.length > 0 ? reelPosts : userPosts;

    if (dataToDisplay.length === 0) {
      return (
        <View style={styles.emptyGridContainer}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>Aún no hay publicaciones</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={canViewContent ? dataToDisplay : []}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => {
              if (navigation && navigation.navigate) {
                navigation.navigate('PostDetail', { postId: item.id });
              } else {
                alert(`Publicación de @${item.user.username}: ${item.caption}`);
              }
            }}
            activeOpacity={0.8}
          >
            <DynamicImage
              uri={item.imageUrl}
              style={{ width: COLUMN_SIZE, height: COLUMN_SIZE }}
              isViewable={true}
            />
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.usernameTitle}>
            {user.username} {user.isPrivate && '🔒'}
          </Text>
          {user.isVerified && <VerifiedBadge size={14} />}
        </View>
        <View style={styles.headerRightBtns}>
          {isSelf && (
            <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.headerIconBtn}>
              <Text style={styles.headerIcon}>➕</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={styles.headerIconBtn}
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info Header */}
        <View style={styles.profileInfo}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => isSelf && setEditModalVisible(true)}>
              <StoryGradientRing hasUnseen={true} size={84}>
                <DynamicImage uri={user.avatar} style={styles.avatar} isViewable={true} />
              </StoryGradientRing>
            </TouchableOpacity>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{userPosts.length || user.postsCount}</Text>
                <Text style={styles.statLabel}>Publicaciones</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{user.followersCount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{user.followingCount}</Text>
                <Text style={styles.statLabel}>Seguidos</Text>
              </View>
            </View>
          </View>

          {/* Name & Bio */}
          <View style={styles.bioContainer}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.fullName}>{user.name}</Text>
              {user.isVerified && <VerifiedBadge size={13} />}
            </View>
            <Text style={styles.bioText}>{user.bio}</Text>
            {user.website && <Text style={styles.websiteText}>{user.website}</Text>}
          </View>

          {/* Action Buttons (Editar Perfil / Compartir / Seguir / Mensaje) */}
          <View style={styles.actionButtonsRow}>
            {isSelf ? (
              <>
                <TouchableOpacity
                  style={[styles.btn, styles.secondaryBtn, { flex: 1 }]}
                  onPress={() => setEditModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnText}>Editar perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.secondaryBtn, { flex: 1, marginLeft: 8 }]}
                  onPress={() => setShareModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnText}>Compartir perfil</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    user.isFollowing ? styles.secondaryBtn : styles.primaryBtn,
                    { flex: 1 },
                  ]}
                  onPress={handleFollowToggle}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.btnText, !user.isFollowing && styles.primaryBtnText]}>
                    {user.hasPendingRequest
                      ? 'Solicitado ⏳'
                      : user.isFollowing
                      ? 'Siguiendo ✓'
                      : 'Seguir'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.secondaryBtn, { flex: 1, marginLeft: 8 }]}
                  onPress={handleOpenDirectMessage}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnText}>Mensaje</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Highlights Row */}
          {canViewContent && (
            <View style={styles.highlightsWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {MOCK_HIGHLIGHTS.map((hl) => (
                  <TouchableOpacity key={hl.id} style={styles.highlightItem} onPress={() => handleOpenHighlight(hl)}>
                    <View style={styles.highlightRing}>
                      <DynamicImage uri={hl.coverUrl} style={styles.highlightAvatar} isViewable={true} />
                    </View>
                    <Text style={styles.highlightTitle}>{hl.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Private Account Lock Warning */}
        {!canViewContent ? (
          <View style={styles.privateLockBox}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.privateTitle}>Esta cuenta es privada</Text>
            <Text style={styles.privateSub}>
              Síguela para ver sus fotos, reels y lista de seguidores.
            </Text>
          </View>
        ) : (
          <>
            {/* Tabs Bar */}
            <View style={styles.tabsBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'grid' && styles.activeTabItem]}
                onPress={() => setActiveTab('grid')}
              >
                <Text style={[styles.tabIcon, activeTab === 'grid' && styles.activeTabIcon]}>🖼️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'reels' && styles.activeTabItem]}
                onPress={() => setActiveTab('reels')}
              >
                <Text style={[styles.tabIcon, activeTab === 'reels' && styles.activeTabIcon]}>🎬</Text>
              </TouchableOpacity>
              {isSelf && (
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'saved' && styles.activeTabItem]}
                  onPress={() => setActiveTab('saved')}
                >
                  <Text style={[styles.tabIcon, activeTab === 'saved' && styles.activeTabIcon]}>🔖</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'tagged' && styles.activeTabItem]}
                onPress={() => setActiveTab('tagged')}
              >
                <Text style={[styles.tabIcon, activeTab === 'tagged' && styles.activeTabIcon]}>👤</Text>
              </TouchableOpacity>
            </View>

            {/* Grid Posts Content */}
            {renderGridPosts()}
          </>
        )}
      </ScrollView>

      {/* ================= EDIT PROFILE MODAL ================= */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editCardModal}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Editar perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} />

              <Text style={styles.inputLabel}>Nombre de usuario</Text>
              <TextInput style={styles.modalInput} value={editUsername} onChangeText={setEditUsername} />

              <Text style={styles.inputLabel}>Presentación (Bio)</Text>
              <TextInput
                style={[styles.modalInput, { height: 70 }]}
                multiline
                value={editBio}
                onChangeText={setEditBio}
              />

              <Text style={styles.inputLabel}>Sitio web</Text>
              <TextInput style={styles.modalInput} value={editWebsite} onChangeText={setEditWebsite} />

              <Text style={styles.inputLabel}>URL de imagen de avatar</Text>
              <TextInput style={styles.modalInput} value={editAvatar} onChangeText={setEditAvatar} />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtnModal} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>Guardar cambios (Persistente)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= SHARE PROFILE MODAL ================= */}
      <Modal visible={shareModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShareModalVisible(false)}>
          <View style={styles.shareCardModal}>
            <Text style={styles.shareTitleModal}>Compartir Perfil</Text>
            <DynamicImage uri={user.avatar} style={styles.shareAvatarModal} isViewable={true} />
            <Text style={styles.shareUsernameModal}>@{user.username}</Text>

            <TouchableOpacity
              style={styles.copyLinkBtn}
              onPress={() => {
                setShareModalVisible(false);
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
                copyToClipboard(`${baseUrl}/?userId=${user.username}`, 'Enlace del perfil');
              }}
            >
              <Text style={styles.copyLinkText}>📋 Copiar enlace del perfil</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= HIGHLIGHT VIEWER MODAL ================= */}
      <Modal visible={highlightModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setHighlightModalVisible(false)}>
          <View style={styles.highlightCardModal}>
            <Text style={styles.hlTitleModal}>{selectedHighlight?.title || 'Historia destacada'}</Text>
            {selectedHighlight && (
              <DynamicImage uri={selectedHighlight.coverUrl} style={styles.hlImageModal} isViewable={true} />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    marginLeft: 18,
  },
  headerIcon: {
    color: '#FFF',
    fontSize: 20,
  },
  profileInfo: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statLabel: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 2,
  },
  bioContainer: {
    marginTop: 10,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bioText: {
    color: '#F5F5F5',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  websiteText: {
    color: '#E0F1FF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  btn: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#0095F6',
  },
  secondaryBtn: {
    backgroundColor: '#262626',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  primaryBtnText: {
    color: '#FFFFFF',
  },
  highlightsWrapper: {
    marginTop: 16,
    paddingBottom: 4,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 14,
  },
  highlightRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: '#363636',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
  },
  tabsBar: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#262626',
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    marginTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabItem: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFFFFF',
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  activeTabIcon: {
    opacity: 1.0,
  },
  gridItem: {
    margin: 1,
  },
  emptyGridContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    color: '#8E8E8E',
    marginTop: 8,
    fontSize: 14,
  },
  privateLockBox: {
    alignItems: 'center',
    paddingVertical: 45,
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#262626',
  },
  lockIcon: {
    fontSize: 40,
  },
  privateTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  privateSub: {
    color: '#8E8E8E',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editCardModal: {
    backgroundColor: '#121212',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxWidth: 450,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeText: {
    color: '#8E8E8E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#8E8E8E',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#000000',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  saveBtnModal: {
    backgroundColor: '#0095F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shareCardModal: {
    backgroundColor: '#121212',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    padding: 24,
    alignItems: 'center',
  },
  shareTitleModal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  shareAvatarModal: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  shareUsernameModal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 20,
  },
  copyLinkBtn: {
    backgroundColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  copyLinkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  highlightCardModal: {
    backgroundColor: '#121212',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxWidth: 360,
    padding: 20,
    alignItems: 'center',
  },
  hlTitleModal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 14,
  },
  hlImageModal: {
    width: 280,
    height: 380,
    borderRadius: 12,
  },
});
