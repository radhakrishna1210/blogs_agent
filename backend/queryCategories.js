import { supabase } from './src/config/supabase.js';

async function query() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error querying categories:', error);
  } else {
    console.log('Categories in DB:', data);
  }
}

query();
