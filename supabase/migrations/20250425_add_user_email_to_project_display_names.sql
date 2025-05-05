-- Ensure the admin_users table exists (create if not)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the default admin if not exists
INSERT INTO admin_users (email)
VALUES ('vicsicard@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Create a dedicated user_projects table for user-project relationships
CREATE TABLE IF NOT EXISTS user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  project_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, project_id)
);

-- Create index for faster queries
CREATE INDEX idx_user_projects_user_email ON user_projects(user_email);
CREATE INDEX idx_user_projects_project_id ON user_projects(project_id);

-- Add RLS policy to ensure users can only see their own projects
CREATE POLICY "Users can view their own projects"
ON user_projects
FOR SELECT
USING (user_email = auth.email() OR auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to update projects
CREATE POLICY "Admins can update projects"
ON user_projects
FOR UPDATE
USING (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to insert projects
CREATE POLICY "Admins can insert projects"
ON user_projects
FOR INSERT
WITH CHECK (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to delete projects
CREATE POLICY "Admins can delete projects"
ON user_projects
FOR DELETE
USING (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Enable RLS on the table
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Insert initial data: assign all existing projects to the admin
INSERT INTO user_projects (user_email, project_id)
SELECT 'vicsicard@gmail.com', project_id
FROM project_display_names
ON CONFLICT (user_email, project_id) DO NOTHING;
