import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Plus, ImageIcon } from "lucide-react";
import { useGallery } from "../context/GalleryContext";
import Lightbox from "./Lightbox";
import type { GalleryItem } from "../data/gallery";

export default function Gallery() {
  const { allPhotos, removePhoto, setUploadModalOpen } = useGallery();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Build dynamic categories from uploaded items
  const categories = useMemo(() => {
    const tools = [...new Set(allPhotos.map((item) => item.aiTool))];
    return ["All", ...tools];
  }, [allPhotos]);

  const filteredItems =
    activeFilter === "All"
      ? allPhotos
      : allPhotos.filter((item) => item.aiTool === activeFilter);

  const currentIndex = selectedItem
    ? filteredItems.findIndex((item) => item.id === selectedItem.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    } else {
      setSelectedItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    } else {
      setSelectedItem(filteredItems[0]);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      removePhoto(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <section id="gallery" className="py-20 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            معرض الصور
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ارفع صورك المولدة بالذكاء الاصطناعي واعرض إبداعاتك هنا!
          </p>
        </motion.div>

        {/* Upload Button (always visible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/25 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            رفع صور جديدة
          </button>
        </motion.div>

        {/* Filter Tabs */}
        {allPhotos.length > 0 && categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              لا توجد صور بعد
            </h3>
            <p className="text-gray-400 mb-6">
              ارفع صورك المولدة بالذكاء الاصطناعي لعرضها هنا
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105"
            >
              ارفع أول صورة ✨
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                const isUploaded = "isUploaded" in item && item.isUploaded;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                    className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/5]"
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Delete button */}
                    {isUploaded && (
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-300 ${
                          confirmDelete === item.id
                            ? "bg-red-500 text-white scale-110"
                            : "bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100"
                        }`}
                        title={
                          confirmDelete === item.id
                            ? "اضغط مرة أخرى للتأكيد"
                            : "حذف"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 text-xs font-medium">
                            {item.aiTool}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {/* Corner glow */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/0 group-hover:bg-purple-500/10 rounded-bl-full transition-all duration-500" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
