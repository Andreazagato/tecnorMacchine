-- ============================================
-- INTRANET TECNOR MACCHINE - Dati Demo
-- ============================================
-- Esegui questo script nel SQL Editor di Supabase
-- DOPO aver creato lo schema e l'utente admin.
-- ============================================

-- ============================================
-- 1. NEWS (almeno 5 notizie realistiche)
-- ============================================

INSERT INTO public.news (title, content, date, archived, user_id) VALUES
(
  'Tecnor Macchine presente a MECSPE 2025 - Bologna',
  'Siamo lieti di annunciare la nostra partecipazione a **MECSPE 2025**, la fiera internazionale per l''industria manifatturiera che si terrà a Bologna Fiere dal 5 al 7 marzo 2025.

Presso il nostro stand potrete scoprire le ultime novità dei nostri partner:
- **Kitamura Machinery**: nuovi centri di lavoro orizzontali serie HX
- **Mitsui Seiki**: centri di lavoro a 5 assi ad altissima precisione
- **OKK**: centri di lavoro verticali e orizzontali di ultima generazione

Vi aspettiamo al **Padiglione 21, Stand C45**. Per appuntamenti contattare il vostro commerciale di riferimento o scrivere a info@tecnormacchine.com.',
  NOW() - INTERVAL '2 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Nuovo accordo di distribuzione con Axile - Taiwan',
  'Tecnor Macchine è orgogliosa di annunciare un nuovo accordo di distribuzione esclusiva per l''Italia con **Axile**, produttore taiwanese di centri di lavoro a 5 assi ad alte prestazioni.

La gamma Axile comprende:
- **Serie G8**: centro di lavoro a 5 assi con tavola roto-basculante
- **Serie G6**: soluzione compatta per lavorazioni complesse
- **Serie DM**: centri multi-tasking per produzione flessibile

Questa partnership rafforza la nostra offerta nel segmento dei 5 assi, affiancandosi ai marchi storici **Mitsui Seiki** e **Kitamura**.

Per maggiori informazioni, contattate l''ufficio commerciale della vostra zona.',
  NOW() - INTERVAL '5 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Aggiornamento orari uffici sede di Assago',
  'Si comunica che a partire dal **1° febbraio 2025**, gli orari di apertura della sede principale di **Assago (MI)** saranno i seguenti:

**Lunedì - Giovedì**: 8:30 - 17:30
**Venerdì**: 8:30 - 16:30

La pausa pranzo resta confermata dalle 12:30 alle 13:30.

Si ricorda che le sedi operative di **Pavia**, **Sovizzo (VI)** e **Porto Recanati (MC)** mantengono gli orari invariati.

Per urgenze fuori orario, contattare il numero di reperibilità aziendale.',
  NOW() - INTERVAL '8 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Formazione tecnica: nuovo ciclo di corsi Kitamura 2025',
  'Il reparto **Assistenza Tecnica** è lieto di comunicare il calendario dei nuovi corsi di formazione tecnica sui centri di lavoro **Kitamura Machinery** per il primo semestre 2025.

**Programma corsi:**
- *Febbraio*: Manutenzione preventiva serie Mycenter-HX (livello base)
- *Marzo*: Programmazione avanzata con controllo Fanuc 31i-B5 Plus
- *Aprile*: Troubleshooting e diagnostica serie Mycenter-4XD
- *Maggio*: Automazione e integrazione con sistemi FMS

I corsi si terranno presso la sede di Assago con sessioni pratiche sulle macchine in showroom.

**Iscrizioni aperte** tramite il proprio responsabile di reparto entro il 31 gennaio.',
  NOW() - INTERVAL '12 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Risultati eccezionali nel Q4 2024 - Grazie a tutto il team!',
  'Cari colleghi,

Sono lieto di condividere con voi i risultati dell''ultimo trimestre 2024 che hanno superato le aspettative:

- **Fatturato Q4**: +12% rispetto allo stesso periodo 2023
- **Nuovi clienti acquisiti**: 18 aziende nel settore aerospace e automotive
- **Tasso di soddisfazione clienti**: 96.5% (sondaggio post-vendita)
- **Installazioni completate**: 27 macchine utensili

Questi risultati sono il frutto del lavoro di squadra di tutti i reparti: commerciale, tecnico, amministrativo e logistico.

Un ringraziamento speciale al team di assistenza tecnica per il supporto post-vendita che continua a distinguerci nel mercato.

*La Direzione*',
  NOW() - INTERVAL '20 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
);

-- ============================================
-- 2. CATEGORIES (categorie documenti)
-- ============================================

INSERT INTO public.categories (name, description) VALUES
('Manuali Tecnici', 'Manuali di utilizzo e manutenzione delle macchine utensili distribuite'),
('Procedure Aziendali', 'Procedure operative standard, regolamenti interni e policy aziendali'),
('Cataloghi Prodotti', 'Cataloghi commerciali e schede tecniche dei prodotti'),
('Sicurezza e Qualità', 'Documentazione relativa alla sicurezza sul lavoro e certificazioni qualità'),
('Risorse Umane', 'Modulistica HR, regolamenti ferie, benefit aziendali');

