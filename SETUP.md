# is-an.ai Frontend Setup

## API Integration

This frontend integrates with the is-an.ai API for subdomain management and GitHub SSO authentication.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.is-an.ai

# GitHub OAuth Configuration (for production)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
```

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
- ✅ Error handling and user feedback

### Authentication Flow

- ✅ GitHub OAuth integration
- ✅ Automatic token management
- ✅ Protected routes
- ✅ Session persistence

## API Endpoints Used

### Authentication

- `POST /v1/dev/login` - Development login
- `POST /v1/user/auth/github` - GitHub OAuth callback

### Subdomains

- `GET /v1/domain/my` - Get user's subdomains
- `GET /v1/domain/name/:name` - Check subdomain availability
- `POST /v1/domain` - Create new subdomain
- `PUT /v1/domain/:name` - Update subdomain
- `DELETE /v1/domain/:name` - Delete subdomain

## Component Architecture

### Hooks

- `useAuth` - Authentication state management
- `useSubdomains` - Subdomain operations

### Components

- `SubdomainChecker` - Interactive availability checker
- `BrowserMockup` - Reusable browser interface
- Dashboard components for subdomain management

## Development Notes

### For Local Development

- Use the dev login button to authenticate without GitHub setup
- The dev login endpoint (`/v1/dev/login`) works without authentication
- All API errors are properly handled and displayed to users

### For Production

- Configure GitHub OAuth app with proper client ID
- Set correct redirect URI for your domain
- Update API base URL to production endpoint

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
