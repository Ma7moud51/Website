import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Creations
            </span>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>using AI</span>
            <span className="mx-2">•</span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </div>

          {/* Social placeholder links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors text-sm"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-400 transition-colors text-sm"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