-- ============================================
-- 3. DOCUMENTS (almeno 5 documenti demo)
-- ============================================
-- Nota: i file_path sono placeholder. I file reali
-- andrebbero caricati nel bucket 'documents' di Supabase Storage.

INSERT INTO public.documents (title, description, file_name, file_path, date, archived, category_id, user_id) VALUES
(
  'Catalogo Kitamura Machinery 2025',
  'Catalogo completo della gamma Kitamura: centri di lavoro orizzontali serie HX, verticali serie Mycenter, e soluzioni 5 assi. Include specifiche tecniche, configurazioni disponibili e accessori opzionali.',
  'catalogo_kitamura_2025.pdf',
  'cataloghi/catalogo_kitamura_2025.pdf',
  NOW() - INTERVAL '3 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Cataloghi Prodotti'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Manuale Manutenzione Preventiva - Mitsui Seiki Vertex 550',
  'Guida completa alla manutenzione preventiva del centro di lavoro a 5 assi Mitsui Seiki Vertex 550-5X. Include check-list giornaliere, settimanali e mensili, tabelle lubrificazione e procedure di calibrazione.',
  'manuale_manutenzione_vertex550.pdf',
  'manuali/manuale_manutenzione_vertex550.pdf',
  NOW() - INTERVAL '7 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Manuali Tecnici'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Procedura Gestione Richieste Assistenza Tecnica',
  'Procedura operativa standard per la gestione delle richieste di assistenza tecnica clienti. Comprende: apertura ticket, classificazione priorità, assegnazione tecnico, SLA di risposta e chiusura intervento.',
  'procedura_assistenza_tecnica_v3.pdf',
  'procedure/procedura_assistenza_tecnica_v3.pdf',
  NOW() - INTERVAL '15 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Procedure Aziendali'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'DVR - Documento Valutazione Rischi Sede Assago 2025',
  'Documento di Valutazione dei Rischi aggiornato per la sede operativa di Assago (MI). Include valutazione rischi specifici per showroom macchine utensili, magazzino ricambi e uffici.',
  'DVR_assago_2025.pdf',
  'sicurezza/DVR_assago_2025.pdf',
  NOW() - INTERVAL '10 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Sicurezza e Qualità'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Scheda Tecnica OKK HM-X5000',
  'Scheda tecnica dettagliata del centro di lavoro orizzontale OKK HM-X5000. Corse assi, velocità mandrino, capacità magazzino utensili, dimensioni e peso. Confronto con modelli concorrenti.',
  'scheda_tecnica_okk_hmx5000.pdf',
  'cataloghi/scheda_tecnica_okk_hmx5000.pdf',
  NOW() - INTERVAL '6 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Cataloghi Prodotti'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Regolamento Ferie e Permessi 2025',
  'Regolamento aggiornato per la gestione delle ferie, permessi retribuiti, ROL e congedi. Include calendario chiusure aziendali 2025, procedura di richiesta e approvazione tramite portale HR.',
  'regolamento_ferie_2025.pdf',
  'hr/regolamento_ferie_2025.pdf',
  NOW() - INTERVAL '25 days',
  false,
  (SELECT id FROM public.categories WHERE name = 'Risorse Umane'),
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
);

-- ============================================
-- 4. POSTS - Bacheca (almeno 5 post demo)
-- ============================================
-- I post vengono inseriti come "approved" per essere visibili

INSERT INTO public.posts (content, is_anonymous, status, date, archived, user_id) VALUES
(
  'Volevo ringraziare il team di assistenza tecnica per il supporto eccezionale durante l''installazione della Kitamura HX-500 presso il cliente Aerospace Components di Torino. Tre giorni di lavoro intenso ma il risultato è stato perfetto! Il cliente è entusiasta. 💪',
  false,
  'approved',
  NOW() - INTERVAL '1 day',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Qualcuno sa se è già disponibile il nuovo listino ricambi Takisawa aggiornato al 2025? Ho un cliente che ha urgenza di ordinare alcuni componenti per la sua TT-2600G. Grazie in anticipo!',
  false,
  'approved',
  NOW() - INTERVAL '3 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Suggerimento: sarebbe utile organizzare un pranzo di team building tra i vari uffici. Lavoriamo tra Assago, Pavia, Sovizzo e Porto Recanati ma ci vediamo raramente tutti insieme. Potrebbe essere un''ottima occasione per rafforzare lo spirito di squadra!',
  true,
  'approved',
  NOW() - INTERVAL '5 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Ricordo a tutti che venerdì 14 febbraio la sede di Assago chiuderà alle 15:00 per lavori di manutenzione all''impianto di climatizzazione. Chi avesse necessità di accedere dopo tale orario è pregato di contattare l''ufficio servizi generali.',
  false,
  'approved',
  NOW() - INTERVAL '4 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Ho appena completato il corso di formazione sul nuovo controllo Fanuc 31i-B5 Plus. Molto interessante le nuove funzionalità di intelligenza artificiale per l''ottimizzazione dei parametri di taglio. Consiglio a tutti i tecnici di partecipare alla prossima sessione!',
  false,
  'approved',
  NOW() - INTERVAL '7 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
),
(
  'Cercasi volontari per la squadra di calcetto aziendale! Giochiamo ogni mercoledì sera alle 20:00 al centro sportivo di Assago. Tutti i livelli sono benvenuti. Scrivetemi in privato se interessati! ⚽',
  true,
  'approved',
  NOW() - INTERVAL '10 days',
  false,
  (SELECT id FROM public.profiles WHERE username = 'massimo.ricciardi')
);

