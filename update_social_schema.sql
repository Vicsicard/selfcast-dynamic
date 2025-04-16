-- Add new social media post fields
INSERT INTO dynamic_content (project_id, key, value)
VALUES
    -- Social Media Profile URLs
    ('default-project', 'twitter_url', 'https://twitter.com/janedoe'),
    ('default-project', 'instagram_url', 'https://instagram.com/janedoe'),
    ('default-project', 'linkedin_url', 'https://linkedin.com/in/janedoe'),
    ('default-project', 'facebook_url', 'https://facebook.com/janedoe'),

    -- Social Media Posts (Text Only)
    ('default-project', 'twitter_post', 'Excited to share my thoughts on personal branding in 2025! Check out my latest article on strategic storytelling and authentic engagement. 🚀 #PersonalBranding #ContentStrategy'),
    ('default-project', 'instagram_post', 'Sharing insights on building a magnetic personal brand! ✨ The key to success? Authenticity and strategic storytelling. 🎯 #PersonalBranding #Success'),
    ('default-project', 'linkedin_post', 'Excited to announce my latest article on the intersection of personal branding and professional growth. The key to standing out in 2025? Authentic storytelling and strategic positioning. What strategies have worked for you in building your personal brand?'),
    ('default-project', 'facebook_post', 'Just wrapped up another amazing workshop on personal branding! 🌟 The power of authentic storytelling never ceases to amaze me. What''s your story?')
ON CONFLICT (project_id, key) DO UPDATE
SET value = EXCLUDED.value;
