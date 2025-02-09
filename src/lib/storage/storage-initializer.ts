import { supabase } from '../supabase';

export interface StorageStatus {
  initialized: boolean;
  buckets: {
    avatars: boolean;
    newsletterAssets: boolean;
    contentImages: boolean;
    exports: boolean;
    backups: boolean;
  };
  error?: string;
}

export async function initializeStorageSystem(): Promise<StorageStatus> {
  try {
    // Check connection first
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) throw bucketsError;

    const requiredBuckets = ['avatars', 'newsletter-assets', 'content-images', 'exports', 'backups'];
    const existingBuckets = new Set(buckets?.map(b => b.name) || []);

    // Create missing buckets
    for (const bucket of requiredBuckets) {
      if (!existingBuckets.has(bucket)) {
        const { error } = await supabase.storage.createBucket(bucket, {
          public: ['avatars', 'newsletter-assets', 'content-images'].includes(bucket),
          fileSizeLimit: bucket === 'exports' ? 10485760 : 5242880 // 10MB for exports, 5MB for others
        });
        if (error) throw error;
      }
    }

    // Verify each bucket exists and is accessible
    const bucketStatus = {
      avatars: false,
      newsletterAssets: false,
      contentImages: false,
      exports: false,
      backups: false
    };

    for (const bucket of Object.keys(bucketStatus)) {
      try {
        const { data } = await supabase.storage.from(bucket).list('', { limit: 1 });
        bucketStatus[bucket as keyof typeof bucketStatus] = data !== null;
      } catch (error) {
        console.error(`Failed to verify bucket ${bucket}:`, error);
      }
    }

    return {
      initialized: true,
      buckets: bucketStatus
    };
  } catch (error) {
    console.error('Storage initialization failed:', error);
    return {
      initialized: false,
      buckets: {
        avatars: false,
        newsletterAssets: false,
        contentImages: false,
        exports: false,
        backups: false
      },
      error: error instanceof Error ? error.message : 'Unknown error initializing storage'
    };
  }
}