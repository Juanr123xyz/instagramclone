-- ============================================================================
-- 📊 SUPABASE POSTGRESQL SCHEMA FOR INSTAGRAM CLONE (Evaluación Parcial V2)
-- ============================================================================
-- Incluye tablas con tipos de datos, índices de alto rendimiento, políticas
-- de seguridad Row Level Security (RLS) para cuentas privadas/públicas,
-- publicaciones, comentarios, likes, historias efímeras, solicitudes de seguimiento
-- y canales de comunicación en tiempo real Supabase Realtime.
-- ============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA DE USUARIOS (Users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT NOT NULL,
  bio TEXT DEFAULT '',
  website TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TABLA DE PUBLICACIONES (Posts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  location VARCHAR(150),
  caption TEXT DEFAULT '',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_reel BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TABLA DE LIKES (Posts Likes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ----------------------------------------------------------------------------
-- 4. TABLA DE COMENTARIOS ANIDADOS (Comments)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Comentarios anidados
  text TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. TABLA DE HISTORIAS EFÍMERAS 24H (Stories)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  duration_seconds INT DEFAULT 5,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- ----------------------------------------------------------------------------
-- 6. TABLA DE SOLICITUDES DE SEGUIMIENTO (Follow Requests & Relationships)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follow_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, target_id)
);

-- ----------------------------------------------------------------------------
-- 7. TABLA DE CHATS Y MENSAJERÍA DIRECTA (DMs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(20) CHECK (status IN ('sending', 'sent', 'delivered', 'read')) DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 🛡️ POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Regla 1: Perfiles públicos son visibles por todos. Perfiles privados requieren estar aprobados.
CREATE POLICY "Public profiles are readable by all" ON public.users FOR SELECT USING (true);

-- Regla 2: Publicaciones de perfiles públicos son visibles. Si es privado, requiere relación aprobada.
CREATE POLICY "Public posts visible to everyone" ON public.posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = posts.user_id AND (u.is_private = FALSE OR u.id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.follow_requests fr
    WHERE fr.requester_id = auth.uid() AND fr.target_id = posts.user_id AND fr.status = 'approved'
  )
);

-- ----------------------------------------------------------------------------
-- ⚡ INDICES DE RENDIMIENTO (Optimización 60 FPS)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON public.comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON public.messages(chat_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON public.stories(expires_at DESC);

-- ----------------------------------------------------------------------------
-- 📡 HABILITAR SUPABASE REALTIME
-- ----------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.follow_requests;

-- ----------------------------------------------------------------------------
-- 📦 DATOS INICIALES (MOCK SEEDING MASIVO DE PRUEBA)
-- ----------------------------------------------------------------------------

-- Insertar Cuentas de Fútbol, Animales, Creadores y Usuario Actual
INSERT INTO public.users (id, username, name, avatar_url, bio, is_private, is_verified, followers_count, following_count, posts_count) VALUES
('11111111-1111-1111-1111-111111111111', 'juan_ramirez.12_', 'Juan Esteban', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', '⚽ Football & Nature Enthusiast | 📍 Medellín / Madrid', false, false, 3420, 512, 42),
('22222222-2222-2222-2222-222222222222', 'leomessi', 'Leo Messi', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80', 'Official Instagram of Leo Messi 🇦🇷 🏆 8x Ballon d''Or', false, true, 504000000, 310, 1120),
('33333333-3333-3333-3333-333333333333', 'cristiano', 'Cristiano Ronaldo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'SIUUU! 🇵🇹 🏆 5x Ballon d''Or Champion | Al Nassr', false, true, 642000000, 570, 3720),
('44444444-4444-4444-4444-444444444444', 'natgeowild', 'National Geographic Wild', 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&q=80', 'Inspiring people to care about the planet 🦁🌿', false, true, 48900000, 140, 8900),
('55555555-5555-5555-5555-555555555555', 'dogs.of.instagram', 'Dogs of Instagram 🐶', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80', 'The world''s best dog photos and videos! 🐕✨', false, true, 15400000, 820, 6400),
('66666666-6666-6666-6666-666666666666', 'cats.of.world', 'Cats of the World 🐱', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80', 'Purr-fect moments from cats around the globe 🐾', false, true, 9800000, 350, 4200),
('77777777-7777-7777-7777-777777777777', 'realmadrid', 'Real Madrid C.F.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', 'Página oficial del Real Madrid C.F. 🏆 15 UEFA Champions League', false, true, 165000000, 65, 12400)
ON CONFLICT (username) DO NOTHING;

-- Insertar Publicaciones de Ejemplo
INSERT INTO public.posts (id, user_id, image_url, location, caption, likes_count, comments_count, is_reel) VALUES
('a1111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80', 'Estadio Santiago Bernabéu', '¡CAMPEONES DEL MUNDO! 🏆✨ Levantamos la Copa Intercontinental. ¡HALA MADRID! 🤍', 2845000, 34100, false),
('b2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80', 'Central Park, NY', 'Meet Milo & Oliver! 🐶💛 Two Golden Retriever brothers running in the sunshine!', 894000, 9400, false),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80', 'Estadio Más Monumental', 'Una noche inolvidable con la Selección 🇦🇷 ¡VAMOS ARGENTINA! 🩵🤍', 8940000, 92500, false),
('d4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1200&q=80', 'Serengeti, Tanzania', 'The King of the Savanna 🦁 Photographed during golden hour in the Serengeti.', 1420000, 12300, false)
ON CONFLICT DO NOTHING;
