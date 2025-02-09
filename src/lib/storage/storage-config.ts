import { supabase } from '../supabase';

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  NEWSLETTER_ASSETS: 'newsletter-assets',
  CONTENT_IMAGES: 'content-images',
  EXPORTS: 'exports',
  BACKUPS: 'backups'
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const ALLOWED_EXPORT_TYPES = [
  'text/csv',
  'application/json',
  'application/pdf'
];

export const MAX_FILE_SIZES = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  NEWSLETTER_ASSET: 5 * 1024 * 1024, // 5MB
  CONTENT_IMAGE: 5 * 1024 * 1024, // 5MB
  EXPORT: 10 * 1024 * 1024, // 10MB
  BACKUP: 50 * 1024 * 1024 // 50MB
};

export async function initializeStorage() {
  try {
    // Create buckets if they don't exist
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      const { data: existingBucket } = await supabase
        .storage
        .getBucket(bucket);

      if (!existingBucket) {
        const { error } = await supabase
          .storage
          .createBucket(bucket, {
            public: bucket === STORAGE_BUCKETS.AVATARS || 
                   bucket === STORAGE_BUCKETS.NEWSLETTER_ASSETS ||
                   bucket === STORAGE_BUCKETS.CONTENT_IMAGES
          });

        if (error) throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize storage:', error);
    return false;
  }
}

export function getStoragePath(
  bucket: typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS],
  id: string,
  fileName: string
): string {
  return `${id}/${fileName}`;
}