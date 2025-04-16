// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

// Initialize site content storage
window.siteContent = {};

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
    `;

    style.textContent = css;
}

// Get project ID from URL or use default
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    console.log('Using default project ID: annie-sicard-123');
    return projectId || 'annie-sicard-123';
}

// Load and inject content
async function loadContent() {
    try {
        const projectId = getProjectId();
        console.log('Loading content for project:', projectId);

        // Fetch all content from Supabase
        const { data: contentData, error: contentError } = await supabase
            .from('dynamic_content')
            .select('*')
            .eq('project_id', projectId);

        if (contentError) throw contentError;
        console.log('Content data:', contentData);

        // Convert array to object for theme styles
        const themeData = {};
        contentData.forEach(item => {
            themeData[item.key] = item.value;
        });

        // Load fonts and inject styles
        loadFonts(themeData.heading_font || 'Roboto', themeData.body_font || 'Open Sans');
        injectStyles(themeData);

        // Process each content item and store for modal use
        contentData.forEach(item => {
            // Store content for modal use
            window.siteContent[item.key] = item.value;
            
            // Find elements with matching data-key
            const elements = document.querySelectorAll(`[data-key="${item.key}"]`);
            
            elements.forEach(element => {
                if (item.key === 'rendered_bio_html') {
                    element.innerHTML = item.value;
                } else if (item.key.includes('_url')) {
                    element.href = item.value;
                } else if (item.key.startsWith('rendered_blog_post_') || item.key.includes('_post')) {
                    // Create excerpt for blog and social posts
                    console.log('Creating excerpt for:', item.key);
                    console.log('Full content:', item.value);
                    
                    // Try to find first paragraph or description
                    let excerpt;
                    if (item.value.includes('Description:')) {
                        // For blog posts that have a description section
                        const description = item.value.split('Description:')[1].split('\n\n')[0].trim();
                        excerpt = description.length > 300 ? description.substring(0, 300) + '...' : description;
                    } else {
                        // For social posts or other content
                        const text = item.value.split('\n')[0];
                        excerpt = text.length > 300 ? text.substring(0, 300) + '...' : text;
                    }
                    console.log('Created excerpt:', excerpt);
                    element.textContent = excerpt;
                } else {
                    // For other content (titles, text, etc.)
                    element.textContent = item.value;
                }
            });
        });

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Modal functions
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Get content based on type
    let title, content;
    if (type.startsWith('blog-')) {
        // For blog posts
        const blogNum = type.replace('blog-', '');
        const blogKey = `rendered_blog_post_${blogNum}`;
        content = window.siteContent[blogKey];
        
        // Split content into sections
        const sections = content.split('\n\n');
        title = sections[0].replace(/["]/g, ''); // First line is the title
        
        // Format content with proper spacing
        const formattedContent = sections.slice(1).map(section => {
            if (section.startsWith('Description:')) {
                return `<p class="description">${section.replace('Description:', '<strong>Description:</strong>')}</p>`;
            }
            return `<p>${section}</p>`;
        }).join('');
        
        modalContent.innerHTML = formattedContent;
    } else {
        // For social media posts
        const postKey = `${type}_post`;
        content = window.siteContent[postKey];
        title = type.charAt(0).toUpperCase() + type.slice(1) + ' Update';
        
        // Format social media content with line breaks
        modalContent.innerHTML = content.split('\n').map(line => 
            line.trim() ? `<p>${line}</p>` : ''
        ).join('');
    }

    // Set modal title
    modalTitle.innerHTML = `<h2>${title}</h2>`;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);
