-- Restore default-project content
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'client_name', 'Jane Doe')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'current_year', '2025')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'instagram_url', 'https://instagram.com/janedoe')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'linkedin_url', 'https://linkedin.com/in/janedoe')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_bio_html', '<p>Jane is a strategist who helps others take control of their narrative and build magnetic personal brands.</p>')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_blog_post_1', '<div class="blog-post"><h3>How to Own Your Story</h3><p>Learn the foundations of narrative control...</p></div>')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_blog_post_2', '<div class="blog-post"><h3>Visibility is Leverage</h3><p>Why your online presence matters more than ever...</p></div>')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_blog_post_3', '<div class="blog-post"><h3>The Power of Intentional Branding</h3><p>Turning chaos into clarity through personal narrative...</p></div>')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_blog_post_4', '<div class="blog-post"><h3>What Makes a Magnetic Bio?</h3><p>Writing bios that actually get read and remembered...</p></div>')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_email', 'hello@janedoe.com')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_footer_slogan', 'Let''s make your story unforgettable.')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_subtitle', 'Storyteller. Strategist. Self Cast Client.')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'rendered_title', 'Jane Doe')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'twitter_url', 'https://twitter.com/janedoe')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('example', 'profile_image_url', '')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Add style presets
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'style_package', 'standard')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'primary_color', '#2C3E50')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'secondary_color', '#34495E')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'background_color', '#FFFFFF')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'text_color', '#333333')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'accent_color', '#3498DB')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'heading_font', 'Roboto')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'body_font', 'Open Sans')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'style_package', 'professional-her')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'primary_color', '#9B2C2C')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'secondary_color', '#D4AF37')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'background_color', '#FFF5F5')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'text_color', '#2D3748')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'accent_color', '#BC8F8F')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'heading_font', 'Playfair Display')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'body_font', 'Lato')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'style_package', 'professional-his')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'primary_color', '#1A365D')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'secondary_color', '#718096')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'background_color', '#F7FAFC')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'text_color', '#1A202C')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'accent_color', '#4A5568')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'heading_font', 'Montserrat')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'body_font', 'Source Sans Pro')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;
