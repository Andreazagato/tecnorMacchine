-- ============================================
-- FIX: Policy RLS per Categorie
-- ============================================
-- Il problema è che la policy "FOR ALL" può avere conflitti
-- con la policy "FOR SELECT" separata.
-- Soluzione: rimuovere "FOR ALL" e creare policy specifiche.
-- ============================================

-- Rimuovi le policy esistenti per categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;

-- Ricrea con policy specifiche per ogni operazione
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update categories" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete categories" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
