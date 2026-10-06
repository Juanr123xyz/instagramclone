import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { Post } from '../types';
import { DynamicImage } from './DynamicImage';
import { VerifiedBadge } from './InstagramIcons';
import {
  NotificationsSVGIcon,
  CommentSVGIcon,
  ShareSVGIcon,
  BookmarkSVGIcon,
  MoreSVGIcon,
} from './OfficialInstagramSVGs';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';
import { copyToClipboard } from '../utils/clipboardHelper';
import { showToast } from './CopyToast';

interface PostCardProps {
  post: Post;
  isViewable: boolean;
  onOpenComments: (postId: string) => void;
  onOpenProfile: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isViewable,
  onOpenComments,
  onOpenProfile,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);
  const [isSaved, setIsSaved] = useState<boolean>(!!post.isSaved);
  const [isExpandedCaption, setIsExpandedCaption] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);

  // Animated heart scale for double-tap image splash
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  // Animated scale for heart icon button bounce
  const btnHeartScale = useRef(new Animated.Value(1)).current;

  const lastTapRef = useRef<number>(0);

  const animateHeartButton = () => {
    btnHeartScale.setValue(0.7);
    Animated.spring(btnHeartScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const triggerDoubleTapHeart = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      offlineSyncQueue.enqueueAction('LIKE_POST', { postId: post.id, timestamp: Date.now() });
    }

    animateHeartButton();

    // Heart splash over image
    heartScale.setValue(0.4);
    heartOpacity.setValue(1);

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleImagePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      triggerDoubleTapHeart();
    }
    lastTapRef.current = now;
  };

  const handleLikeToggle = () => {
    const nextLikedState = !isLiked;
    const nextCount = nextLikedState ? likesCount + 1 : likesCount - 1;

    setIsLiked(nextLikedState);
    setLikesCount(nextCount);
    animateHeartButton();

    offlineSyncQueue.enqueueAction(nextLikedState ? 'LIKE_POST' : 'UNLIKE_POST', {
      postId: post.id,
      timestamp: Date.now(),
    });
  };

  const handleSaveToggle = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    offlineSyncQueue.enqueueAction(nextSaved ? 'SAVE_POST' : 'UNSAVE_POST', {
      postId: post.id,
      timestamp: Date.now(),
    });
  };

  const handleOpenShare = () => {
    setShareModalVisible(true);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Post Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.authorInfo}
          onPress={() => onOpenProfile(post.user.id)}
          activeOpacity={0.8}
        >
          <DynamicImage uri={post.user.avatar} style={styles.avatarImage} isViewable={isViewable} />
          <View style={styles.usernameContainer}>
            <View style={styles.usernameBadgeRow}>
              <Text style={styles.usernameText}>{post.user.username}</Text>
              {post.user.isVerified && <VerifiedBadge size={13} />}
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.timeAgoText}>{post.createdAt}</Text>
            </View>
            {post.location && <Text style={styles.locationText}>{post.location}</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenShare} style={styles.dotsButton} activeOpacity={0.6}>
          <MoreSVGIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Media Image with Double-Tap Heart Animation */}
      <TouchableWithoutFeedback onPress={handleImagePress}>
        <View style={styles.imageContainer}>
          <DynamicImage uri={post.imageUrl} style={styles.postImage} isViewable={isViewable} />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heartOverlay,
              {
                opacity: heartOpacity,
                transform: [{ scale: heartScale }],
              },
            ]}
          >
            <Text style={styles.bigHeartEmoji}>❤️</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* Action Bar */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLikeToggle} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: btnHeartScale }] }}>
              <NotificationsSVGIcon active={isLiked} size={24} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onOpenComments(post.id)}
            activeOpacity={0.7}
          >
            <CommentSVGIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={handleOpenShare} activeOpacity={0.7}>
            <ShareSVGIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSaveToggle} activeOpacity={0.7}>
          <BookmarkSVGIcon active={isSaved} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Likes Number */}
      <View style={styles.likesContainer}>
        <Text style={styles.likesText}>
          <Text style={styles.boldText}>{likesCount.toLocaleString()} Me gusta</Text>
        </Text>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText} numberOfLines={isExpandedCaption ? undefined : 2}>
          <Text style={styles.boldUsername} onPress={() => onOpenProfile(post.user.id)}>
            {post.user.username}{' '}
          </Text>
          {post.caption}
        </Text>
        {post.caption.length > 70 && !isExpandedCaption && (
          <TouchableOpacity onPress={() => setIsExpandedCaption(true)}>
            <Text style={styles.moreText}>más</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Preview */}
      {post.comments.length > 0 && (
        <TouchableOpacity style={styles.commentsPreview} onPress={() => onOpenComments(post.id)}>
          <Text style={styles.viewCommentsText}>
            Ver los {post.commentsCount || post.comments.length} comentarios
          </Text>
        </TouchableOpacity>
      )}

      {/* Share / Direct Modal */}
      <Modal visible={shareModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShareModalVisible(false)}
        >
          <View style={styles.shareSheet}>
            <Text style={styles.shareTitle}>Compartir publicación</Text>
            <View style={styles.shareOptionsRow}>
              <TouchableOpacity
                style={styles.shareOptionItem}
                onPress={() => {
                  setShareModalVisible(false);
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
                  copyToClipboard(`${baseUrl}/?postId=${post.id}`, 'Enlace de la publicación');
                }}
              >
                <View style={styles.shareIconCircle}>
                  <Text style={styles.shareOptionIcon}>🔗</Text>
                </View>
                <Text style={styles.shareOptionLabel}>Copiar enlace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOptionItem}
                onPress={() => {
                  setShareModalVisible(false);
                  showToast('Publicación enviada por Mensaje Directo');
                }}
              >
                <View style={styles.shareIconCircle}>
                  <ShareSVGIcon size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.shareOptionLabel}>Enviar en DM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    paddingBottom: 12,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  usernameContainer: {
    justifyContent: 'center',
  },
  usernameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  dotSeparator: {
    color: '#8E8E8E',
    marginHorizontal: 4,
    fontSize: 12,
  },
  timeAgoText: {
    color: '#8E8E8E',
    fontSize: 12,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 1,
  },
  dotsButton: {
    padding: 6,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  heartOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bigHeartEmoji: {
    fontSize: 80,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: 16,
  },
  likesContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  likesText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  boldText: {
    fontWeight: 'bold',
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  boldUsername: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moreText: {
    color: '#8E8E8E',
    fontSize: 12,
    marginTop: 2,
  },
  commentsPreview: {
    paddingHorizontal: 12,
    marginTop: 2,
  },
  viewCommentsText: {
    color: '#8E8E8E',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  shareSheet: {
    backgroundColor: '#262626',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  shareTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
  },
  shareOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareOptionItem: {
    alignItems: 'center',
  },
  shareIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#363636',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareOptionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  shareOptionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
