import { supabase } from '../supabase';
import { 
  STORAGE_BUCKETS, 
  ALLOWED_IMAGE_TYPES,
  ALLOWED_EXPORT_TYPES,
  MAX_FILE_SIZES,
  getStoragePath 
} from './storage-config';

export class StorageService {
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > MAX_FILE_SIZES.AVATAR) {
      throw new Error('File too large. Maximum size is 2MB.');
    }

    const path = getStoragePath(STORAGE_BUCKETS.AVATARS, userId, file.name);
    const { error, data } = await supabase.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    return data?.path || null;
  }

  async uploadNewsletterAsset(
    newsletterId: string, 
    file: File
  ): Promise<string | null> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > MAX_FILE_SIZES.NEWSLETTER_ASSET) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const path = getStoragePath(
      STORAGE_BUCKETS.NEWSLETTER_ASSETS, 
      newsletterId, 
      file.name
    );
    const { error, data } = await supabase.storage
      .from(STORAGE_BUCKETS.NEWSLETTER_ASSETS)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    return data?.path || null;
  }

  async uploadContentImage(
    contentId: string, 
    file: File
  ): Promise<string | null> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > MAX_FILE_SIZES.CONTENT_IMAGE) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    const path = getStoragePath(
      STORAGE_BUCKETS.CONTENT_IMAGES, 
      contentId, 
      file.name
    );
    const { error, data } = await supabase.storage
      .from(STORAGE_BUCKETS.CONTENT_IMAGES)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    return data?.path || null;
  }

  async uploadExport(
    workspaceId: string,
    file: File,
    type: string
  ): Promise<string | null> {
    if (!ALLOWED_EXPORT_TYPES.includes(file.type)) {
      throw new Error('Invalid file type.');
    }

    if (file.size > MAX_FILE_SIZES.EXPORT) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    const timestamp = new Date().toISOString();
    const path = getStoragePath(
      STORAGE_BUCKETS.EXPORTS,
      workspaceId,
      `${type}/${timestamp}-${file.name}`
    );
    
    const { error, data } = await supabase.storage
      .from(STORAGE_BUCKETS.EXPORTS)
      .upload(path, file);

    if (error) throw error;
    return data?.path || null;
  }

  async uploadBackup(
    workspaceId: string,
    file: File
  ): Promise<string | null> {
    if (file.size > MAX_FILE_SIZES.BACKUP) {
      throw new Error('File too large. Maximum size is 50MB.');
    }

    const timestamp = new Date().toISOString();
    const path = getStoragePath(
      STORAGE_BUCKETS.BACKUPS,
      workspaceId,
      `${timestamp}-backup.json`
    );
    
    const { error, data } = await supabase.storage
      .from(STORAGE_BUCKETS.BACKUPS)
      .upload(path, file);

    if (error) throw error;
    return data?.path || null;
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
}

export const storageService = new StorageService();