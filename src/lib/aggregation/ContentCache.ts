typescript
export class ContentCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private ttl: number;

  constructor(ttl = 3600000) { // 1 hour default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (this.isExpired(cached.timestamp)) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.ttl;
  }
}
```