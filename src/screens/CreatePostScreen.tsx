import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { CURRENT_USER, INITIAL_POSTS } from '../mock/mockData';
import { offlineSyncQueue } from '../offline/OfflineSyncQueue';
import { localDatabase } from '../database/LocalDatabase';
import { DynamicImage } from '../components/DynamicImage';
import { showToast } from '../components/CopyToast';
import { OLISE_IMAGE_DATA_URL } from '../mock/oliseImage';

const PRESET_POST_IMAGES = [
  OLISE_IMAGE_DATA_URL,
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
];

export const CreatePostScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [caption, setCaption] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_POST_IMAGES[0]);

  const handleFileSelect = (event: any) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageUrl(e.target.result as string);
          showToast('¡Imagen cargada desde tu equipo! 📸');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!caption.trim()) {
      showToast('Ingresa un pie de foto para tu publicación');
      return;
    }

    const newPostId = `post_${Date.now()}`;
    const newPost = {
      id: newPostId,
      userId: CURRENT_USER.id,
      user: CURRENT_USER,
      imageUrl: imageUrl || PRESET_POST_IMAGES[0],
      caption: caption.trim(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Ahora mismo',
      comments: [],
    };

    // 1. Optimistic UI insertion at top of Feed
    INITIAL_POSTS.unshift(newPost);
    localDatabase.savePosts(INITIAL_POSTS);

    // 2. Enqueue action in SQLite sync queue
    offlineSyncQueue.enqueueAction('LIKE_POST', { postId: newPostId, caption, imageUrl });

    showToast('¡Publicación creada con éxito! 📸✨');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Publicación</Text>
        <TouchableOpacity onPress={handlePublish}>
          <Text style={styles.publishText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={styles.imagePreviewBox}>
          <DynamicImage uri={imageUrl} style={styles.mainPreviewImage} isViewable={true} />
        </View>

        {Platform.OS === 'web' && (
          <View style={{ width: '100%', marginBottom: 14 }}>
            {/* @ts-ignore */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0095F6',
                color: '#FFFFFF',
                padding: '10px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'center',
              }}
            >
              📁 Cargar cualquier foto desde tu equipo / computador
              {/* @ts-ignore */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
          </View>
        )}

        <Text style={styles.sectionLabel}>O seleccionar imágenes predefinidas:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {PRESET_POST_IMAGES.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setImageUrl(img)}
              style={[
                styles.thumbWrapper,
                imageUrl === img && styles.selectedThumbWrapper,
              ]}
            >
              <DynamicImage uri={img} style={styles.thumbImage} isViewable={true} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>O ingresa la URL de una imagen:</Text>
        <TextInput
          style={styles.urlInput}
          placeholder="https://..."
          placeholderTextColor="#666"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Pie de foto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe un pie de foto para tu publicación..."
          placeholderTextColor="#666"
          multiline
          value={caption}
          onChangeText={setCaption}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  cancelText: {
    color: '#FFF',
    fontSize: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  publishText: {
    color: '#3897f0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  imagePreviewBox: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#121212',
  },
  mainPreviewImage: {
    width: '100%',
    height: '100%',
  },
  sectionLabel: {
    color: '#8E8E8E',
    fontSize: 13,
    marginBottom: 6,
  },
  thumbWrapper: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbWrapper: {
    borderColor: '#3897f0',
  },
  thumbImage: {
    width: 54,
    height: 54,
  },
  urlInput: {
    backgroundColor: '#121212',
    color: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 0.5,
    borderColor: '#262626',
  },
  input: {
    backgroundColor: '#121212',
    color: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 90,
    fontSize: 14,
    textAlignVertical: 'top',
    borderWidth: 0.5,
    borderColor: '#262626',
  },
});
