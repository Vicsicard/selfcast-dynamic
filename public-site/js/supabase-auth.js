// supabase-auth.js
// Helper functions for Supabase authentication

// Singleton Supabase client
let supabaseClient = null;

// Initialize Supabase client (using the config.js file)
function getSupabaseClient() {
  if (!window.SUPABASE_CONFIG) {
    console.error('SUPABASE_CONFIG not found. Make sure config.js is loaded before this script.');
    return null;
  }
  
  // Return existing client if already initialized
  if (supabaseClient) {
    return supabaseClient;
  }
  
  // Create new client
  supabaseClient = supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.key
  );
  
  return supabaseClient;
}

// Sign in with email and password
async function signIn(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: { message: 'Supabase client not initialized' } };
  
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

// Sign up with email and password
async function signUp(email, password) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: { message: 'Supabase client not initialized' } };
  
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      // Skip email verification
      email_confirmation: false
    }
  });
}

// Sign out
async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: { message: 'Supabase client not initialized' } };
  
  try {
    // Clear any local storage tokens
    const storageKey = 'sb-' + window.SUPABASE_CONFIG.url.split('//')[1].split('.')[0] + '-auth-token';
    localStorage.removeItem(storageKey);
    
    // Call the Supabase signOut method
    const result = await supabase.auth.signOut();
    
    return result;
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error };
  }
}

// Get current session
async function getSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: { session: null }, error: { message: 'Supabase client not initialized' } };
  
  return await supabase.auth.getSession();
}

// Get current user
async function getUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: { user: null }, error: { message: 'Supabase client not initialized' } };
  
  return await supabase.auth.getUser();
}

// Check if user is admin
async function isAdmin(email) {
  // DEVELOPMENT MODE: Hardcoded admin emails until tables are created
  const adminEmails = ['vicsicard@gmail.com'];
  if (adminEmails.includes(email)) {
    console.log('Admin access granted via hardcoded list');
    return true;
  }
  
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();
      
    if (error) {
      // If table doesn't exist, log error but don't break functionality
      if (error.code === '42P01') {
        console.error('Error checking admin status:', error);
        console.log('DEVELOPMENT MODE: admin_users table not found, using hardcoded admin list');
        return adminEmails.includes(email);
      }
      
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data !== null;
  } catch (err) {
    console.error('Error in isAdmin check:', err);
    return adminEmails.includes(email);
  }
}

