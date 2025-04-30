# Social Media Expansion Guide
**SelfCast Dynamic Platform Update - April 30, 2025**

## Overview
This guide covers the implementation of expanded social media content in the SelfCast Dynamic platform. The system has been updated to support 4 unique posts per social media platform instead of the previous single post structure.

## Changes Implemented
- Modified `index.html` to display 4 posts per platform in 2×2 grid layouts
- Updated the content editor (`editor-enhanced.html`) with fields for 4 posts per platform
- Enhanced JavaScript to automatically generate excerpts for each post
- Updated field reference documentation

## Migrating Existing Projects

### Database Migration

For each existing project in Supabase, you'll need to migrate the current social media content to the new format:

1. **Identify existing content**: For each platform, identify the current content stored under keys like `facebook_post`

2. **Create new records**: For each project, create new records with the following structure:
   - `facebook_post_1`: Copy content from the existing `facebook_post`
   - `facebook_title_1`: Copy content from the existing `facebook_title` or create a new title
   - Create empty placeholder records for posts 2-4 or populate with generated content

3. **SQL Migration Script**:
   ```sql
   -- For each platform, migrate existing content to post_1 and create placeholders for 2-4
   -- Facebook Migration
   INSERT INTO dynamic_content (project_id, key, value)
   SELECT 
     project_id, 
     'facebook_post_1', 
     value 
   FROM dynamic_content 
   WHERE key = 'facebook_post';
   
   INSERT INTO dynamic_content (project_id, key, value)
   SELECT 
     project_id, 
     'facebook_title_1', 
     COALESCE((SELECT value FROM dynamic_content WHERE key = 'facebook_title' AND project_id = d.project_id), 'Facebook Update')
   FROM dynamic_content d
   WHERE key = 'facebook_post';
   
   -- Repeat similar statements for twitter, instagram, and linkedin
   -- Create placeholder records for posts 2-4
   ```

## Onboarding Form Integration

The onboarding form that collects client data should be updated to support the new structure:

1. **Data Mapping Update**: 
   - Map form fields to the new numbered social media fields (e.g., `facebook_post_1`, `facebook_post_2`, etc.)
   - Ensure default titles are provided for each post

2. **Content Generator Integration**:
   - Update App 3 (Content Generator) to distribute content across all 4 posts per platform
   - Ensure content is properly formatted with titles and body text

## Marketing Updates

1. **Update Service Description**:
   - Update the Core Visibility Package description to highlight "4 platform-specific social posts per platform" (total of 16 posts)
   - Adjust ongoing monthly package to emphasize "4 new posts per platform each month" (total of 16 posts monthly)

2. **Email Communication**:
   - Update client communication templates to mention the expanded social media content
   - Consider sending an announcement about the enhanced offering to existing clients

## Testing and Quality Assurance

Before deploying to production:

1. **Test with Sample Data**:
   - Create a test project with all 16 social media posts populated
   - Verify display on different screen sizes
   - Check modal functionality for each post

2. **Backward Compatibility**:
   - Ensure projects with only the old single-post format still display correctly
   - Verify no JavaScript errors occur with partial data

## Deployment Checklist

- [ ] Update Supabase structure for all existing projects
- [ ] Deploy HTML/CSS/JS changes to production
- [ ] Update onboarding form integration
- [ ] Update marketing materials and service descriptions
- [ ] Send announcement to existing clients (optional)
