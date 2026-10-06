import { User, Post, Story, Chat, FollowRequest, NotificationItem, Highlight } from '../types';

export const CURRENT_USER: User = {
  id: 'user_me',
  username: 'juan_ramirez.12_',
  name: 'Juan Esteban',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  bio: '⚽ Football & Nature Enthusiast | 📍 Medellín / Madrid\n🏆 Living for the beautiful game & wildlife! 🐾',
  website: 'https://instagram.com/juan_ramirez.12_',
  isPrivate: false,
  isFollowing: false,
  hasPendingRequest: false,
  isVerified: false,
  followersCount: 3420,
  followingCount: 512,
  postsCount: 42,
};

// ==========================================
// ⚽ 1. FOOTBALL LEGENDS & CLUBS (12 ACCOUNTS)
// ==========================================
export const FOOTBALL_USERS: Record<string, User> = {
  leomessi: {
    id: 'user_messi',
    username: 'leomessi',
    name: 'Leo Messi',
    avatar: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&q=80',
    bio: 'Official Instagram of Leo Messi 🇦🇷 🏆 8x Ballon d\'Or Champion | Inter Miami',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 504000000,
    followingCount: 310,
    postsCount: 1120,
  },
  cristiano: {
    id: 'user_cr7',
    username: 'cristiano',
    name: 'Cristiano Ronaldo',
    avatar: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80',
    bio: 'SIUUU! 🇵🇹 🏆 5x Ballon d\'Or Champion | Al Nassr & Portugal',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 642000000,
    followingCount: 570,
    postsCount: 3720,
  },
  kmbappe: {
    id: 'user_mbappe',
    username: 'k.mbappe',
    name: 'Kylian Mbappé',
    avatar: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=80',
    bio: 'Real Madrid & Equipe de France 🇫🇷 ⚽ 👑',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 122000000,
    followingCount: 410,
    postsCount: 1420,
  },
  vinijr: {
    id: 'user_vini',
    username: 'vinijr',
    name: 'Vini Jr. 🇧🇷',
    avatar: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80',
    bio: 'Baila Vini! ⚡ Real Madrid C.F. & Seleção Brasileira',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 51200000,
    followingCount: 620,
    postsCount: 980,
  },
  judebellingham: {
    id: 'user_jude',
    username: 'judebellingham',
    name: 'Jude Bellingham',
    avatar: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=400&q=80',
    bio: 'Hey Jude! 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Real Madrid C.F. & England',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 38900000,
    followingCount: 480,
    postsCount: 650,
  },
  neymarjr: {
    id: 'user_neymar',
    username: 'neymarjr',
    name: 'NJ 🇧🇷',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    bio: 'Ousadia e Alegria! ⚽ 🇧🇷 Al Hilal & Brasil',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 226000000,
    followingCount: 1720,
    postsCount: 5410,
  },
  erlinghaaland: {
    id: 'user_haaland',
    username: 'erling.haaland',
    name: 'Erling Braut Haaland',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    bio: 'Manchester City & Norway 🇳🇴 ⚽ Viking Mode',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 39100000,
    followingCount: 320,
    postsCount: 840,
  },
  lamineyamal: {
    id: 'user_yamal',
    username: 'lamineyamal',
    name: 'Lamine Yamal',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80',
    bio: 'FC Barcelona & Selección Española 🇪🇸 ⚽ 304',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 24500000,
    followingCount: 280,
    postsCount: 310,
  },
  jamesrodriguez10: {
    id: 'user_james',
    username: 'jamesrodriguez10',
    name: 'James Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
    bio: 'Colombia 🇨🇴 ⚽ Rayo Vallecano | Zurda de Oro',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 52400000,
    followingCount: 680,
    postsCount: 1940,
  },
  luisdiaz19_: {
    id: 'user_ldiaz',
    username: 'luisdiaz19_',
    name: 'Luis Díaz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Lucho Díaz 🇨🇴 Liverpool FC & Selección Colombia ⚡',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 12800000,
    followingCount: 510,
    postsCount: 610,
  },
  realmadrid: {
    id: 'user_realmadrid',
    username: 'realmadrid',
    name: 'Real Madrid C.F.',
    avatar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
    bio: 'Página oficial del Real Madrid C.F. 🏆 15 UEFA Champions League',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 165000000,
    followingCount: 65,
    postsCount: 12400,
  },
  fcbarcelona: {
    id: 'user_fcbarcelona',
    username: 'fcbarcelona',
    name: 'FC Barcelona',
    avatar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
    bio: 'Més que un Club 🔵🔴 Official FC Barcelona Account',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 128000000,
    followingCount: 95,
    postsCount: 15200,
  }
};

