import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snkewhhbvnziilriwftd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNua2V3aGhidm56aWlscml3ZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDYxNTYsImV4cCI6MjA2NjE4MjE1Nn0.RGmYxidRjTDZIF1mHefCmcMxHXfkN-MC6PMq2G91t-4';

export const supabase = createClient(supabaseUrl, supabaseKey);
