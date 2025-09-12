import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Briefcase } from 'lucide-react';

const MyJobs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">
          Manage your job postings and view applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-6 w-6 mr-2" />
            Your Job Postings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet</p>
            <p className="text-sm text-gray-400">Job management functionality will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyJobs;