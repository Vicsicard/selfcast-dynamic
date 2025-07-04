// Static Site Generator for SelfCast Dynamic
// This script fetches all content from Supabase for a specific project_id
// and creates a static version of the site with content directly embedded

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');

// Get project ID from command line argument
const projectId = process.argv[2];
if (!projectId) {
  console.error('Please provide a project_id as an argument');
  console.error('Example: node static-build.js annie-sicard-123');
  process.exit(1);
}

// Create output directory
const outputDir = path.join(__dirname, 'static-sites', projectId);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy all static assets
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else if (entry.name !== 'index.html' && entry.name !== 'edit.html') {
      // Skip index.html and edit.html as we'll process them separately
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Load Supabase configuration
// Use hardcoded config values since config.js is browser-based
const supabaseConfig = {
  url: 'https://aqicztygjpmunfljjjuto.supabase.co', 
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
};
const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

async function buildStaticSite(projectId) {
  console.log(`Building static site for project: ${projectId}`);
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'static-sites', projectId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Copy static assets
    const staticAssets = [
      'style.css',
      'script.js',
      'config.js',
      'blog.html',
      'placeholder.jpg',
      'blog-placeholder.jpg'
    ];
    
    staticAssets.forEach(asset => {
      const sourcePath = path.join(__dirname, 'public-site', asset);
      const destPath = path.join(outputDir, asset);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, path.join(outputDir, asset));
        console.log(`Copied ${asset} to ${destPath}`);
      } else {
        console.log(`Warning: ${sourcePath} does not exist, skipping`);
      }
    });
    
    // Fetch content for the project with retry logic
    let data = null;
    let error = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching content for project ${projectId} (attempt ${attempt}/${maxRetries})...`);
        const response = await supabase
          .from('dynamic_content')
          .select('*')
          .eq('project_id', projectId);
        
        if (response.error) {
          throw response.error;
        }
        
        data = response.data;
        console.log(`Successfully fetched ${data.length} content items for project ${projectId}`);
        break; // Success, exit retry loop
      } catch (fetchError) {
        error = fetchError;
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, fetchError.message);
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If all retries failed, throw the last error
    if (!data) {
      throw new Error(`Failed to fetch content after ${maxRetries} attempts: ${error.message}`);
    }
    
    // Convert array to object for easier access
    const content = {};
    data.forEach(item => {
      content[item.key] = item.value;
    });
    
    // Copy all static files from public-site to output directory
    copyDir(path.join(__dirname, 'public-site'), outputDir);
    
    // Read the template.html file
    const indexPath = path.join(__dirname, 'public-site', 'template.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Load HTML into cheerio for manipulation
    const $ = cheerio.load(html);
    
    // Replace all data-key attributes with actual content
    $('[data-key]').each(function() {
      const key = $(this).attr('data-key');
      if (content[key]) {
        if ($(this).is('img')) {
          $(this).attr('src', content[key]);
        } else {
          $(this).html(content[key]);
        }
      }
    });
    
    // Replace PROJECT_ID in all links with the actual project ID
    $('a[href*="PROJECT_ID"]').each(function() {
      const href = $(this).attr('href');
      $(this).attr('href', href.replace('PROJECT_ID', projectId));
    });
    
    // Remove only the Supabase scripts but keep script.js
    $('script[src*="supabase"]').remove();
    
    // We need to preserve the window.siteContent object for modals to work
    // Create a static version of the site content
    const contentObject = {};
    data.forEach(item => {
      contentObject[item.key] = item.value;
    });
    
    // Create a script to initialize the site content
    const contentScript = `
    <script>
      // Static content pre-loaded from build
      window.siteContent = ${JSON.stringify(contentObject)};
      
      // Disable Supabase loading
      async function loadContent() {
        console.log("Content pre-loaded in static build");
        // No need to load content, it's already embedded in the HTML
      }
      
      // Make sure parallax is initialized
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Static site loaded - all content pre-embedded');
        initParallax();
      });
    </script>
    `;
    
    // Add our content initialization script before the main script
    $('script[src="script.js"]').before(contentScript);
    
    // Ensure the View All Blog Posts link is present
    const blogSection = $('section#blog');
    if (blogSection.length) {
      // Force add the View All Blog Posts link
      console.log('Adding View All Blog Posts link to static site');
      
      // First, remove any existing link to avoid duplicates
      blogSection.find('.view-all-blogs').remove();
      
      // Add the new link after the blog grid
      const blogGrid = blogSection.find('.blog-grid');
      if (blogGrid.length) {
        const viewAllHtml = `
          <div class="view-all-blogs" style="text-align: center; margin: 40px 0; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
            <h3 style="margin-bottom: 15px;">Want to see more content?</h3>
            <a href="blog.html?project_id=${projectId}" style="display: inline-block; background-color: #3399FF; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 18px;">View All Blog Posts</a>
          </div>
        `;
        blogGrid.after(viewAllHtml);
        console.log('View All Blog Posts link added successfully');
      } else {
        console.log('Blog grid not found, adding link directly to blog section');
        blogSection.append(`
          <div class="container">
            <div class="view-all-blogs" style="text-align: center; margin: 40px 0; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
              <h3 style="margin-bottom: 15px;">Want to see more content?</h3>
              <a href="blog.html?project_id=${projectId}" style="display: inline-block; background-color: #3399FF; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 18px;">View All Blog Posts</a>
            </div>
          </div>
        `);
      }
    } else {
      console.log('Blog section not found, cannot add View All Blog Posts link');
    }
    
    // Add a comment to indicate this is a static build
    $('head').append(`<!-- Static build generated for ${projectId} on ${new Date().toISOString()} -->`);
    
    // Write the modified HTML to the output directory
    fs.writeFileSync(path.join(outputDir, 'index.html'), $.html());
    
    console.log(`Static site built successfully at: ${outputDir}`);
    console.log('To deploy to Vercel, run:');
    console.log(`vercel --name ${projectId} ${outputDir}`);
    
  } catch (error) {
    console.error('Error building static site:', error);
    process.exit(1);
  }
}

buildStaticSite(projectId);
