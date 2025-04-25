/**
 * Clerk Custom Loader
 * 
 * This script provides a reliable way to load the Clerk SDK
 * with multiple fallback options and error handling.
 */

(function() {
    // Configuration
    const config = {
        // Primary CDN URL
        primaryUrl: 'https://js.clerk.dev/v4/clerk.js',
        
        // Fallback CDN URLs
        fallbacks: [
            'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js',
            'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js',
            'https://cdnjs.cloudflare.com/ajax/libs/clerk-js/4.56.1/clerk.browser.min.js'
        ],
        
        // Timeout in milliseconds before trying fallback
        timeout: 5000,
        
        // Maximum retries
        maxRetries: 3,
        
        // Debug mode
        debug: true
    };
    
    // State
    let currentRetry = 0;
    let loadingPromise = null;
    let clerkInstance = null;
    
    /**
     * Log messages to console if debug mode is enabled
     */
    function log(message, isError = false) {
        if (config.debug) {
            if (isError) {
                console.error(`[Clerk Loader] ${message}`);
            } else {
                console.log(`[Clerk Loader] ${message}`);
            }
        }
    }
    
    /**
     * Load Clerk from a specific URL
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            log(`Loading Clerk from: ${url}`);
            
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            // Set timeout to detect slow loading
            const timeoutId = setTimeout(() => {
                log(`Loading timed out for: ${url}`, true);
                reject(new Error(`Loading timed out for: ${url}`));
            }, config.timeout);
            
            script.onload = () => {
                clearTimeout(timeoutId);
                log(`Successfully loaded script from: ${url}`);
                resolve();
            };
            
            script.onerror = (error) => {
                clearTimeout(timeoutId);
                log(`Error loading script from: ${url}`, true);
                reject(error);
            };
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * Try to load Clerk with fallbacks
     */
    function loadClerkWithFallbacks() {
        if (loadingPromise) {
            return loadingPromise;
        }
        
        loadingPromise = new Promise(async (resolve, reject) => {
            // Try primary URL first
            try {
                await loadScript(config.primaryUrl);
                if (window.Clerk) {
                    log('Clerk loaded successfully from primary URL');
                    resolve(window.Clerk);
                    return;
                } else {
                    log('Script loaded but Clerk is not defined', true);
                }
            } catch (error) {
                log(`Failed to load from primary URL: ${error.message}`, true);
            }
            
            // Try fallbacks
            for (let i = 0; i < config.fallbacks.length; i++) {
                try {
                    await loadScript(config.fallbacks[i]);
                    if (window.Clerk) {
                        log(`Clerk loaded successfully from fallback URL: ${config.fallbacks[i]}`);
                        resolve(window.Clerk);
                        return;
                    } else {
                        log('Script loaded but Clerk is not defined', true);
                    }
                } catch (error) {
                    log(`Failed to load from fallback URL ${i + 1}: ${error.message}`, true);
                }
            }
            
            // All attempts failed
            reject(new Error('Failed to load Clerk from all sources'));
        });
        
        return loadingPromise;
    }
    
    /**
     * Initialize Clerk with the provided key
     */
    async function initializeClerk(publishableKey) {
        if (clerkInstance) {
            return clerkInstance;
        }
        
        try {
            // Load Clerk if not already loaded
            const Clerk = await loadClerkWithFallbacks();
            
            // Initialize Clerk
            log(`Initializing Clerk with key: ${publishableKey.substring(0, 10)}...`);
            clerkInstance = await Clerk(publishableKey);
            
            log('Clerk initialized successfully');
            return clerkInstance;
        } catch (error) {
            log(`Failed to initialize Clerk: ${error.message}`, true);
            throw error;
        }
    }
    
    /**
     * Alternative initialization method using a different approach
     */
    async function initializeClerkAlternative(publishableKey) {
        return new Promise((resolve, reject) => {
            // Create a script element
            const script = document.createElement('script');
            script.src = 'https://js.clerk.dev/v4/clerk.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            
            // Add a global callback function
            window.__clerkCallback = function() {
                try {
                    if (window.Clerk) {
                        window.Clerk(publishableKey)
                            .then(clerk => {
                                log('Clerk initialized successfully via alternative method');
                                resolve(clerk);
                            })
                            .catch(error => {
                                log(`Clerk initialization error: ${error.message}`, true);
                                reject(error);
                            });
                    } else {
                        reject(new Error('Clerk not available after script load'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            // Set up load and error handlers
            script.onload = function() {
                log('Clerk script loaded, calling callback');
                window.__clerkCallback();
            };
            
            script.onerror = function(error) {
                log(`Error loading Clerk script: ${error}`, true);
                reject(new Error('Failed to load Clerk script'));
            };
            
            // Add the script to the document
            document.head.appendChild(script);
        });
    }
    
    /**
     * Reset the loader state
     */
    function reset() {
        loadingPromise = null;
        clerkInstance = null;
        currentRetry = 0;
    }
    
    // Export the API
    window.ClerkLoader = {
        load: loadClerkWithFallbacks,
        initialize: initializeClerk,
        initializeAlternative: initializeClerkAlternative,
        reset: reset
    };
})();
