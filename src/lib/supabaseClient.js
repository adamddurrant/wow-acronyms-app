import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://qxwgyherjhkhqspmawgw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d2d5aGVyamhraHFzcG1hd2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM0NTgwMjUsImV4cCI6MjAxOTAzNDAyNX0.o6ZTZCNpxCJLLDiihnGmmPVpUZgiZWjae5Duq9--Eho')