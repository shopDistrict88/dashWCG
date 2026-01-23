# WCG Dashboard - Quick Reference

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build locally

# Deployment
vercel                   # Deploy to Vercel
netlify deploy --prod    # Deploy to Netlify
```

## 📦 Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client configuration |
| `src/services/DatabaseService.ts` | Database CRUD operations |
| `src/context/AuthContext.tsx` | Authentication logic |
| `src/types/database.ts` | TypeScript type definitions |
| `supabase-schema.sql` | Database schema SQL |
| `.env` | Environment variables (create this) |

## 🔑 Environment Variables

Create `.env` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-svcacct-yuVBpCefvPe52YRF0hSqKkH4RbMFnbcmKFrtw3AK...
```

## 📊 Database Service Usage

### Import
```typescript
import { db } from '../services/DatabaseService'
```

### Check Configuration
```typescript
if (db.isConfigured()) {
  // Supabase is set up
}
```

### Fetch Data
```typescript
// Get all projects for user
const { data, error } = await db.getProjects(userId)

// Get single project
const { data, error } = await db.getProject(projectId)

// Get content with filter
const { data, error } = await db.getContent(userId, 'published')
```

### Create Data
```typescript
const { data, error } = await db.createProject({
  user_id: user.id,
  name: 'My Project',
  description: 'A cool project',
  status: 'active',
  type: 'creative'
})
```

### Update Data
```typescript
const { data, error } = await db.updateProject(projectId, {
  name: 'Updated Name',
  status: 'completed'
})
```

### Delete Data
```typescript
const { error } = await db.deleteProject(projectId)
```

### Upload File
```typescript
const file = event.target.files[0]
const { data, error } = await db.uploadFile(
  'music',  // bucket name
  `${user.id}/${file.name}`,  // path
  file  // File object
)
// Returns: { path, url }
```

## 🔐 Authentication

### Get Current User
```typescript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Hello {user.email}</div>
}
```

### Login
```typescript
const { user, login } = useAuth()
const { error } = await login(email, password)
```

### Signup
```typescript
const { signup } = useAuth()
const { error } = await signup(email, password, name)
```

### Logout
```typescript
const { logout } = useAuth()
logout()
```

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) { }

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) { }

/* Mobile */
@media (max-width: 768px) { }
```

## 🎨 CSS Modules

### Import
```typescript
import styles from './MyComponent.module.css'
```

### Usage
```typescript
<div className={styles.container}>
  <h1 className={styles.title}>Hello</h1>
</div>
```

### Conditional Classes
```typescript
className={`${styles.button} ${isActive ? styles.active : ''}`}
```

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles | id, email, name, role |
| `projects` | Projects | user_id, name, status, type |
| `content` | Content | user_id, title, type, status |
| `brands` | Brands | user_id, name, visual_identity |
| `music_files` | Music | user_id, file_url, duration |
| `design_files` | Designs | user_id, file_url, dimensions |
| `ideas` | Ideas | user_id, title, validation_score |
| `experiments` | Tests | user_id, hypothesis, results |
| `ai_conversations` | AI | user_id, messages, context |
| `social_connections` | Social | user_id, platform, access_token |

## 🛣️ Routes

| Path | Component | Protected |
|------|-----------|-----------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/dashboard` | Dashboard/Home | Yes |
| `/dashboard/*` | Dashboard pages | Yes |

## 🎯 Type Definitions

### User
```typescript
User {
  id: string
  email: string
  user_metadata: {
    name?: string
  }
}
```

### Database Row Types
```typescript
// Imported from src/types/database.ts
import type { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Content = Database['public']['Tables']['content']['Row']
```

## 🔧 Troubleshooting

### Development server won't start
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run build
```

### Supabase errors
```bash
# Check configuration
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify in code
console.log(db.isConfigured())
```

### TypeScript errors
```bash
# Check types
npx tsc --noEmit

# Restart VS Code TypeScript server
# CMD/CTRL + Shift + P → "TypeScript: Restart TS Server"
```

## 📞 Support Resources

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- TypeScript Docs: https://www.typescriptlang.org/docs

## 🎨 Design Tokens

```css
/* Colors */
--black: #000000
--dark-gray: #1a1a1a
--white: #ffffff
--light-gray: #d4d4d4
--purple-start: #8b5cf6
--purple-end: #a855f7

/* Spacing */
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 48px

/* Transitions */
--transition-fast: 150ms
--transition-normal: 300ms
--transition-slow: 500ms
```

## ⚡ Performance Tips

1. Use `React.memo()` for expensive components
2. Implement virtualization for long lists
3. Lazy load routes with `React.lazy()`
4. Optimize images (WebP format)
5. Use Supabase Realtime sparingly
6. Enable caching in Supabase Storage
7. Minimize bundle size with code splitting

## 🔐 Security Best Practices

1. Never commit `.env` file
2. Use Row Level Security in Supabase
3. Validate all user input
4. Sanitize HTML content
5. Use HTTPS in production
6. Rotate API keys periodically
7. Monitor Supabase dashboard for suspicious activity

## 📈 Monitoring

### Supabase Dashboard
- Database → Check table sizes
- Authentication → Monitor user signups
- Storage → Check usage
- Logs → Review errors

### Browser DevTools
- Console → Check for errors
- Network → Monitor API calls
- Performance → Check load times
- Application → Verify local storage

---

**Need more help?** Check [PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md) for detailed instructions.
