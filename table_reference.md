# Dynamic Content Table Reference

## Table Structure
- **Table Name**: dynamic_content
- **Primary Key**: (project_id, key)

## Available Projects
- default-project (template project with example content)
- example (new project with profile image support)

## Content Keys by Category

### Branding Colors
| Key              | Purpose                    | Example Value |
|------------------|----------------------------|---------------|
| brand-bg-gray    | Background gray color     | #F2F2F2      |
| brand-blue       | Primary blue color        | #3399FF      |
| brand-dark-gray  | Dark gray text color      | #333333      |
| brand-light-gray | Light gray text color     | #777777      |
| brand-white      | White color               | #FFFFFF      |

### Basic Information
| Key               | Purpose                  | Example Value                                |
|-------------------|--------------------------|---------------------------------------------|
| client_name       | Client's name           | Jane Doe                                    |
| profile_image_url | Client's profile image  | [URL to uploaded image]                     |
| rendered_title    | Main page title         | Jane Doe                                    |
| rendered_subtitle | Page subtitle/tagline    | Storyteller. Strategist. Self Cast Client. |

### Blog Content
| Key                  | Purpose           | Format                                          |
|----------------------|------------------|--------------------------------------------------|
| rendered_blog_post_1 | First blog post  | HTML with title and content in blog-post class  |
| rendered_blog_post_2 | Second blog post | HTML with title and content in blog-post class  |
| rendered_blog_post_3 | Third blog post  | HTML with title and content in blog-post class  |
| rendered_blog_post_4 | Fourth blog post | HTML with title and content in blog-post class  |

### Bio and Contact
| Key                    | Purpose           | Example Value                                        |
|-----------------------|-------------------|-----------------------------------------------------|
| rendered_bio_html     | Main bio content  | HTML paragraph with client description              |
| rendered_email        | Contact email     | hello@janedoe.com                                  |
| rendered_footer_slogan| Footer text       | Let's make your story unforgettable.               |

### Social Media Links
| Key           | Purpose         | Example Value                        |
|---------------|----------------|--------------------------------------|
| instagram_url | Instagram link | https://instagram.com/janedoe        |
| linkedin_url  | LinkedIn link  | https://linkedin.com/in/janedoe      |
| twitter_url   | Twitter link   | https://twitter.com/janedoe          |

### System Values
| Key           | Purpose              | Example Value |
|---------------|---------------------|---------------|
| current_year  | Current year value  | 2025          |

## Usage Notes
1. All keys are case-sensitive
2. HTML content should be properly escaped
3. Color values should be in hexadecimal format
4. URLs should include the full path with https://
5. The profile_image_url is stored as a complete URL to the Supabase storage bucket
