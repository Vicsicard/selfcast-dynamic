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
  url: 'https://aqicztygjpmunfljjuto.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
};
const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

async function buildStaticSite() {
  try {
    console.log(`Building static site for project: ${projectId}`);
    
    // Fetch all content for this project from Supabase
    const { data: contentData, error } = await supabase
      .from('dynamic_content')
      .select('*')
      .eq('project_id', projectId);
      
    if (error) throw error;
    
    if (!contentData || contentData.length === 0) {
      console.error(`No content found for project: ${projectId}`);
      process.exit(1);
    }
    
    console.log(`Found ${contentData.length} content items`);
    
    // Convert array to object for easier access
    const content = {};
    contentData.forEach(item => {
      content[item.key] = item.value;
    });
    
    // Copy all static files from public-site to output directory
    copyDir(path.join(__dirname, 'public-site'), outputDir);
    
    // Read the index.html file
    const indexPath = path.join(__dirname, 'public-site', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Load HTML into cheerio for manipulation
    const $ = cheerio.load(html);
    
    // Replace all data-key elements with their actual content
    $('[data-key]').each((i, element) => {
      const key = $(element).attr('data-key');
      const value = content[key];
      
      if (value) {
        if (element.tagName === 'img') {
          $(element).attr('src', value);
        } else if (element.tagName === 'a') {
          $(element).attr('href', value);
        } else {
          $(element).html(value);
        }
      }
    });
    
    // Remove only the Supabase scripts but keep script.js
    $('script[src*="supabase"]').remove();
    
    // We need to preserve the window.siteContent object for modals to work
    // Create a static version of the site content
    const contentObject = {};
    contentData.forEach(item => {
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

buildStaticSite();
