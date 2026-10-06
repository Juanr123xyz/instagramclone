import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  SUGGESTIONS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
} from '../mock/mockData';
import { User, Post } from '../types';
import { PostCard } from './PostCard';
import { StoryAvatar } from './StoryAvatar';
import { DynamicImage } from './DynamicImage';
import {
  InstagramTextLogoSVG,
  HomeSVGIcon,
  SearchSVGIcon,
  ExploreSVGIcon,
  ReelsSVGIcon,
  MessagesSVGIcon,
  NotificationsSVGIcon,
  CreateSVGIcon,
  MoreSVGIcon,
  ReelPlayBadge,
} from './OfficialInstagramSVGs';
import { ReelsView } from './ReelsView';
import { ProfileScreen } from '../screens/ProfileScreen';
import { webSocketService } from '../realtime/WebSocketService';
import { localDatabase } from '../database/LocalDatabase';
import { CopyToast, showToast } from './CopyToast';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';
import { OLISE_IMAGE_DATA_URL } from '../mock/oliseImage';

interface WebDesktopLayoutProps {
  navigation: any;
}

const CATEGORIES = ['Para ti', 'Cuentas', 'Reels', 'Audio', 'Etiquetas', 'Lugares'];

export const WebDesktopLayout: React.FC<WebDesktopLayoutProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'messages' | 'search' | 'notifications' | 'profile'>('home');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(() => localDatabase.loadCurrentUser(CURRENT_USER));
  const [postsFeed, setPostsFeed] = useState<Post[]>(() => localDatabase.loadPosts(INITIAL_POSTS));
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [suggestionsList, setSuggestionsList] = useState(SUGGESTIONS);

  // Sync URL query params and path for deep linking (e.g. instagramclone://post/{uuid}, ?postId=xxx, ?userId=cristiano)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const targetUser = params.get('userId') || params.get('profile') || params.get('user');
      const targetPost = params.get('postId') || params.get('post');
      const pathname = window.location.pathname;

      if (targetUser) {
        setSelectedProfileId(targetUser);
        setActiveTab('profile');
      } else if (targetPost) {
        setSelectedPostId(targetPost);
      } else if (pathname.includes('/post/')) {
        const idFromPath = pathname.split('/post/')[1];
        if (idFromPath) {
          setSelectedPostId(idFromPath);
        }
      }
    }
  }, []);

  // Sync current user profile & posts on tab change or mount
  useEffect(() => {
    const loaded = localDatabase.loadCurrentUser(CURRENT_USER);
    setCurrentUser(loaded);
    const loadedPosts = localDatabase.loadPosts(INITIAL_POSTS);
    setPostsFeed(loadedPosts);
  }, [activeTab]);

  // Sync suggestions following states
  useEffect(() => {
    const savedFollowing = localDatabase.loadFollowingStates();
    setSuggestionsList((prev) =>
      prev.map((item) => {
        const isFol = savedFollowing[item.user.id];
        if (isFol !== undefined) {
          return {
            ...item,
            subtitle: isFol ? 'Siguiendo ✓' : 'Sugerencia para ti',
          };
        }
        return item;
      })
    );
  }, []);

  // Search view state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Para ti');

  // Messages view state
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState(INITIAL_CHATS[0]);
  const [chatMessageText, setChatMessageText] = useState('');

  // Modals state
  const PRESET_POST_IMAGES = [
    OLISE_IMAGE_DATA_URL,
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
  ];

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState(PRESET_POST_IMAGES[0]);
  const [moreModalVisible, setMoreModalVisible] = useState(false);

  const handleFileSelect = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setNewPostImageUrl(e.target.result as string);
          showToast('¡Imagen cargada desde tu equipo! 📸');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishNewPost = () => {
    if (!newPostCaption.trim()) {
      showToast('Por favor escribe un pie de foto');
      return;
    }

    const newPostId = `post_${Date.now()}`;
    const newPost = {
      id: newPostId,
      userId: currentUser.id,
      user: currentUser,
      imageUrl: newPostImageUrl || PRESET_POST_IMAGES[0],
      caption: newPostCaption.trim(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Ahora',
      comments: [],
    };

    const updatedPosts = [newPost, ...postsFeed];
    INITIAL_POSTS.unshift(newPost);
    localDatabase.savePosts(updatedPosts);
    setPostsFeed(updatedPosts);
    offlineSyncQueue.enqueueAction('LIKE_POST', { postId: newPostId, caption: newPost.caption, imageUrl: newPost.imageUrl });

    setCreateModalVisible(false);
    setNewPostCaption('');
    showToast('¡Publicación compartida con éxito! 📸✨');
    setActiveTab('home');
  };

  const handleToggleFollowSuggestion = (index: number) => {
    setSuggestionsList((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const isFollowing = item.subtitle.includes('Siguiendo');
          const nextState = !isFollowing;
          localDatabase.saveFollowingState(item.user.id, nextState);
          return {
            ...item,
            subtitle: nextState ? 'Siguiendo ✓' : 'Sugerencia para ti',
          };
        }
        return item;
      })
    );
  };

  const handleOpenComments = (postId: string) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Comments', { postId });
    } else {
      alert(`Ver comentarios de publicación ${postId}`);
    }
  };

  const handleOpenProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setActiveTab('profile');
  };

  const handleOpenStory = (story: any) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('StoriesViewer', { story });
    } else {
      alert(`Viendo historia de @${story.user.username}`);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessageText.trim()) return;
    const msg = webSocketService.sendChatMessage(selectedChat.id, chatMessageText.trim(), 'user_me');
    setSelectedChat((prev) => ({
      ...prev,
      lastMessage: msg,
    }));
    setChatMessageText('');
  };

  const renderCenterContent = () => {
    switch (activeTab) {
      case 'reels':
        return <ReelsView />;

      case 'search':
        return (
          <View style={styles.exploreWrapper}>
            <View style={styles.topSearchHeader}>
              <View style={styles.searchBarBox}>
                <SearchSVGIcon size={16} color="#8E8E8E" />
                <TextInput
                  style={styles.searchBarInput}
                  placeholder="Buscar"
                  placeholderTextColor="#8E8E8E"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <View style={styles.chipsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, activeCategory === cat && styles.activeCategoryChip]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipTextLabel,
                        activeCategory === cat && styles.activeChipTextLabel,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.gridContainer}>
              {INITIAL_POSTS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridCell}
                  onPress={() => {
                    if (navigation && navigation.navigate) {
                      navigation.navigate('PostDetail', { postId: item.id });
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <DynamicImage uri={item.imageUrl} style={styles.gridImage} isViewable={true} />
                  <View style={styles.gridReelBadge}>
                    <ReelPlayBadge size={14} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'messages':
        return (
          <View style={styles.messagesSplitView}>
            <View style={styles.chatsListCol}>
              <View style={styles.chatsListHeader}>
                <Text style={styles.chatsListHeaderTitle}>{currentUser.username} ▾</Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {chats.map((chat) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={[
                      styles.chatRowItem,
                      selectedChat.id === chat.id && styles.activeChatRowItem,
                    ]}
                    onPress={() => setSelectedChat(chat)}
                  >
                    <DynamicImage uri={chat.user.avatar} style={styles.chatAvatar} isViewable={true} />
                    <View style={styles.chatInfoTextCol}>
                      <Text style={styles.chatHandle}>{chat.user.username}</Text>
                      <Text style={styles.chatLastMsg} numberOfLines={1}>
                        {chat.lastMessage?.text || 'Nuevo mensaje'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.chatWindowCol}>
              <View style={styles.chatWindowHeader}>
                <DynamicImage uri={selectedChat.user.avatar} style={styles.chatHeaderAvatar} isViewable={true} />
                <Text style={styles.chatHeaderName}>{selectedChat.user.name}</Text>
              </View>

              <View style={styles.messagesDisplay}>
                {selectedChat.lastMessage && (
                  <View style={styles.msgBubble}>
                    <Text style={styles.msgBubbleText}>{selectedChat.lastMessage.text}</Text>
                  </View>
                )}
              </View>

              <View style={styles.chatInputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Escribe un mensaje..."
                  placeholderTextColor="#8E8E8E"
                  value={chatMessageText}
                  onChangeText={setChatMessageText}
                />
                <TouchableOpacity onPress={handleSendMessage}>
                  <Text style={styles.chatSendBtn}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'notifications':
        return (
          <View style={styles.notificationsViewWrapper}>
            <Text style={styles.notifHeaderTitle}>Notificaciones</Text>
            {INITIAL_NOTIFICATIONS.map((n) => (
              <View key={n.id} style={styles.notifRow}>
                <DynamicImage uri={n.user.avatar} style={styles.notifAvatar} isViewable={true} />
                <Text style={styles.notifText}>
                  <Text style={styles.notifUsername}>{n.user.username} </Text>
                  {n.text}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'profile':
        return (
          <ProfileScreen
            key={selectedProfileId || currentUser.id}
            route={{ params: { userId: selectedProfileId || currentUser.id } }}
            navigation={navigation}
          />
        );

      case 'home':
      default:
        return (
          <View style={styles.mainFeedColumn}>
            <View style={styles.storiesBarWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
                {stories.map((story) => (
                  <StoryAvatar
                    key={story.id}
                    story={story}
                    onPress={() => handleOpenStory(story)}
                  />
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.storiesScrollArrowBtn}>
                <Text style={styles.storiesArrowIcon}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.postsFeedContainer}>
              {postsFeed.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isViewable={true}
                  onOpenComments={handleOpenComments}
                  onOpenProfile={handleOpenProfile}
                />
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.desktopContainer}>
      <View style={styles.leftSidebarNav}>
        <View style={styles.topBrandHeader}>
          <TouchableOpacity onPress={() => setActiveTab('home')}>
            <InstagramTextLogoSVG size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.navGroup}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <HomeSVGIcon active={activeTab === 'home'} size={24} />
            <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'reels' && styles.activeNavItem]}
            onPress={() => setActiveTab('reels')}
            activeOpacity={0.7}
          >
            <ReelsSVGIcon active={activeTab === 'reels'} size={24} />
            <Text style={[styles.navText, activeTab === 'reels' && styles.activeNavText]}>Reels</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'messages' && styles.activeNavItem]}
            onPress={() => setActiveTab('messages')}
            activeOpacity={0.7}
          >
            <View style={styles.iconWithBadge}>
              <MessagesSVGIcon active={activeTab === 'messages'} size={24} />
              <View style={styles.sidebarBadge}>
                <Text style={styles.sidebarBadgeText}>3</Text>
              </View>
            </View>
            <Text style={[styles.navText, activeTab === 'messages' && styles.activeNavText]}>Mensajes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'search' && styles.activeNavItem]}
            onPress={() => setActiveTab('search')}
            activeOpacity={0.7}
          >
            <SearchSVGIcon active={activeTab === 'search'} size={24} />
            <Text style={[styles.navText, activeTab === 'search' && styles.activeNavText]}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'notifications' && styles.activeNavItem]}
            onPress={() => setActiveTab('notifications')}
            activeOpacity={0.7}
          >
            <NotificationsSVGIcon active={activeTab === 'notifications'} size={24} />
            <Text style={[styles.navText, activeTab === 'notifications' && styles.activeNavText]}>Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.7}
          >
            <CreateSVGIcon size={24} />
            <Text style={styles.navText}>Crear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
            onPress={() => {
              setSelectedProfileId(currentUser.id);
              setActiveTab('profile');
            }}
            activeOpacity={0.7}
          >
            <DynamicImage uri={currentUser.avatar} style={styles.profileNavAvatar} isViewable={true} />
            <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNavGroup}>
          <TouchableOpacity style={styles.navItem} onPress={() => setMoreModalVisible(true)} activeOpacity={0.7}>
            <MoreSVGIcon size={24} />
            <Text style={styles.navText}>Más</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.centerLayoutContent} showsVerticalScrollIndicator={false}>
        {renderCenterContent()}

        {activeTab === 'home' && (
          <View style={styles.rightSidebarColumn}>
            <View style={styles.userProfileRow}>
              <TouchableOpacity onPress={() => setActiveTab('profile')}>
                <DynamicImage uri={currentUser.avatar} style={styles.userProfileAvatar} isViewable={true} />
              </TouchableOpacity>
              <View style={styles.userProfileTextCol}>
                <Text style={styles.userProfileHandle}>{currentUser.username}</Text>
                <Text style={styles.userProfileName}>{currentUser.name}</Text>
              </View>
              <TouchableOpacity style={styles.switchBtn} onPress={() => setActiveTab('profile')}>
                <Text style={styles.switchBtnText}>Perfil</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>Sugerencias para ti</Text>
              <TouchableOpacity onPress={() => setActiveTab('search')}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsList}>
              {suggestionsList.map((item, idx) => (
                <View key={idx} style={styles.suggestionRow}>
                  <DynamicImage uri={item.user.avatar} style={styles.suggestionAvatar} isViewable={true} />
                  <View style={styles.suggestionTextCol}>
                    <Text style={styles.suggestionHandle}>{item.user.username}</Text>
                    <Text style={styles.suggestionSub} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.followBtn} onPress={() => handleToggleFollowSuggestion(idx)}>
                    <Text style={styles.followBtnText}>
                      {item.subtitle.includes('Siguiendo') ? 'Siguiendo ✓' : 'Seguir'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.createCardModal}>
            <Text style={styles.createModalTitle}>Crear nueva publicación</Text>

            {/* Image Preview & Preset Selector */}
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <DynamicImage
                uri={newPostImageUrl}
                style={{ width: '100%', height: 180, borderRadius: 12 }}
                isViewable={true}
              />
              <Text style={{ color: '#8E8E8E', fontSize: 12, marginTop: 8, alignSelf: 'flex-start' }}>
                Seleccionar imagen o ingresar URL:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8, width: '100%' }}>
                {PRESET_POST_IMAGES.map((img, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setNewPostImageUrl(img)}
                    style={{
                      marginRight: 8,
                      borderWidth: newPostImageUrl === img ? 2 : 0,
                      borderColor: '#0095F6',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <DynamicImage uri={img} style={{ width: 44, height: 44 }} isViewable={true} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput
                style={[styles.createInput, { height: 38, fontSize: 12, marginBottom: 8 }]}
                placeholder="URL personalizada de la imagen..."
                placeholderTextColor="#8E8E8E"
                value={newPostImageUrl}
                onChangeText={setNewPostImageUrl}
              />

              {Platform.OS === 'web' && (
                <View style={{ width: '100%', marginVertical: 4 }}>
                  {/* @ts-ignore */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0095F6',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    📁 Seleccionar cualquier archivo de imagen de tu equipo...
                    {/* @ts-ignore */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                </View>
              )}
            </View>

            <TextInput
              style={[styles.createInput, { height: 70 }]}
              placeholder="Escribe un pie de foto para tu publicación..."
              placeholderTextColor="#8E8E8E"
              multiline
              value={newPostCaption}
              onChangeText={setNewPostCaption}
            />

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity style={styles.cancelBtnModal} onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtnModal} onPress={handlePublishNewPost}>
                <Text style={styles.shareBtnText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deep Link Post Viewer Modal */}
      <Modal visible={!!selectedPostId} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSelectedPostId(null)}>
          <View style={{ width: 470, backgroundColor: '#000000', borderRadius: 12, borderWidth: 1, borderColor: '#262626', padding: 12, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#262626' }}>
              <Text style={{ color: '#0095F6', fontSize: 13, fontWeight: 'bold' }}>🔗 Deep Link: instagramclone://post/{selectedPostId}</Text>
              <TouchableOpacity onPress={() => setSelectedPostId(null)}>
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }}>
              {selectedPostId && (
                <PostCard
                  post={postsFeed.find((p) => p.id === selectedPostId || p.id === `post_${selectedPostId}`) || postsFeed[0]}
                  isViewable={true}
                  onOpenComments={handleOpenComments}
                  onOpenProfile={handleOpenProfile}
                />
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      <CopyToast />
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000000',
    minHeight: '100%',
  },
  leftSidebarNav: {
    width: 244,
    borderRightWidth: 0.5,
    borderRightColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  topBrandHeader: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  navGroup: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  activeNavItem: {
    backgroundColor: '#121212',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 16,
  },
  activeNavText: {
    fontWeight: 'bold',
  },
  iconWithBadge: {
    position: 'relative',
  },
  sidebarBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3040',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  sidebarBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileNavAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bottomNavGroup: {
    borderTopWidth: 0.5,
    borderTopColor: '#262626',
    paddingTop: 10,
  },
  centerLayoutContent: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainFeedColumn: {
    width: 470,
    paddingTop: 24,
  },
  storiesBarWrapper: {
    position: 'relative',
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    paddingBottom: 16,
    marginBottom: 16,
  },
  storiesScroll: {
    paddingLeft: 4,
  },
  storyAvatarItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 66,
  },
  storyUsernameLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  storiesScrollArrowBtn: {
    position: 'absolute',
    right: 0,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesArrowIcon: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postsFeedContainer: {
    width: '100%',
  },
  rightSidebarColumn: {
    width: 320,
    paddingLeft: 32,
    paddingTop: 36,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userProfileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userProfileTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  userProfileHandle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userProfileName: {
    color: '#8E8E8E',
    fontSize: 13,
  },
  switchBtn: {
    paddingHorizontal: 8,
  },
  switchBtnText: {
    color: '#0095F6',
    fontWeight: 'bold',
    fontSize: 12,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  suggestionsTitle: {
    color: '#8E8E8E',
    fontWeight: 'bold',
    fontSize: 14,
  },
  seeAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  suggestionTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  suggestionHandle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  suggestionSub: {
    color: '#8E8E8E',
    fontSize: 11,
  },
  followBtn: {
    paddingHorizontal: 8,
  },
  followBtnText: {
    color: '#0095F6',
    fontWeight: 'bold',
    fontSize: 12,
  },
  exploreWrapper: {
    width: 935,
    paddingTop: 24,
  },
  topSearchHeader: {
    marginBottom: 16,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    width: 300,
  },
  searchBarInput: {
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  chipsRow: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#FFFFFF',
  },
  chipTextLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipTextLabel: {
    color: '#000000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridCell: {
    width: 307,
    height: 307,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridReelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  messagesSplitView: {
    width: 935,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#262626',
    borderRadius: 12,
    marginTop: 24,
    height: 600,
    overflow: 'hidden',
  },
  chatsListCol: {
    width: 350,
    borderRightWidth: 0.5,
    borderRightColor: '#262626',
  },
  chatsListHeader: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  chatsListHeaderTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activeChatRowItem: {
    backgroundColor: '#121212',
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatInfoTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  chatHandle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chatLastMsg: {
    color: '#8E8E8E',
    fontSize: 12,
    marginTop: 2,
  },
  chatWindowCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  chatHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatHeaderName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 12,
  },
  messagesDisplay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  msgBubble: {
    backgroundColor: '#3797F0',
    alignSelf: 'flex-end',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '70%',
  },
  msgBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#262626',
  },
  chatInput: {
    flex: 1,
    color: '#FFFFFF',
    backgroundColor: '#121212',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  chatSendBtn: {
    color: '#0095F6',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  notificationsViewWrapper: {
    width: 600,
    paddingTop: 24,
  },
  notifHeaderTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#121212',
  },
  notifAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notifText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 13,
  },
  notifUsername: {
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCardModal: {
    backgroundColor: '#121212',
    borderRadius: 12,
    width: 400,
    padding: 20,
  },
  createModalTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  createInput: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  modalBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelBtnModal: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelBtnText: {
    color: '#8E8E8E',
  },
  shareBtnModal: {
    backgroundColor: '#0095F6',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