// ==========================================
// 🐾 2. ANIMALS & WILDLIFE (10 ACCOUNTS)
// ==========================================
export const ANIMAL_USERS: Record<string, User> = {
  natgeowild: {
    id: 'user_natgeowild',
    username: 'natgeowild',
    name: 'National Geographic Wild',
    avatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&q=80',
    bio: 'Inspiring people to care about the planet 🦁🌿 Experience the wild world through our lenses.',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 48900000,
    followingCount: 140,
    postsCount: 8900,
  },
  dogs_of_instagram: {
    id: 'user_dogs',
    username: 'dogs.of.instagram',
    name: 'Dogs of Instagram 🐶',
    avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
    bio: 'The world\'s best dog photos and videos! Tag #dogsofinstagram to be featured 🐕✨',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 15400000,
    followingCount: 820,
    postsCount: 6400,
  },
  cats_of_world: {
    id: 'user_cats',
    username: 'cats.of.world',
    name: 'Cats of the World 🐱',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    bio: 'Purr-fect moments from cats around the globe 🐾 Meow daily!',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 9800000,
    followingCount: 350,
    postsCount: 4200,
  },
  wildlife_planet: {
    id: 'user_wildlife',
    username: 'wildlife.planet',
    name: 'Wildlife Planet 🐆',
    avatar: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=80',
    bio: 'Protecting and showcasing nature\'s most breathtaking animals 🌍🐅',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 12100000,
    followingCount: 190,
    postsCount: 5100,
  },
  panda_daily: {
    id: 'user_panda',
    username: 'panda.daily',
    name: 'Daily Pandas 🐼',
    avatar: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=400&q=80',
    bio: 'Your daily dose of fluffy giant pandas eating bamboo & playing! 🐾',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 6200000,
    followingCount: 80,
    postsCount: 2300,
  },
  husky_pack: {
    id: 'user_husky',
    username: 'husky.pack',
    name: 'Siberian Huskies 🐺',
    avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&q=80',
    bio: 'Majestic huskies running through snow and singing! ❄️🐾',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 4100000,
    followingCount: 110,
    postsCount: 1800,
  },
  ocean_creatures: {
    id: 'user_ocean',
    username: 'ocean.life',
    name: 'Ocean Life 🐬',
    avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    bio: 'Dolphins, whales & coral reefs from deep blue oceans 🌊🐋',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 3800000,
    followingCount: 95,
    postsCount: 1450,
  },
  safari_adventures: {
    id: 'user_safari',
    username: 'wildlife.safari',
    name: 'African Safari 🐘',
    avatar: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80',
    bio: 'Expeditions across Kenya & Tanzania savannas 🌍🐆',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 5200000,
    followingCount: 130,
    postsCount: 2100,
  },
  cute_bunnies: {
    id: 'user_bunnies',
    username: 'cute.bunnies',
    name: 'Adorable Bunnies 🐰',
    avatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80',
    bio: 'Fluffy bunnies twitching noses & eating carrots! 🥕✨',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 2900000,
    followingCount: 70,
    postsCount: 980,
  },
  birds_paradise: {
    id: 'user_birds',
    username: 'birds.paradise',
    name: 'Exotic Birds 🦜',
    avatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80',
    bio: 'Colorful macaws, hummingbirds and eagles in flight 🦅🌈',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 1800000,
    followingCount: 120,
    postsCount: 760,
  }
};

