# JobPortal Backend API 🚀

A robust Node.js + Express REST API for the JobPortal application, featuring MongoDB integration, JWT authentication, and comprehensive job management functionality.

## 🌟 Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Role-Based Access** - Separate permissions for candidates and recruiters
- 💼 **Job Management** - Full CRUD operations for job postings
- 🏢 **Company Management** - Company profiles and branding
- 🔍 **Advanced Search** - Filter jobs by multiple criteria
- 🛡️ **Security First** - Helmet, CORS, input validation, and rate limiting
- 📊 **Error Handling** - Comprehensive error responses with logging
- 🚀 **Performance** - Optimized MongoDB queries and caching

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/      # Custom middleware functions
│   ├── models/         # MongoDB schemas and models
│   ├── routes/         # API route definitions
│   └── server.js       # Application entry point
├── .env               # Environment variables
└── package.json       # Dependencies and scripts
```

## 📦 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Helmet.js, CORS, bcryptjs
- **Logging:** Morgan
- **Development:** Nodemon

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create and configure environment file**
   ```bash
   # Create environment configuration file
   # Contact system administrator for production values
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available on the configured port.

## ⚙️ Configuration

The application requires environment configuration for:

### Server Configuration
- Application environment (development/production)
- Server port configuration
- Application secrets and keys

### Database Configuration
- Database connection string
- Database authentication credentials
- Connection pool settings

### Authentication Configuration
- JWT secret keys and expiration settings
- Password hashing configuration
- Session management settings

### Security Configuration
- CORS allowed origins
- Rate limiting settings
- Security middleware configuration

**Important:** All sensitive configuration values should be provided through environment variables and never committed to version control.

### Database Setup

The application uses MongoDB as the database. You can use either:

**Local MongoDB Installation:**
- Install MongoDB Community Edition
- Start MongoDB service
- Configure connection string in environment variables

**Cloud Database (Recommended for Production):**
- Use MongoDB Atlas or similar cloud service
- Create database cluster
- Configure connection string with authentication

## 📡 API Documentation

### Base URL
The API is available at the configured base URL.

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |

### Job Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/jobs` | Get all jobs | Public |
| GET | `/jobs/:id` | Get specific job | Public |
| POST | `/jobs` | Create new job | Recruiter |
| PUT | `/jobs/:id` | Update job | Recruiter (own jobs) |
| DELETE | `/jobs/:id` | Delete job | Recruiter (own jobs) |
| GET | `/jobs/my-jobs` | Get recruiter's jobs | Recruiter |

### Company Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/companies` | Get all companies | Public |
| GET | `/companies/:id` | Get specific company | Public |
| POST | `/companies` | Create company | Recruiter |
| PUT | `/companies/:id` | Update company | Recruiter (own company) |
| GET | `/companies/my-company` | Get recruiter's company | Recruiter |

### Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/health` | Server health status | Public |

## 📊 Data Models

### User Schema
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['candidate', 'recruiter'], default: 'candidate'),
  createdAt: Date,
  updatedAt: Date
}
```

### Job Schema
```javascript
{
  title: String (required, max 100 chars),
  description: String (required, max 5000 chars),
  requirements: String (required, max 3000 chars),
  location: String (required, max 100 chars),
  salary_min: Number (min 0),
  salary_max: Number (min 0),
  job_type: String (enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']),
  experience_level: String (enum: ['entry', 'mid', 'senior', 'executive']),
  company: ObjectId (ref: 'Company'),
  recruiter: ObjectId (ref: 'User'),
  skills: [String],
  benefits: [String],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Company Schema
```javascript
{
  name: String (required, max 100 chars),
  description: String (max 2000 chars),
  website: String (URL validated),
  location: String (max 100 chars),
  industry: String,
  size: String (enum: ['1-10', '11-50', '51-200', '201-1000', '1000+']),
  logo: String (URL),
  recruiter: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "candidate"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Create Job (Recruiter)
```bash
POST /api/jobs
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Frontend Developer",
  "description": "We are looking for a skilled frontend developer...",
  "requirements": "3+ years experience with React...",
  "location": "Remote",
  "salary_min": 80000,
  "salary_max": 120000,
  "job_type": "full-time",
  "experience_level": "mid",
  "skills": ["React", "JavaScript", "CSS"],
  "benefits": ["Health Insurance", "Remote Work"]
}
```

### Search Jobs
```bash
GET /api/jobs?search=developer&location=city&job_type=full-time&page=1&limit=10
```

## 🛡️ Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Tokens:** Secure authentication with expiration
- **Input Validation:** Mongoose schema validation
- **SQL Injection Protection:** MongoDB native protection
- **CORS Configuration:** Configurable cross-origin requests
- **Helmet.js:** Security headers protection
- **Rate Limiting:** Protection against brute force attacks
- **Environment Variables:** Sensitive data protection

## 🔍 Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

### Development Guidelines
1. Follow REST API conventions
2. Use async/await for asynchronous operations
3. Implement proper error handling
4. Add input validation for all endpoints
5. Use meaningful HTTP status codes
6. Document all new endpoints

### Adding New Routes
1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add middleware if needed
4. Update this documentation

## 🚀 Deployment

### Production Environment
1. Set appropriate environment configuration
2. Use production database instance
3. Configure secure authentication secrets
4. Set up reverse proxy and load balancing
5. Enable SSL/HTTPS
6. Configure logging and monitoring
7. Set up automated backups
8. Configure security policies

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Logging

The application uses standard logging for HTTP requests and application events.

**Development Logging:**
- HTTP request logging
- Error logging with stack traces
- Debug information for development

**Production Logging:**
- Structured logging format
- Error tracking and monitoring
- Performance metrics
- Security event logging

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update API documentation
5. Test all endpoints thoroughly

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)

## 🐛 Troubleshooting

### Common Issues

**Configuration Error:**
```bash
Error: Missing required configuration
```
- Check environment variables are set
- Verify configuration file exists
- Ensure all required values are provided

**Database Connection Error:**
```bash
Error: Cannot connect to database
```
- Check database server is running
- Verify connection configuration
- Ensure network connectivity and authentication

**Authentication Error:**
```bash
Error: Invalid or missing token
```
- Check authentication configuration
- Verify token format in Authorization header
- Ensure token hasn't expired

**Port Conflict:**
```bash
Error: Address already in use
```
- Change port in configuration
- Stop conflicting processes
- Check firewall settings

---

**Need help?** Open an issue or contact the development team! 🚀