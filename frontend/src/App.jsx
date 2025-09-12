import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import SavedJobs from './pages/SavedJobs';
import Companies from './pages/Companies';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/companies" element={<Companies />} />
              
              {/* Protected Routes */}
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-jobs" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <MyJobs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/saved-jobs" 
                element={
                  <ProtectedRoute>
                    <SavedJobs />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
