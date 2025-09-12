import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Heart } from 'lucide-react';

const SavedJobs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
        <p className="text-gray-600">
          Keep track of jobs you're interested in
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-6 w-6 mr-2" />
            Your Saved Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't saved any jobs yet</p>
            <p className="text-sm text-gray-400">Saved jobs functionality will be implemented here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedJobs;