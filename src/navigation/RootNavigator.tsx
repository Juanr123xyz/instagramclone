import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { CommentsScreen } from '../screens/CommentsScreen';
import { StoriesViewerScreen } from '../screens/StoriesViewerScreen';
import { DirectMessagesScreen } from '../screens/DirectMessagesScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Home Stack with Independent Navigation
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="StoriesViewer" component={StoriesViewerScreen} />
      <Stack.Screen name="DirectMessages" component={DirectMessagesScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// 2. Explore Stack
function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// 3. Activity Stack
function ActivityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivityMain" component={ActivityScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

// 4. Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
}

// Deep Linking Interception Configuration (instagramclone://post/{postId})
const linking: LinkingOptions<any> = {
  prefixes: ['instagramclone://', 'https://instagramclone.app'],
  config: {
    screens: {
      HomeTab: {
        screens: {
          PostDetail: 'post/:postId',
        },
      },
    },
  },
};

import { CopyToast } from '../components/CopyToast';

export function RootNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarBackgroundColor: '#000',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#222',
            borderTopWidth: 0.5,
          },
          tabBarActiveTintColor: '#FFF',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({ color }) => {
            let icon = '🏠';
            if (route.name === 'HomeTab') icon = '🏠';
            else if (route.name === 'ExploreTab') icon = '🔍';
            else if (route.name === 'ActivityTab') icon = '❤️';
            else if (route.name === 'ProfileTab') icon = '👤';
            return <Text style={{ color, fontSize: 18 }}>{icon}</Text>;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Inicio' }} />
        <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: 'Explorar' }} />
        <Tab.Screen name="ActivityTab" component={ActivityStack} options={{ title: 'Actividad' }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
      <CopyToast />
    </NavigationContainer>
  );
}
