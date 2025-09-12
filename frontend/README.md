# JobPortal Frontend 🎨

A modern, responsive React application built with Vite, featuring beautiful UI with Tailwind CSS, comprehensive job search functionality, and seamless user experience.

## 🌟 Features

### 🎯 Core Functionality
- **Job Search & Discovery** - Advanced search with filters for location, job type, and experience level
- **User Authentication** - Secure login/registration with role-based access (Candidate/Recruiter)
- **Responsive Design** - Mobile-first approach that works on all devices
- **Real-time Updates** - Dynamic content loading and state management

### 👨‍💼 For Job Seekers
- 🔍 **Advanced Job Search** - Filter by title, location, company, salary, and job type
- 💾 **Save Jobs** - Bookmark interesting opportunities for later
- 📱 **Mobile Optimized** - Job search on-the-go with responsive design
- 🎯 **Job Details** - Comprehensive job information with company details

### 🏢 For Recruiters
- 📝 **Post Jobs** - Create detailed job listings with rich descriptions
- 🏢 **Company Management** - Manage company profiles and branding
- 📊 **My Jobs Dashboard** - Track and manage all posted jobs
- 👥 **Application Management** - Review and manage candidate applications

### 🎨 UI/UX Features
- **Modern Design** - Clean, professional interface with Tailwind CSS
- **Interactive Components** - Hover effects, animations, and smooth transitions
- **Accessibility** - WCAG compliant design with keyboard navigation
- **Loading States** - Skeleton loaders and progress indicators

## 🏗️ Architecture

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API service functions
│   ├── assets/         # Images, icons, and static files
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication related components
│   │   └── ui/         # Generic UI components
│   ├── contexts/       # React context providers
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
```

## 📦 Tech Stack

### Core Technologies
- ⚛️ **React 19** - Latest React with modern hooks and concurrent features
- ⚡ **Vite 7** - Lightning-fast build tool and development server
- 🧭 **React Router DOM 7** - Client-side routing with data loading

### Styling & UI
- 🎨 **Tailwind CSS 3** - Utility-first CSS framework
- 🎯 **Lucide React** - Beautiful, customizable SVG icons
- 📱 **Responsive Design** - Mobile-first approach with breakpoint system

### State Management & APIs
- 🔄 **React Context** - Global state management for authentication
- 📡 **Axios** - HTTP client for API communication
- 🔐 **JWT Authentication** - Secure token-based authentication

### Development Tools
- 🔧 **ESLint 9** - Code linting and formatting
- 🚀 **PostCSS** - CSS processing with Autoprefixer
- 📦 **npm** - Package management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API server running

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   ```
   The application will open in your default browser
   ```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Component Architecture

### 📁 Component Structure

#### `/components/ui/` - Reusable UI Components
```javascript
// Button Component
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Input Component
<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={setEmail}
  error={emailError}
/>

// Card Component
<Card className="p-6">
  <Card.Header>Title</Card.Header>
  <Card.Content>Content here</Card.Content>
</Card>
```

#### `/components/auth/` - Authentication Components
- `LoginModal.jsx` - Login form with validation
- `RegisterModal.jsx` - Registration form with role selection

#### `/components/` - Feature Components
- `Header.jsx` - Navigation with authentication state
- `ProtectedRoute.jsx` - Route protection based on user role

### 📄 Page Components

#### `/pages/` - Main Application Pages
- `Home.jsx` - Landing page with job search and featured content
- `Jobs.jsx` - Job listings with search and filtering
- `JobDetails.jsx` - Detailed job view with application functionality
- `Companies.jsx` - Company directory and profiles
- `PostJob.jsx` - Job creation form (Recruiters only)
- `MyJobs.jsx` - Recruiter dashboard for managing jobs
- `SavedJobs.jsx` - User's saved/bookmarked jobs

## 🔧 State Management

### Authentication Context
```javascript
// useAuth Hook Usage
const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login(email, password);

// Logout
logout();

// Check authentication status
if (isAuthenticated) {
  // User is logged in
}
```

### Context Providers
- `AuthContext` - Global authentication state
- User information and authentication status
- Login/logout functionality
- Role-based access control

## 📡 API Integration

### API Services (`/src/api/`)

#### Authentication API
```javascript
import { authAPI } from '../api/auth';

// Register user
await authAPI.register(name, email, password, role);

// Login user
const response = await authAPI.login(email, password);

// Get current user
const user = await authAPI.getCurrentUser();
```

#### Jobs API
```javascript
import { jobsAPI } from '../api/jobs';

// Get all jobs with filters
const jobs = await jobsAPI.getJobs({ search, location, jobType });

// Get specific job
const job = await jobsAPI.getJob(jobId);

// Create job (Recruiter)
await jobsAPI.createJob(jobData);

// Update job (Recruiter)
await jobsAPI.updateJob(jobId, updateData);
```

#### Companies API
```javascript
import { companiesAPI } from '../api/companies';

// Get all companies
const companies = await companiesAPI.getCompanies();