// ==========================================
// 🌍 3. TRAVEL, TECH, GASTRONOMY & LIFESTYLE (18 ACCOUNTS)
// ==========================================
export const CREATOR_USERS: Record<string, User> = {
  earthpix: {
    id: 'user_earthpix',
    username: 'earthpix',
    name: 'Earth Pix 🌎',
    avatar: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    bio: 'Your daily dose of travel inspiration and wonders of planet Earth ✨✈️',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 25400000,
    followingCount: 210,
    postsCount: 7800,
  },
  beautifuldestinations: {
    id: 'user_destinations',
    username: 'beautifuldestinations',
    name: 'Beautiful Destinations ✈️',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    bio: 'Inspiring people to travel & celebrate world beauty 🏝️✨',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 31200000,
    followingCount: 410,
    postsCount: 6500,
  },
  japan_explores: {
    id: 'user_japan',
    username: 'japan.explores',
    name: 'Explore Japan 🗾',
    avatar: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&q=80',
    bio: 'Tokyo neon lights, Kyoto temples & Mount Fuji cherry blossoms 🌸',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 8400000,
    followingCount: 180,
    postsCount: 3200,
  },
  colombia_travel: {
    id: 'user_colombia',
    username: 'colombia.travel',
    name: 'Magia de Colombia 🇨🇴',
    avatar: 'https://images.unsplash.com/photo-1583531172005-814191b8b6c0?w=400&q=80',
    bio: 'Cartagena, Guatapé, Valle del Cocora y la amabilidad colombiana 🌴❤️',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 4600000,
    followingCount: 230,
    postsCount: 1950,
  },
  tech_setups: {
    id: 'user_tech',
    username: 'tech.setups',
    name: 'Ultimate Desk Setups 💻',
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    bio: 'Curated minimalist & RGB gaming setups for developers and creators 🚀',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 7800000,
    followingCount: 390,
    postsCount: 3100,
  },
  playstation: {
    id: 'user_playstation',
    username: 'playstation',
    name: 'PlayStation Official 🎮',
    avatar: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80',
    bio: 'Play Has No Limits 🟦 PlayStation 5 & Next-Gen Gaming',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 32100000,
    followingCount: 150,
    postsCount: 5400,
  },
  gourmet_chef: {
    id: 'user_food',
    username: 'gourmet.chef',
    name: 'Gourmet Recipes & Food 🍕',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
    bio: 'Mouthwatering dishes, artisan pizza, and culinary art from around the globe 👨‍🍳🔥',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 11200000,
    followingCount: 450,
    postsCount: 4900,
  },
  coffee_culture: {
    id: 'user_coffee',
    username: 'coffee.culture',
    name: 'Artisan Coffee & Latte ☕',
    avatar: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    bio: 'Espresso art, specialty beans & coffee shops around the globe ☕🎨',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 2800000,
    followingCount: 190,
    postsCount: 1200,
  }
};

// ==========================================
// 🔍 MAP ALL 40 ACCOUNTS BY BOTH ID AND USERNAME FOR 100% LOOKUP ACCURACY
// ==========================================
export const ALL_USERS_LIST: User[] = [
  CURRENT_USER,
  ...Object.values(FOOTBALL_USERS),
  ...Object.values(ANIMAL_USERS),
  ...Object.values(CREATOR_USERS),
];

export const MOCK_USERS: Record<string, User> = {};

ALL_USERS_LIST.forEach((u) => {
  MOCK_USERS[u.id] = u;
  MOCK_USERS[u.username] = u;
});

export const getUserByIdOrUsername = (key: string): User => {
  if (!key) return CURRENT_USER;
  if (MOCK_USERS[key]) return MOCK_USERS[key];
  
  // Search case-insensitive
  const found = ALL_USERS_LIST.find(
    (u) => u.id.toLowerCase() === key.toLowerCase() || u.username.toLowerCase() === key.toLowerCase()
  );
  if (found) return found;

  return {
    id: key,
    username: key,
    name: `@${key}`,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    bio: 'Perfil verificado en Instagram Clone Mobile',
    isPrivate: false,
    isFollowing: true,
    hasPendingRequest: false,
    isVerified: true,
    followersCount: 1540000,
    followingCount: 320,
    postsCount: 24,
  };
};

