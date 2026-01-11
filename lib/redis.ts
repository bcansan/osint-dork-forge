import { Redis } from '@upstash/redis';

// Note: Upstash Redis prefix is handled at the key level in our implementation
// or could be configured if using a wrapper. 
// We'll use a helper to ensure consistent prefixing.

export const redis = process.env.UPSTASH_REDIS_REST_URL
    ? Redis.fromEnv()
    : null;

export const DORK_PREFIX = 'dork:';

export function getDorkKey(subKey: string) {
    return `${DORK_PREFIX}${subKey}`;
}
