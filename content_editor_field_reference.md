# SelfCast Dynamic Content Editor Field Reference

This document provides a comprehensive list of all field names (keys) used in the SelfCast Dynamic content editor system. Use these exact field names when connecting the onboarding form to ensure data consistency.

## Table of Contents
- [Main Content Fields](#main-content-fields)
- [Bio Section Fields](#bio-section-fields)
- [Social Media Fields](#social-media-fields)
- [Blog Content Fields](#blog-content-fields)
- [Quote Fields](#quote-fields)
- [Style and Branding Fields](#style-and-branding-fields)
- [Contact Information Fields](#contact-information-fields)

## Main Content Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `rendered_title` | Main page title (usually person's name) | `#rendered_title` |
| `rendered_subtitle` | Subtitle or tagline (usually professional title) | `#rendered_subtitle` |
| `profile_image_url` | URL to profile/headshot image | `#profile_image_url` |

## Bio Section Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `rendered_bio_html` | Main biography text | `#rendered_bio_html` |
| `rendered_bio_html_card_1` | Mind card content in bio section | `#rendered_bio_html_card_1` |
| `rendered_bio_html_card_2` | Body card content in bio section | `#rendered_bio_html_card_2` |
| `rendered_bio_html_card_3` | Soul card content in bio section | `#rendered_bio_html_card_3` |

## Social Media Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `facebook_url` | Facebook profile URL | `#facebook_url` |
| `facebook_title` | Title for Facebook section | `#facebook_title` |
| `facebook_post` | Facebook post content | `#facebook_post` |
| `twitter_url` | Twitter/X profile URL | `#twitter_url` |
| `twitter_title` | Title for Twitter/X section | `#twitter_title` |
| `twitter_post` | Twitter/X post content | `#twitter_post` |
| `instagram_url` | Instagram profile URL | `#instagram_url` |
| `instagram_title` | Title for Instagram section | `#instagram_title` |
| `instagram_post` | Instagram post content | `#instagram_post` |
| `linkedin_url` | LinkedIn profile URL | `#linkedin_url` |
| `linkedin_title` | Title for LinkedIn section | `#linkedin_title` |
| `linkedin_post` | LinkedIn post content | `#linkedin_post` |

## Blog Content Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `blog_post_1_title` | Title for blog post 1 | `#blog_post_1_title` |
| `blog_post_1_description` | Short description/preview of blog post 1 | `#blog_post_1_description` |
| `blog_post_1` | Full content of blog post 1 | `#blog_post_1` |
| `blog_post_2_title` | Title for blog post 2 | `#blog_post_2_title` |
| `blog_post_2_description` | Short description/preview of blog post 2 | `#blog_post_2_description` |
| `blog_post_2` | Full content of blog post 2 | `#blog_post_2` |
| `blog_post_3_title` | Title for blog post 3 | `#blog_post_3_title` |
| `blog_post_3_description` | Short description/preview of blog post 3 | `#blog_post_3_description` |
| `blog_post_3` | Full content of blog post 3 | `#blog_post_3` |
| `blog_post_4_title` | Title for blog post 4 | `#blog_post_4_title` |
| `blog_post_4_description` | Short description/preview of blog post 4 | `#blog_post_4_description` |
| `blog_post_4` | Full content of blog post 4 | `#blog_post_4` |

## Quote Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `quote_1` | First quote (after bio) | `#quote_1` |
| `quote_2` | Second quote (after blog) | `#quote_2` |
| `quote_3` | Third quote (after social media) | `#quote_3` |

## Style and Branding Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `style_package` | Selected style preset | `#style_package` |
| `primary_color` | Primary brand color | Hidden input (set by preset) |
| `secondary_color` | Secondary brand color | Hidden input (set by preset) |
| `accent_color` | Accent color for highlights | Hidden input (set by preset) |
| `heading_font` | Font used for headings | Set via `#heading_font_select` |
| `body_font` | Font used for body text | Set via `#body_font_select` |

## Contact Information Fields

| Field Name (key) | Description | HTML Element ID |
|------------------|-------------|-----------------|
| `email_address` | Contact email address | `#email_address` |
| `phone_number` | Contact phone number | Not in current editor |

## Style Package Values

The `style_package` field accepts the following values:

| Value | Description | Color Scheme |
|-------|-------------|--------------|
| `standard-professional` | Blue theme | Blue primary with light accents |
| `dark-professional` | Dark/Navy theme | Dark blue/black with light accents |
| `light-professional` | Gold theme | Gold/tan with dark accents |
| `green-professional` | Green theme | Green with complementary accents |
| `red-professional` | Red theme | Red with complementary accents |

## Font Options

Available options for `heading_font` and `body_font`:

- Montserrat
- Raleway
- Playfair Display
- Roboto Slab
- Merriweather
- Poppins
- Lora
- Open Sans
