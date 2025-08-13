import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bkllwduebdogriwjynrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbGx3ZHVlYmRvZ3Jpd2p5bnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjgwNjEsImV4cCI6MjA3MDYwNDA2MX0.4hliZs-cme9b4gdPsZHNPageWGr26WXwSQUfjL3uLU0'

export const supabase = createClient(supabaseUrl, supabaseKey)
