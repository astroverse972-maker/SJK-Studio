import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://weqvotbeuornqzcliezh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlcXZvdGJldW9ybnF6Y2xpZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTk5MzMsImV4cCI6MjA3Njc5NTkzM30.bPg5dgYR9eaURI1pzreRejFwCpIbeUKoPXMZfpv4GT8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
