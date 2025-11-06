import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import StatsSection from '@/components/StatsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Statistics Section */}
      <StatsSection />
      
      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Highlight Section */}
      <section 
        className="py-20 bg-gradient-to-br from-rexcan-dark-blue-primary via-rexcan-dark-blue-secondary to-rexcan-dark-blue-primary"
        style={{
          background: 'linear-gradient(135deg, #002D62 0%, #191970 50%, #002D62 100%)'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose ReXcan?
              </h2>
              <p className="text-xl text-rexcan-light-grey-secondary">
                Powerful features that transform your invoice processing workflow
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-rexcan-bright-cyan-primary/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(0, 255, 216, 0.2)'
                }}
              >
                <div 
                  className="w-12 h-12 bg-rexcan-bright-cyan-primary rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#00FFD8' }}
                >
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Lightning Fast</h3>
                <p className="text-rexcan-light-grey-secondary" style={{ color: '#EAEAEA' }}>
                  Process thousands of invoices in minutes, not days. Our AI pipeline handles high-volume processing with ease.
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-rexcan-bright-cyan-secondary/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(57, 255, 20, 0.2)'
                }}
              >
                <div 
                  className="w-12 h-12 bg-rexcan-bright-cyan-secondary rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#39FF14' }}
                >
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">99%+ Accuracy</h3>
                <p className="text-rexcan-light-grey-secondary" style={{ color: '#EAEAEA' }}>
                  Advanced NLP and validation rules ensure near-perfect extraction. Low-confidence fields are flagged for review.
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-rexcan-bright-cyan-primary/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(0, 255, 216, 0.2)'
                }}
              >
                <div 
                  className="w-12 h-12 bg-rexcan-bright-cyan-primary rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#00FFD8' }}
                >
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Universal Format Support</h3>
                <p className="text-rexcan-light-grey-secondary" style={{ color: '#EAEAEA' }}>
                  Handles any invoice format—text PDFs, scanned documents, emails. No template matching required.
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-rexcan-bright-cyan-secondary/20"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(57, 255, 20, 0.2)'
                }}
              >
                <div 
                  className="w-12 h-12 bg-rexcan-bright-cyan-secondary rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#39FF14' }}
                >
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Standardized Output</h3>
                <p className="text-rexcan-light-grey-secondary" style={{ color: '#EAEAEA' }}>
                  Automatic canonicalization ensures consistent dates, currencies, and vendor IDs across all invoices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

