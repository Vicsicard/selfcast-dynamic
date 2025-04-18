// Initialize Supabase client
const supabase = window.supabase;

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
    console.log(`Project ID from URL: ${projectId || 'none'}`);
    return projectId || 'adam-hyp-1';
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

        // For every element with a data-key, set its content to the project value or blank if missing
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            
            // Skip social buttons - we don't want to clear their content
            if (element.classList.contains('social-button')) {
                if (themeData[key] !== undefined && themeData[key] !== null && themeData[key] !== '') {
                    element.href = themeData[key];
                }
                return; // Skip the rest of the processing for social buttons
            }
            
            if (themeData[key] !== undefined && themeData[key] !== null && themeData[key] !== '') {
                // If the key exists for this project, set the value
                if (element.tagName === 'IMG') {
                    element.src = themeData[key];
                } else if (key.endsWith('_html')) {
                    element.innerHTML = themeData[key];
                } else {
                    element.textContent = themeData[key];
                }
            } else {
                // If the key is missing, clear the content
                if (element.tagName === 'IMG') {
                    element.src = '';
                } else {
                    element.textContent = '';
                }
            }
        });

        // Load fonts and inject styles
        loadFonts(themeData.heading_font || 'Roboto', themeData.body_font || 'Open Sans');
        injectStyles(themeData);

        // Process each content item and store for modal use
        contentData.forEach(item => {
            // Store content for modal use
            window.siteContent[item.key] = item.value;
            
            // Debug: Log all keys and values
            console.log(`Processing key: ${item.key}, value: ${item.value}`);
            
            // Special handling for profile image
            if (item.key === 'profile_image_url') {
                const profileImg = document.querySelector('img[data-key="profile_image_url"]');
                if (profileImg) {
                    // Only update if the image is a placeholder or matches the old URL
                    if (profileImg.src.includes('placeholder') || 
                        profileImg.src.includes('image06.jpg')) {
                        console.log('Setting profile image src to:', item.value);
                        profileImg.src = item.value;
                    } else {
                        console.log('Keeping existing profile image:', profileImg.src);
                    }
                } else {
                    console.error('Profile image element not found');
                }
            }
            
            // Special handling for email address
            if (item.key === 'email_address') {
                const emailLink = document.querySelector('a[data-key="email_address"]');
                if (emailLink && item.value) {
                    emailLink.href = `mailto:${item.value}`;
                    
                    // Clear any text nodes to prevent email from showing
                    Array.from(emailLink.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            emailLink.removeChild(node);
                        }
                    });
                }
            }
            
            // Special handling for social media URLs
            if (item.key.endsWith('_url') && ['facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url'].includes(item.key)) {
                const socialLink = document.querySelector(`a[data-key="${item.key}"]`);
                if (socialLink && item.value) {
                    socialLink.href = item.value;
                    
                    // Clear any text nodes to prevent URL from showing
                    Array.from(socialLink.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            socialLink.removeChild(node);
                        }
                    });
                }
            }
            
            // Find elements with matching data-key
            const elements = document.querySelectorAll(`[data-key="${item.key}"]`);
            console.log(`Found ${elements.length} elements with data-key="${item.key}"`);
            
            elements.forEach(element => {
                if (item.key === 'rendered_bio_html') {
                    // Format bio content with proper paragraph breaks
                    if (item.value) {
                        // Split content by newline characters and create paragraphs
                        const paragraphs = item.value.split(/\n\s*\n/);
                        const formattedContent = paragraphs
                            .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
                            .join('');
                        element.innerHTML = formattedContent;
                    } else {
                        element.innerHTML = '';
                    }
                } else if (item.key === 'email_address') {
                    // Handle email links specially
                    const mailtoLink = `mailto:${item.value}`;
                    element.href = mailtoLink;
                } else if (item.key.includes('_url')) {
                    // Handle URLs differently based on element type
                    if (element.tagName === 'IMG') {
                        // For image elements, set the src attribute
                        console.log(`Setting image src for ${item.key}:`, element, item.value);
                        element.src = item.value;
                    } else {
                        // For link elements, set the href attribute
                        element.href = item.value;
                    }
                } else if (item.key.endsWith('_post')) {
                    // For social media posts, create excerpt
                    console.log('Creating excerpt for social post:', item.key);
                    
                    // Check if this is a social media post
                    const platform = item.key.replace('_post', '');
                    const excerptKey = `${platform}_excerpt`;
                    
                    // Find excerpt elements for this platform
                    const excerptElements = document.querySelectorAll(`[data-key="${excerptKey}"]`);
                    
                    if (excerptElements.length > 0) {
                        // Create excerpt by truncating to 150 characters
                        const excerpt = item.value.length > 150 ? item.value.substring(0, 150) + '...' : item.value;
                        
                        // Apply excerpt to all matching elements
                        excerptElements.forEach(excerptElement => {
                            excerptElement.textContent = excerpt;
                        });
                    } else {
                        // If no specific excerpt element, use the post element for the excerpt
                        element.textContent = item.value.length > 150 ? item.value.substring(0, 150) + '...' : item.value;
                    }
                } else if (item.key.includes('_description')) {
                    // For blog post descriptions, use as excerpt
                    console.log('Using description as excerpt for:', item.key);
                    element.textContent = item.value;
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

// Create fun fact cards from bio content
function createBioCards(bioContent, element) {
    // Use static words for the cards
    const words = ['Mind', 'Body', 'Soul'];
    
    // Create a container for the cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'bio-cards';
    
    // Create a card for each word
    words.forEach(word => {
        const card = document.createElement('div');
        card.className = 'bio-card';
        
        // Gradient styled word
        const wordElem = document.createElement('span');
        wordElem.className = 'bio-card-title';
        wordElem.textContent = word;
        card.appendChild(wordElem);
        
        cardsContainer.appendChild(card);
    });
    
    // Insert the cards after the bio content
    element.parentNode.insertBefore(cardsContainer, element.nextSibling);
}

// Modal Functions
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    
    // Format content with proper paragraph breaks
    function formatContent(content) {
        if (!content) return '';
        
        // Split content by double line breaks (paragraphs)
        const paragraphs = content.split(/\n\s*\n/);
        return paragraphs
            .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
            .join('');
    }
    
    // Handle blog posts
    if (modalId.startsWith('blog-')) {
        const blogNumber = modalId.split('-')[1];
        const titleKey = `blog_post_${blogNumber}_title`;
        const contentKey = `blog_post_${blogNumber}`;
        
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('Modal not found:', modalId);
            return;
        }
        
        // Set modal content from stored data
        const titleElement = modal.querySelector(`[data-key="${titleKey}"]`);
        const contentElement = modal.querySelector(`[data-key="${contentKey}"]`);
        
        if (titleElement && window.siteContent[titleKey]) {
            titleElement.textContent = window.siteContent[titleKey];
        }
        
        if (contentElement && window.siteContent[contentKey]) {
            // Format content with proper paragraph breaks
            contentElement.innerHTML = formatContent(window.siteContent[contentKey]);
        }
        
        // Use the active class for flexbox centering
        modal.classList.add('active');
        
        // Add a small delay to trigger the transform animation
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
    // Handle social media posts
    else if (['facebook', 'twitter', 'instagram', 'linkedin'].includes(modalId)) {
        const titleKey = `${modalId}_title`;
        const contentKey = `${modalId}_post`;
        
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal not found');
            return;
        }
        
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        
        if (modalTitle) {
            modalTitle.textContent = window.siteContent[titleKey] || `${modalId.charAt(0).toUpperCase() + modalId.slice(1)} Update`;
        }
        
        if (modalContent && window.siteContent[contentKey]) {
            // Format content with proper paragraph breaks
            modalContent.innerHTML = formatContent(window.siteContent[contentKey]);
        } else if (modalContent) {
            modalContent.innerHTML = '';
        }
        
        // Use the active class for flexbox centering
        modal.classList.add('active');
        
        // Add a small delay to trigger the transform animation
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Remove the active class instead of setting display to none
            modal.classList.remove('active');
            
            // Restore body scrolling
            document.body.style.overflow = '';
        }
    } else {
        // Close the generic modal
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
            
            // Restore body scrolling
            document.body.style.overflow = '';
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
        
        // Ensure body scrolling is restored
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Find any open modal
        const openModals = document.querySelectorAll('.modal.active');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
        
        // Ensure body scrolling is restored
        document.body.style.overflow = '';
    }
});

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        const layerBack = document.querySelector('.layer-back');
        const layerMid = document.querySelector('.layer-mid');
        
        // Only apply parallax if hero is in view
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                const scrollSpeed = 0.5; // Adjust for more/less effect
                if (layerBack) layerBack.style.transform = `translateY(${scrollPosition * scrollSpeed * 0.5}px) translateZ(-10px) scale(2)`;
                if (layerMid) layerMid.style.transform = `translateY(${scrollPosition * scrollSpeed * 0.3}px) translateZ(-5px) scale(1.5)`;
            }
        }
    });
}

// Function to ensure social media icons are displayed
function fixSocialIcons() {
    document.querySelectorAll('.button-text').forEach(element => {
        const icon = element.getAttribute('data-icon');
        if (icon && element.textContent === '') {
            element.textContent = icon;
        }
    });
}

// Initialize content on page load
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    fixSocialIcons();
});

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', function() {
    initParallax();
});

// Also run it after a short delay to catch any dynamic changes
setTimeout(fixSocialIcons, 1000);
