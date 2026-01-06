/**
 * Generates and persists an anonymous user identifier for rate limiting
 * @returns Unique anonymous user ID (format: u_timestamp_random)
 */
export function getAnonymousUserId(): string {
  // Server-side rendering guard
  if (typeof window === 'undefined') {
    return 'server';
  }
  
  const STORAGE_KEY = 'mastmo_user_id';
  
  try {
    // Try to get existing ID
    let userId = localStorage.getItem(STORAGE_KEY);
    
    if (!userId) {
      // Generate new ID: u_1704567890_a3x9k2m
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 11);
      userId = `u_${timestamp}_${random}`;
      
      // Store for persistence
      localStorage.setItem(STORAGE_KEY, userId);
      console.log('🆔 New user ID created:', userId);
    }
    
    return userId;
    
  } catch (error) {
    // localStorage blocked (incognito/privacy mode)
    console.warn('⚠️ localStorage unavailable, using session ID');
    
    try {
      // Fallback to sessionStorage
      let sessionId = sessionStorage.getItem(STORAGE_KEY);
      
      if (!sessionId) {
        sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem(STORAGE_KEY, sessionId);
      }
      
      return sessionId;
      
    } catch {
      // Both storage methods failed - return session-only ID
      return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
  }
}

/**
 * Optional: Clear user ID (for testing or user request)
 */
export function clearUserId(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('mastmo_user_id');
    sessionStorage.removeItem('mastmo_user_id');
    console.log('✅ User ID cleared');
  } catch (error) {
    console.warn('⚠️ Could not clear user ID:', error);
  }
}
