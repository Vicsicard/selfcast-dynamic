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
    
    // DEVELOPMENT MODE: If user_projects table doesn't exist, show all projects for admins
    // and no projects for regular users
    try {
      if (adminStatus) {
        // Admin user - get all distinct project IDs
        const { data, error } = await supabase
          .from('dynamic_content')
          .select('project_id')
          .order('project_id');
          
        if (error) {
          return { data: [], error };
        }
        
        // Extract unique project IDs
        const uniqueProjects = [...new Set(data.map(item => item.project_id))];
        return { data: uniqueProjects.map(id => ({ project_id: id })), error: null };
      } else {
        // Regular user - get only their projects
        const { data, error } = await supabase
          .from('user_projects')
          .select('project_id')
          .eq('user_email', email)
          .order('project_id');
          
        if (error) {
          // If table doesn't exist, check for projects with matching email
          if (error.code === '42P01') {
            console.log('DEVELOPMENT MODE: user_projects table not found, checking for email match in dynamic_content');
            
            // Look for projects with matching email in dynamic_content
            const { data: emailData, error: emailError } = await supabase
              .from('dynamic_content')
              .select('project_id')
              .eq('key', 'email_address')
              .eq('content', email)
              .order('project_id');
              
            if (emailError) {
              console.error('Error finding projects by email:', emailError);
              return { data: [], error: emailError };
            }
            
            // Extract unique project IDs
            const uniqueProjects = [...new Set(emailData.map(item => item.project_id))];
            return { data: uniqueProjects.map(id => ({ project_id: id })), error: null };
          }
          
          return { data: [], error };
        }
        
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error getting user projects:', err);
      
      // DEVELOPMENT FALLBACK: If all else fails, show all projects for admins
      if (adminStatus) {
        console.log('DEVELOPMENT FALLBACK: Showing all projects for admin user');
        const { data, error } = await supabase
          .from('dynamic_content')
          .select('project_id')
          .order('project_id');
          
        if (error) {
          return { data: [], error };
        }
        
        // Extract unique project IDs
        const uniqueProjects = [...new Set(data.map(item => item.project_id))];
        return { data: uniqueProjects.map(id => ({ project_id: id })), error: null };
      }
      
      return { data: [], error: { message: 'Error getting user projects' } };
    }
  } catch (err) {
    console.error('Error getting user projects:', err);
    return { data: [], error: { message: 'Error getting user projects' } };
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
  associateUserWithProject
};
