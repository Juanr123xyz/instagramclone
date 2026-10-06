export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  isFollowing: boolean;
  hasPendingRequest: boolean;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  website?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  isOptimistic?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  location?: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  likedBySummary?: string;
  createdAt: string;
  comments: Comment[];
  isReel?: boolean;
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  durationSeconds: number;
  createdAt: string;
  isViewed: boolean;
  caption?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  items: StoryItem[];
  hasUnseen: boolean;
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  isOptimistic?: boolean;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isTyping: boolean;
  onlineStatus?: string;
}

export interface FollowRequest {
  id: string;
  requester: User;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'follow_request';
  user: User;
  postImageUrl?: string;
  timeAgo: string;
  text: string;
  isRead: boolean;
}

export type ActionType = 
  | 'LIKE_POST' 
  | 'UNLIKE_POST' 
  | 'SAVE_POST' 
  | 'UNSAVE_POST' 
  | 'ADD_COMMENT' 
  | 'LIKE_COMMENT' 
  | 'SEND_MESSAGE' 
  | 'REQUEST_FOLLOW' 
  | 'APPROVE_FOLLOW' 
  | 'REJECT_FOLLOW';

export interface OfflineSyncAction {
  id: string;
  type: ActionType;
  payload: Record<string, any>;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export interface CacheEntry<T> {
  key: string;
  data: T;
  sizeBytes: number;
  lastAccessed: number;
}
