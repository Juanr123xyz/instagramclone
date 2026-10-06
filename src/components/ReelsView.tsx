import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MOCK_USERS, FOOTBALL_USERS, ANIMAL_USERS } from '../mock/mockData';
import { DynamicImage } from './DynamicImage';
import { VerifiedBadge } from './InstagramIcons';
import { copyToClipboard } from '../utils/clipboardHelper';

const { width, height } = Dimensions.get('window');

export interface ReelItem {
  id: string;
  user: any;
  videoUrl: string;
  videoThumb: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved?: boolean;
}

const REELS_DATA: ReelItem[] = [
  {
    id: 'reel_messi',
    user: FOOTBALL_USERS.leomessi,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80',
    caption: 'Noche mágica con la Selección 🇦🇷 Golazo y 3 puntos para seguir firmes. ¡VAMOS! 🩵🤍',
    audioTrack: 'Leo Messi • Muchachos (Sonido Oficial) 🏆',
    likesCount: 5840000,
    commentsCount: 64200,
    isLiked: true,
  },
  {
    id: 'reel_panda',
    user: ANIMAL_USERS.panda_daily,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=800&q=80',
    caption: 'Current mood: Eating fresh bamboo sticks without a care in the world! 🐼🎋 #PandaLove #CuteAnimals',
    audioTrack: 'Daily Pandas • Bamboo Relaxing Beat 🎵',
    likesCount: 1280000,
    commentsCount: 14500,
    isLiked: true,
  },
  {
    id: 'reel_dogs',
    user: ANIMAL_USERS.dogs_of_instagram,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
    caption: 'Meet Milo & Oliver! 🐶💛 Two Golden Retriever brothers running in the sunshine! #GoldenRetriever #PuppyLove',
    audioTrack: 'Dogs of Instagram • Happy Dog Song 🐶🎵',
    likesCount: 940000,
    commentsCount: 8900,
    isLiked: true,
  },
  {
    id: 'reel_cr7',
    user: FOOTBALL_USERS.cristiano,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    caption: 'Hard work pays off! SIUUU! ⚽🔥 #AlNassr #CR7',
    audioTrack: 'Cristiano Ronaldo • SIUUU Anthem 🇵🇹',
    likesCount: 4520000,
    commentsCount: 51200,
    isLiked: true,
  },
  {
    id: 'reel_natgeo',
    user: ANIMAL_USERS.natgeowild,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&q=80',
    caption: 'The King of the Savanna 🦁 Golden hour in Serengeti. #NatGeoWild #Lions #Serengeti',
    audioTrack: 'NatGeo Wild • Wildlife Soundscapes 🐆',
    likesCount: 1420000,
    commentsCount: 12300,
    isLiked: true,
  },
  {
    id: 'reel_realmadrid',
    user: FOOTBALL_USERS.realmadrid,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4',
    videoThumb: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    caption: '¡CAMPEONES DEL MUNDO! 🏆 Celebración en el Bernabéu #HalaMadrid',
    audioTrack: 'Real Madrid • Himno Oficial 15va 🤍',
    likesCount: 3840000,
    commentsCount: 42100,
    isLiked: true,
  },
];

export const ReelsView: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>(REELS_DATA);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const handleLikeToggle = (id: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.reelCard}>
            {/* Native / Web Video Player */}
            {Platform.OS === 'web' ? (
              // @ts-ignore
              <video
                src={item.videoUrl}
                poster={item.videoThumb}
                autoPlay={isPlaying}
                loop
                muted={isMuted}
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <DynamicImage uri={item.videoThumb} style={styles.videoPlayer} isViewable={true} />
            )}

            {/* Play/Pause & Sound Control Overlay */}
            <TouchableOpacity
              style={styles.playTouchArea}
              onPress={() => setIsPlaying(!isPlaying)}
              activeOpacity={1}
            >
              {!isPlaying && (
                <View style={styles.pauseCircle}>
                  <Text style={styles.pauseIcon}>▶</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Top Sound Control Button */}
            <TouchableOpacity
              style={styles.audioToggleBtn}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.8}
            >
              <Text style={styles.audioToggleText}>{isMuted ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>

            {/* Right Action Sidebar (Like, Comment, Share, Music Disk) */}
            <View style={styles.rightActionsSidebar}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleLikeToggle(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
                <Text style={styles.actionLabel}>{(item.likesCount / 1000).toFixed(1)}k</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.8}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionLabel}>{(item.commentsCount / 1000).toFixed(1)}k</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                activeOpacity={0.8}
                onPress={() => {
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
                  copyToClipboard(`${baseUrl}/?reelId=${item.id}`, 'Enlace del Reel');
                }}
              >
                <Text style={styles.actionIcon}>✈️</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} activeOpacity={0.8}>
                <Text style={styles.actionIcon}>🔖</Text>
              </TouchableOpacity>

              <View style={styles.musicVinylDisk}>
                <DynamicImage uri={item.user.avatar} style={styles.vinylAvatar} isViewable={true} />
              </View>
            </View>

            {/* Bottom Info Overlay (Author, Caption, Music Track) */}
            <View style={styles.bottomInfoOverlay}>
              <View style={styles.authorRow}>
                <DynamicImage uri={item.user.avatar} style={styles.authorAvatar} isViewable={true} />
                <Text style={styles.authorHandle}>{item.user.username}</Text>
                {item.user.isVerified && <VerifiedBadge size={12} />}
                <TouchableOpacity style={styles.followPillBtn}>
                  <Text style={styles.followPillText}>Seguir</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.captionText} numberOfLines={2}>
                {item.caption}
              </Text>

              <View style={styles.audioRow}>
                <Text style={styles.audioNoteIcon}>🎵</Text>
                <Text style={styles.audioTrackName} numberOfLines={1}>
                  {item.audioTrack}
                </Text>
              </View>
            </View>
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
    alignItems: 'center',
  },
  reelCard: {
    width: 380,
    height: 680,
    backgroundColor: '#121212',
    borderRadius: 12,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  playTouchArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    color: '#FFF',
    fontSize: 24,
    marginLeft: 4,
  },
  audioToggleBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  audioToggleText: {
    fontSize: 16,
    color: '#FFF',
  },
  rightActionsSidebar: {
    position: 'absolute',
    right: 12,
    bottom: 30,
    alignItems: 'center',
    zIndex: 5,
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 18,
  },
  actionIcon: {
    fontSize: 26,
    color: '#FFF',
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  musicVinylDisk: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#FFF',
    overflow: 'hidden',
    marginTop: 10,
  },
  vinylAvatar: {
    width: '100%',
    height: '100%',
  },
  bottomInfoOverlay: {
    position: 'absolute',
    left: 14,
    bottom: 24,
    right: 70,
    zIndex: 5,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  authorHandle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  followPillBtn: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 10,
  },
  followPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  captionText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioNoteIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  audioTrackName: {
    color: '#FFF',
    fontSize: 12,
  },
});
