/**
 * Generates and persists an anonymous user identifier for rate limiting
 * @returns Unique anonymous user ID (format: u_timestamp_random)
 */
const STORAGE_KEY = "mastmo_user_id";

export function getAnonymousUserId(): string {
  // Server-side rendering guard
  if (typeof window === 'undefined') {
    return 'server';
  }

  const createIdentifier = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  try {
    // Try to get existing ID
    let userId = localStorage.getItem(STORAGE_KEY);
    
    if (!userId) {
      userId = createIdentifier("u");
      localStorage.setItem(STORAGE_KEY, userId);
    }
    
    return userId;
    
  } catch {
    // localStorage blocked (incognito/privacy mode)
    try {
      // Fallback to sessionStorage
      let sessionId = sessionStorage.getItem(STORAGE_KEY);
      
      if (!sessionId) {
        sessionId = createIdentifier("s");
        sessionStorage.setItem(STORAGE_KEY, sessionId);
      }
      
      return sessionId;
      
    } catch {
      // Both storage methods failed - return session-only ID
      return createIdentifier("temp");
    }
  }
}

/**
 * Optional: Clear user ID (for testing or user request)
 */
export function clearUserId(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures to avoid breaking the UI.
  }
}
