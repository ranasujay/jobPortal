import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companiesAPI } from '../api/companies';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Building, Users, MapPin } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const companiesData = await companiesAPI.getCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
        <p className="text-gray-600">
          Explore companies and their job opportunities
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 w-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500">
              Companies will appear here once they're added to the platform.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link key={company._id} to={`/companies/${company._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=3b82f6&color=ffffff&bold=true&format=png`}
                      alt={`${company.name} logo`}
                      className="h-16 w-16 rounded-lg object-cover mr-4 border border-gray-200"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=6b7280&color=ffffff&bold=true&format=png`;
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <p className="text-sm text-gray-500">{company.industry}</p>
                      )}
                    </div>
                  </div>
                  
                  {company.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {company.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {company.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {company.location}
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {company.size}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;