export const SUGGESTIONS = [
  { user: FOOTBALL_USERS.leomessi, subtitle: 'Sugerencia popular en Fútbol' },
  { user: ANIMAL_USERS.natgeowild, subtitle: 'Sugerencia en Naturaleza & Animales' },
  { user: ANIMAL_USERS.dogs_of_instagram, subtitle: 'Seguido por 1.2M personas' },
  { user: FOOTBALL_USERS.cristiano, subtitle: 'Seguido por vinijr y 40 más' },
  { user: ANIMAL_USERS.cats_of_world, subtitle: 'Sugerencia para ti' },
  { user: FOOTBALL_USERS.kmbappe, subtitle: 'Sugerencia en Deportes' },
  { user: CREATOR_USERS.earthpix, subtitle: 'Destinos impresionantes' },
];

export const MOCK_HIGHLIGHTS: Highlight[] = [
  {
    id: 'h1',
    title: 'Champions 🏆',
    coverUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
  },
  {
    id: 'h2',
    title: 'Perros 🐶',
    coverUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80',
  },
  {
    id: 'h3',
    title: 'Mundial 🌍',
    coverUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&q=80',
  },
  {
    id: 'h4',
    title: 'Gatos 🐱',
    coverUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
  },
];

// ==========================================
// 📸 INITIAL POSTS (EXPANDED DIVERSE COLLECTION)
// ==========================================
export const INITIAL_POSTS: Post[] = [
  // --- REAL MADRID ---
  {
    id: 'post_realmadrid_1',
    userId: 'user_realmadrid',
    user: FOOTBALL_USERS.realmadrid,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    location: 'Estadio Santiago Bernabéu',
    caption: '¡CAMPEONES DEL MUNDO! 🏆✨ Levantamos la Copa Intercontinental tras una actuación legendaria. ¡HALA MADRID! 🤍 #RealMadrid #Campeones #HalaMadrid',
    likesCount: 2845000,
    commentsCount: 34100,
    isLiked: true,
    isSaved: true,
    likedBySummary: 'Les gusta a vinijr, judebellingham y 2,844,998 personas más',
    createdAt: '2 h',
    comments: [
      {
        id: 'c_rm1',
        postId: 'post_realmadrid_1',
        userId: 'user_vini',
        username: 'vinijr',
        userAvatar: FOOTBALL_USERS.vinijr.avatar,
        text: '¡HALA MADRID SIEMPRE! ⚡🤍',
        createdAt: '1 h',
        likesCount: 14200,
        isLiked: true
      },
      {
        id: 'c_rm2',
        postId: 'post_realmadrid_1',
        userId: 'user_jude',
        username: 'judebellingham',
        userAvatar: FOOTBALL_USERS.judebellingham.avatar,
        text: 'What a team effort! 🙌🤍',
        createdAt: '1 h',
        likesCount: 9800,
        isLiked: true
      }
    ],
  },

  // --- LEO MESSI ---
  {
    id: 'post_messi_1',
    userId: 'user_messi',
    user: FOOTBALL_USERS.leomessi,
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80',
    location: 'Estadio Más Monumental',
    caption: 'Una noche inolvidable con la Selección 🇦🇷 Gracias a todos por el aliento incondicional de siempre. ¡VAMOS ARGENTINA! 🩵🤍 #Messi #Argentina',
    likesCount: 8940000,
    commentsCount: 92500,
    isLiked: true,
    isSaved: true,
    likedBySummary: 'Les gusta a leomessi y 8,939,999 personas más',
    createdAt: '4 h',
    comments: [
      {
        id: 'c_m1',
        postId: 'post_messi_1',
        userId: 'user_ldiaz',
        username: 'luisdiaz19_',
        userAvatar: FOOTBALL_USERS.luisdiaz19_.avatar,
        text: 'Grande Leo! Máximo respeto siempre 🐐🇦🇷',
        createdAt: '3 h',
        likesCount: 31200,
        isLiked: true
      }
    ],
  },

  // --- CRISTIANO RONALDO ---
  {
    id: 'post_cr7_1',
    userId: 'user_cr7',
    user: FOOTBALL_USERS.cristiano,
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80',
    location: 'Al Awwal Park, Riyadh',
    caption: 'Great victory tonight! Happy to score and help the team get the 3 points. SIUUU! ⚽🔥 #AlNassr #CR7 #Ronaldo',
    likesCount: 6540000,
    commentsCount: 78400,
    isLiked: true,
    isSaved: false,
    likedBySummary: 'Les gusta a vinijr y 6,539,999 personas más',
    createdAt: '5 h',
    comments: [],
  },

  // --- DOGS OF INSTAGRAM ---
  {
    id: 'post_dogs_1',
    userId: 'user_dogs',
    user: ANIMAL_USERS.dogs_of_instagram,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80',
    location: 'Central Park, New York',
    caption: 'Meet Milo & Oliver! 🐶💛 Two Golden Retriever brothers enjoying their afternoon run in the sunshine. Tag someone who needs a smile today! ✨ #GoldenRetriever #DogsofInstagram #CutePuppies',
    likesCount: 894000,
    commentsCount: 9400,
    isLiked: true,
    isSaved: true,
    likedBySummary: 'Les gusta a natgeowild y 893,999 personas más',
    createdAt: '6 h',
    comments: [],
  },

  // --- NATGEO WILD ---
  {
    id: 'post_natgeo_1',
    userId: 'user_natgeowild',
    user: ANIMAL_USERS.natgeowild,
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1200&q=80',
    location: 'Serengeti National Park, Tanzania',
    caption: 'The King of the Savanna 🦁 Photographed during golden hour in the Serengeti. A majestic male lion stands watch over his pride as dusk approaches. #NatGeoWild #Serengeti #Lions #WildlifePhotography',
    likesCount: 1420000,
    commentsCount: 12300,
    isLiked: true,
    isSaved: true,
    likedBySummary: 'Les gusta a wildlife.planet y 1,419,999 personas más',
    createdAt: '7 h',
    comments: [],
  },

  // --- MBAPPÉ ---
  {
    id: 'post_mbappe_1',
    userId: 'user_mbappe',
    user: FOOTBALL_USERS.kmbappe,
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80',
    location: 'Estadio Santiago Bernabéu',
    caption: 'Victoire importante a la maison ⚪️👑 Premier hat-trick au Bernabéu. Hala Madrid ! #KM9 #Mbappe',
    likesCount: 4250000,
    commentsCount: 48400,
    isLiked: true,
    isSaved: true,
    likedBySummary: 'Les gusta a vinijr y 4,249,999 personas más',
    createdAt: '8 h',
    comments: [],
  },

  // --- CATS OF THE WORLD ---
  {
    id: 'post_cats_1',
    userId: 'user_cats',
    user: ANIMAL_USERS.cats_of_world,
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=80',
    location: 'Kyoto, Japan',
    caption: 'Soft green eyes staring right into your soul 🐱💚 Whiskers of pure elegance. What should we name this little prince? #CatsofInstagram #KittenLove #Meow',
    likesCount: 745000,
    commentsCount: 8200,
    isLiked: true,
    isSaved: false,
    createdAt: '9 h',
    comments: [],
  },

  // --- DAILY PANDA REEL ---
  {
    id: 'post_panda_1',
    userId: 'user_panda',
    user: ANIMAL_USERS.panda_daily,
    imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=1200&q=80',
    location: 'Chengdu Panda Base, China',
    caption: 'Current mood: Eating fresh bamboo sticks without a care in the world! 🐼🎋 Who else relates to this level of relaxation? #PandaLove #Chengdu #CuteAnimals',
    likesCount: 1280000,
    commentsCount: 14500,
    isLiked: true,
    isSaved: true,
    isReel: true,
    createdAt: '10 h',
    comments: [],
  }
];

