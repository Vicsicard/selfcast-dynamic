# SelfCast Dynamic Blog Feature

This document provides an overview of the blog feature in SelfCast Dynamic, including how to create, manage, and display blog posts.

## Overview

The blog feature allows clients to create and manage unlimited blog posts while maintaining a clean, organized interface. Key components include:

1. **Blog Display Page**: A dedicated page that shows all blog posts with pagination
2. **Blog Management Interface**: A user-friendly interface for creating, editing, and managing blog posts
3. **Navigation Integration**: Clear navigation between the homepage and blog section

## Using the Blog Feature

### Creating and Managing Blog Posts

1. Log in to the Content Editor (edit.html)
2. Click the "Manage All Blog Posts" button in the Blog Posts section
3. In the Blog Management interface:
   - Click "Create New Blog Post" to add a new post
   - Use the list view to see all existing posts
   - Click "Edit" on any post to modify its content
   - Toggle the "Featured" switch to display a post on the homepage
   - Click "Delete" to remove a post (this will not affect post numbering)

### Blog Post Structure

Each blog post includes:
- **Title**: The headline of the post
- **Excerpt**: A brief description shown in previews (automatically generated if not provided)
- **Content**: The full text of the blog post
- **Featured Status**: Whether the post appears on the homepage
- **Date**: Automatically recorded when the post is created

### Viewing Blog Posts

Visitors to your site can:
- See featured blog posts on the homepage (up to 4)
- Click "View All Blog Posts" to see the complete blog
- Navigate through multiple pages of blog posts using pagination
- Return to the homepage using the "Return to Homepage" link

## Technical Details

### Data Structure

The blog feature maintains backward compatibility with the existing `blog_X` naming convention while adding metadata:

- `blog_X`: The full content of blog post X
- `blog_X_title`: The title of blog post X
- `blog_X_date`: The creation date of blog post X
- `blog_X_featured`: Boolean indicating if blog post X is featured on the homepage
- `blog_X_active`: Boolean indicating if blog post X is active (not deleted)

### Implementation Notes

- Featured posts are limited to 4 for the homepage display
- Deleted posts leave gaps in the numbering to maintain consistency
- The blog page uses the same branding and styling as the main site
- All blog content is stored in Supabase and can be exported/imported

## Troubleshooting

If you encounter issues with the blog feature:

1. **Blog posts not appearing**: Make sure they are marked as active
2. **Featured posts not showing on homepage**: Check that you haven't exceeded the limit of 4 featured posts
3. **Styling inconsistencies**: Verify that your theme settings are applied correctly

For additional assistance, please contact support.
