# JobPortal 🚀

A modern, full-stack job portal application built with **React + Vite** frontend and **Node.js + Express** backend, featuring real-time job postings, company management, and user authentication.

## 🌟 Features

### For Job Seekers
- 🔍 **Advanced Job Search** - Search by title, location, company, and more
- 💾 **Save Jobs** - Bookmark interesting opportunities
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎯 **Personalized Dashboard** - Track your applications and saved jobs

### For Recruiters
- 📝 **Post Jobs** - Create detailed job listings with rich descriptions
- 🏢 **Company Management** - Manage company profiles and branding
- 📊 **Job Analytics** - Track job performance and applications
- 👥 **Candidate Management** - Review and manage applications

### General Features
- 🔐 **Secure Authentication** - JWT-based auth with role-based access
- 🎨 **Modern UI/UX** - Built with Tailwind CSS and Lucide icons
- ⚡ **Fast Performance** - Optimized with Vite and modern React
- 🛡️ **Security First** - Helmet.js, CORS, and security best practices

## 🏗️ Architecture

```
jobPortal/
├── frontend/          # React + Vite frontend application
├── backend/           # Node.js + Express API server
└── README.md         # This file
```

### Tech Stack

**Frontend:**
- ⚛️ **React 19** - Modern React with hooks and context
- ⚡ **Vite 7** - Lightning-fast build tool and dev server
- 🎨 **Tailwind CSS 3** - Utility-first CSS framework
- 🧭 **React Router DOM 7** - Client-side routing
- 📡 **Axios** - HTTP client for API calls
- 🎯 **Lucide React** - Beautiful, customizable icons

**Backend:**
- 🚀 **Node.js** - JavaScript runtime
- 🌐 **Express 5** - Web framework
- 🍃 **MongoDB + Mongoose** - NoSQL database with ODM
- 🔑 **JWT** - JSON Web Tokens for authentication
- 🔒 **bcryptjs** - Password hashing
- 🛡️ **Helmet** - Security middleware

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ranasujay/jobPortal.git
   cd jobPortal
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### Frontend
No additional environment variables required for development.

## 📁 Project Structure

```
jobPortal/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React context providers
│   │   ├── api/              # API service functions
│   │   └── assets/           # Static assets
│   ├── public/               # Public assets
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## 🛠️ Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job (recruiter only)
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get specific company
- `POST /api/companies` - Create company (recruiter only)

For detailed API documentation, see [Backend README](./backend/README.md).

## 🎨 UI Components

The frontend includes a comprehensive component library:
- **Forms** - Input, Button, Select components
- **Layout** - Header, Footer, Container components
- **Cards** - Job cards, Company cards
- **Modals** - Login, Register, Confirmation modals

For detailed component documentation, see [Frontend README](./frontend/README.md).

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add proper comments and documentation
- Test your changes thoroughly
- Update README if needed

## 📝 License

This project is licensed under the **ISC License**.

## 👥 Authors

- **Sujay Rana** - [@ranasujay](https://github.com/ranasujay)

## 🐛 Issues & Support

Found a bug or need help? Please [open an issue](https://github.com/ranasujay/jobPortal/issues) on GitHub.

## 🙏 Acknowledgments

- Thanks to the React and Node.js communities
- Tailwind CSS for the amazing styling framework
- MongoDB for the flexible database solution

---

**Happy Job Hunting!** 🎯✨