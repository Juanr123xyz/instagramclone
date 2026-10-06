import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { INITIAL_POSTS } from '../mock/mockData';
import { PostCard } from '../components/PostCard';
import { localDatabase } from '../database/LocalDatabase';

export const PostDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { postId } = route.params || {};
  const allPosts = localDatabase.loadPosts(INITIAL_POSTS);
  const post = allPosts.find((p) => p.id === postId || p.id === `post_${postId}`) || allPosts[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post (Deep Link: {postId || post.id})</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <PostCard
          post={post}
          isViewable={true}
          onOpenComments={(id) => navigation.navigate('Comments', { postId: id })}
          onOpenProfile={(id) => navigation.navigate('Profile', { userId: id })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  backBtn: {
    color: '#3897f0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
