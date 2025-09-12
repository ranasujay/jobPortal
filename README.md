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
   # Configure environment variables (see backend/README.md)
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - The application will be available in your browser
   - Backend API will run on the configured port

## ⚙️ Configuration

### Backend Configuration
The backend requires environment configuration for:
- Database connection
- Authentication secrets
- Server settings
- Security configurations

### Frontend Configuration
The frontend connects to the backend API and requires minimal configuration.

**Note:** Detailed configuration instructions are provided in the respective backend and frontend directories.

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

## 🔧 API Overview

The backend provides RESTful APIs for:

### Authentication
- User registration and login
- Role-based access control

### Jobs
- Job listings and search
- Job creation and management
- Job applications

### Companies
- Company profiles
- Company-specific job listings

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