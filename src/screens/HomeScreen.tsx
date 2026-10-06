import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ViewToken,
  RefreshControl,
  Platform,
} from 'react-native';
import { INITIAL_POSTS, INITIAL_STORIES, CURRENT_USER } from '../mock/mockData';
import { Post, Story } from '../types';
import { PostCard } from '../components/PostCard';
import { StoryAvatar } from '../components/StoryAvatar';
import { ConnectionBanner } from '../components/ConnectionBanner';
import { InstagramLogo } from '../components/InstagramIcons';
import { WebDesktopLayout } from '../components/WebDesktopLayout';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Always render the Web Desktop Layout when running in web browser!
  if (Platform.OS === 'web') {
    return <WebDesktopLayout navigation={navigation} />;
  }

  // Mobile native layout fallback
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewableItemsMap, setViewableItemsMap] = useState<Record<string, boolean>>({});

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const newMap: Record<string, boolean> = {};
      viewableItems.forEach((item) => {
        if (item.item && item.item.id) {
          newMap[item.item.id] = true;
        }
      });
      setViewableItemsMap(newMap);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConnectionBanner />
      <View style={styles.header}>
        <InstagramLogo fontSize={26} />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.headerIcon}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('ActivityMain')}
          >
            <Text style={styles.headerIcon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('DirectMessages')}
          >
            <Text style={styles.headerIcon}>✈️</Text>
            <View style={styles.dmBadge}>
              <Text style={styles.dmBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFF" />
        }
        ListHeaderComponent={
          <View style={styles.storiesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
              {stories.map((story) => (
                <StoryAvatar
                  key={story.id}
                  story={story}
                  isSelf={story.userId === CURRENT_USER.id}
                  onPress={() => navigation.navigate('StoriesViewer', { story })}
                />
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isViewable={!!viewableItemsMap[item.id]}
            onOpenComments={(postId) => navigation.navigate('Comments', { postId })}
            onOpenProfile={(userId) => navigation.navigate('Profile', { userId })}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
    borderBottomColor: '#121212',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 18,
    position: 'relative',
  },
  headerIcon: {
    fontSize: 20,
    color: '#FFF',
  },
  dmBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  dmBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#121212',
    backgroundColor: '#000000',
  },
  storiesScroll: {
    paddingLeft: 12,
  },
});
