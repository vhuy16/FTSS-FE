import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmtfersaqiheeutlttpz.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdGZlcnNhcWloZWV1dGx0dHB6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTg5NTYxMCwiZXhwIjoyMDUxNDcxNjEwfQ.3Q4H26PP-HLlX1VbIoxg2yXqMNS_ITs1cRDjbQxQum0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
