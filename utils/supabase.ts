import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// تصدير نسخة واحدة من العميل لاستخدامها في التطبيق
export const supabase = createClient(supabaseUrl, supabaseAnonKey);