// ==========================================
// 📖 INITIAL STORIES
// ==========================================
export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_messi',
    userId: 'user_messi',
    user: FOOTBALL_USERS.leomessi,
    hasUnseen: true,
    items: [
      {
        id: 'si_m1',
        mediaUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 30m',
        isViewed: false,
        caption: 'Entrenamiento con la Selección 🇦🇷🏆'
      }
    ]
  },
  {
    id: 'story_cr7',
    userId: 'user_cr7',
    user: FOOTBALL_USERS.cristiano,
    hasUnseen: true,
    items: [
      {
        id: 'si_cr1',
        mediaUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 1h',
        isViewed: false,
        caption: 'Recovery day! SIUUU 💪🇵🇹'
      }
    ]
  },
  {
    id: 'story_mbappe',
    userId: 'user_mbappe',
    user: FOOTBALL_USERS.kmbappe,
    hasUnseen: true,
    items: [
      {
        id: 'si_mb1',
        mediaUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 2h',
        isViewed: false,
        caption: 'Matchday ready! 👑⚽'
      }
    ]
  },
  {
    id: 'story_vini',
    userId: 'user_vini',
    user: FOOTBALL_USERS.vinijr,
    hasUnseen: true,
    items: [
      {
        id: 'si_v1',
        mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 3h',
        isViewed: false,
        caption: 'Baila Vini!⚡ Samba on the pitch'
      }
    ]
  },
  {
    id: 'story_jude',
    userId: 'user_jude',
    user: FOOTBALL_USERS.judebellingham,
    hasUnseen: true,
    items: [
      {
        id: 'si_j1',
        mediaUrl: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 4h',
        isViewed: false,
        caption: 'Great win tonight! 🤍 Madridistas'
      }
    ]
  },
  {
    id: 'story_neymar',
    userId: 'user_neymar',
    user: FOOTBALL_USERS.neymarjr,
    hasUnseen: true,
    items: [
      {
        id: 'si_n1',
        mediaUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 5h',
        isViewed: false,
        caption: 'Ousadia e alegria sempre! 🇧🇷⚡'
      }
    ]
  },
  {
    id: 'story_haaland',
    userId: 'user_haaland',
    user: FOOTBALL_USERS.erlinghaaland,
    hasUnseen: true,
    items: [
      {
        id: 'si_h1',
        mediaUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 6h',
        isViewed: false,
        caption: 'Viking mode activated 🤖⚡'
      }
    ]
  },
  {
    id: 'story_yamal',
    userId: 'user_yamal',
    user: FOOTBALL_USERS.lamineyamal,
    hasUnseen: true,
    items: [
      {
        id: 'si_y1',
        mediaUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 7h',
        isViewed: false,
        caption: '304 represent! 🔵🔴'
      }
    ]
  },
  {
    id: 'story_james',
    userId: 'user_james',
    user: FOOTBALL_USERS.jamesrodriguez10,
    hasUnseen: true,
    items: [
      {
        id: 'si_james1',
        mediaUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 8h',
        isViewed: false,
        caption: 'Focus & vision 🇨🇴⚽'
      }
    ]
  },
  {
    id: 'story_ldiaz',
    userId: 'user_ldiaz',
    user: FOOTBALL_USERS.luisdiaz19_,
    hasUnseen: true,
    items: [
      {
        id: 'si_ld1',
        mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 9h',
        isViewed: false,
        caption: 'Con la bendición de Dios 🙏⚡'
      }
    ]
  },
  {
    id: 'story_realmadrid',
    userId: 'user_realmadrid',
    user: FOOTBALL_USERS.realmadrid,
    hasUnseen: true,
    items: [
      {
        id: 'si_rm1',
        mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 10h',
        isViewed: false,
        caption: '¡Hala Madrid y nada más! 👑 Champions'
      }
    ]
  },
  {
    id: 'story_fcbarcelona',
    userId: 'user_fcbarcelona',
    user: FOOTBALL_USERS.fcbarcelona,
    hasUnseen: true,
    items: [
      {
        id: 'si_fcb1',
        mediaUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 11h',
        isViewed: false,
        caption: 'Més que un Club 🔵🔴 Spotify Camp Nou'
      }
    ]
  },
  {
    id: 'story_dogs',
    userId: 'user_dogs',
    user: ANIMAL_USERS.dogs_of_instagram,
    hasUnseen: true,
    items: [
      {
        id: 'si_d1',
        mediaUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 15m',
        isViewed: false,
        caption: 'Happy Golden Retriever morning! 🐶✨'
      }
    ]
  },
  {
    id: 'story_natgeo',
    userId: 'user_natgeowild',
    user: ANIMAL_USERS.natgeowild,
    hasUnseen: true,
    items: [
      {
        id: 'si_ng1',
        mediaUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 45m',
        isViewed: false,
        caption: 'Behind the scenes in Serengeti 🦁📷'
      }
    ]
  },
  {
    id: 'story_cats',
    userId: 'user_cats',
    user: ANIMAL_USERS.cats_of_world,
    hasUnseen: true,
    items: [
      {
        id: 'si_c1',
        mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 1h',
        isViewed: false,
        caption: 'Morning purr vibes 🐱🐾'
      }
    ]
  },
  {
    id: 'story_panda',
    userId: 'user_panda',
    user: ANIMAL_USERS.panda_daily,
    hasUnseen: true,
    items: [
      {
        id: 'si_p1',
        mediaUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 2h',
        isViewed: false,
        caption: 'Bamboo snack time 🐼🌿'
      }
    ]
  },
  {
    id: 'story_earthpix',
    userId: 'user_earthpix',
    user: CREATOR_USERS.earthpix,
    hasUnseen: true,
    items: [
      {
        id: 'si_ep1',
        mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 3h',
        isViewed: false,
        caption: 'Sunset over Swiss Alps 🏔️🌅'
      }
    ]
  },
  {
    id: 'story_tech',
    userId: 'user_tech',
    user: CREATOR_USERS.tech_setups,
    hasUnseen: true,
    items: [
      {
        id: 'si_ts1',
        mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        durationSeconds: 5,
        createdAt: 'Hace 4h',
        isViewed: false,
        caption: 'Late night coding setup 💻🌙'
      }
    ]
  }
];

