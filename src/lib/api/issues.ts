import { supabase } from '../supabase';
import type { NewsletterIssue } from '@/types/newsletter';

export async function getNewsletterIssues(newsletterId: string) {
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('*')
    .eq('newsletter_id', newsletterId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createNewsletterIssue(issue: Partial<NewsletterIssue>) {
  const { data, error } = await supabase
    .from('newsletter_issues')
    .insert([issue])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNewsletterIssue(id: string, updates: Partial<NewsletterIssue>) {
  const { data, error } = await supabase
    .from('newsletter_issues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNewsletterIssue(id: string) {
  const { error } = await supabase
    .from('newsletter_issues')
    .delete()
    .eq('id', id);

  if (error) throw error;
}