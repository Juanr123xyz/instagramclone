import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Story } from '../types';
import { StoryGradientRing } from './InstagramIcons';

interface StoryAvatarProps {
  story: Story;
  isSelf?: boolean;
  onPress?: () => void;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({ story, isSelf = false, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress ? onPress : () => {}}
      activeOpacity={0.85}
    >
      <StoryGradientRing hasUnseen={story.hasUnseen} size={72}>
        <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
        {isSelf && (
          <View style={styles.addStoryPlus}>
            <Text style={styles.plusText}>+</Text>
          </View>
        )}
      </StoryGradientRing>
      <Text style={styles.username} numberOfLines={1}>
        {isSelf ? 'Tu historia' : story.user.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 14,
    width: 74,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#262626',
  },
  addStoryPlus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095F6',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: -2,
  },
  username: {
    color: '#F5F5F5',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },
});
