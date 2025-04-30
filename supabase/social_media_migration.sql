-- SelfCast Dynamic Social Media Structure Migration Script
-- April 30, 2025
-- This script migrates existing social media content to the new 4-post structure

-- Facebook Migration
-- Step 1: Copy existing facebook_post content to facebook_post_1
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_post_1', 
  value 
FROM dynamic_content 
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_post_1' 
  AND project_id = dynamic_content.project_id
);

-- Step 2: Create facebook_title_1 from existing facebook_title or create default
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  d.project_id, 
  'facebook_title_1', 
  COALESCE((SELECT value FROM dynamic_content WHERE key = 'facebook_title' AND project_id = d.project_id), 'Facebook Update 1')
FROM dynamic_content d
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_title_1' 
  AND project_id = d.project_id
);

-- Step 3: Create placeholder content for facebook posts 2-4
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_title_2', 
  'Facebook Update 2'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_title_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_post_2', 
  'Example post content for your Facebook audience. Replace this with your own content that resonates with your target audience. Include relevant information, questions, or insights to encourage engagement.'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_post_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_title_3', 
  'Facebook Update 3'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_title_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_post_3', 
  'Connect with your audience by sharing valuable insights. This placeholder can be replaced with content from your workshop or expertise in your field. Consider including a call to action to encourage comments and shares.'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_post_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_title_4', 
  'Facebook Update 4'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_title_4' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'facebook_post_4', 
  'Share your latest news, project updates, or professional insights here. Effective social posts often include a personal touch along with professional value. This helps build both authority and connection with your audience.'
FROM dynamic_content
WHERE key = 'facebook_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'facebook_post_4' 
  AND project_id = dynamic_content.project_id
);

-- Twitter/X Migration
-- Step 1: Copy existing twitter_post content to twitter_post_1
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_post_1', 
  value 
FROM dynamic_content 
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_post_1' 
  AND project_id = dynamic_content.project_id
);

-- Step 2: Create twitter_title_1 from existing twitter_title or create default
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  d.project_id, 
  'twitter_title_1', 
  COALESCE((SELECT value FROM dynamic_content WHERE key = 'twitter_title' AND project_id = d.project_id), 'Twitter Update 1')
FROM dynamic_content d
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_title_1' 
  AND project_id = d.project_id
);

-- Step 3: Create placeholder content for twitter posts 2-4
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_title_2', 
  'Twitter Update 2'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_title_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_post_2', 
  'Share concise thoughts and industry insights that align with your personal brand. While this platform is known for brevity, your content should still deliver meaningful value to followers.'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_post_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_title_3', 
  'Twitter Update 3'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_title_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_post_3', 
  'Consider posing thoughtful questions to your audience to drive engagement. This platform works well for starting conversations around topics related to your expertise or industry trends.'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_post_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_title_4', 
  'Twitter Update 4'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_title_4' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'twitter_post_4', 
  'Share news, updates, or quick insights that position you as a thought leader in your field. Remember that authenticity resonates well on this platform, so let your unique voice shine through.'
FROM dynamic_content
WHERE key = 'twitter_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'twitter_post_4' 
  AND project_id = dynamic_content.project_id
);

-- Instagram Migration
-- Step 1: Copy existing instagram_post content to instagram_post_1
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_post_1', 
  value 
FROM dynamic_content 
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_post_1' 
  AND project_id = dynamic_content.project_id
);

-- Step 2: Create instagram_title_1 from existing instagram_title or create default
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  d.project_id, 
  'instagram_title_1', 
  COALESCE((SELECT value FROM dynamic_content WHERE key = 'instagram_title' AND project_id = d.project_id), 'Instagram Update 1')
FROM dynamic_content d
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_title_1' 
  AND project_id = d.project_id
);

-- Step 3: Create placeholder content for instagram posts 2-4
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_title_2', 
  'Instagram Update 2'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_title_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_post_2', 
  'Instagram is a visual platform that works well for storytelling. Share content that combines compelling visuals with meaningful captions that reflect your personal brand and professional journey.'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_post_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_title_3', 
  'Instagram Update 3'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_title_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_post_3', 
  'Behind-the-scenes content works well on this platform. Share glimpses of your professional process, workspace, or day-to-day activities that give your audience a more personal connection to you and your work.'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_post_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_title_4', 
  'Instagram Update 4'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_title_4' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'instagram_post_4', 
  'Use this space to share content that highlights your values, expertise, or unique perspective. Instagram is perfect for creating a visual narrative that supports your personal brand while engaging with your audience.'
FROM dynamic_content
WHERE key = 'instagram_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'instagram_post_4' 
  AND project_id = dynamic_content.project_id
);

-- LinkedIn Migration
-- Step 1: Copy existing linkedin_post content to linkedin_post_1
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_post_1', 
  value 
FROM dynamic_content 
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_post_1' 
  AND project_id = dynamic_content.project_id
);

-- Step 2: Create linkedin_title_1 from existing linkedin_title or create default
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  d.project_id, 
  'linkedin_title_1', 
  COALESCE((SELECT value FROM dynamic_content WHERE key = 'linkedin_title' AND project_id = d.project_id), 'LinkedIn Update 1')
FROM dynamic_content d
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_title_1' 
  AND project_id = d.project_id
);

-- Step 3: Create placeholder content for linkedin posts 2-4
INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_title_2', 
  'LinkedIn Update 2'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_title_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_post_2', 
  'LinkedIn is ideal for professional insights and thought leadership. Share content that demonstrates your expertise and provides real value to professionals in your network or industry.'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_post_2' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_title_3', 
  'LinkedIn Update 3'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_title_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_post_3', 
  'Success stories, case studies, or professional achievements work well on LinkedIn. Consider sharing content that highlights your accomplishments while providing useful insights for others in your field.'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_post_3' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_title_4', 
  'LinkedIn Update 4'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_title_4' 
  AND project_id = dynamic_content.project_id
);

INSERT INTO dynamic_content (project_id, key, value)
SELECT 
  project_id, 
  'linkedin_post_4', 
  'Industry analysis, trends, and professional insights are particularly effective on LinkedIn. Share your unique perspective on developments in your field to position yourself as a knowledgeable and forward-thinking professional.'
FROM dynamic_content
WHERE key = 'linkedin_post'
AND NOT EXISTS (
  SELECT 1 FROM dynamic_content 
  WHERE key = 'linkedin_post_4' 
  AND project_id = dynamic_content.project_id
);
