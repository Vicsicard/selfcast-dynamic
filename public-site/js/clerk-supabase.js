/**
 * Clerk-Supabase Integration Helper
 * 
 * This file provides utilities for integrating Clerk authentication with Supabase
 * by injecting the Clerk session token into Supabase requests.
 */

/**
 * Creates a Supabase client that uses the Clerk session token for authentication
 * 
 * @param {Object} clerk - The Clerk instance
 * @param {string} supabaseUrl - The Supabase project URL
 * @param {string} supabaseKey - The Supabase anon key
 * @returns {Object} - A Supabase client configured with Clerk authentication
 */
function createClerkSupabaseClient(clerk, supabaseUrl, supabaseKey) {
    // Return a Supabase client that injects the Clerk session token
    return supabase.createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${getClerkSessionToken(clerk)}`
            }
        }
    });
}

/**
 * Gets the current Clerk session token
 * 
 * @param {Object} clerk - The Clerk instance
 * @returns {string|null} - The Clerk session token or null if not authenticated
 */
function getClerkSessionToken(clerk) {
    if (!clerk || !clerk.session) {
        console.warn('No Clerk session available');
        return null;
    }
    
    try {
        // Get the session token from Clerk
        return clerk.session.getToken();
    } catch (error) {
        console.error('Error getting Clerk session token:', error);
        return null;
    }
}

/**
 * Updates the Supabase client with the current Clerk session token
 * 
 * @param {Object} supabaseClient - The Supabase client to update
 * @param {Object} clerk - The Clerk instance
 */
async function updateSupabaseAuth(supabaseClient, clerk) {
    if (!clerk || !clerk.session) {
        console.warn('No Clerk session available for Supabase auth update');
        return;
    }
    
    try {
        const token = await clerk.session.getToken();
        
        // Update the Supabase client with the new token
        supabaseClient.auth.setAuth(token);
        
        console.log('Supabase client updated with Clerk session token');
    } catch (error) {
        console.error('Error updating Supabase auth with Clerk token:', error);
    }
}

// Export the helper functions
window.ClerkSupabase = {
    createClient: createClerkSupabaseClient,
    getSessionToken: getClerkSessionToken,
    updateAuth: updateSupabaseAuth
};
