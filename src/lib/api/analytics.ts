import { supabase } from '../supabase';

export async function getAnalytics(newsletterId: string) {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('newsletter_id', newsletterId);

  if (error) throw error;
  return data;
}