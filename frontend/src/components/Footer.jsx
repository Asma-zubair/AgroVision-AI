export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-green-500">AgroVision AI 🌱</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">Empowering farmers with cutting-edge AI technology for a sustainable future.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-green-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-green-500 transition">Terms of Service</a>
            <a href="#" className="hover:text-green-500 transition">Contact Support</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
          &copy; {new Date().getFullYear()} AgroVision AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
