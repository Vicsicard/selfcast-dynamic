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
├── restore_data.sql   # Database content restoration
├── check_content.sql  # Content verification queries
└── check_styles.sql   # Style preset verification
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
  - Platform-specific limits (e.g., Twitter 280 chars)

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

2. **Social Media**
   - Profile URLs
   - Social posts (text-only)

3. **Style Configuration**
   - Color scheme
   - Typography
   - Style package

## Development

1. Clone the repository
2. Set up Supabase connection in `config.js`
3. Run SQL scripts to initialize database
4. Open `edit.html` to manage content
5. Preview on `index.html`

## Deployment

- Frontend: Vercel with subdomain deployments
- Backend: Supabase
- Database: PostgreSQL (via Supabase)

## Future Enhancements

- Next.js upgrade planned
- Enhanced social media preview
- Additional style presets
- Hashtag suggestions
- Emoji picker integration
