import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rexcan-light-grey-secondary to-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-rexcan-dark-blue-secondary text-lg mb-6">
            Dashboard content coming soon...
          </p>
          <Link
            to="/profile"
            className="inline-block text-[#00FFD8] hover:text-[#39FF14] transition-colors font-medium"
          >
            → View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
