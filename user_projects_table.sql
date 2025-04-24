-- Create user_projects table to store the relationship between Clerk users and SelfCast projects
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Clerk user ID
  project_id TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Create index for faster lookups by user_id
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);

-- Create index for faster lookups by project_id
CREATE INDEX idx_user_projects_project_id ON user_projects(project_id);

-- Insert example for admin user
-- Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID once you create your account
INSERT INTO user_projects (user_id, project_id, is_admin)
VALUES ('YOUR_CLERK_USER_ID', 'all', TRUE);

-- Example for regular user
-- Replace with actual user IDs and project IDs
-- INSERT INTO user_projects (user_id, project_id, is_admin)
-- VALUES ('CLERK_USER_ID', 'lastname-firstname-0001', FALSE);

-- Grant permissions if using Row Level Security (optional for future enhancement)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_projects TO authenticated;
-- GRANT SELECT ON user_projects TO anon;
