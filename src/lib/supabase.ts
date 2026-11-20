/**
 * Point d'entrée rétro-compatible.
 * L'application utilise désormais `@supabase/ssr` :
 * - Client Components : `@/utils/supabase/client` (`createClient()`)
 * - Server Components / Actions / Routes : `@/utils/supabase/server` (`createClient()`)
 * - Middleware de protection des routes : `@/utils/supabase/middleware` (`updateSession()`)
 */
export { createClient } from '@/utils/supabase/client';
