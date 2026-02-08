-- ============================================
-- INTRANET TECNOR MACCHINE - Schema Supabase
-- ============================================
-- Esegui questo script nel SQL Editor di Supabase
-- per creare tutte le tabelle necessarie.
-- ============================================

-- 1. PROFILES (estende auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reset_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NEWS
CREATE TABLE public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. CATEGORIES
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCUMENTS
CREATE TABLE public.documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 5. POSTS (Bacheca)
CREATE TABLE public.posts (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  date TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 6. VIDEOS
CREATE TABLE public.videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER_PROGRESS (tracciamento video)
CREATE TABLE public.user_progress (
  id BIGSERIAL PRIMARY KEY,
  percentage INTEGER DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  video_id BIGINT REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, video_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- NEWS policies
CREATE POLICY "Approved users can view non-archived news" ON public.news
  FOR SELECT USING (archived = false);

CREATE POLICY "Admin can view all news" ON public.news
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can insert news" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update news" ON public.news
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete news" ON public.news
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CATEGORIES policies
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- DOCUMENTS policies
CREATE POLICY "Users can view non-archived documents" ON public.documents
  FOR SELECT USING (archived = false);

CREATE POLICY "Admin can view all documents" ON public.documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can manage documents" ON public.documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- POSTS policies
CREATE POLICY "Users can view approved posts" ON public.posts
  FOR SELECT USING (status = 'approved' AND archived = false);

CREATE POLICY "Users can view own posts" ON public.posts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all posts" ON public.posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can insert posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can update posts" ON public.posts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete posts" ON public.posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- VIDEOS policies
CREATE POLICY "Authenticated users can view videos" ON public.videos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage videos" ON public.videos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- USER_PROGRESS policies
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all progress" ON public.user_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Crea i bucket per documenti e video dal pannello Supabase Storage
-- oppure esegui:

INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Storage policies
CREATE POLICY "Anyone can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Admin can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Admin can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGER: Auto-crea profilo alla registrazione
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, first_name, last_name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'employee') = 'admin' THEN 'approved'
      ELSE 'pending'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Statistiche admin dashboard
-- ============================================
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'usersApproved', (SELECT COUNT(*) FROM public.profiles WHERE status = 'approved'),
    'usersPending', (SELECT COUNT(*) FROM public.profiles WHERE status = 'pending'),
    'usersResetReq', (SELECT COUNT(*) FROM public.profiles WHERE reset_requested = true),
    'postsActive', (SELECT COUNT(*) FROM public.posts WHERE status = 'approved' AND archived = false),
    'postsPending', (SELECT COUNT(*) FROM public.posts WHERE status = 'pending'),
    'documentsTotal', (SELECT COUNT(*) FROM public.documents WHERE archived = false),
    'videosTotal', (SELECT COUNT(*) FROM public.videos)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
