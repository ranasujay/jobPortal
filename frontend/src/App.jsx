import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import PostJob from './pages/PostJob';
import EditJob from './pages/EditJob';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import MyCompanies from './pages/MyCompanies';
import CreateCompany from './pages/CreateCompany';
import EditCompany from './pages/EditCompany';
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
              <Route path="/companies/:id" element={<CompanyDetails />} />
              
              {/* Job Application Route */}
              <Route 
                path="/apply-job/:id" 
                element={
                  <ProtectedRoute requiredRole="candidate">
                    <ApplyJob />
                  </ProtectedRoute>
                } 
              />
              
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
                path="/job-applications/:jobId" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <JobApplications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs/:id/edit" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <EditJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-company" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <CreateCompany />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-company/:id" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <EditCompany />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-companies" 
                element={
                  <ProtectedRoute requiredRole="recruiter">
                    <MyCompanies />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/applied-jobs" 
                element={
                  <ProtectedRoute requiredRole="candidate">
                    <AppliedJobs />
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
