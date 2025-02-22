import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wudztumjhzxohfzaidyc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHp0dW1qaHp4b2hmemFpZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDc3MzgsImV4cCI6MjA1NTcyMzczOH0.yxL7We8G5Lq4_fWZGeK7MHYaa6ymhxYaTauCXN0Bzc0'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey)