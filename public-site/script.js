// Initialize Supabase client
const supabase = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.key
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
    return defaultId; // Always use default for now
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

// Modal functions
function openModal(key) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Find the content for this key
    let content = '';
    let title = '';
    
    // For blog posts
    if (key.startsWith('blog-')) {
        const blogKey = `blog_${key.split('-')[1]}`;
        const blogData = testData.find(item => item.key === blogKey);
        if (blogData) {
            title = `Blog Post ${key.split('-')[1]}`;
            content = blogData.value;
        }
    }
    // For social media
    else {
        const socialData = testData.find(item => item.key === `${key}_post`);
        if (socialData) {
            // Capitalize platform name and add "Update"
            title = `${key.charAt(0).toUpperCase() + key.slice(1)} Update`;
            content = socialData.value;
        }
    }
    
    // Update modal content
    modalTitle.textContent = title;
    modalContent.textContent = content;
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listener to close on outside click
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Test data for development
const testData = [
    // Blog posts
    { key: 'blog_1', value: 'This is the first blog post. It contains a detailed description of our latest project launch. We worked with multiple teams across different time zones to deliver this amazing feature that our users have been requesting for months.' },
    { key: 'blog_2', value: 'Second blog post about our team culture and how we maintain high productivity while working remotely. Communication and trust are key factors in our success.' },
    { key: 'blog_3', value: 'Technical deep dive into our new architecture. We migrated from a monolithic application to a microservices architecture using the latest cloud technologies.' },
    { key: 'blog_4', value: 'Community spotlight: Meet our amazing users and see how they are using our platform to solve real-world problems in innovative ways.' },
    
    // Social media posts
    { key: 'facebook_post', value: 'Excited to announce our latest feature release! Check out our blog for more details about how this will improve your workflow.' },
    { key: 'twitter_post', value: '🚀 Big news! We just launched a game-changing feature that will revolutionize how you work. Read the full story on our blog!' },
    { key: 'instagram_post', value: 'Behind the scenes look at our team working hard to bring you the best possible experience. Swipe up to learn more about our culture.' },
    { key: 'linkedin_post', value: 'We are proud to announce a major milestone in our journey. Our platform now serves over 10,000 happy customers worldwide.' }
];

// Main function to inject dynamic content
async function injectDynamicContent() {
    const projectId = getProjectId();
    console.log('Loading content for project:', projectId);
    
    try {
        console.log('Making Supabase query...');
        // For testing, use test data
        const data = testData;
        console.log('Raw Supabase data:', JSON.stringify(data, null, 2));
        
        // Convert data array to object for easier access
        const contentMap = {};
        data.forEach(item => {
            contentMap[item.key] = item.value;
            console.log(`Content for ${item.key}:`, item.value);
        });

        // First apply styles if they exist
        if (contentMap.heading_font && contentMap.body_font) {
            loadFonts(contentMap.heading_font, contentMap.body_font);
        }

        const styles = {
            primary_color: contentMap.primary_color,
            secondary_color: contentMap.secondary_color,
            accent_color: contentMap.accent_color,
            text_color: contentMap.text_color,
            background_color: contentMap.background_color,
            heading_font: contentMap.heading_font,
            body_font: contentMap.body_font
        };
        injectStyles(styles);

        // Update all elements with matching data-keys
        Object.keys(contentMap).forEach(key => {
            const value = contentMap[key];
            const elements = document.querySelectorAll(`[data-key="${key}"]`);
            console.log(`Found ${elements.length} elements for key "${key}"`);
            
            elements.forEach(element => {
                console.log(`Updating element:`, element);
                if (element.tagName === 'A') {
                    element.href = value;
                } else {
                    element.innerHTML = value;
                }
            });

            // Also check for excerpt version of the key
            if (key.includes('_post')) {
                // Handle social media posts
                const excerptKey = key.replace('_post', '_excerpt');
                const excerptElements = document.querySelectorAll(`[data-key="${excerptKey}"]`);
                
                excerptElements.forEach(element => {
                    const excerpt = value.length > 150 ? value.substring(0, 150) + '...' : value;
                    element.innerHTML = excerpt;
                });
            } else if (key.match(/^blog_\d+$/)) {
                // Handle blog posts
                const excerptKey = `${key}_excerpt`;
                const excerptElements = document.querySelectorAll(`[data-key="${excerptKey}"]`);
                console.log(`Looking for blog excerpt elements with key: ${excerptKey}`);
                
                excerptElements.forEach(element => {
                    console.log(`Creating blog excerpt for ${key} -> ${excerptKey}`);
                    const excerpt = value.length > 150 ? value.substring(0, 150) + '...' : value;
                    element.innerHTML = excerpt;
                });
            }
        });

    } catch (error) {
        console.error('Error fetching dynamic content:', error);
        const status = document.createElement('div');
        status.style.cssText = 'position:fixed;bottom:10px;right:10px;background:red;color:white;padding:10px;';
        status.textContent = `Error: ${error.message}`;
        document.body.appendChild(status);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', injectDynamicContent);
