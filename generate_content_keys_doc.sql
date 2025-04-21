-- SQL query to generate a markdown documentation of all keys in the dynamic_content table
-- This will create a comprehensive list of field names used in the SelfCast Dynamic system

WITH distinct_keys AS (
    SELECT DISTINCT key
    FROM dynamic_content
    ORDER BY key
),
key_categories AS (
    SELECT 
        key,
        CASE
            WHEN key LIKE 'rendered_%' THEN 'Main Content'
            WHEN key LIKE 'blog_post_%' THEN 'Blog Content'
            WHEN key LIKE '%_url' THEN 'URLs and Links'
            WHEN key LIKE '%_font%' THEN 'Typography'
            WHEN key LIKE '%color%' THEN 'Visual Styling'
            WHEN key LIKE 'quote_%' THEN 'Quotes'
            WHEN key LIKE '%_post' THEN 'Social Media'
            WHEN key LIKE '%_title' THEN 'Titles'
            WHEN key LIKE 'email%' OR key = 'phone_number' THEN 'Contact Information'
            ELSE 'Other Settings'
        END AS category,
        CASE
            WHEN key = 'rendered_title' THEN 'Main page title (usually person''s name)'
            WHEN key = 'rendered_subtitle' THEN 'Subtitle or tagline (usually professional title)'
            WHEN key = 'rendered_bio_html' THEN 'Main biography text'
            WHEN key = 'rendered_bio_html_card_1' THEN 'Mind card content in bio section'
            WHEN key = 'rendered_bio_html_card_2' THEN 'Body card content in bio section'
            WHEN key = 'rendered_bio_html_card_3' THEN 'Soul card content in bio section'
            WHEN key = 'profile_image_url' THEN 'URL to profile/headshot image'
            WHEN key = 'email_address' THEN 'Contact email address'
            WHEN key = 'phone_number' THEN 'Contact phone number'
            WHEN key = 'facebook_url' THEN 'Facebook profile URL'
            WHEN key = 'twitter_url' THEN 'Twitter/X profile URL'
            WHEN key = 'instagram_url' THEN 'Instagram profile URL'
            WHEN key = 'linkedin_url' THEN 'LinkedIn profile URL'
            WHEN key = 'facebook_post' THEN 'Facebook post content'
            WHEN key = 'twitter_post' THEN 'Twitter/X post content'
            WHEN key = 'instagram_post' THEN 'Instagram post content'
            WHEN key = 'linkedin_post' THEN 'LinkedIn post content'
            WHEN key = 'facebook_title' THEN 'Title for Facebook section'
            WHEN key = 'twitter_title' THEN 'Title for Twitter/X section'
            WHEN key = 'instagram_title' THEN 'Title for Instagram section'
            WHEN key = 'linkedin_title' THEN 'Title for LinkedIn section'
            WHEN key = 'quote_1' THEN 'First quote (after bio)'
            WHEN key = 'quote_2' THEN 'Second quote (after blog)'
            WHEN key = 'quote_3' THEN 'Third quote (after social media)'
            WHEN key = 'style_package' THEN 'Selected style preset (e.g., standard-professional)'
            WHEN key = 'primary_color' THEN 'Primary brand color'
            WHEN key = 'secondary_color' THEN 'Secondary brand color'
            WHEN key = 'accent_color' THEN 'Accent color for highlights'
            WHEN key = 'heading_font' THEN 'Font used for headings'
            WHEN key = 'body_font' THEN 'Font used for body text'
            WHEN key LIKE 'blog_post_%_title' THEN 'Title for blog post'
            WHEN key LIKE 'blog_post_%_description' THEN 'Short description/preview of blog post'
            WHEN key LIKE 'blog_post_%' AND key NOT LIKE '%title' AND key NOT LIKE '%description' THEN 'Full content of blog post'
            ELSE 'Other setting or configuration value'
        END AS description
    FROM distinct_keys
)

-- Output as markdown
SELECT 
    '# SelfCast Dynamic Content Fields' AS markdown_output
UNION ALL
SELECT '## Field Naming Reference Guide' 
UNION ALL
SELECT 'This document lists all field names (keys) used in the SelfCast Dynamic content system.'
UNION ALL
SELECT 'Use these exact field names when connecting the onboarding form to ensure data consistency.'
UNION ALL
SELECT ''
UNION ALL
SELECT '## Table of Contents'
UNION ALL
SELECT '- [Main Content](#main-content)'
UNION ALL
SELECT '- [Blog Content](#blog-content)'
UNION ALL
SELECT '- [Social Media](#social-media)'
UNION ALL
SELECT '- [Visual Styling](#visual-styling)'
UNION ALL
SELECT '- [Typography](#typography)'
UNION ALL
SELECT '- [URLs and Links](#urls-and-links)'
UNION ALL
SELECT '- [Quotes](#quotes)'
UNION ALL
SELECT '- [Titles](#titles)'
UNION ALL
SELECT '- [Contact Information](#contact-information)'
UNION ALL
SELECT '- [Other Settings](#other-settings)'
UNION ALL
SELECT ''

-- Generate sections by category
UNION ALL
SELECT '## Main Content'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Main Content'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Blog Content'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Blog Content'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Social Media'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Social Media'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Visual Styling'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Visual Styling'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Typography'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Typography'
UNION ALL
SELECT ''

UNION ALL
SELECT '## URLs and Links'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'URLs and Links'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Quotes'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Quotes'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Titles'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Titles'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Contact Information'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Contact Information'
UNION ALL
SELECT ''

UNION ALL
SELECT '## Other Settings'
UNION ALL
SELECT ''
UNION ALL
SELECT '| Field Name | Description |'
UNION ALL
SELECT '|------------|-------------|'
UNION ALL
SELECT '| `' || key || '` | ' || description || ' |'
FROM key_categories
WHERE category = 'Other Settings'
UNION ALL
SELECT '';
