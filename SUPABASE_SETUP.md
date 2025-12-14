# Supabase Setup Guide

This guide will help you set up Supabase for password reset and magic link authentication in the Sweat Set App.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))
- Your MongoDB connection string
- Your existing `.env.local` file (or create one from `.env.example`)

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - Project name: `workout-app` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project"

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy the following two values (that's all you need!):
   - **Project URL**: Your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Application URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Configure Email Templates

Supabase needs to be configured to send emails for password reset and magic link.

### 4.1 Configure Email Provider (Optional)

By default, Supabase uses their email service (limited to 3 emails per hour in free tier). For production, configure a custom SMTP provider:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, Mailgun, AWS SES, etc.)

### 4.2 Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Update the following templates:

#### Magic Link Template
- Subject: `Sign in to Sweat Set App`
- Template:
```html
<h2>Sign in to Sweat Set App</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink">Sign In</a></p>
<p>This link will expire in 1 hour.</p>
```

#### Password Recovery Template
- Subject: `Reset Your Password - Sweat Set App`
- Template:
```html
<h2>Reset Your Password</h2>
<p>You requested to reset your password for Sweat Set App.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .SiteURL }}/reset-password#access_token={{ .Token }}&type=recovery">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>This link will expire in 1 hour.</p>
```

## Step 5: Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   - **Site URL**: `http://localhost:3000` (update for production)
   - **Redirect URLs**: Add these:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/reset-password`
     - Your production URLs when deploying

## Step 6: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Under **Email** settings:
   - ✅ Enable Email provider
   - ✅ Confirm email (optional - you can disable this for magic links)
   - ✅ Secure email change (recommended)

## Features Implemented

### 1. Password Reset Flow
Users can reset their password if they forget it:
1. User clicks "Forgot Password?" on login page
2. User enters their email address
3. Supabase sends a password reset email
4. User clicks the link in the email
5. User enters a new password
6. Password is updated in MongoDB

**Routes:**
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- `/api/auth/forgot-password` - API endpoint to send reset email
- `/api/auth/reset-password` - API endpoint to update password

### 2. Magic Link Authentication
Users can sign in without a password:
1. User clicks "Sign in with Magic Link" on login page
2. User enters their email address
3. Supabase sends a magic link email
4. User clicks the link in the email
5. User is automatically signed in

**Routes:**
- `/login` - Toggle between password and magic link login
- `/api/auth/magic-link` - API endpoint to send magic link
- `/auth/callback` - Handles magic link authentication

## Production Deployment

When deploying to production:

1. Update environment variables with production values:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

2. Add production redirect URLs in Supabase:
   - Go to **Authentication** → **URL Configuration**
   - Add production URLs to redirect URLs list

3. Configure custom domain for Supabase emails (optional):
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Use a custom SMTP provider for better deliverability

## Troubleshooting

### Emails not sending
- Check SMTP configuration in Supabase dashboard
- Free tier has rate limits (3 emails/hour)
- Check spam folder
- Verify email templates are configured correctly

### Magic link not working
- Verify redirect URLs are configured in Supabase
- Check browser console for errors
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Password reset not working
- Check that token is being extracted from URL hash
- Verify MongoDB connection is working
- Check server logs for errors

### Environment variables not loading
- Restart your development server after adding/changing env vars
- Ensure `.env.local` file is in the root directory
- Don't commit `.env.local` to git (it should be in `.gitignore`)

## Security Notes

- Keep your `.env.local` file in `.gitignore`
- Use environment variables for all sensitive data
- In production, use a proper secrets management system
- Consider implementing rate limiting for auth endpoints
- Enable email confirmation for new signups in production

## Testing

To test the implementation:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Test password reset:
   - Click "Forgot Password?"
   - Enter a registered email
   - Check your email for the reset link
   - Follow the link and set a new password

4. Test magic link:
   - Click "Sign in with Magic Link"
   - Enter a registered email
   - Check your email for the magic link
   - Click the link to sign in

## Support

If you encounter issues:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [NextAuth.js Documentation](https://next-auth.js.org/)
- Check server logs in your terminal
- Review browser console for client-side errors
