# Supabase Auth Implementation Plan for SelfCast Dynamic

## Overview
This document outlines the plan to implement Supabase Auth for SelfCast Dynamic, replacing the previous Clerk authentication approach. This plan focuses on email/password authentication only, with no email verification, and minimal changes to the existing codebase.

## Phase 1: Basic Setup

### 1.1 Initialize Supabase Auth
```javascript
const supabase = createClient(
  'https://aqicztygjpmunfljjuto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
)
```

### 1.2 Disable Email Verification in Supabase Dashboard
1. In the Supabase Dashboard, go to Authentication → Settings
2. Under "Email Auth", turn off "Enable email confirmations"
3. This allows users to sign up and immediately use the application without verification

### 1.3 Create Auth Helper File
Create `supabase-auth.js` with basic authentication utilities:

```javascript
// supabase-auth.js
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.key
)

// Sign in with email and password
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

// Sign up with email and password
export async function signUp(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      // Skip email verification
      email_confirmation: false
    }
  })
}

// Sign out
export async function signOut() {
  return await supabase.auth.signOut()
}

// Get current session
export async function getSession() {
  return await supabase.auth.getSession()
}

// Get current user
export async function getUser() {
  return await supabase.auth.getUser()
}

// Check if user is admin
export function isAdmin(user, adminEmails) {
  return user && adminEmails.includes(user.email)
}

// Export Supabase client for direct use
export { supabase }
```

## Phase 2: Authentication UI

### 2.1 Update Login Page
Update `login.html` to use Supabase Auth:

```javascript
// Import auth helper
import { signIn, signUp } from './js/supabase-auth.js'

// Sign in function
async function handleSignIn(event) {
  event.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  
  const { data, error } = await signIn(email, password)
  
  if (error) {
    showError(error.message)
    return
  }
  
  // Redirect to editor on success
  window.location.href = '/editor.html'
}

// Sign up function
async function handleSignUp(event) {
  event.preventDefault()
  
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  
  const { data, error } = await signUp(email, password)
  
  if (error) {
    showError(error.message)
    return
  }
  
  // Since email verification is disabled, redirect to editor
  window.location.href = '/editor.html'
}

// Add event listeners
document.getElementById('sign-in-form').addEventListener('submit', handleSignIn)
document.getElementById('sign-up-form').addEventListener('submit', handleSignUp)
```

### 2.2 Add Sign-Out Button to Editor
Add a sign-out button to `editor.html`:

```javascript
// Import auth helper
import { signOut } from './js/supabase-auth.js'

// Sign out function
async function handleSignOut() {
  const { error } = await signOut()
  
  if (error) {
    showError(error.message)
    return
  }
  
  window.location.href = '/login.html'
}

// Add event listener
document.getElementById('sign-out-button').addEventListener('click', handleSignOut)
```

## Phase 3: Session Management

### 3.1 Add Session Check to Protected Pages
Add session check to `editor.html` and other protected pages:

```javascript
// Import auth helper
import { getSession } from './js/supabase-auth.js'

// Check session on page load
async function checkSession() {
  const { data: { session } } = await getSession()
  
  if (!session) {
    // Redirect to login if no session
    window.location.href = '/login.html'
    return
  }
  
  // User is authenticated, continue loading the page
  initializeEditor()
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkSession)
```

## Phase 4: RLS Implementation

### 4.1 Add Owner ID to Dynamic Content Table
```sql
-- Add owner_id column to dynamic_content table
ALTER TABLE dynamic_content ADD COLUMN owner_id UUID REFERENCES auth.users(id);
```

### 4.2 Create RLS Policies
```sql
-- Enable RLS on the table
ALTER TABLE dynamic_content ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to see all projects
CREATE POLICY "Admins can see all projects" 
ON dynamic_content
FOR SELECT
USING (
  auth.email() IN ('admin@selfcaststudios.com', 'your-email@example.com')
);

-- Create policy for regular users to see their own projects
CREATE POLICY "Users can see their own projects" 
ON dynamic_content
FOR SELECT
USING (
  -- If owner_id is set, check that it matches the current user
  (owner_id = auth.uid()) OR
  -- For legacy data without owner_id, use project_id pattern
  (owner_id IS NULL AND project_id LIKE CONCAT('%', auth.email(), '%'))
);

-- Create policy for inserting new projects
CREATE POLICY "Users can insert their own projects" 
ON dynamic_content
FOR INSERT
WITH CHECK (
  owner_id = auth.uid()
);

-- Create policy for updating projects
CREATE POLICY "Users can update their own projects" 
ON dynamic_content
FOR UPDATE
USING (
  (owner_id = auth.uid()) OR
  (owner_id IS NULL AND project_id LIKE CONCAT('%', auth.email(), '%'))
);

-- Create policy for deleting projects
CREATE POLICY "Users can delete their own projects" 
ON dynamic_content
FOR DELETE
USING (
  (owner_id = auth.uid()) OR
  (owner_id IS NULL AND project_id LIKE CONCAT('%', auth.email(), '%'))
);
```

## Phase 5: Integration with Editor

### 5.1 Update Project Loading
Update the project loading function in `editor.html`:

