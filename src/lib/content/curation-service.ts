import { supabase } from '@/lib/supabase';
import type { SourceContent } from '@/types/content';

export class CurationService {
  static async getQueuedContent(): Promise<SourceContent[]> {
    const { data, error } = await supabase
      .from('source_content')
      .select('*')
      .eq('status', 'pending')
      .order('score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateContentStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('source_content')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }

  static async updateQueueOrder(items: { id: string; position: number }[]): Promise<void> {
    const { error } = await supabase
      .from('source_content')
      .upsert(
        items.map(({ id, position }) => ({
          id,
          queue_position: position,
        }))
      );

    if (error) throw error;
  }
}