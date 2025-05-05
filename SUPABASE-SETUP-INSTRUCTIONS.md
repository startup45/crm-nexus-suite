
# Supabase Setup Instructions for CRM Nexus

Follow these steps to set up Supabase for the CRM Nexus application.

## 1. Initial Setup

1. Connect your Lovable project to Supabase using the Supabase integration button
2. After connecting, access the Supabase dashboard for your project

## 2. Database Setup

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL from `supabase-setup.sql` and run it
3. This will create all necessary tables with RLS policies

## 3. Authentication Setup

1. Go to Authentication > Providers and ensure "Email" is enabled
2. Set up password policies as needed
3. Create the following test users:

| Email               | Password  | Role    |
|---------------------|-----------|---------|
| admin@crmnexus.com  | Admin123! | admin   |
| manager@crmnexus.com| Admin123! | manager |
| employee@crmnexus.com| Admin123!| employee|
| intern@crmnexus.com | Admin123! | intern  |
| client@crmnexus.com | Admin123! | client  |

4. After creating each user in the Supabase Auth section, note their user IDs
5. Update the SQL statements in the `supabase-setup.sql` file to use the actual user IDs where it says "user-id"

## 4. Environment Variables

Ensure your Lovable project has these environment variables set:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should be automatically set when you connect your Lovable project to Supabase.

## 5. Role-Based Access Control (RBAC)

The implemented RBAC system includes the following roles and permissions:

### Admin
- Full access to all modules and actions

### Manager
- Create: clients, tasks, projects, leads, messages, groups
- Read: all modules
- Update: clients, tasks, projects, leads, messages, groups
- Delete: tasks, projects, leads, messages, groups

### Employee
- Create: tasks, messages, groups
- Read: clients, tasks, projects, leads, messages, groups
- Update: tasks
- Delete: messages (own)

### Intern
- Create: messages
- Read: tasks, projects, messages, groups
- Update: none
- Delete: none

### Client
- Create: messages
- Read: messages, groups
- Update: none
- Delete: none

## 6. Testing the Integration

1. Log in with different user accounts to test the role-based permissions
2. Try sending direct messages between users
3. Create group chats and add members
4. Verify that appropriate permissions are enforced

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify that RLS policies are correctly set up in Supabase
3. Ensure user profiles have the correct role values
4. Check that environment variables are properly configured
