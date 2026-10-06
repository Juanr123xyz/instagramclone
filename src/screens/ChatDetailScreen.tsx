import React, { useState, useEffect } from 'react';
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
import { Chat, ChatMessage } from '../types';
import { DynamicImage } from '../components/DynamicImage';
import { webSocketService } from '../realtime/WebSocketService';

export const ChatDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { chat }: { chat: Chat } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>(
    chat.lastMessage ? [chat.lastMessage] : []
  );
  const [text, setText] = useState<string>('');
  const [isOpponentTyping, setIsOpponentTyping] = useState<boolean>(false);

  useEffect(() => {
    // Listen for incoming messages on WebSocket
    const unsubMsg = webSocketService.onMessage((incoming) => {
      if (incoming.chatId === chat.id) {
        setMessages((prev) => [...prev, incoming]);
      }
    });

    // Listen for typing events
    const unsubTyping = webSocketService.onTyping((cId, isTyping) => {
      if (cId === chat.id) {
        setIsOpponentTyping(isTyping);
      }
    });

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, [chat.id]);

  const handleSend = () => {
    if (!text.trim()) return;

    const outgoing = webSocketService.sendChatMessage(chat.id, text.trim(), 'user_me');
    setMessages((prev) => [...prev, outgoing]);
    setText('');
    webSocketService.sendTypingEvent(chat.id, false);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (val.length > 0) {
      webSocketService.sendTypingEvent(chat.id, true);
    } else {
      webSocketService.sendTypingEvent(chat.id, false);
    }
  };

  const renderStatusTicks = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return ' 🕒';
      case 'sent':
        return ' ✓';
      case 'delivered':
        return ' ✓✓';
      case 'read':
        return ' ✓✓ Visto';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <DynamicImage uri={chat.user.avatar} style={styles.headerAvatar} isViewable={true} />
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerName}>{chat.user.name}</Text>
          <Text style={styles.headerUsername}>
            {isOpponentTyping ? '✍️ Escribiendo...' : `@${chat.user.username}`}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14 }}
          renderItem={({ item }) => {
            const isMe = item.senderId === 'user_me';
            return (
              <View style={[styles.msgWrapper, isMe ? styles.myMsgWrapper : styles.theirMsgWrapper]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                  <Text style={styles.msgText}>{item.text}</Text>
                  <View style={styles.msgFooter}>
                    <Text style={styles.msgTime}>{item.timestamp}</Text>
                    {isMe && <Text style={styles.statusTicks}>{renderStatusTicks(item.status)}</Text>}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Typing Status Indicator Banner */}
        {isOpponentTyping && (
          <View style={styles.typingBanner}>
            <Text style={styles.typingBannerText}>{chat.user.username} está escribiendo...</Text>
          </View>
        )}

        {/* Chat Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={handleTextChange}
          />
          <TouchableOpacity onPress={handleSend} disabled={!text.trim()}>
            <Text style={[styles.sendBtn, !text.trim() && styles.disabledSendBtn]}>Enviar</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  backBtn: {
    color: '#FFF',
    fontSize: 22,
    marginRight: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitleCol: {
    marginLeft: 10,
  },
  headerName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerUsername: {
    color: '#3897f0',
    fontSize: 11,
  },
  msgWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  myMsgWrapper: {
    justifyContent: 'flex-end',
  },
  theirMsgWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: '#3797F0',
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: '#262626',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 19,
  },
  msgFooter: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 4,
    alignItems: 'center',
  },
  msgTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
  },
  statusTicks: {
    color: '#FFF',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  typingBanner: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  typingBannerText: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#222',
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    paddingHorizontal: 12,
  },
  sendBtn: {
    color: '#3897f0',
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 8,
  },
  disabledSendBtn: {
    color: '#555',
  },
});