// ==========================================
// 💬 INITIAL CHATS
// ==========================================
export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_messi',
    user: FOOTBALL_USERS.leomessi,
    unreadCount: 2,
    isTyping: false,
    onlineStatus: 'Activo(a) ahora',
    lastMessage: {
      id: 'm_m1',
      chatId: 'chat_messi',
      senderId: 'user_messi',
      text: '¡Muchas gracias por el apoyo de siempre hermano! 🇦🇷🏆',
      timestamp: '11:15 AM',
      status: 'delivered',
    },
  },
  {
    id: 'chat_cr7',
    user: FOOTBALL_USERS.cristiano,
    unreadCount: 0,
    isTyping: false,
    onlineStatus: 'Activo hace 10m',
    lastMessage: {
      id: 'm_cr1',
      chatId: 'chat_cr7',
      senderId: 'user_cr7',
      text: 'SIUUU! Keep pushing and hard work pays off ⚽🔥',
      timestamp: 'Ayer',
      status: 'read',
    },
  },
  {
    id: 'chat_dogs',
    user: ANIMAL_USERS.dogs_of_instagram,
    unreadCount: 1,
    isTyping: false,
    onlineStatus: 'En línea',
    lastMessage: {
      id: 'm_d1',
      chatId: 'chat_dogs',
      senderId: 'user_dogs',
      text: 'Woof! We loved your dog photo submission! 🐶💛',
      timestamp: '10:30 AM',
      status: 'delivered',
    },
  }
];

export const INITIAL_FOLLOW_REQUESTS: FollowRequest[] = [
  {
    id: 'req_1',
    requester: FOOTBALL_USERS.lamineyamal,
    createdAt: 'Hace 10 min',
    status: 'pending',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'like',
    user: FOOTBALL_USERS.leomessi,
    postImageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200&q=80',
    timeAgo: '15m',
    text: 'le gustó tu publicación.',
    isRead: false,
  },
  {
    id: 'notif_2',
    type: 'comment',
    user: FOOTBALL_USERS.cristiano,
    postImageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&q=80',
    timeAgo: '1h',
    text: 'comentó: "SIUUU! ⚽🔥"',
    isRead: false,
  }
];
