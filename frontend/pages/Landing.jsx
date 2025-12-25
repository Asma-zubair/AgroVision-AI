import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-green-900 text-black py-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-black text-sm font-semibold mb-4 backdrop-blur-sm">
                🚀 The Future of Agriculture
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-black">
                Smart Farming <br /> with <span className="text-black">AI Intelligence</span>
              </h1>
              <p className="text-lg md:text-xl text-black mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Maximize your yield with AI-powered crop recommendations, instant disease detection, and 24/7 expert farming assistance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/crop" className="bg-accent text-primary font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-400 transition transform hover:scale-105 flex items-center justify-center gap-2">
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </Link>
                <Link to="/chatbot" className="bg-white/10 backdrop-blur-md border border-white/30 text-black font-bold py-4 px-8 rounded-full hover:bg-white/20 transition flex items-center justify-center gap-2">
                  <span>Talk to AI</span>
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center relative">
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-secondary blur-2xl opacity-20 rounded-full"></div>
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                alt="Smart Farming"
                className="rounded-3xl shadow-2xl w-full max-w-md border-4 border-white/10 relative z-10 transform hover:-translate-y-2 transition duration-500"
              />
              
              {/* Floating Cards */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20 max-w-[200px]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="bg-green-100 p-2 rounded-lg text-2xl">🌿</div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Crop Health</p>
                  <p className="text-sm font-bold text-primary">98% Optimal</p>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 z-20 max-w-[200px]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="bg-yellow-100 p-2 rounded-lg text-2xl">🤖</div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">AI Assistant</p>
                  <p className="text-sm font-bold text-primary">Active Now</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-light relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose AgroVision AI?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We combine advanced machine learning with agricultural expertise to help you make data-driven decisions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Crop Recommendation"
              description="Analyze soil nutrients (NPK), weather conditions, and rainfall to find the perfect crop for your land."
              icon="🌾"
              link="/crop"
              color="bg-green-50"
              delay={0.2}
            />
            <FeatureCard
              title="Instant Disease Detection"
              description="Simply upload a photo of a plant leaf. Our AI instantly identifies diseases and suggests treatments."
              icon="🦠"
              link="/diseases"
              color="bg-red-50"
              delay={0.4}
            />
            <FeatureCard
              title="24/7 AI Farmer Assistant"
              description="Have a question? Chat with our intelligent assistant about farming tips, market trends, and more."
              icon="🤖"
              link="/chatbot"
              color="bg-blue-50"
              delay={0.6}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon, link, color, delay }) {
  return (
    <motion.div
      className={`p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${color} group`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
      <Link to={link} className="inline-flex items-center text-primary font-bold hover:text-secondary transition group-hover:translate-x-2 duration-300">
        Try Feature <span className="ml-2">&rarr;</span>
      </Link>
    </motion.div>
  );
}