-- ============================================
-- 5. VIDEOS - Formazione (almeno 5 video demo)
-- ============================================
-- Nota: i file_path sono placeholder. I file reali
-- andrebbero caricati nel bucket 'videos' di Supabase Storage.

INSERT INTO public.videos (title, subtitle, description, file_name, file_path, created_at) VALUES
(
  'Introduzione alla Sicurezza in Showroom',
  'Modulo 1 - Formazione Obbligatoria',
  'Video formativo sulla sicurezza nell''ambiente dello showroom macchine utensili. Tratta i rischi specifici legati alla movimentazione macchine pesanti, l''uso dei DPI obbligatori, le procedure di emergenza e l''evacuazione. Formazione obbligatoria per tutti i nuovi dipendenti.',
  'sicurezza_showroom_mod1.mp4',
  'formazione/sicurezza_showroom_mod1.mp4',
  NOW() - INTERVAL '30 days'
),
(
  'Centro di Lavoro Kitamura Mycenter-HX500G - Overview',
  'Conoscere la macchina',
  'Presentazione completa del centro di lavoro orizzontale Kitamura Mycenter-HX500G. Panoramica delle caratteristiche principali: struttura a doppia colonna, mandrino 15.000 rpm, magazzino utensili 60 posti, sistema di palettizzazione. Ideale per i nuovi tecnici commerciali.',
  'kitamura_hx500g_overview.mp4',
  'formazione/kitamura_hx500g_overview.mp4',
  NOW() - INTERVAL '25 days'
),
(
  'Mitsui Seiki Vertex 550 - Lavorazione 5 Assi Simultanei',
  'Applicazioni avanzate',
  'Dimostrazione pratica di lavorazione a 5 assi simultanei sul centro Mitsui Seiki Vertex 550-5X. Viene mostrato il setup pezzo, la programmazione CAM, l''esecuzione del ciclo di lavoro e il controllo qualità finale su un componente aerospace in titanio Ti-6Al-4V.',
  'mitsui_vertex550_5assi_demo.mp4',
  'formazione/mitsui_vertex550_5assi_demo.mp4',
  NOW() - INTERVAL '20 days'
),
(
  'Procedura di Manutenzione Preventiva Giornaliera',
  'Best practices per tecnici',
  'Guida passo-passo alla manutenzione preventiva giornaliera delle macchine utensili. Controllo livelli lubrificante, pulizia filtri, verifica pressioni, ispezione visiva guide e viti a ricircolo di sfere. Applicabile a tutti i centri di lavoro del nostro portfolio.',
  'manutenzione_preventiva_giornaliera.mp4',
  'formazione/manutenzione_preventiva_giornaliera.mp4',
  NOW() - INTERVAL '15 days'
),
(
  'CRM Aziendale - Guida per il Team Commerciale',
  'Strumenti digitali',
  'Tutorial completo sull''utilizzo del CRM aziendale per il team commerciale. Creazione anagrafica cliente, gestione opportunità, pipeline di vendita, generazione preventivi e reportistica. Include le best practices per il follow-up clienti e la gestione delle trattative.',
  'tutorial_crm_commerciale.mp4',
  'formazione/tutorial_crm_commerciale.mp4',
  NOW() - INTERVAL '10 days'
),
(
  'Quaser MV184 - Setup e Primo Avvio',
  'Guida installazione',
  'Video formativo sul setup completo e primo avvio del centro di lavoro verticale Quaser MV184. Dall''ancoraggio alla fondazione, al collegamento elettrico e pneumatico, fino alla calibrazione assi e test di precisione geometrica. Destinato ai tecnici di installazione.',
  'quaser_mv184_setup.mp4',
  'formazione/quaser_mv184_setup.mp4',
  NOW() - INTERVAL '5 days'
);

-- ============================================
-- VERIFICA INSERIMENTO
-- ============================================
SELECT 'News inserite: ' || COUNT(*) FROM public.news;
SELECT 'Categorie inserite: ' || COUNT(*) FROM public.categories;
SELECT 'Documenti inseriti: ' || COUNT(*) FROM public.documents;
SELECT 'Post bacheca inseriti: ' || COUNT(*) FROM public.posts;
SELECT 'Video inseriti: ' || COUNT(*) FROM public.videos;
