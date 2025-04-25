// Supabase Configuration
const SUPABASE_CONFIG = {
    // Supabase Project URL
    url: 'https://aqicztygjpmunfljjuto.supabase.co',
    
    // Supabase Anon/Public Key
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
};

// Clerk Authentication Configuration
const CLERK_CONFIG = {
    // Clerk Publishable Key
    publishableKey: 'pk_test_Y3VyaW91cy1jYW1lbC01MC5jbGVyay5hY2NvdW50cy5kZXYk',
    
    // Clerk Frontend API
    frontendApi: 'https://curious-camel-50.clerk.accounts.dev',
    
    // Clerk Account Portal
    accountPortal: 'https://curious-camel-50.accounts.dev',
    
    // Redirect URLs
    redirects: {
        signIn: '/editor.html',
        signUp: '/editor.html',
        afterSignOut: '/login.html'
    }
};

// Application Configuration
const APP_CONFIG = {
    // Development Mode - Set to true for local development, false for production
    developmentMode: true,
    
    // Admin Emails - List of email addresses that have admin access
    adminEmails: ['admin@selfcaststudios.com', 'your-email@example.com'],
    
    // Project ID Format (for reference)
    projectIdFormat: 'lastname-firstname-YYYYMMDD-HHMM'
};

// Integration Configuration
const INTEGRATION_CONFIG = {
    // Clerk-Supabase Integration
    clerkSupabase: {
        // Enable the integration
        enabled: true,
        
        // Path to the integration helper script
        helperScript: '/js/clerk-supabase.js',
        
        // Whether to use Row Level Security
        useRLS: true,
        
        // Debug mode - logs additional information to console
        debug: true
    }
};

// Make configuration available globally
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.CLERK_CONFIG = CLERK_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.INTEGRATION_CONFIG = INTEGRATION_CONFIG;
