import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Statistics Section */}
      <StatsSection />
      
      {/* How It Works Section */}
      <section 
        className="py-20 bg-gradient-to-b from-rexcan-light-grey-secondary to-white"
        style={{
          background: 'linear-gradient(to bottom, #EAEAEA 0%, #FFFFFF 100%)'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-rexcan-dark-blue-secondary mb-12 font-medium">
              Our AI-powered pipeline processes invoices in three simple steps
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-rexcan-light-grey-primary hover:border-rexcan-bright-cyan-primary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-logo-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto shadow-md">
                  1
                </div>
                <h3 className="text-xl font-semibold text-rexcan-dark-blue-secondary mb-3">
                  Upload Invoice
                </h3>
                <p className="text-rexcan-dark-blue-primary">
                  Upload invoices in any format—PDF, scanned images, or email attachments
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-rexcan-dark-blue-primary to-rexcan-dark-blue-secondary p-8 rounded-xl shadow-lg border-2 border-rexcan-bright-cyan-primary/30 hover:border-rexcan-bright-cyan-primary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-rexcan-bright-cyan-primary rounded-full flex items-center justify-center text-rexcan-dark-blue-primary text-2xl font-bold mb-4 mx-auto shadow-md">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  AI Extraction
                </h3>
                <p className="text-rexcan-light-grey-secondary">
                  Our AI extracts key fields like invoice number, vendor, amount, and dates
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-rexcan-light-grey-primary hover:border-rexcan-bright-cyan-secondary transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="w-16 h-16 bg-logo-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto shadow-md">
                  3
                </div>
                <h3 className="text-xl font-semibold text-rexcan-dark-blue-secondary mb-3">
                  Get Structured Data
                </h3>
                <p className="text-rexcan-dark-blue-primary">
                  Receive clean, standardized JSON/CSV output ready for your accounting system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

