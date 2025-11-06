import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Home from '@/pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<div className="min-h-screen bg-gradient-to-b from-rexcan-light-grey-secondary to-white"><div className="container mx-auto px-6 py-20"><h1 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-4">Features</h1><p className="text-rexcan-dark-blue-secondary text-lg">Coming soon...</p></div></div>} />
            <Route path="/about" element={<div className="min-h-screen bg-gradient-to-b from-rexcan-light-grey-secondary to-white"><div className="container mx-auto px-6 py-20"><h1 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-4">About</h1><p className="text-rexcan-dark-blue-secondary text-lg">Coming soon...</p></div></div>} />
            <Route path="/contact" element={<div className="min-h-screen bg-gradient-to-b from-rexcan-light-grey-secondary to-white"><div className="container mx-auto px-6 py-20"><h1 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-4">Contact</h1><p className="text-rexcan-dark-blue-secondary text-lg">Coming soon...</p></div></div>} />
            <Route path="/login" element={<div className="min-h-screen bg-gradient-to-br from-rexcan-dark-blue-primary to-rexcan-dark-blue-secondary"><div className="container mx-auto px-6 py-20"><h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Login</h1><p className="text-rexcan-light-grey-secondary text-lg">Coming soon...</p></div></div>} />
            <Route path="/demo" element={<div className="min-h-screen bg-gradient-to-br from-rexcan-dark-blue-primary to-rexcan-dark-blue-secondary"><div className="container mx-auto px-6 py-20"><h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Demo</h1><p className="text-rexcan-light-grey-secondary text-lg">Coming soon...</p></div></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
