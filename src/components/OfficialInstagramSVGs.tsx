import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  active?: boolean;
}

// ============================================================================
// 🖤 MONOCHROME OFFICIAL INSTAGRAM ICONS & BUTTONS (Black & White Theme)
// ============================================================================

export const InstagramTextLogoSVG: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Text style={[styles.instagramBrandLogo, { fontSize: size, color }]}>Instagram</Text>
);

// 🏠 Home Icon (Monochrome Outline / Solid)
export const HomeSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    {active ? (
      <Text style={[styles.svgChar, { color, fontSize: size - 2, fontWeight: '900' }]}>⌂</Text>
    ) : (
      <Text style={[styles.svgChar, { color, fontSize: size - 2, fontWeight: '300' }]}>⌂</Text>
    )}
  </View>
);

// 🔍 Search Icon
export const SearchSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 4, fontWeight: active ? 'bold' : 'normal' }]}>
      ⚲
    </Text>
  </View>
);

// 🧭 Explore Compass Icon
export const ExploreSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2, fontWeight: active ? 'bold' : 'normal' }]}>
      ◌
    </Text>
  </View>
);

// 🎬 Reels Icon
export const ReelsSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 4, fontWeight: active ? 'bold' : 'normal' }]}>
      🎞
    </Text>
  </View>
);

// ✈️ Direct Messages Icon (Monochrome Paper Airplane)
export const MessagesSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2, fontWeight: active ? 'bold' : 'normal' }]}>
      💬
    </Text>
  </View>
);

// ❤️ Notifications Heart Icon
export const NotificationsSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color: active ? '#FF3040' : color, fontSize: size - 4 }]}>
      {active ? '♥' : '♡'}
    </Text>
  </View>
);

// ➕ Create Post Icon
export const CreateSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <View style={[styles.createSquareBox, { width: size, height: size, borderColor: color }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 8, fontWeight: 'bold' }]}>+</Text>
  </View>
);

// 🔖 Bookmark Icon
export const BookmarkSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', active = false }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2 }]}>{active ? '🔖' : '⚐'}</Text>
  </View>
);

// 💬 Comment Icon
export const CommentSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2 }]}>🗨</Text>
  </View>
);

// ✈️ Share Icon
export const ShareSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2 }]}>➦</Text>
  </View>
);

// ≡ More Options Icon
export const MoreSVGIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => (
  <View style={[styles.iconBox, { width: size, height: size }]}>
    <Text style={[styles.svgChar, { color, fontSize: size - 2, fontWeight: 'bold' }]}>≡</Text>
  </View>
);

// ✓ Verified Badge (Monochrome / Blue)
export const VerifiedBadgeSVG: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <View style={[styles.verifiedBadge, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.verifiedCheck, { fontSize: size * 0.7 }]}>✓</Text>
  </View>
);

// ▶ Reel Badge Box
export const ReelPlayBadge: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <View style={[styles.reelBadgeBox, { width: size + 6, height: size + 4 }]}>
    <Text style={styles.reelBadgeText}>▶</Text>
  </View>
);

const styles = StyleSheet.create({
  instagramBrandLogo: {
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: -0.5,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createSquareBox: {
    borderWidth: 1.8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgChar: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  verifiedBadge: {
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedCheck: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reelBadgeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