```javascript
// Import auth helper
import { getUser, isAdmin, supabase } from './js/supabase-auth.js'

// Load projects
async function loadProjects() {
  // Get current user
  const { data: { user } } = await getUser()
  
  // Check if admin
  const adminStatus = isAdmin(user, APP_CONFIG.adminEmails)
  
  // Query projects - RLS will automatically filter based on policies
  const { data, error } = await supabase
    .from('dynamic_content')
    .select('project_id')
    .order('project_id')
  
  if (error) {
    console.error('Error loading projects:', error)
    return []
  }
  
  // Update UI with projects
  updateProjectList(data, adminStatus)
  
  return data
}
```

### 5.2 Update Project Saving
Update the project saving function in `editor.html`:

```javascript
// Import auth helper
import { getUser, supabase } from './js/supabase-auth.js'

// Save project
async function saveProject(projectId, content) {
  // Get current user
  const { data: { user } } = await getUser()
  
  const { data, error } = await supabase
    .from('dynamic_content')
    .upsert({
      project_id: projectId,
      content: content,
      owner_id: user.id  // Associate project with current user
    })
  
  if (error) {
    console.error('Error saving project:', error)
    showError('Failed to save project: ' + error.message)
    return false
  }
  
  showSuccess('Project saved successfully')
  return true
}
```

## Phase 6: Testing

### 6.1 Create Test Page
Create `supabase-auth-test.html` to test the authentication flow:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Supabase Auth Test</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js"></script>
</head>
<body>
  <h1>Supabase Auth Test</h1>
  
  <div id="auth-status">Checking authentication status...</div>
  
  <h2>Sign In</h2>
  <form id="sign-in-form">
    <input type="email" id="sign-in-email" placeholder="Email" required>
    <input type="password" id="sign-in-password" placeholder="Password" required>
    <button type="submit">Sign In</button>
  </form>
  
  <h2>Sign Up</h2>
  <form id="sign-up-form">
    <input type="email" id="sign-up-email" placeholder="Email" required>
    <input type="password" id="sign-up-password" placeholder="Password" required>
    <button type="submit">Sign Up</button>
  </form>
  
  <div id="user-info" style="display: none;">
    <h2>User Information</h2>
    <pre id="user-data"></pre>
    <button id="sign-out">Sign Out</button>
    
    <h2>Projects</h2>
    <ul id="projects-list"></ul>
  </div>
  
  <script>
    // Initialize Supabase client
    const supabase = supabase.createClient(
      'https://aqicztygjpmunfljjuto.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs'
    )
    
    // DOM elements
    const authStatus = document.getElementById('auth-status')
    const userInfo = document.getElementById('user-info')
    const userData = document.getElementById('user-data')
    const projectsList = document.getElementById('projects-list')
    
    // Check authentication status
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        authStatus.textContent = 'Authenticated'
        userInfo.style.display = 'block'
        userData.textContent = JSON.stringify(session.user, null, 2)
        loadProjects()
      } else {
        authStatus.textContent = 'Not authenticated'
        userInfo.style.display = 'none'
      }
    }
    
    // Load projects
    async function loadProjects() {
      const { data, error } = await supabase
        .from('dynamic_content')
        .select('project_id')
        .order('project_id')
      
      if (error) {
        console.error('Error loading projects:', error)
        return
      }
      
      projectsList.innerHTML = ''
      
      if (data.length === 0) {
        projectsList.innerHTML = '<li>No projects found</li>'
        return
      }
      
      data.forEach(project => {
        const li = document.createElement('li')
        li.textContent = project.project_id
        projectsList.appendChild(li)
      })
    }
    
    // Sign in
    document.getElementById('sign-in-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const email = document.getElementById('sign-in-email').value
      const password = document.getElementById('sign-in-password').value
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        authStatus.textContent = `Error: ${error.message}`
        return
      }
      
      checkAuth()
    })
    
    // Sign up
    document.getElementById('sign-up-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const email = document.getElementById('sign-up-email').value
      const password = document.getElementById('sign-up-password').value
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        authStatus.textContent = `Error: ${error.message}`
        return
      }
      
      checkAuth()
    })
    
    // Sign out
    document.getElementById('sign-out').addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        authStatus.textContent = `Error: ${error.message}`
        return
      }
      
      checkAuth()
    })
    
    // Check auth on page load
    checkAuth()
  </script>
</body>
</html>
```

### 6.2 Test Checklist
- [ ] Sign up with email/password works
- [ ] Sign in with email/password works
- [ ] Session persistence works (refresh page)
- [ ] Sign out works
- [ ] Admin users can see all projects
- [ ] Regular users can only see their own projects
- [ ] Project saving associates projects with the correct user

## Implementation Timeline

1. **Day 1**: Basic Setup and Authentication UI
   - Set up Supabase Auth
   - Create auth helper file
   - Update login page

2. **Day 2**: Session Management and RLS
   - Add session check to protected pages
   - Add owner_id to dynamic_content table
   - Create RLS policies

3. **Day 3**: Editor Integration and Testing
   - Update project loading and saving
   - Create test page
   - Test all functionality

## Benefits of This Approach

1. **Simplified Architecture**
   - Direct integration with Supabase eliminates third-party dependencies
   - Fewer points of failure in the authentication flow

2. **Built-in RLS Support**
   - Supabase's Row Level Security is designed to work seamlessly with Supabase Auth
   - Policies are enforced at the database level for better security

3. **Improved Reliability**
   - No DNS resolution issues since we're using the same service for both database and auth
   - Fewer external API calls means better performance and reliability

4. **Easier Maintenance**
   - Single provider for both database and authentication
   - Consistent API patterns across your application
