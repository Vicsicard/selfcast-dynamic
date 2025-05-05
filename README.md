TEST CHANGE

# SelfCast Dynamic

A multi-client website platform for personal branding and content management.

## Latest Updates (April 18, 2025)

- **Improved Bio/About Section Formatting:**
  - Enhanced paragraph handling with proper spacing and structure
  - Added special styling for quotes within bio text
  - Preserved line breaks and paragraph structure from user input
  - Improved text alignment for better readability
  - Fixed content formatting issues that previously ignored paragraph breaks
  - Added increased spacing between main bio content and bio cards

- **Enhanced Modal Functionality:**
  - Centered modals with smooth animations
  - Improved content formatting in modals with proper paragraph breaks
  - Added special styling for quotes in modal content
  - Fixed scrolling behavior for long content
  - Prevented background scrolling when modals are open

- **Comprehensive Responsive Design Improvements:**
  - Added multiple breakpoints (992px, 768px, 480px) for optimal display on all devices
  - Improved grid layouts on smaller screens
  - Enhanced typography scaling for better readability
  - Optimized spacing and proportions for mobile devices
  - Added responsive image handling
  - Ensured consistent styling across all screen sizes

## Latest Updates (April 17, 2025)

- Enhanced blog section with bold, gradient typography and glassmorphism cards
- Added wavy SVG divider for seamless section transitions
- Unified color scheme: header now uses the same blue gradient as blog and buttons
- Improved modal functionality for blog and social posts (responsive, accessible, error-free)
- Fixed CSS compatibility issues with gradients and line clamping
- All blog and social content remains fully dynamic from Supabase
- **Modernized Connect With Us section:**
  - Wavy divider, frosted glass panel, centered layout, and subtle background
  - Animated floating icons for a playful touch
  - Dynamic social links open in new tabs with proper security attributes
- **Inspiring Quotes System:**
  - Added beautiful, glassmorphism-style quote cards between major sections (Bio→Blog, Blog→Social, Social→Connect)
  - Quotes are dynamic, loaded from Supabase using `quote_1`, `quote_2`, `quote_3` keys
  - Responsive, accessible, and visually integrated with site design
- **Section Spacing:**
  - Reduced excessive padding for a tighter, more cohesive layout
- **Footer:**
  - Updated to match header gradient and includes copyright with link to Self Cast Studio
- **Style Package Renaming & Visual Selection:**
  - Renamed style packages: "professional-his" → "Standard Professional", "professional-her" → "Dark Professional", "standard" → "Light Professional"
  - Style selection now uses visually styled buttons with previews of each theme (color and font), replacing the dropdown menu.
- **Dynamic Content Cleanup:**
  - Removed all hardcoded content from dynamic fields in `index.html`.
  - All elements with `data-key` attributes are blank by default and receive content dynamically from Supabase.
- **Dynamic Email Button:**
  - The email button in the Connect section now links dynamically to the email address stored in the database.

## April 17, 2025 – Major Content and Logic Update

### CSV Import & Project Management
- Added CSV import/export for bulk content management in `edit.html`.
- Project dropdown dynamically loads all project IDs from Supabase.
- Fixed Supabase URL typo that caused persistent connection errors.
- Ensured correct project selection and editing for all projects, including `adam-hyp-1`.

### Public Site Dynamic Loading
- Public site (`index.html`) now loads content strictly for the selected `project_id` (e.g., `?project_id=adam-hyp-1`).
- **No more fallback content:** If a data-key is missing for the project, the element is blank, never showing default/"annie" content.
- All `[data-key]` elements are cleared if the key is not present for the selected project.
- Modal and excerpt logic maintained for blog/social posts.

### Bug Fixes
- Character count update now checks for element existence to prevent JS errors.
- Fixed all issues with duplicate keys and project creation in Supabase.

### How to View a Project
- To view a specific project, use:
  `http://localhost:8000/index.html?project_id=adam-hyp-1`
- Only content for that project will be shown; missing fields will appear blank.

### Developer Notes
- See `script.js` for the updated logic that enforces strict project-based content injection.
- See `edit.html` for CSV import/export and project management improvements.

