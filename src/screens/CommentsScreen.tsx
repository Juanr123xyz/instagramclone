import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { INITIAL_POSTS, CURRENT_USER } from '../mock/mockData';
import { Comment } from '../types';
import { DynamicImage } from '../components/DynamicImage';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';

export const CommentsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { postId } = route.params;
  const post = INITIAL_POSTS.find((p) => p.id === postId) || INITIAL_POSTS[0];

  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [inputText, setInputText] = useState<string>('');

  const handleAddComment = () => {
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      userAvatar: CURRENT_USER.avatar,
      text: inputText.trim(),
      createdAt: 'Ahora mismo',
      likesCount: 0,
      isOptimistic: true, // Tagged as optimistic update!
    };

    // 1. Instantaneous UI Update (0 ms latency)
    setComments((prev) => [...prev, newComment]);
    post.comments.push(newComment);
    const commentText = inputText.trim();
    setInputText('');

    // 2. Queue in SQLite Offline Sync Queue for background sync
    offlineSyncQueue.enqueueAction('ADD_COMMENT', {
      postId,
      commentId: newComment.id,
      text: commentText,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comentarios</Text>
        <View style={{ width: 50 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <DynamicImage uri={item.userAvatar} style={styles.avatar} isViewable={true} />
              <View style={styles.commentContent}>
                <Text style={styles.commentText}>
                  <Text style={styles.username}>{item.username} </Text>
                  {item.text}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.timeText}>{item.createdAt}</Text>
                  {item.isOptimistic && (
                    <Text style={styles.optimisticTag}> ⚡ Enviando (UI Optimista)</Text>
                  )}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay comentarios aún. ¡Sé el primero!</Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <DynamicImage uri={CURRENT_USER.avatar} style={styles.smallAvatar} isViewable={true} />
          <TextInput
            style={styles.input}
            placeholder="Añade un comentario..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleAddComment} disabled={!inputText.trim()}>
            <Text style={[styles.sendBtn, !inputText.trim() && styles.disabledSendBtn]}>
              Publicar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#111',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
  username: {
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    color: '#777',
    fontSize: 11,
  },
  optimisticTag: {
    color: '#FFCC00',
    fontSize: 10,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 13,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#222',
    backgroundColor: '#0a0a0a',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: '#FFF',
    marginHorizontal: 10,
    fontSize: 13,
  },
  sendBtn: {
    color: '#3897f0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledSendBtn: {
    color: '#444',
  },
});
