export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  timeout?: number;
}

export const sanitizeResponse = (data: any): any => {
  if (data === null || data === undefined) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponse(item));
  }
  
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && !(value instanceof Symbol)) {
        cleaned[key] = sanitizeResponse(value);
      }
    }
    return cleaned;
  }
  
  return data;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < options.maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 
          options.timeout || 10000)
        ),
      ]);
      return sanitizeResponse(result);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Retry attempt ${attempt + 1} failed:`, lastError.message);
      
      if (attempt < options.maxRetries - 1) {
        await delay(options.delayMs * Math.pow(2, attempt));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}