## Project Structure

```
SelfCast Dynamic/
├── public-site/
│   ├── edit.html      # Content management interface
│   ├── index.html     # Public-facing site
│   ├── script.js      # Client-side functionality
│   └── style.css      # Styling
├── config.js          # Supabase configuration
├── config.example.js  # Example configuration template
├── check_latest.sql   # Latest content verification
├── view_latest_content.sql  # Content viewing queries
└── view_content_md.sql      # Markdown content viewing
```

## Features

### Content Management
- Dynamic content editing
- Real-time preview
- Auto-save functionality
- Project-based organization

### Style System
- Pre-defined style presets:
  - Standard Professional
  - Professional Her
  - Professional His
- Customizable:
  - Colors (primary, secondary, accent, text, background)
  - Fonts (heading, body)
  - Style package selection
- Layout:
  - Centered site design with max-width 1200px
  - Consistent spacing using CSS variables
  - Responsive padding and margins
- Card Design:
  - Enhanced visual separation with borders and shadows
  - Colored accent line at top of cards
  - Hover effects with subtle elevation
  - Optimized spacing between grid items
  - Increased vertical gaps for better readability

### Site Sections
1. **Hero**
   - Dynamic title and subtitle with gradient text effects
   - Animated gradient background with parallax scrolling
   - Floating decorative elements for visual interest
   - Wave divider for smooth section transitions
   - Circular profile image with subtle border effects
   - Responsive layout (side-by-side on desktop, stacked on mobile)
   - Text shadow and typographic enhancements

2. **Bio**
   - Rich text content
   - Professional introduction
   - Clean typography

3. **Blog Grid (2×2)**
   - Four featured blog posts in grid layout
   - Preview cards with title and excerpt
   - Modal popup for full content
   - Responsive grid with optimized spacing
   - Interactive hover effects

4. **Social Media Grid**
   - Four social platform updates
   - Preview cards with platform-specific styling
   - Modal popup for full content
   - Consistent layout with blog grid
   - Enhanced vertical spacing for readability

5. **Connect Section**
   - Social media buttons
   - Interactive hover effects
   - Platform-specific colors
   - Responsive button layout
   - **Modernized Connect With Us section:**
     - Wavy divider, frosted glass panel, centered layout, and subtle background
     - Animated floating icons for a playful touch
     - Dynamic social links open in new tabs with proper security attributes

6. **Footer**
   - Custom slogan
   - Brand styling
   - Clean typography
   - Updated to match header gradient and includes copyright with link to Self Cast Studio

### Modern UI Features
- Consistent card-based design
- Elevation shadows with hover effects
- Platform-specific color accents
- Responsive grid layouts
- Smooth transitions and animations
- Mobile-first approach
- Flexible content areas
- Clean typography hierarchy
- Gradient effects and modern design elements
- Parallax scrolling for depth
- Animated decorative elements
- Wave dividers between sections
- Enhanced profile image presentation

### Modal System
- Unified modal design for blog and social content
- Responsive layout with max-width 800px
- Backdrop blur effect for depth
- Scrollable content for long posts
- Smart content formatting:
  - Blog posts: Description sections with special styling
  - Social posts: Paragraph breaks and hashtag formatting
- Multiple close options:
  - Close button (×)
  - Click outside modal
  - Press Escape key
- Accessibility features:
  - Keyboard navigation
  - Proper focus management
  - Semantic HTML structure

### Quotes System

- **Purpose:** Adds personality and inspiration between major content areas.
- **How it works:**
  - Each quote card uses a `data-key` attribute (`quote_1`, `quote_2`, `quote_3`)
  - Quotes are loaded dynamically from Supabase; default text is shown if not present
  - Quotes can be updated in Supabase without code changes
- **Visual Design:**
  - Glassmorphism/frosted glass effect, elegant large quotation mark, centered text
  - Responsive and accessible

### Connect Section Modernization

- Wavy SVG divider above section
- Frosted glass card with centered layout
- Animated floating icons in background
- Subtitle: “I would love to connect with you on social media!”
- Social buttons use dynamic links and open securely in new tabs

### Section Spacing Improvements