// Get projects for current user
async function getUserProjects() {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: [], error: { message: 'Supabase client not initialized' } };
  
  try {
    // Get current user
    const { data: userData, error: userError } = await getUser();
    if (userError || !userData.user) {
      return { data: [], error: userError || { message: 'User not authenticated' } };
    }
    
    const email = userData.user.email;
    
    // Check if admin first (admins see all projects)
    const adminStatus = await isAdmin(email);
    
    // Store all found projects here for deduplication
    const allProjects = new Map();
    let hasErrors = false;
    
    try {
      if (adminStatus) {
        console.log('User is admin, fetching all projects');
        // Admin user - get all projects
        
        // First attempt: Join user_projects with project_display_names
        const { data, error } = await supabase
          .from('user_projects')
          .select(`
            project_id,
            project_display_names (
              display_name
            )
          `)
          .order('project_id');
          
        if (!error && data) {
          data.forEach(item => {
            allProjects.set(item.project_id, {
              project_id: item.project_id,
              display_name: item.project_display_names ? item.project_display_names.display_name : item.project_id
            });
          });
        } else {
          console.error('Error fetching projects with join:', error);
          hasErrors = true;
        }
          
        // Second attempt: Get projects from user_projects table
        const { data: projectData, error: projectError } = await supabase
          .from('user_projects')
          .select('project_id')
          .order('project_id');
          
        if (!projectError && projectData) {
          projectData.forEach(item => {
            if (!allProjects.has(item.project_id)) {
              allProjects.set(item.project_id, {
                project_id: item.project_id,
                display_name: item.project_id
              });
            }
          });
        } else {
          console.error('Error fetching projects from user_projects:', projectError);
          hasErrors = true;
        }
        
        // Third attempt: Get all unique projects from dynamic_content table
        const { data: contentData, error: contentError } = await supabase
          .from('dynamic_content')
          .select('project_id')
          .order('project_id');
          
        if (!contentError && contentData) {
          const uniqueProjects = [...new Set(contentData.map(item => item.project_id))];
          uniqueProjects.forEach(id => {
            if (!allProjects.has(id)) {
              allProjects.set(id, {
                project_id: id,
                display_name: id
              });
            }
          });
        } else {
          console.error('Error fetching projects from dynamic_content:', contentError);
          hasErrors = true;
        }
      } else {
        console.log('Regular user, fetching assigned projects');
        // Regular user - get only their projects
        
        // First attempt: Join user_projects with project_display_names
        const { data, error } = await supabase
          .from('user_projects')
          .select(`
            project_id,
            project_display_names (
              display_name
            )
          `)
          .eq('user_email', email)
          .order('project_id');
          
        if (!error && data) {
          data.forEach(item => {
            allProjects.set(item.project_id, {
              project_id: item.project_id,
              display_name: item.project_display_names ? item.project_display_names.display_name : item.project_id
            });
          });
        } else {
          console.error('Error fetching user projects with join:', error);
          hasErrors = true;
        }
        
        // Second attempt: Get projects from user_projects table
        const { data: projectData, error: projectError } = await supabase
          .from('user_projects')
          .select('project_id')
          .eq('user_email', email)
          .order('project_id');
          
        if (!projectError && projectData) {
          projectData.forEach(item => {
            if (!allProjects.has(item.project_id)) {
              allProjects.set(item.project_id, {
                project_id: item.project_id,
                display_name: item.project_id
              });
            }
          });
        } else if (projectError) {
          console.error('Error fetching user projects from user_projects:', projectError);
          hasErrors = true;
        }
        
        // Third attempt: Check for email match in dynamic_content
        const { data: emailData, error: emailError } = await supabase
          .from('dynamic_content')
          .select('project_id')
          .eq('key', 'email_address')
          .eq('value', email)
          .order('project_id');
          
        if (!emailError && emailData) {
          emailData.forEach(item => {
            if (!allProjects.has(item.project_id)) {
              allProjects.set(item.project_id, {
                project_id: item.project_id,
                display_name: item.project_id
              });
            }
          });
        } else {
          console.error('Error finding projects by email match:', emailError);
          hasErrors = true;
        }
        
        // Fourth attempt for regular users: Check project_owner field as a fallback
        const { data: ownerData, error: ownerError } = await supabase
          .from('dynamic_content')
          .select('project_id')
          .eq('key', 'project_owner')
          .eq('value', email)
          .order('project_id');
          
        if (!ownerError && ownerData) {
          ownerData.forEach(item => {
            if (!allProjects.has(item.project_id)) {
              allProjects.set(item.project_id, {
                project_id: item.project_id,
                display_name: item.project_id
              });
            }
          });
        } else {
          console.error('Error finding projects by owner match:', ownerError);
          hasErrors = true;
        }
      }
      
      // Convert map to array
      const projectArray = Array.from(allProjects.values());
      
      // Sort by display name
      projectArray.sort((a, b) => {
        return a.display_name.localeCompare(b.display_name);
      });
      
      console.log(`Found ${projectArray.length} total projects`, projectArray);
      
      return { 
        data: projectArray, 
        error: hasErrors ? { message: 'Some project retrieval methods encountered errors (see console)' } : null,
        partial: hasErrors
      };
      
    } catch (error) {
      console.error('Unexpected error in getUserProjects:', error);
      return { data: [], error };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return { data: [], error };
  }
}

// Associate a user with a project
async function associateUserWithProject(email, projectId) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: { message: 'Supabase client not initialized' } };
  
  try {
    // Try to insert into user_projects table
    try {
      const { error } = await supabase
        .from('user_projects')
        .insert({ user_email: email, project_id: projectId });
        
      if (error && error.code !== '23505' && error.code !== '42P01') { // Ignore unique violation and table not found errors
        return { error };
      }
    } catch (err) {
      console.log('DEVELOPMENT MODE: Could not insert into user_projects table, likely does not exist yet');
    }
    
    // Update owner_email in dynamic_content table
    try {
      const { error: updateError } = await supabase
        .from('dynamic_content')
        .update({ owner_email: email })
        .eq('project_id', projectId)
        .is('owner_email', null);
        
      if (updateError && updateError.code !== '42P01') { // Ignore table not found errors
        return { error: updateError };
      }
    } catch (err) {
      console.log('DEVELOPMENT MODE: Could not update owner_email in dynamic_content');
    }
    
    return { error: null };
  } catch (err) {
    console.error('Error associating user with project:', err);
    return { error: { message: 'Error associating user with project' } };
  }
}

// Export all functions
window.SupabaseAuth = {
  signIn,
  signUp,
  signOut,
  getSession,
  getUser,
  isAdmin,
  getUserProjects,
  associateUserWithProject,
  getSupabaseClient
};
