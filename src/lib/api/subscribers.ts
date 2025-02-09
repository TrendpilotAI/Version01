import { supabase } from '../supabase';

export async function getSubscribers(newsletterId: string) {
  try {
    if (!newsletterId) {
      throw new Error('Newsletter ID is required');
    }

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('newsletter_id', newsletterId);

    if (error) {
      console.error('Error fetching subscribers:', error);
      throw new Error('Failed to fetch subscribers');
    }

    return data || [];
  } catch (error) {
    console.error(`Error getting subscribers for newsletter ${newsletterId}:`, error);
    return []; // Return empty array instead of throwing to prevent cascading failures
  }
}

export async function addSubscriber(newsletterId: string, email: string) {
  try {
    if (!newsletterId || !email) {
      throw new Error('Newsletter ID and email are required');
    }

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('newsletter_id', newsletterId)
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      throw new Error('Subscriber already exists');
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert([{
        newsletter_id: newsletterId,
        email,
        status: 'active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding subscriber:', error);
      throw new Error('Failed to add subscriber');
    }

    return data;
  } catch (error) {
    console.error('Error in addSubscriber:', error);
    throw error;
  }
}