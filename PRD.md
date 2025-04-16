# SelfCast Dynamic - Product Requirements Document

## Overview
SelfCast Dynamic is a multi-client website platform that enables rapid deployment of customized websites through a centralized content management system.

## Core Components

### 1. Backend Infrastructure
- **Supabase Integration**
  - Project URL: https://aqicztygjpmunfljjuto.supabase.co
  - Database Schema:
    - Table: `dynamic_content`
      - `project_id` (text, required)
      - `key` (text, required)
      - `value` (text, required)
      - Primary Key: (project_id, key)
  - Storage Buckets:
    - `images`: For client-specific image assets

### 2. Frontend Architecture
- **Public Site (`/public-site/index.html`)**
  - Dynamic content injection via data attributes
  - Sections:
    - Hero
    - Bio
    - Blog Grid
    - Social Media Grid
    - Contact & Footer
  - Responsive design with CSS variables for theming

- **Admin Interface (`/public-site/edit.html`)**
  - Content management dashboard
  - File upload system with:
    - Multi-file upload support
    - Progress tracking
    - Image preview grid
    - Delete functionality
  - Project-specific content editing

### 3. Deployment
- **Platform**: Vercel
- **Configuration**:
  - Static site deployment
  - Subdomain-based client separation
  - Admin route redirection (/admin → /edit.html)

## Technical Stack
1. **Frontend**:
   - HTML5
   - CSS3 with CSS Variables
   - Vanilla JavaScript (ES6+)
   - Supabase JavaScript Client

2. **Backend**:
   - Supabase (Database & Storage)
   - Vercel (Hosting & Deployment)

## Features

### Content Management
- [x] Dynamic content injection
- [x] Real-time content updates
- [x] Project-specific content isolation
- [x] Image upload and management
- [x] Brand color customization

### Multi-Client Support
- [x] Subdomain-based routing
- [x] Client-specific storage buckets
- [x] Shared codebase architecture
- [x] Independent content management

### Security
- [x] Supabase RLS policies
- [x] Secure file uploads
- [x] Protected admin interface

## Deployment Process
1. Configure Vercel project settings
2. Set up client subdomain
3. Initialize content through admin interface
4. Verify dynamic content loading

## Future Enhancements
1. Next.js Migration
2. Enhanced Authentication
3. Custom Domain Support
4. Advanced Media Management
5. Analytics Integration
