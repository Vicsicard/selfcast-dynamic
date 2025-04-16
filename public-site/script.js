// Initialize Supabase client
const supabase = window.supabase.createClient(
    'https://aqicztygjpmunfljjuto.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
);

// Get project ID from URL parameter or subdomain
function getProjectId() {
    // First try to get from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
        console.log('Using project ID from URL:', projectId);
        return projectId;
    }
    
    // Fallback to subdomain
    const subdomain = window.location.hostname.split('.')[0];
    const defaultId = 'annie-sicard-123';
    console.log('Using default project ID:', defaultId);
    return subdomain === 'localhost' ? defaultId : subdomain;
}

// Load Google Fonts
function loadFonts(headingFont, bodyFont) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}&family=${bodyFont.replace(' ', '+')}&display=swap`;
    document.head.appendChild(link);
}

// Inject dynamic theme styles
function injectStyles(styles) {
    const style = document.getElementById('dynamic-theme');
    if (!style) return;

    const css = `
        :root {
            --primary-color: ${styles.primary_color};
            --secondary-color: ${styles.secondary_color};
            --accent-color: ${styles.accent_color};
            --text-color: ${styles.text_color};
            --background-color: ${styles.background_color};
            --heading-font: '${styles.heading_font}', sans-serif;
            --body-font: '${styles.body_font}', sans-serif;
        }

        body {
            background-color: var(--background-color);
            color: var(--text-color);
            font-family: var(--body-font);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--heading-font);
            color: var(--primary-color);
        }

        .hero {
            background-color: var(--primary-color);
            color: var(--background-color);
            padding: 4rem 2rem;
            text-align: center;
        }

        .hero h1 {
            color: var(--background-color);
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .hero p {
            font-size: 1.5rem;
            opacity: 0.9;
        }

        .bio {
            max-width: 800px;
            margin: 4rem auto;
            padding: 0 2rem;
            line-height: 1.6;
        }

        .blog-grid .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
        }

        .blog-grid .grid > div {
            background: var(--background-color);
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid var(--accent-color);
        }

        .social-grid .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 2rem;
        }

        .social-item {
            background: var(--background-color);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 1px solid var(--secondary-color);
        }

        .social-item a {
            color: var(--primary-color);
            text-decoration: none;
        }

        .social-posts .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .social-post {
            background: var(--background-color);
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .social-post h3 {
            color: var(--accent-color);
            margin-bottom: 1rem;
        }

        .social-link {
            display: inline-block;
            margin-top: 1rem;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: bold;
        }

        .social-link:hover {
            text-decoration: underline;
        }

        .connect {
            background-color: var(--secondary-color);
            padding: 4rem 2rem;
            text-align: center;
        }

        .connect h2 {
            color: var(--background-color);
            margin-bottom: 2rem;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            flex-wrap: wrap;
            max-width: 800px;
            margin: 0 auto;
        }

        .social-button {
            display: inline-block;
            padding: 1rem 2rem;
            background-color: var(--background-color);
            color: var(--primary-color);
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .social-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        footer {
            background-color: var(--primary-color);
            color: var(--background-color);
            padding: 2rem;
            text-align: center;
            margin-top: 0;
        }

        section {
            margin: 4rem 0;
        }

        section h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--secondary-color);
        }

        @media (max-width: 768px) {
            .social-posts .grid {
                grid-template-columns: 1fr;
            }

            .social-links {
                flex-direction: column;
                align-items: center;
            }

            .social-button {
                width: 80%;
                max-width: 300px;
            }
        }
    `;

    style.textContent = css;
}

// Main function to inject dynamic content
async function injectDynamicContent() {
    const projectId = getProjectId();
    console.log('Loading content for project:', projectId);
    
    try {
        // Fetch all content for this project from Supabase
        const { data, error } = await supabase
            .from('dynamic_content')
            .select('key, value')
            .eq('project_id', projectId);

        if (error) throw error;

        console.log('Fetched data:', data);
        
        // Convert data array to object for easier access
        const styles = {};
        data.forEach(item => {
            styles[item.key] = item.value;
        });

        // Load fonts first
        if (styles.heading_font && styles.body_font) {
            loadFonts(styles.heading_font, styles.body_font);
        }

        // Inject styles
        injectStyles(styles);

        // Process each content item
        data.forEach(item => {
            // Find and update elements with matching data-key
            const elements = document.querySelectorAll(`[data-key="${item.key}"]`);
            console.log(`Updating elements with key ${item.key}:`, elements.length);
            
            elements.forEach(element => {
                if (element.tagName === 'A') {
                    element.href = item.value;
                } else {
                    element.innerHTML = item.value;
                }
            });
        });

    } catch (error) {
        console.error('Error fetching dynamic content:', error);
        // Display error on page
        const status = document.createElement('div');
        status.style.cssText = 'position:fixed;bottom:10px;right:10px;background:red;color:white;padding:10px;';
        status.textContent = `Error: ${error.message}`;
        document.body.appendChild(status);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', injectDynamicContent);
