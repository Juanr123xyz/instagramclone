import React, { useEffect, useState } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

let toastListener: ((msg: string) => void) | null = null;

export const showToast = (message: string) => {
  if (toastListener) {
    toastListener(message);
  }
};

export const CopyToast: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    toastListener = (msg: string) => {
      setMessage(msg);
      fadeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2200),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMessage(null);
      });
    };

    return () => {
      toastListener = null;
    };
  }, [fadeAnim]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <View style={styles.checkCircle}>
        <Text style={styles.toastIcon}>✓</Text>
      </View>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#262626',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#363636',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 100,
    zIndex: 999999,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  toastIcon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