- Reduced padding/margin between sections and dividers for a more modern, cohesive look

### Accessibility & Security

- All external links use `rel="noopener noreferrer"`
- Modal dialogs are fully accessible (keyboard, screen reader, responsive)

### Content Display
- Blog posts:
  - Title extraction from content
  - Description section with special styling
  - Full content with proper paragraph spacing
  - 300-character excerpts in preview cards
- Social media posts:
  - Platform-specific formatting
  - Emoji and hashtag support
  - Line break preservation
  - 300-character excerpts in preview cards

### Social Media Integration
- Platform support:
  - Facebook
  - Twitter
  - Instagram
  - LinkedIn
- Features:
  - Short description preview in cards
  - Full content in modal popup
  - Dynamic content keys:
    ```
    Platform Preview:
    - facebook_excerpt
    - twitter_excerpt
    - instagram_excerpt
    - linkedin_excerpt

    Full Content:
    - facebook_post
    - twitter_post
    - instagram_post
    - linkedin_post

    Social Links:
    - facebook_url
    - twitter_url
    - instagram_url
    - linkedin_url
    ```
  - Automatic excerpt generation (150 characters)
  - "Read More" functionality
  - Platform-specific styling
  - Direct social profile links

### Content Keys and Data Structure
- **Social Media Content**
  - Each platform has three associated keys:
    1. `*_excerpt`: Short preview shown in the card
    2. `*_post`: Full content shown in modal
    3. `*_url`: Link to social profile
  - Content is dynamically loaded from Supabase
  - Project-specific content using `project_id`

### Supabase Integration
- Table: `dynamic_content`
- Fields:
  - `project_id` (text, required)
  - `key` (text, required)
  - `value` (text, required)
  - Primary Key: (project_id, key)

## Database Schema

Using Supabase with table `dynamic_content`:
- `project_id` (text, required)
- `key` (text, required)
- `value` (text, required)
- Primary Key: (project_id, key)

## Key Content Types

1. **Basic Information**
   - Client name
   - Page title
   - Subtitle
   - Profile image

2. **Blog Posts**
   - Four post slots
   - Title for each post
   - Content excerpt
   - Read more link

3. **Social Media**
   - Latest post per platform
   - Profile URLs
   - Platform-specific styling

4. **Style Configuration**
   - Color scheme
   - Typography
   - Style package

## Development

1. Clone the repository
2. Copy `config.example.js` to `config.js` and set up Supabase connection
3. Run SQL scripts to initialize database
4. Open `edit.html` to manage content
5. Preview on `index.html`

## Deployment

- Frontend: Vercel with subdomain deployments
- Backend: Supabase
- Database: PostgreSQL (via Supabase)

## Responsive Design

- Mobile-first approach
- Responsive 2×2 grids that stack on mobile
- Adaptive card layouts
- Flexible content sections
- Touch-friendly interactions

## Future Enhancements

- Next.js upgrade planned
- Enhanced social media preview
- Additional style presets
- Hashtag suggestions
- Emoji picker integration
- Rich text formatting
- Image gallery support

## SelfCast Dynamic Platform

### Overview
SelfCast Dynamic is a multi-client website platform that allows you to:
- Easily create and manage content for multiple client sites using an editor and Supabase
- Generate ultra-fast, fully static sites for each client with all interactive features preserved
- Deploy each static site to Vercel, using subdomains for client isolation

---

## Workflow

### 1. Content Creation & Editing
- Use `public-site/edit.html` to create or update content for a client
- Assign a unique `project_id` for each client (e.g., `annie-sicard-123`)
- Content is saved to the Supabase `dynamic_content` table

### 2. Static Site Generation
- Run the static site generator to fetch all content from Supabase and embed it directly in the HTML
- Command:
  ```sh
  node static-build.js <project_id>
  ```
  Example:
  ```sh
  node static-build.js annie-sicard-123
  ```
- Output is saved in `static-sites/<project_id>`

