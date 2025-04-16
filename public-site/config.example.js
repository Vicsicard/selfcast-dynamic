/**
 * Supabase Configuration
 * ---------------------
 * This file contains the configuration for connecting to Supabase.
 * Create a copy of this file named 'config.js' and update the values.
 * 
 * Example values:
 * url: 'https://aqicztygjpmunfljjuto.supabase.co'
 * key: 'your-anon-key-here'
 */

// Supabase Project Settings
const SUPABASE_CONFIG = {
    // Your Supabase Project URL (required)
    url: 'YOUR_SUPABASE_URL',
    
    // Your Supabase Anon/Public Key (required)
    key: 'YOUR_SUPABASE_ANON_KEY'
};

// Make configuration available globally
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
