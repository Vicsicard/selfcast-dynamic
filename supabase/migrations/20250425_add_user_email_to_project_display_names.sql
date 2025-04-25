-- Add user_email column to project_display_names table
ALTER TABLE project_display_names
ADD COLUMN user_email TEXT NOT NULL DEFAULT 'vicsicard@gmail.com';

-- Create index for faster queries
CREATE INDEX idx_project_display_names_user_email ON project_display_names(user_email);

-- Add RLS policy to ensure users can only see their own projects
CREATE POLICY "Users can view their own projects"
ON project_display_names
FOR SELECT
USING (user_email = auth.email() OR auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to update projects
CREATE POLICY "Admins can update projects"
ON project_display_names
FOR UPDATE
USING (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to insert projects
CREATE POLICY "Admins can insert projects"
ON project_display_names
FOR INSERT
WITH CHECK (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Add RLS policy to allow admins to delete projects
CREATE POLICY "Admins can delete projects"
ON project_display_names
FOR DELETE
USING (auth.email() IN (SELECT email FROM admin_users) OR auth.email() = 'vicsicard@gmail.com');

-- Enable RLS on the table if not already enabled
ALTER TABLE project_display_names ENABLE ROW LEVEL SECURITY;

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
