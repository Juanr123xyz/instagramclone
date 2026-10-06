import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InstagramLogo: React.FC<{ fontSize?: number }> = ({ fontSize = 24 }) => (
  <Text style={[styles.logoText, { fontSize }]}>Instagram</Text>
);

export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <View style={[styles.verifiedContainer, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.verifiedCheck, { fontSize: size * 0.7 }]}>✓</Text>
  </View>
);

// SVG-like Vector Icons matching Instagram Web Desktop
export const HomeIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>
    {active ? '🏠' : '🏚️'}
  </Text>
);

export const ReelsIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>🎬</Text>
);

export const MessagesIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>✈️</Text>
);

export const SearchIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>🔍</Text>
);

export const NotificationsIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>
    {active ? '❤️' : '🤍'}
  </Text>
);

export const CreateIcon: React.FC<{ active?: boolean; size?: number; color?: string }> = ({
  active = false,
  size = 24,
  color = '#FFF',
}) => (
  <Text style={{ fontSize: size - 2, color, fontWeight: active ? 'bold' : 'normal' }}>➕</Text>
);

export const StoryGradientRing: React.FC<{
  children: React.ReactNode;
  hasUnseen?: boolean;
  size?: number;
}> = ({ children, hasUnseen = true, size = 68 }) => {
  return (
    <View
      style={[
        styles.ringWrapper,
        { width: size, height: size, borderRadius: size / 2 },
        hasUnseen ? styles.instagramGradientRing : styles.seenRing,
      ]}
    >
      <View style={[styles.innerRingBg, { borderRadius: (size - 6) / 2 }]}>{children}</View>
    </View>
  );
};

export const ReelPlayBadge: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <View style={[styles.reelBadgeBox, { width: size + 6, height: size + 4 }]}>
    <Text style={styles.reelBadgeText}>▶</Text>
  </View>
);

const styles = StyleSheet.create({
  logoText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
    letterSpacing: -0.5,
  },
  verifiedContainer: {
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
  ringWrapper: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramGradientRing: {
    borderWidth: 2.5,
    borderColor: '#D10869',
  },
  seenRing: {
    borderWidth: 1.5,
    borderColor: '#363636',
  },
  innerRingBg: {
    backgroundColor: '#000000',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelBadgeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
