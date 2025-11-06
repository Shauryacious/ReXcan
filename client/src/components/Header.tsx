import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header 
      className="sticky top-0 z-50 shadow-lg"
      style={{
        backgroundColor: '#002D62'
      }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="ReXcan Logo" 
              className="h-10 w-auto group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-bold text-white">
              ReXcan
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-rexcan-bright-cyan-primary transition-colors font-medium"
              style={{ color: '#FFFFFF' }}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-white hover:text-rexcan-bright-cyan-primary transition-colors font-medium"
              style={{ color: '#FFFFFF' }}
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-rexcan-bright-cyan-primary transition-colors font-medium"
              style={{ color: '#FFFFFF' }}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-rexcan-bright-cyan-primary transition-colors font-medium"
              style={{ color: '#FFFFFF' }}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-rexcan-bright-cyan-primary transition-colors font-medium"
              style={{ color: '#FFFFFF' }}
            >
              Login
            </Link>
            <Link
              to="/demo"
              className="px-6 py-2 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
              style={{
                backgroundColor: '#00FFD8',
                color: '#002D62'
              }}
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
