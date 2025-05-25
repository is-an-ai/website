# is-an.ai Frontend Setup

## Technology Stack

This is a **React + Vite** application with TypeScript, providing a fast and lightweight frontend for the is-an.ai subdomain service.

**Why Vite over Next.js?**

- No SSR overhead or hosting costs
- Faster development and build times
- Simpler deployment (static files)
- Perfect for client-side only applications

## User Registration Flow

### Quick Start (Recommended)

Users can register subdomains instantly through our web interface:

1. **Visit the website** - No technical knowledge required
2. **GitHub OAuth** - Simple one-click authentication
3. **Instant registration** - Subdomains are active immediately
4. **Dashboard management** - Easy subdomain configuration

**No GitHub PRs, no review process, no waiting.**

### Alternative: GitHub Repository Method

For advanced users who prefer the traditional approach:

1. **Fork** the [is-an.ai repository](https://github.com/is-an-ai/is-an.ai)
2. **Add DNS records** following the JSON schema
3. **Submit pull request** - Automatically processed via GitHub Actions
4. **DNS deployment** - Changes propagated to Cloudflare

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://api.is-an.ai

# GitHub OAuth Configuration (for production)
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Note:** Vite uses `VITE_` prefix instead of `NEXT_PUBLIC_` for environment variables.

## Development Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment

- Copy the environment variables above into `.env.local`
- For development, you can use the dev login endpoint without configuring GitHub OAuth

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
# or
pnpm build
```

Built files will be in the `dist` directory.

## Features Implemented

### Core API Integration

- ✅ API client with proper error handling
- ✅ JWT token management
- ✅ GitHub SSO authentication flow
- ✅ Dev environment login for testing

### Subdomain Management

- ✅ Real-time availability checking
- ✅ Subdomain validation
- ✅ User dashboard with subdomain listing
- ✅ Instant subdomain registration
- ✅ Error handling and user feedback

### Authentication Flow

- ✅ GitHub OAuth integration
- ✅ Automatic token management
- ✅ Protected routes with React Router
- ✅ Session persistence

## API Endpoints Used

### Authentication

- `POST /v1/dev/login` - Development login
- `POST /v1/user/auth/github` - GitHub OAuth callback

### Subdomains

- `GET /v1/domain/my` - Get user's subdomains
- `GET /v1/domain/name/:name` - Check subdomain availability
- `POST /v1/domain` - Create new subdomain (instant registration)
- `PUT /v1/domain/:name` - Update subdomain
- `DELETE /v1/domain/:name` - Delete subdomain

## Component Architecture

### Routing

- **React Router** for client-side routing
- **Protected routes** with authentication checks
- **History API** for navigation

### Hooks

- `useAuth` - Authentication state management with React Router
- `useSubdomains` - Subdomain operations

### Components

- `SubdomainChecker` - Interactive availability checker with instant registration
- `BrowserMockup` - Reusable browser interface
- Dashboard components for subdomain management

### Pages

- `HomePage` - Landing page with subdomain checker
- `DashboardPage` - User dashboard for managing subdomains
- `AuthCallbackPage` - GitHub OAuth callback handler

## Development Notes

### For Local Development

- Use the dev login button to authenticate without GitHub setup
- The dev login endpoint (`/v1/dev/login`) works without authentication
- All API errors are properly handled and displayed to users
- Hot reload works perfectly with Vite
- Test subdomain registration flow without affecting production

### For Production

- Configure GitHub OAuth app with proper client ID
- Set correct redirect URI for your domain
- Update API base URL to production endpoint
- Deploy static files from `dist` directory

## How Backend Integration Works

The frontend communicates with our backend API which handles:

1. **GitHub OAuth** - User authentication
2. **DNS Management** - Automatic record creation in GitHub repository
3. **Cloudflare Integration** - DNS propagation via GitHub Actions
4. **Validation** - Subdomain name and target URL validation

**No manual GitHub work required for users** - everything is automated through our API.

## Deployment

Since this is now a static React app, you can deploy to:

### Static Hosting Services

- **Vercel** (recommended for simplicity)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static file server**

### Example Deployment Commands

```bash
# Build the app
npm run build

# The dist/ directory contains all static files
# Upload these to your hosting provider
```

### Environment Variables in Production

Make sure to set the `VITE_*` environment variables in your hosting provider's dashboard.

## Error Handling

The application includes comprehensive error handling:

- Network errors
- API validation errors
- Authentication token expiration
- User-friendly error messages
- Automatic retry mechanisms

## Security Features

- JWT token stored securely in localStorage
- CSRF protection with state parameter in OAuth flow
- Input validation for subdomain names
- Proper error handling without exposing sensitive data

## Migration from Next.js

This project was migrated from Next.js to Vite for:

- **Cost savings** - No SSR hosting costs
- **Performance** - Faster development builds
- **Simplicity** - Static deployment
- **Compatibility** - Works with any hosting provider

All functionality remains the same, just with a lighter, faster foundation.
