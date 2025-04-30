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
| `facebook_title_1` | Title for Facebook post 1 | `#facebook_title_1` |
| `facebook_post_1` | Facebook post 1 content | `#facebook_post_1` |
| `facebook_title_2` | Title for Facebook post 2 | `#facebook_title_2` |
| `facebook_post_2` | Facebook post 2 content | `#facebook_post_2` |
| `facebook_title_3` | Title for Facebook post 3 | `#facebook_title_3` |
| `facebook_post_3` | Facebook post 3 content | `#facebook_post_3` |
| `facebook_title_4` | Title for Facebook post 4 | `#facebook_title_4` |
| `facebook_post_4` | Facebook post 4 content | `#facebook_post_4` |
| `twitter_url` | Twitter/X profile URL | `#twitter_url` |
| `twitter_title_1` | Title for Twitter/X post 1 | `#twitter_title_1` |
| `twitter_post_1` | Twitter/X post 1 content | `#twitter_post_1` |
| `twitter_title_2` | Title for Twitter/X post 2 | `#twitter_title_2` |
| `twitter_post_2` | Twitter/X post 2 content | `#twitter_post_2` |
| `twitter_title_3` | Title for Twitter/X post 3 | `#twitter_title_3` |
| `twitter_post_3` | Twitter/X post 3 content | `#twitter_post_3` |
| `twitter_title_4` | Title for Twitter/X post 4 | `#twitter_title_4` |
| `twitter_post_4` | Twitter/X post 4 content | `#twitter_post_4` |
| `instagram_url` | Instagram profile URL | `#instagram_url` |
| `instagram_title_1` | Title for Instagram post 1 | `#instagram_title_1` |
| `instagram_post_1` | Instagram post 1 content | `#instagram_post_1` |
| `instagram_title_2` | Title for Instagram post 2 | `#instagram_title_2` |
| `instagram_post_2` | Instagram post 2 content | `#instagram_post_2` |
| `instagram_title_3` | Title for Instagram post 3 | `#instagram_title_3` |
| `instagram_post_3` | Instagram post 3 content | `#instagram_post_3` |
| `instagram_title_4` | Title for Instagram post 4 | `#instagram_title_4` |
| `instagram_post_4` | Instagram post 4 content | `#instagram_post_4` |
| `linkedin_url` | LinkedIn profile URL | `#linkedin_url` |
| `linkedin_title_1` | Title for LinkedIn post 1 | `#linkedin_title_1` |
| `linkedin_post_1` | LinkedIn post 1 content | `#linkedin_post_1` |
| `linkedin_title_2` | Title for LinkedIn post 2 | `#linkedin_title_2` |
| `linkedin_post_2` | LinkedIn post 2 content | `#linkedin_post_2` |
| `linkedin_title_3` | Title for LinkedIn post 3 | `#linkedin_title_3` |
| `linkedin_post_3` | LinkedIn post 3 content | `#linkedin_post_3` |
| `linkedin_title_4` | Title for LinkedIn post 4 | `#linkedin_title_4` |
| `linkedin_post_4` | LinkedIn post 4 content | `#linkedin_post_4` |

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