// Create company (Recruiter)
await companiesAPI.createCompany(companyData);
```

## 🎨 Styling Guide

### Tailwind CSS Classes

#### Common Patterns
```jsx
// Buttons
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"

// Cards
className="bg-white shadow-md rounded-lg p-6 border border-gray-200"

// Input Fields
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"

// Responsive Design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

#### Color Palette
- **Primary:** Blue (`blue-600`, `blue-700`)
- **Success:** Green (`green-600`, `green-700`)
- **Warning:** Yellow (`yellow-600`, `yellow-700`)
- **Error:** Red (`red-600`, `red-700`)
- **Neutral:** Gray (`gray-100` to `gray-900`)

### Custom CSS Classes
```css
/* Global styles in index.css */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors;
}

.card {
  @apply bg-white shadow-md rounded-lg p-6 border border-gray-200;
}
```

## 🧭 Routing Structure

```javascript
// App.jsx routing configuration
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />
  <Route path="/companies" element={<Companies />} />
  <Route path="/saved-jobs" element={<SavedJobs />} />
  
  {/* Protected Routes for Recruiters */}
  <Route path="/post-job" element={
    <ProtectedRoute requiredRole="recruiter">
      <PostJob />
    </ProtectedRoute>
  } />
  
  <Route path="/my-jobs" element={
    <ProtectedRoute requiredRole="recruiter">
      <MyJobs />
    </ProtectedRoute>
  } />
</Routes>
```

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- `sm:` - 640px and up (tablets)
- `md:` - 768px and up (small laptops)
- `lg:` - 1024px and up (desktops)
- `xl:` - 1280px and up (large screens)

### Mobile-First Approach
```jsx
<div className="
  grid grid-cols-1        // 1 column on mobile
  sm:grid-cols-2          // 2 columns on tablet
  lg:grid-cols-3          // 3 columns on desktop
  gap-4 sm:gap-6          // Responsive spacing
">
```

## 🔍 Search & Filtering

### Job Search Features
- **Text Search** - Search by job title, company, or description
- **Location Filter** - Filter by city, state, or remote
- **Job Type Filter** - Full-time, part-time, contract, internship
- **Experience Level** - Entry, mid-level, senior, executive
- **Salary Range** - Min/max salary filtering
- **Company Filter** - Filter by specific companies

### Search Implementation
```javascript
const [filters, setFilters] = useState({
  search: '',
  location: '',
  jobType: '',
  experienceLevel: '',
  salaryMin: '',
  salaryMax: ''
});

// Apply filters
const filteredJobs = await jobsAPI.getJobs(filters);
```

## 🛠️ Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations
- Follow consistent naming conventions
- Use TypeScript-style prop validation

### Component Development
```jsx
// Component template
const ComponentName = ({ prop1, prop2, ...props }) => {
  const [state, setState] = useState(initialValue);
  
  const handleAction = async () => {
    try {
      // Async operation
      setState(newValue);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="component-styles" {...props}>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Error Handling
```javascript
// API error handling
try {
  const response = await apiCall();
  setData(response.data);
} catch (error) {
  setError(error.message || 'Something went wrong');
  console.error('API Error:', error);
}
```

## 🔧 Build & Deployment

### Production Build
```bash
npm run build
```

### Build Output
```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js # Bundled JavaScript
│   └── index-[hash].css # Bundled CSS
└── static/             # Static assets
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI and deploy
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
# Build and deploy
npm run build
# Upload dist/ folder to Netlify or connect GitHub
```

#### Custom Server
```bash
# Build for production
npm run build
# Serve static files from dist/ directory
```

#### Docker
```dockerfile
# Multi-stage build for production
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🧪 Testing (Future Enhancement)

### Recommended Testing Stack
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing

### Test Structure
```
src/
├── __tests__/          # Unit tests
├── components/
│   └── __tests__/      # Component tests
└── pages/
    └── __tests__/      # Page tests
```

## 🚀 Performance Optimization

### Implemented Optimizations
- **Code Splitting** - Automatic route-based splitting with Vite
- **Asset Optimization** - Image compression and lazy loading
- **Bundle Analysis** - Optimized bundle size with tree shaking
- **Caching** - Browser caching for static assets

### Best Practices
- Minimize bundle size
- Optimize images (WebP format)
- Implement lazy loading for routes
- Use React.memo for expensive components
- Debounce search inputs

## 🐛 Troubleshooting

### Common Issues

**Development server not starting:**
```bash
Error: Port already in use
```
- Change port: `npm run dev -- --port 3000`
- Stop conflicting processes
- Check system configuration

**Styling issues:**
```bash
# Reinstall styling dependencies
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**API connection issues:**
- Check backend server is running
- Verify API configuration
- Check network connectivity

**Authentication issues:**
```javascript
// Clear browser storage
localStorage.clear();
sessionStorage.clear();
// Refresh the page
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Follow component development guidelines
3. Test responsive design on multiple devices
4. Ensure accessibility compliance
5. Update documentation as needed

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] All components are responsive
- [ ] Error handling is implemented
- [ ] Loading states are added
- [ ] Documentation is updated

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Build something amazing!** ✨🚀
