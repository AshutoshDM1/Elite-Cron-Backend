# User Authentication System

## Overview

This authentication system uses a simple username-based authentication via HTTP headers. Users must be registered in the database and provide their username in the `x-username` header for all API requests.

## Setup

### 1. Update Database Schema

The User model is already defined in `prisma/schema.prisma`. To sync it with your database:

```bash
npm run push
```

### 2. Regenerate Prisma Client

```bash
npm run gen
```

## Managing Users

### Interactive CLI Tool

Run the user management CLI:

```bash
npm run user:manage
```

This will launch an interactive menu where you can:
1. **Add new user** - Create a new username
2. **List all users** - View all registered users
3. **Delete user** - Remove a user by username
4. **Exit** - Close the CLI

### Example Usage

```
╔════════════════════════════════════╗
║   User Management CLI Tool         ║
╚════════════════════════════════════╝

Choose an option:
  1. Add new user
  2. List all users
  3. Delete user
  4. Exit

Enter your choice (1-4): 1
Enter username: john_doe

✅ User created successfully!
   ID: 123e4567-e89b-12d3-a456-426614174000
   Username: john_doe
   Created: 2/8/2026, 10:30:00 AM
```

## Using the API with Authentication

### Making Authenticated Requests

All `/api/v1/cron` endpoints require authentication. Include the `x-username` header:

```bash
# Get all crons
curl -H "x-username: john_doe" http://localhost:3000/api/v1/cron

# Create a cron
curl -X POST \
  -H "x-username: john_doe" \
  -H "Content-Type: application/json" \
  -d '{"interval": "*/5 * * * *", "url": "https://example.com"}' \
  http://localhost:3000/api/v1/cron

# Get cron by ID
curl -H "x-username: john_doe" \
  http://localhost:3000/api/v1/cron/123e4567-e89b-12d3-a456-426614174000

# Delete a cron
curl -X DELETE \
  -H "x-username: john_doe" \
  http://localhost:3000/api/v1/cron/123e4567-e89b-12d3-a456-426614174000
```

### Frontend Integration (Elite-Cron)

Update your `api.ts` service to include the username header:

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Add username to all requests
api.interceptors.request.use((config) => {
  // Get username from localStorage, environment, or user input
  const username = localStorage.getItem('username') || 'default_user';
  config.headers['x-username'] = username;
  return config;
});

export default api;
```

### Error Responses

#### 401 - No Username Provided
```json
{
  "success": false,
  "message": "Authentication required. Please provide username in x-username header.",
  "statusCode": 401
}
```

#### 403 - Invalid Username
```json
{
  "success": false,
  "message": "Invalid username. User not found.",
  "statusCode": 403
}
```

## Testing with Swagger

The Swagger documentation now includes authentication support:

1. Go to http://localhost:3000/api-docs
2. Click the **Authorize** button (🔓 icon)
3. Enter your username in the `x-username` field
4. Click **Authorize**
5. All API requests will now include your username

## Programmatic User Management

You can also use the user service directly in your code:

```typescript
import { createUser, getUserByUsername, getAllUsers, deleteUser } from './services/user.service';

// Create a user
const user = await createUser('john_doe');

// Check if user exists
const exists = await userExists('john_doe');

// Get user by username
const user = await getUserByUsername('john_doe');

// Get all users
const users = await getAllUsers();

// Delete user
await deleteUser('john_doe');
```

## Middleware Options

### Required Authentication
Applied to `/api/v1/cron` routes - returns 401/403 if authentication fails:

```typescript
import { authenticateUser } from './middleware/auth.middleware';
router.use(authenticateUser);
```

### Optional Authentication
For endpoints that work better with auth but don't require it:

```typescript
import { optionalAuth } from './middleware/auth.middleware';
router.use(optionalAuth);
```

## Security Considerations

⚠️ **Important**: This is a simple authentication system for internal tools or development:

1. **Not suitable for production** - Username in header is not secure
2. **No password protection** - Anyone with a valid username can access
3. **No token expiration** - Username remains valid indefinitely
4. **No rate limiting** - Consider adding rate limiting for production

### For Production, Consider:
- JWT tokens with expiration
- Password hashing (bcrypt)
- OAuth 2.0 / OpenID Connect
- API keys with rate limiting
- HTTPS only

## Quick Start Checklist

- [ ] Run `npm run push` to sync database
- [ ] Run `npm run gen` to generate Prisma client
- [ ] Run `npm run user:manage` to add your first user
- [ ] Test with `curl -H "x-username: your_username" http://localhost:3000/api/v1/cron`
- [ ] Update frontend to include `x-username` header in all API requests
- [ ] Check Swagger docs at http://localhost:3000/api-docs

## Troubleshooting

### "User not found" error
- Make sure you created the user using `npm run user:manage`
- Check username spelling (case-sensitive)
- List all users to verify: Choose option 2 in the CLI

### CLI won't start
- Make sure you have run `npm run gen` after schema changes
- Check that DATABASE_URL is set in .env file
- Verify PostgreSQL is running

### Headers not being sent
- Check browser network tab for outgoing requests
- Verify axios interceptor is configured correctly
- Make sure header name is exactly `x-username` (lowercase)
