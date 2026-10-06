import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Story } from '../types';
import { DynamicImage } from '../components/DynamicImage';

const { width, height } = Dimensions.get('window');

const QUICK_EMOJIS = ['🔥', '😂', '😍', '👏', '😮', '😢'];

export const StoriesViewerScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { story }: { story: Story } = route.params;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  const progressAnim = useRef(new Animated.Value(0)).current;
  const activeItem = story.items[currentIndex] || story.items[0];

  useEffect(() => {
    progressAnim.setValue(0);

    if (isPaused) return;

    const animation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: activeItem.durationSeconds * 1000,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });

    return () => {
      progressAnim.stopAnimation();
    };
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (currentIndex < story.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleTap = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 3) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    Alert.alert('Respuesta Enviada ✉️', `Mensaje a @${story.user.username}: "${replyText}"`);
    setReplyText('');
    setIsPaused(false);
  };

  const handleEmojiClick = (emoji: string) => {
    Alert.alert('Reacción Enviada', `${emoji} enviado a @${story.user.username}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleTap}
        >
          <View style={styles.touchArea}>
            {/* Story Image */}
            <DynamicImage uri={activeItem.mediaUrl} style={styles.media} isViewable={true} />

            {/* Header Overlay */}
            <View style={styles.topOverlay}>
              {/* Progress Bars */}
              <View style={styles.progressContainer}>
                {story.items.map((item, idx) => {
                  let barWidth: any = '0%';
                  if (idx < currentIndex) {
                    barWidth = '100%';
                  } else if (idx === currentIndex) {
                    barWidth = progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    });
                  }
                  return (
                    <View key={item.id} style={styles.progressBarBackground}>
                      <Animated.View style={[styles.progressBarFill, { width: barWidth }]} />
                    </View>
                  );
                })}
              </View>

              {/* Author Row */}
              <View style={styles.authorHeader}>
                <DynamicImage uri={story.user.avatar} style={styles.avatar} isViewable={true} />
                <Text style={styles.username}>{story.user.username}</Text>
                <Text style={styles.timeAgo}>{activeItem.createdAt}</Text>
                {isPaused && <Text style={styles.pausedBadge}>⏸️ Pausado</Text>}
                <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Overlay: Quick Emojis & Story Reply Input */}
            <View style={styles.bottomOverlay}>
              {/* Quick Emojis */}
              <View style={styles.emojiRow}>
                {QUICK_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleEmojiClick(emoji)}
                    style={styles.emojiBtn}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Reply Input Bar */}
              <View style={styles.replyBar}>
                <TextInput
                  style={styles.replyInput}
                  placeholder={`Enviar mensaje a ${story.user.username}...`}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={replyText}
                  onChangeText={setReplyText}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                />
                <TouchableOpacity onPress={handleSendReply} disabled={!replyText.trim()}>
                  <Text style={[styles.sendIcon, !replyText.trim() && styles.disabledSendIcon]}>
                    ✈️
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  touchArea: {
    width,
    height,
    justifyContent: 'space-between',
  },
  media: {
    width,
    height,
    position: 'absolute',
  },
  topOverlay: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 8,
  },
  timeAgo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginLeft: 6,
  },
  pausedBadge: {
    marginLeft: 10,
    color: '#FFCC00',
    fontSize: 11,
    fontWeight: 'bold',
  },
  closeBtn: {
    marginLeft: 'auto',
    padding: 6,
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomOverlay: {
    paddingHorizontal: 14,
    paddingBottom: 25,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    paddingVertical: 6,
  },
  emojiBtn: {
    padding: 4,
  },
  emojiText: {
    fontSize: 22,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  replyInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
  },
  sendIcon: {
    fontSize: 18,
    marginLeft: 10,
  },
  disabledSendIcon: {
    opacity: 0.4,
  },
});
