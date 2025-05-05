// Initialize Supabase client
const supabase = window.supabase;

// Initialize site content storage
window.siteContent = {};

// Global blog post and pagination variables (expanding existing variables)
let blogSortOrder = 'newest';
let currentPage = 1;
let totalPages = 1;
let allBlogPosts = [];
const postsPerPage = 4;
const platformPostsPerPage = 4;

// Platform posts storage
let platformPosts = {
    facebook: { posts: [], currentPage: 1 },
    twitter: { posts: [], currentPage: 1 },
    instagram: { posts: [], currentPage: 1 },
    linkedin: { posts: [], currentPage: 1 }
};

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

    let css = `
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

    // Special handling for dark theme to ensure text visibility in bio and card sections
    if (styles.style_package === 'dark-professional' || 
        (styles.primary_color && styles.primary_color.toLowerCase() === '#121212')) {
        console.log('Applying dark theme overrides for text visibility');
        
        // Enable the theme-overrides styles
        document.getElementById('theme-overrides').disabled = false;
    } else {
        // Disable the theme-overrides styles for other themes
        if (document.getElementById('theme-overrides')) {
            document.getElementById('theme-overrides').disabled = true;
        }
    }

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
            
            // Store content for modal use
            window.siteContent[item.key] = item.value;
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
                    element.alt = 'Image not available';
                } else if (key.endsWith('_html')) {
                    element.innerHTML = '';
                } else {
                    element.textContent = '';
                }
            }
        });

        // Apply theme styles
        const styles = {
            primary_color: themeData.primary_color || '#007bff',
            secondary_color: themeData.secondary_color || '#6c757d',
            accent_color: themeData.accent_color || '#333',
            text_color: themeData.text_color || '#333',
            background_color: themeData.background_color || '#ffffff',
            heading_font: themeData.heading_font || 'Montserrat',
            body_font: themeData.body_font || 'Open Sans',
            style_package: themeData.style_package || 'standard-preset'
        };

        // Apply theme
        injectStyles(styles);
        
        // Load fonts
        loadFonts(styles.heading_font, styles.body_font);
        
        // Process blog posts for pagination
        extractAndProcessBlogPosts(contentData);
        
        // Update blog post grid with first page of posts
        displayBlogPosts(1);
        
        // Process social media posts for pagination
        extractAndProcessSocialPosts(contentData);
        
        // Set up pagination event listeners
        setupPaginationControls();
        
        // Special handling for email address
        if (themeData.email_address) {
            const emailLink = document.querySelector('a[data-key="email_address"]');
            if (emailLink) {
                emailLink.href = `mailto:${themeData.email_address}`;
                
                // Clear any text nodes to prevent email from showing
                Array.from(emailLink.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        emailLink.removeChild(node);
                    }
                });
            }
        }
        
        // Special handling for social media URLs
        ['facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url'].forEach(socialKey => {
            if (themeData[socialKey]) {
                const socialLink = document.querySelector(`a[data-key="${socialKey}"]`);
                if (socialLink) {
                    socialLink.href = themeData[socialKey];
                    
                    // Clear any text nodes to prevent URL from showing
                    Array.from(socialLink.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            socialLink.removeChild(node);
                        }
                    });
                }
            }
        });
        
        // Specialized processing for social media excerpts
        processKeysWithPrefix(contentData, '_post');
        
        // Add bio cards
        const bioElement = document.querySelector('[data-key="rendered_bio_html"]');
        if (bioElement && themeData.rendered_bio_html) {
            createBioCards(themeData.rendered_bio_html, bioElement);
        }
        
        // After content is loaded, initialize parallax effect
        initParallax();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Process all keys that end with a specific suffix
function processKeysWithPrefix(contentData, suffix) {
    contentData.forEach(item => {
        const key = item.key;
        const value = item.value;
        
        if (key.endsWith(suffix)) {
            generateSocialExcerpt(key, value, contentData);
        }
    });
}

// Extract and process all blog posts
function extractAndProcessBlogPosts(contentData) {
    // Reset allBlogPosts array
    allBlogPosts = [];
    
    // Process each content item
    contentData.forEach(item => {
        const key = item.key;
        const value = item.value;
        
        // Match blog post pattern (blog_1, blog_2, etc.)
        const blogPostMatch = key.match(/^blog_(\d+)$/);
        if (blogPostMatch) {
            const blogNumber = parseInt(blogPostMatch[1]);
            
            // Find matching title and description
            const titleKey = `blog_post_${blogNumber}_title`;
            const descriptionKey = `blog_post_${blogNumber}_description`;
            const dateKey = `blog_post_${blogNumber}_date`;
            const featuredKey = `blog_post_${blogNumber}_featured`;
            
            // Find corresponding content items
            const titleItem = contentData.find(item => item.key === titleKey);
            const descriptionItem = contentData.find(item => item.key === descriptionKey);
            const dateItem = contentData.find(item => item.key === dateKey);
            const featuredItem = contentData.find(item => item.key === featuredKey);
            
            // If we have the core content, add to blog posts array
            if (value) {
                allBlogPosts.push({
                    number: blogNumber,
                    title: titleItem ? titleItem.value : `Blog Post ${blogNumber}`,
                    description: descriptionItem ? descriptionItem.value : generateExcerpt(value),
                    content: value,
                    date: dateItem ? new Date(dateItem.value) : new Date(),
                    featured: featuredItem ? featuredItem.value === 'true' : false
                });
            }
        }
    });
    
    // Sort blog posts (newest first by default)
    sortBlogPosts(blogSortOrder);
    
    // Calculate total pages
    totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
    
    console.log(`Extracted ${allBlogPosts.length} blog posts, total pages: ${totalPages}`);
}

// Generate excerpt from content
function generateExcerpt(content, maxLength = 150) {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Truncate to maxLength characters
    if (plainText.length <= maxLength) return plainText;
    
    // Find the last space before maxLength
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    // If no space found, just truncate at maxLength
    if (lastSpace === -1) return truncated + '...';
    
    // Truncate at the last space
    return truncated.substring(0, lastSpace) + '...';
}

// Sort blog posts based on the selected order
function sortBlogPosts(order) {
    blogSortOrder = order;
    
    switch (order) {
        case 'newest':
            allBlogPosts.sort((a, b) => b.date - a.date);
            break;
        case 'oldest':
            allBlogPosts.sort((a, b) => a.date - b.date);
            break;
        case 'featured':
            // First featured (true before false), then newest within each group
            allBlogPosts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.date - a.date;
            });
            break;
    }
    
    // Update the display if we're already showing blog posts
    if (document.getElementById('blog-post-grid')) {
        displayBlogPosts(currentPage);
    }
}

// Display blog posts for the specified page
function displayBlogPosts(page) {
    currentPage = page;
    
    // Calculate start and end index
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    // Get blog posts for this page
    const postsToShow = allBlogPosts.slice(startIndex, endIndex);
    
    // Get the grid container
    const gridContainer = document.getElementById('blog-post-grid');
    if (!gridContainer) return;
    
    // Clear existing content
    gridContainer.innerHTML = '';
    
    // If no posts, show a message
    if (postsToShow.length === 0) {
        gridContainer.innerHTML = '<div class="no-content-message">No blog posts yet. Check back soon!</div>';
        return;
    }
    
    // Add posts to the grid
    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'grid-item blog-card';
        if (post.featured) postElement.classList.add('featured');
        
        postElement.innerHTML = `
            <h3 class="blog-title">${post.title}</h3>
            <p class="excerpt blog-excerpt">${post.description}</p>
            <button class="action-button" onclick="openModal('blog-${post.number}')">Read More</button>
        `;
        
        gridContainer.appendChild(postElement);
    });
    
    // Update pagination information
    updateBlogPagination();
}

// Update blog pagination information and button states
function updateBlogPagination() {
    // Update current page and total pages display
    document.getElementById('blog-current-page').textContent = currentPage;
    document.getElementById('blog-total-pages').textContent = totalPages || 1;
    
    // Update button states
    const prevButton = document.getElementById('blog-prev-page');
    const nextButton = document.getElementById('blog-next-page');
    
    if (prevButton) {
        prevButton.disabled = currentPage <= 1;
    }
    
    if (nextButton) {
        nextButton.disabled = currentPage >= totalPages;
    }
}

// Process social media platform posts for pagination
function processPlatformPosts(contentData) {
    // Reset platform posts
    Object.keys(platformPosts).forEach(platform => {
        platformPosts[platform].posts = [];
        platformPosts[platform].currentPage = 1;
    });
    
    // Process each content item
    contentData.forEach(item => {
        const key = item.key;
        const value = item.value;
        
        // Check for platform post patterns
        Object.keys(platformPosts).forEach(platform => {
            // Match patterns like facebook_1, twitter_2, etc.
            const postMatch = key.match(new RegExp(`^${platform}_(\\d+)$`));
            if (postMatch) {
                const postNumber = parseInt(postMatch[1]);
                
                // Find matching title (if exists)
                const titleKey = `${platform}_title_${postNumber}`;
                const titleItem = contentData.find(item => item.key === titleKey);
                
                // If we have content, add to platform posts array
                if (value) {
                    platformPosts[platform].posts.push({
                        number: postNumber,
                        title: titleItem ? titleItem.value : `${platform.charAt(0).toUpperCase() + platform.slice(1)} Update ${postNumber}`,
                        content: value
                    });
                }
            }
        });
    });
    
    // Sort all platform posts by number (most recent first assuming higher numbers are newer)
    Object.keys(platformPosts).forEach(platform => {
        platformPosts[platform].posts.sort((a, b) => b.number - a.number);
        console.log(`Extracted ${platformPosts[platform].posts.length} ${platform} posts`);
    });
}

// Set up pagination event listeners
function setupPaginationControls() {
    // Blog pagination
    const blogPrevButton = document.getElementById('blog-prev-page');
    const blogNextButton = document.getElementById('blog-next-page');
    const blogSortSelect = document.getElementById('blog-sort-by');
    
    if (blogPrevButton) {
        blogPrevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                displayBlogPosts(currentPage - 1);
            }
        });
    }
    
    if (blogNextButton) {
        blogNextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                displayBlogPosts(currentPage + 1);
            }
        });
    }
    
    if (blogSortSelect) {
        blogSortSelect.addEventListener('change', () => {
            sortBlogPosts(blogSortSelect.value);
        });
    }
    
    // Social media platform pagination
    setupPlatformPagination();
}

// Set up platform pagination for all social media platforms
function setupPlatformPagination() {
    // For each platform (facebook, twitter, instagram, linkedin)
    Object.keys(platformPosts).forEach(platform => {
        // Get pagination buttons
        const prevButton = document.getElementById(`${platform}-prev-page`);
        const nextButton = document.getElementById(`${platform}-next-page`);
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (platformPosts[platform].currentPage > 1) {
                    displayPlatformPosts(platform, platformPosts[platform].currentPage - 1);
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(platformPosts[platform].posts.length / platformPostsPerPage);
                if (platformPosts[platform].currentPage < totalPages) {
                    displayPlatformPosts(platform, platformPosts[platform].currentPage + 1);
                }
            });
        }
        
        // Initial display of platform posts
        displayPlatformPosts(platform, 1);
    });
}

// Display platform posts for a specific page
function displayPlatformPosts(platform, page) {
    // Set current page for this platform
    platformPosts[platform].currentPage = page;
    
    // Calculate start and end index
    const startIndex = (page - 1) * platformPostsPerPage;
    const endIndex = startIndex + platformPostsPerPage;
    
    // Get posts for this page
    const postsToShow = platformPosts[platform].posts.slice(startIndex, endIndex);
    
    // Get the grid container
    const gridContainer = document.getElementById(`${platform}-post-grid`);
    if (!gridContainer) return;
    
    // Clear existing content
    gridContainer.innerHTML = '';
    
    // If no posts, show a message
    if (postsToShow.length === 0) {
        gridContainer.innerHTML = `<div class="no-content-message">No ${platform} posts yet. Check back soon!</div>`;
        return;
    }
    
    // Add posts to the grid
    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = `grid-item social-card ${platform}`;
        
        // Create card structure based on platform
        postElement.innerHTML = `
            <div class="social-card-header">
                <div class="social-card-icon">
                    ${getPlatformIcon(platform)}
                </div>
                <span class="social-date">Latest Update</span>
            </div>
            <div class="social-content">
                <p class="excerpt">${generateExcerpt(post.content)}</p>
            </div>
            <button class="action-button" onclick="openModal('${platform}-${post.number}')">Read More</button>
        `;
        
        gridContainer.appendChild(postElement);
    });
    
    // Update pagination information
    updatePlatformPagination(platform);
}

// Update platform pagination information and button states
function updatePlatformPagination(platform) {
    const currentPage = platformPosts[platform].currentPage;
    const totalPages = Math.ceil(platformPosts[platform].posts.length / platformPostsPerPage);
    
    // Update current page and total pages display
    const currentPageElement = document.getElementById(`${platform}-current-page`);
    const totalPagesElement = document.getElementById(`${platform}-total-pages`);
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (totalPagesElement) {
        totalPagesElement.textContent = totalPages || 1;
    }
    
    // Update button states
    const prevButton = document.getElementById(`${platform}-prev-page`);
    const nextButton = document.getElementById(`${platform}-next-page`);
    
    if (prevButton) {
        prevButton.disabled = currentPage <= 1;
    }
    
    if (nextButton) {
        nextButton.disabled = currentPage >= totalPages;
    }
}

// Get the SVG icon for a platform
function getPlatformIcon(platform) {
    switch (platform) {
        case 'facebook':
            return `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
            </svg>`;
        case 'twitter':
            return `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
            </svg>`;
        case 'instagram':
            return `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>`;
        case 'linkedin':
            return `<svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
            </svg>`;
        default:
            return '';
    }
}

// Function to generate social media excerpts
function generateSocialExcerpt(key, value, contentData) {
    // Check if this is a platform post (e.g., facebook_1, twitter_2)
    const platforms = Object.keys(platformPosts);
    
    // Try to match platform and number pattern
    for (const platform of platforms) {
        const postMatch = key.match(new RegExp(`^${platform}_(\\d+)$`));
        if (postMatch) {
            const postNumber = postMatch[1];
            const excerptKey = `${platform}_excerpt_${postNumber}`;
            const excerptElements = document.querySelectorAll(`[data-key="${excerptKey}"]`);
            
            // If we have excerpt elements, create and set the excerpt
            if (excerptElements.length > 0) {
                const excerpt = generateExcerpt(value);
                
                // Apply excerpt to all matching elements
                excerptElements.forEach(element => {
                    element.textContent = excerpt;
                });
            }
            
            // Add corresponding data to window.siteContent for modal use
            window.siteContent[excerptKey] = generateExcerpt(value);
            break;
        }
    }
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
    
    // Helper function to find the best matching content
    function findBestMatchingContent(platform, postNumber) {
        // Try different key patterns for content
        const possibleContentKeys = [
            `${platform}_post_${postNumber}`,      // Format 1: facebook_post_1
            `${platform}_${postNumber}`,           // Format 2: facebook_1
            `${platform}_${postNumber}_post`       // Format 3: facebook_1_post
        ];
        
        // Try different key patterns for title
        const possibleTitleKeys = [
            `${platform}_title_${postNumber}`,     // Format 1: facebook_title_1
            `${platform}_${postNumber}_title`      // Format 2: facebook_1_title
        ];
        
        // Find the first available content
        let contentKey = null;
        for (const key of possibleContentKeys) {
            if (window.siteContent[key]) {
                contentKey = key;
                console.log(`Found content with key: ${key}`);
                break;
            }
        }
        
        // Find the first available title
        let titleKey = null;
        for (const key of possibleTitleKeys) {
            if (window.siteContent[key]) {
                titleKey = key;
                console.log(`Found title with key: ${key}`);
                break;
            }
        }
        
        // If no title found, use a default one
        if (!titleKey) {
            titleKey = `${platform}_title_${postNumber}`;
            window.siteContent[titleKey] = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Update ${postNumber}`;
        }
        
        return { contentKey, titleKey };
    }
    
    // Handle blog posts
    if (modalId.startsWith('blog-')) {
        const blogNumber = modalId.split('-')[1];
        
        // Try different key patterns for blog posts
        const possibleContentKeys = [
            `blog_post_${blogNumber}`,
            `blog_${blogNumber}`,
            `blog_content_${blogNumber}`
        ];
        
        const possibleTitleKeys = [
            `blog_post_${blogNumber}_title`,
            `blog_${blogNumber}_title`,
            `blog_title_${blogNumber}`
        ];
        
        // Find the best matching keys
        let contentKey = null;
        for (const key of possibleContentKeys) {
            if (window.siteContent[key]) {
                contentKey = key;
                break;
            }
        }
        
        let titleKey = null;
        for (const key of possibleTitleKeys) {
            if (window.siteContent[key]) {
                titleKey = key;
                break;
            }
        }
        
        // Default fallback for content key
        if (!contentKey) {
            contentKey = possibleContentKeys[0];
        }
        
        // Default fallback for title key
        if (!titleKey) {
            titleKey = possibleTitleKeys[0];
        }
        
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
            console.log('Set modal content to:', window.siteContent[contentKey].substring(0, 100) + '...');
        } else {
            console.warn(`Content not found for key: ${contentKey}`);
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
    // Handle social media posts with platform-number format (e.g., facebook-1)
    else if (modalId.match(/^(facebook|twitter|instagram|linkedin)-\d+$/)) {
        const [platform, postNumber] = modalId.split('-');
        
        // Find the best matching content and title keys
        const { contentKey, titleKey } = findBestMatchingContent(platform, postNumber);
        
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('Modal not found:', modalId);
            return;
        }
        
        // Set modal content from stored data
        const titleElement = modal.querySelector('h2');
        const contentElement = modal.querySelector('.social-content');
        
        if (titleElement && window.siteContent[titleKey]) {
            titleElement.textContent = window.siteContent[titleKey];
        }
        
        if (contentElement && window.siteContent[contentKey]) {
            // Format content with proper paragraph breaks
            contentElement.innerHTML = formatContent(window.siteContent[contentKey]);
            console.log('Set social modal content to:', window.siteContent[contentKey].substring(0, 100) + '...');
        } else {
            console.warn(`Social content not found for key: ${contentKey}`);
            console.log('Available site content keys:', Object.keys(window.siteContent).filter(k => k.startsWith(platform)));
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
    // Handle platform-only modals (e.g., facebook, twitter)
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

// All Blogs Modal Functions
// Variables for pagination
// Already declared globally, so not re-declaring here
// let allBlogPosts = [];
// let currentPage = 1;
// const postsPerPage = 4;
// let totalPages = 1;

// Function to open the All Blogs modal
function openAllBlogsModal() {
    console.log('Opening All Blogs Modal');
    
    // Get all blog posts
    allBlogPosts = getAllBlogPosts();
    
    // Update pagination
    updatePagination();
    
    // Display blog posts for the first page
    displayAllBlogPosts(1);
    
    // Show the modal
    const modal = document.getElementById('all-blogs-modal');
    if (modal) {
        modal.classList.add('active');
        
        // Set modal title with site name if available
        const titleElement = document.getElementById('all-blogs-title');
        if (titleElement && window.siteContent.rendered_title) {
            titleElement.textContent = window.siteContent.rendered_title + ' - All Blog Posts';
        }
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Function to get all blog posts from the loaded content
function getAllBlogPosts() {
    const blogPosts = [];
    const blogTitleRegex = /^blog_(\d+)_title$/;
    
    // Find all blog posts in the loaded content
    for (const key in window.siteContent) {
        const match = key.match(blogTitleRegex);
        if (match) {
            const blogNumber = parseInt(match[1]);
            const contentKey = `blog_${blogNumber}`;
            
            // Check if this blog post has content
            if (window.siteContent[contentKey]) {
                blogPosts.push({
                    number: blogNumber,
                    title: window.siteContent[key] || `Blog Post ${blogNumber}`,
                    content: window.siteContent[contentKey],
                    // Check if this blog is featured (shown on homepage)
                    featured: window.siteContent[`blog_${blogNumber}_featured`] === 'true',
                    // Check if this blog is active (not deleted)
                    active: window.siteContent[`blog_${blogNumber}_active`] !== 'false',
                    // Get date if available
                    date: window.siteContent[`blog_${blogNumber}_date`] || 'No date'
                });
            }
        }
    }
    
    // Sort by blog number (newest first assuming higher numbers are newer)
    return blogPosts.sort((a, b) => b.number - a.number);
}

// Function to display blog posts for the current page
function displayAllBlogPosts(page) {
    const container = document.getElementById('all-blogs-container');
    if (!container) return;
    
    // Update current page
    currentPage = page;
    
    // Calculate start and end indices for current page
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, allBlogPosts.length);
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are any posts
    if (allBlogPosts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <h3>No Blog Posts Found</h3>
                <p>There are currently no blog posts available.</p>
            </div>
        `;
        return;
    }
    
    // Add posts for current page
    for (let i = startIndex; i < endIndex; i++) {
        const post = allBlogPosts[i];
        
        // Create excerpt
        const excerpt = post.content.length > 150 
            ? post.content.substring(0, 150) + '...' 
            : post.content;
        
        // Create blog post element
        const postElement = document.createElement('div');
        postElement.className = 'grid-item';
        postElement.innerHTML = `
            <div class="blog-post-number">Blog ${post.number}</div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${excerpt}</p>
            <button class="read-more" onclick="openBlogPostModal(${post.number})">Read More</button>
        `;
        
        container.appendChild(postElement);
    }
    
    // Update pagination display
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    // Update button states
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

// Function to update pagination
function updatePagination() {
    totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
    
    document.getElementById('total-pages').textContent = totalPages;
    document.getElementById('current-page').textContent = currentPage;
    
    // Update button states
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

// Function to change page
function changePage(direction) {
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayAllBlogPosts(currentPage);
    }
}

// Function to open a specific blog post modal
function openBlogPostModal(blogNumber) {
    const modalId = 'modal';
    const modal = document.getElementById(modalId);
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Get blog content
    const title = window.siteContent[`blog_${blogNumber}_title`] || `Blog Post ${blogNumber}`;
    const content = window.siteContent[`blog_${blogNumber}`] || 'No content available';
    
    // Set modal content
    modalTitle.textContent = title;
    
    // Format content with proper paragraph breaks
    const paragraphs = content.split(/\n\s*\n/);
    const formattedContent = paragraphs
        .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    modalContent.innerHTML = formattedContent;
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    if (!modalId) modalId = 'modal';
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
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
    
    // Add event listeners for modals
    document.querySelectorAll('.modal').forEach(modal => {
        // Close when clicking outside
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });
    
    // Initialize parallax effect if on main page
    if (typeof initParallax === 'function') {
        initParallax();
    }
});

// Also run it after a short delay to catch any dynamic changes
setTimeout(fixSocialIcons, 1000);

// Extract and process all blog posts from content data
function extractAndProcessBlogPosts(contentData) {
    allBlogPosts = [];
    
    // Extract blog posts
    for (const item of contentData) {
        const key = item.key;
        const value = item.value;
        
        // If this is a blog post (matches blog_X pattern)
        const blogMatch = key.match(/^blog_(\d+)$/);
        if (blogMatch) {
            const blogNumber = parseInt(blogMatch[1]);
            
            // Find related blog metadata (title, description, date, featured)
            const titleItem = contentData.find(i => i.key === `blog_${blogNumber}_title`);
            const descriptionItem = contentData.find(i => i.key === `blog_${blogNumber}_description`);
            const dateItem = contentData.find(i => i.key === `blog_${blogNumber}_date`);
            const featuredItem = contentData.find(i => i.key === `blog_${blogNumber}_featured`);
            
            // Add blog post to our collection
            allBlogPosts.push({
                number: blogNumber,
                title: titleItem ? titleItem.value : `Blog Post ${blogNumber}`,
                description: descriptionItem ? descriptionItem.value : generateExcerpt(value),
                content: value,
                date: dateItem ? new Date(dateItem.value) : new Date(),
                featured: featuredItem ? featuredItem.value === 'true' : false
            });
        }
    }
    
    // Sort by newest first (default)
    allBlogPosts.sort((a, b) => b.date - a.date);
    
    // Calculate total pages
    totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
    
    // Display first page
    displayBlogPosts(1);
}

// Extract and process all social media posts from content data
function extractAndProcessSocialPosts(contentData) {
    // Reset platform posts
    Object.keys(platformPosts).forEach(platform => {
        platformPosts[platform].posts = [];
    });
    
    // Extract posts for each platform
    for (const item of contentData) {
        const key = item.key;
        const value = item.value;
        
        // Process each platform
        Object.keys(platformPosts).forEach(platform => {
            // Try multiple key formats to find posts
            
            // Format 1: platform_post_X (e.g., facebook_post_1)
            const postMatchFormat1 = key.match(new RegExp(`^${platform}_post_(\\d+)$`));
            if (postMatchFormat1) {
                const postNumber = parseInt(postMatchFormat1[1]);
                
                // Find related metadata (title, date, etc.)
                const titleItem = contentData.find(i => i.key === `${platform}_title_${postNumber}`);
                const dateItem = contentData.find(i => i.key === `${platform}_date_${postNumber}`) || 
                                contentData.find(i => i.key === `${platform}_${postNumber}_date`);
                
                // Add post to platform collection
                platformPosts[platform].posts.push({
                    number: postNumber,
                    content: value,
                    date: dateItem ? new Date(dateItem.value) : new Date(),
                    title: titleItem ? titleItem.value : `${platform.charAt(0).toUpperCase() + platform.slice(1)} Update ${postNumber}`
                });
                
                return; // Skip checking the other formats for this key
            }
            
            // Format 2: platform_X (e.g., facebook_1)
            const postMatchFormat2 = key.match(new RegExp(`^${platform}_(\\d+)$`));
            if (postMatchFormat2) {
                const postNumber = parseInt(postMatchFormat2[1]);
                
                // Find related metadata (title, date, etc.)
                const titleItem = contentData.find(i => i.key === `${platform}_${postNumber}_title`) || 
                                contentData.find(i => i.key === `${platform}_title_${postNumber}`);
                const dateItem = contentData.find(i => i.key === `${platform}_${postNumber}_date`) || 
                                contentData.find(i => i.key === `${platform}_date_${postNumber}`);
                
                // Add post to platform collection
                platformPosts[platform].posts.push({
                    number: postNumber,
                    content: value,
                    date: dateItem ? new Date(dateItem.value) : new Date(),
                    title: titleItem ? titleItem.value : `${platform.charAt(0).toUpperCase() + platform.slice(1)} Update ${postNumber}`
                });
                
                return; // Skip checking the other formats for this key
            }
            
            // Format 3: platform_X_post (e.g., facebook_1_post)
            const postMatchFormat3 = key.match(new RegExp(`^${platform}_(\\d+)_post$`));
            if (postMatchFormat3) {
                const postNumber = parseInt(postMatchFormat3[1]);
                
                // Find related metadata (title, date, etc.)
                const titleItem = contentData.find(i => i.key === `${platform}_${postNumber}_title`) || 
                                contentData.find(i => i.key === `${platform}_title_${postNumber}`);
                const dateItem = contentData.find(i => i.key === `${platform}_${postNumber}_date`) || 
                                contentData.find(i => i.key === `${platform}_date_${postNumber}`);
                
                // Add post to platform collection
                platformPosts[platform].posts.push({
                    number: postNumber,
                    content: value,
                    date: dateItem ? new Date(dateItem.value) : new Date(),
                    title: titleItem ? titleItem.value : `${platform.charAt(0).toUpperCase() + platform.slice(1)} Update ${postNumber}`
                });
            }
        });
    }
    
    // Debug output
    console.log('Extracted platform posts:', platformPosts);
    
    // Sort all platform posts by newest first
    Object.keys(platformPosts).forEach(platform => {
        platformPosts[platform].posts.sort((a, b) => b.date - a.date);
        
        // Log how many posts were extracted for each platform
        console.log(`Found ${platformPosts[platform].posts.length} posts for ${platform}`);
    });
    
    // Initialize platform pagination
    setupPlatformPagination();
}

// Main function to load content from Supabase
async function loadContent() {
    // Get the project ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project_id');
    
    if (!projectId) {
        console.error('No project ID provided');
        return;
    }
    
    try {
        // Initialize Supabase client
        const supabase = window.supabase;
        
        // Get content for the project
        const { data: contentData, error: contentError } = await supabase
            .from('dynamic_content')
            .select('*')
            .eq('project_id', projectId);
            
        if (contentError) {
            throw contentError;
        }
        
        if (!contentData || contentData.length === 0) {
            console.error('No content found for this project');
            return;
        }
        
        // Store content for modal reference
        window.siteContent = {};
        contentData.forEach(item => {
            window.siteContent[item.key] = item.value;
        });
        
        // Process content and inject into page
        contentData.forEach(item => {
            const key = item.key;
            const value = item.value;
            
            // Find elements with matching data-key attribute
            const elements = document.querySelectorAll(`[data-key="${key}"]`);
            
            // Update elements
            elements.forEach(element => {
                // Check if element is an image
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else {
                    element.innerHTML = value;
                }
            });
        });
        
        // Extract and process blog posts for pagination
        extractAndProcessBlogPosts(contentData);
        
        // Extract and process social media posts for pagination
        extractAndProcessSocialPosts(contentData);
        
        // Set up pagination event listeners
        setupPaginationControls();
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}
