import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';

const PostJob = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">
          Create a job posting to attract top talent
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="h-6 w-6 mr-2" />
            Job Posting Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Job posting form will be implemented here</p>
            <Button>Coming Soon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJob;