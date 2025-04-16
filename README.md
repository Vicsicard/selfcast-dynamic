# SelfCast Dynamic

A multi-client website platform for personal branding and content management.

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
   - Dynamic title and subtitle
   - Customizable styling
   - Full-width banner design

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

6. **Footer**
   - Custom slogan
   - Brand styling
   - Clean typography

### Modern UI Features
- Consistent card-based design
- Elevation shadows with hover effects
- Platform-specific color accents
- Responsive grid layouts
- Smooth transitions and animations
- Mobile-first approach
- Flexible content areas
- Clean typography hierarchy

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
  - `key`: Content identifier
  - `value`: Actual content
  - `project_id`: Project identifier
- Content is fetched using project ID from URL or subdomain

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
