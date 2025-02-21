import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smvodimhjegutuotvakm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdm9kaW1oamVndXR1b3R2YWttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDExOTc3MCwiZXhwIjoyMDU1Njk1NzcwfQ.XHrKUxTbHC4PJQPz3fE9NDl1B47kDCmpM2PF8CcGlXU'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey)