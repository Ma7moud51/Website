import { GalleryProvider } from "./context/GalleryContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import VideoGallery from "./components/VideoGallery";
import DocumentsGallery from "./components/DocumentsGallery";
import About from "./components/About";
import Footer from "./components/Footer";
import UploadModal from "./components/UploadModal";

export default function App() {
  return (
    <GalleryProvider>
      <div className="min-h-screen bg-black text-white antialiased">
        <Navbar />
        <Hero />
        <Gallery />
        <VideoGallery />
        <DocumentsGallery />
        <About />
        <Footer />
        <UploadModal />
      </div>
    </GalleryProvider>
  );
}
