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
   - Modern card design with hover effects
   - Title, excerpt, and "Read More" link
   - Equal height cards with flexible content
   - Smooth hover animations

4. **Social Media Grid (2×2)**
   - Latest post from each platform:
     - Facebook (with brand color)
     - Twitter (with brand color)
     - Instagram (with brand color)
     - LinkedIn (with brand color)
   - Platform icons and headers
   - Card design with hover effects
   - "View on Platform" links
   - Equal height cards with flexible content

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

### Social Media Integration
- Platform support:
  - Facebook
  - Twitter
  - Instagram
  - LinkedIn
- Features:
  - Profile URL management
  - Text-only posts with emoji support
  - Character count tracking
  - Platform-specific limits

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
