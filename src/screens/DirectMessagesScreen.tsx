import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { INITIAL_CHATS } from '../mock/mockData';
import { Chat, ChatMessage } from '../types';
import { DynamicImage } from '../components/DynamicImage';
import { webSocketService } from '../realtime/WebSocketService';

export const DirectMessagesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);

  useEffect(() => {
    // Realtime WebSocket listener: Auto-reorder inbox on incoming message
    const unsubMsg = webSocketService.onMessage((msg: ChatMessage) => {
      setChats((prevChats) => {
        const updated = prevChats.map((c) => {
          if (c.id === msg.chatId) {
            return {
              ...c,
              lastMessage: msg,
              unreadCount: msg.senderId !== 'user_me' ? c.unreadCount + 1 : c.unreadCount,
            };
          }
          return c;
        });

        // Reorder inbox by latest message chronology (Rigorous order)
        return updated.sort((a, b) => {
          const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() || 0 : 0;
          const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() || 0 : 0;
          return timeB - timeA;
        });
      });
    });

    const unsubTyping = webSocketService.onTyping((chatId, isTyping) => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, isTyping } : c))
      );
    });

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, []);

  const handleOpenChat = (chat: Chat) => {
    // Clear unread count on open
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    navigation.navigate('ChatDetail', { chat });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mensajes Directos (DMs)</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRow}
            onPress={() => handleOpenChat(item)}
            activeOpacity={0.7}
          >
            <DynamicImage uri={item.user.avatar} style={styles.avatar} isViewable={true} />
            <View style={styles.chatContent}>
              <Text style={styles.username}>{item.user.username}</Text>
              <Text
                style={[
                  styles.lastMsgText,
                  item.unreadCount > 0 && styles.unreadMsgText,
                  item.isTyping && styles.typingMsgText,
                ]}
                numberOfLines={1}
              >
                {item.isTyping ? '✍️ Escribiendo...' : item.lastMessage?.text || 'Sin mensajes'}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.timeText}>{item.lastMessage?.timestamp}</Text>
              {item.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
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
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: '#111',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
    marginLeft: 14,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lastMsgText: {
    color: '#888',
    fontSize: 13,
    marginTop: 3,
  },
  unreadMsgText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  typingMsgText: {
    color: '#3897f0',
    fontStyle: 'italic',
  },
  metaCol: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: '#666',
    fontSize: 11,
  },
  badge: {
    backgroundColor: '#3897f0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
