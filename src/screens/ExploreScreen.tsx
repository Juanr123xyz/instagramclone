import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { INITIAL_POSTS } from '../mock/mockData';
import { DynamicImage } from '../components/DynamicImage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_SIZE = SCREEN_WIDTH / 3 - 2;

const CATEGORIES = ['Para ti', 'Fútbol ⚽', 'Animales 🐶', 'Naturaleza 🌿', 'Tecnología 💻', 'Reels 🎬'];

export const ExploreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Para ti');

  const filteredPosts = INITIAL_POSTS.filter((p) => {
    // 1. Text Search query filter
    const matchesSearch =
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Category Chip Filter
    if (activeCategory === 'Fútbol ⚽') {
      const footballKeywords = ['fútbol', 'messi', 'cr7', 'realmadrid', 'champions', 'gol', 'bernabéu', 'colombia', 'argentina', 'madrid'];
      return footballKeywords.some(k => p.caption.toLowerCase().includes(k) || p.user.username.toLowerCase().includes(k));
    }
    if (activeCategory === 'Animales 🐶') {
      const animalKeywords = ['dog', 'cat', 'lion', 'panda', 'husky', 'natgeo', 'pet', 'puppy', 'animal', 'savanna', 'wildlife', 'kitten'];
      return animalKeywords.some(k => p.caption.toLowerCase().includes(k) || p.user.username.toLowerCase().includes(k));
    }
    if (activeCategory === 'Naturaleza 🌿') {
      const natureKeywords = ['earth', 'fuji', 'japan', 'travel', 'nature', 'sakura', 'mountains', 'park'];
      return natureKeywords.some(k => p.caption.toLowerCase().includes(k) || p.user.username.toLowerCase().includes(k));
    }
    if (activeCategory === 'Tecnología 💻') {
      const techKeywords = ['tech', 'setup', 'developer', 'coding', 'react', 'workstation'];
      return techKeywords.some(k => p.caption.toLowerCase().includes(k) || p.user.username.toLowerCase().includes(k));
    }
    if (activeCategory === 'Reels 🎬') {
      return p.isReel === true;
    }

    return true; // 'Para ti' returns all
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por equipo, jugador, mascota, hashtag..."
            placeholderTextColor="#8E8E8E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Bar */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.activeChip]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.activeChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid of Posts */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item, index }) => {
          const isReelBadge = item.isReel || index % 3 === 0;
          return (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              activeOpacity={0.8}
            >
              <DynamicImage
                uri={item.imageUrl}
                style={{ width: COLUMN_SIZE, height: COLUMN_SIZE }}
                isViewable={true}
              />
              {isReelBadge && (
                <View style={styles.reelBadge}>
                  <Text style={styles.reelBadgeIcon}>🎬</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchBarContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
  },
  clearIcon: {
    color: '#8E8E8E',
    fontSize: 12,
  },
  categoriesWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
    paddingBottom: 8,
  },
  categoriesScroll: {
    paddingLeft: 12,
  },
  chip: {
    backgroundColor: '#121212',
    borderColor: '#262626',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#000000',
  },
  gridItem: {
    margin: 1,
    position: 'relative',
  },
  reelBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 2,
  },
  reelBadgeIcon: {
    fontSize: 10,
  },
});
