const Footer = () => {
  return (
    <footer className="bg-[#0a1128] border-t border-gray-800/50 py-10 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and tagline */}
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-[#0a1128] rounded-sm"></div>
          </div>
          <div>
            <span className="text-lg font-bold text-white">BrickChain</span>
            <div className="text-xs text-gray-400">Democratizing real estate investment</div>
          </div>
        </div>
        {/* Links */}
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} BrickChain. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