### 3. Local Preview
- Preview the static site locally:
  ```sh
  cd static-sites/<project_id>
  python -m http.server 8080
  ```
  Visit [http://localhost:8080](http://localhost:8080)

### 4. Deployment to Vercel
- Deploy the static site to Vercel:
  ```sh
  vercel --name <project_id> static-sites/<project_id>
  ```
- For subdomain-based deployments, configure Vercel with the appropriate subdomain for each client

### 5. Updating Content
- Make changes in the editor (edit.html)
- Re-run the static site generator
- Re-deploy to Vercel

---

## Deploying the Content Editor

To create a permanent, accessible content editor for managing all your SelfCast Dynamic sites:

### Vercel Deployment (Recommended)

1. **Connect Repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import the GitHub repository (selfcast-dynamic)

2. **Configure Deployment Settings**:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: public-site

3. **Access Your Content Editor**:
   - Once deployed, your content editor will be available at:
     - Main URL: `https://your-project-name.vercel.app/`
     - Admin URL: `https://your-project-name.vercel.app/admin`
     - Editor URL: `https://your-project-name.vercel.app/editor`

4. **Viewing Specific Projects**:
   - To view a specific project site, use:
     `https://your-project-name.vercel.app/index.html?project_id=your-project-id`

The deployment is configured to prioritize the content editor as the main interface, making it easy to manage all your SelfCast Dynamic sites from a single, accessible location.

---

## Features
- **Content isolation**: Each client site is isolated by `project_id`
- **Static generation**: All content is embedded, no Supabase dependency after deployment
- **Full interactivity**: Modals, parallax, and all JavaScript features preserved
- **Easy updates**: Update content in Supabase, regenerate static site, redeploy
- **Scalable**: Supports many clients using subdomains (Vercel paid plans recommended for >50 subdomains)

---

## Static Site Generator Details
- File: `static-build.js`
- Uses Node.js, Cheerio, and @supabase/supabase-js
- Copies all assets from `public-site` to output
- Embeds content as `window.siteContent` for modal support
- Removes all Supabase dependencies from the final build

---

## Example Commands

Install dependencies:
```sh
npm install
```

Build static site:
```sh
node static-build.js annie-sicard-123
```

Preview locally:
```sh
cd static-sites/annie-sicard-123
python -m http.server 8080
```

Deploy to Vercel:
```sh
vercel --name annie-sicard-123 static-sites/annie-sicard-123
```

---

## Notes
- The editor form (`edit.html`) must include all new content keys (e.g., quote cards) to stay in sync with Supabase and the static site
- The static site generator will preserve all modal and interactive JavaScript features
- For new clients, repeat the workflow with a new `project_id`

---

## Static Site Deployment to Vercel (2025-04-17 Update)

### Deploying a Client Site
To deploy a generated static site for a client (e.g., `annie-sicard-123`) to Vercel:

1. **Ensure the static site is built:**
   - Run `node static-build.js <project_id>` (e.g., `annie-sicard-123`).
   - The output will be in `static-sites/<project_id>`.

2. **Update `vercel.json`:**
   - Set `outputDirectory` to `static-sites/<project_id>`
   - Set `buildCommand` to `null`.
   - Remove the `framework` property if present.

3. **Deploy with Vercel CLI:**
   ```sh
   vercel --yes static-sites/<project_id>
   ```
   - The CLI will prompt for project setup if it's a new deployment.
   - Use the relative path only (e.g., `static-sites/annie-sicard-123`).

4. **Access the deployed site:**
   - The CLI will show the live URL (e.g., `https://annie-sicard-123-xxxx.vercel.app`).

### Notes
- Each client site should be deployed as a separate Vercel project for subdomain separation.
- To update a site, rebuild the static content and redeploy with the same command.
- The static site does not require Supabase or any backend after deployment.

### Example `vercel.json` for Static Deployments
```json
{
  "version": 2,
  "buildCommand": null,
  "outputDirectory": "static-sites/annie-sicard-123",
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false,
  "github": {
    "silent": true
  }
}
```

---

## Troubleshooting
- If you see errors about the framework or build command, check your `vercel.json` for typos or extra properties.
- Always use a relative path for the deployment directory.

## Useful Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

## Contact & Support
For questions or support, contact the SelfCast Dynamic engineering team.
