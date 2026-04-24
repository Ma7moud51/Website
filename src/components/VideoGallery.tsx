import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Clock, Trash2, Plus, Video, Film } from "lucide-react";
import { useGallery } from "../context/GalleryContext";

export default function VideoGallery() {
  const { allVideos, removeVideo, setUploadModalOpen } = useGallery();
  const [activeVideo, setActiveVideo] = useState<(typeof allVideos)[0] | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      removeVideo(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <section
      id="videos"
      className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">
            Motion
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            معرض الفيديوهات
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ارفع فيديوهاتك المولدة بالذكاء الاصطناعي واعرض إبداعاتك المتحركة!
          </p>
        </motion.div>

        {/* Upload Button */}
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
            رفع فيديو جديد
          </button>
        </motion.div>

        {/* Video Grid or Empty State */}
        {allVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Film className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              لا توجد فيديوهات بعد
            </h3>
            <p className="text-gray-400 mb-6">
              ارفع فيديوهاتك المولدة بالذكاء الاصطناعي لعرضها هنا
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 hover:scale-105"
            >
              ارفع أول فيديو 🎬
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {allVideos.map((video, index) => {
                const isUploaded = video.isUploaded;
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                    className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-900/50 border border-white/5 hover:border-purple-500/30 transition-all duration-500"
                    onClick={() => setActiveVideo(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gray-800">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center">
                          <Video className="w-12 h-12 text-purple-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />

                      {/* Delete button */}
                      {isUploaded && (
                        <button
                          onClick={(e) => handleDelete(e, video.id)}
                          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-300 ${
                            confirmDelete === video.id
                              ? "bg-red-500 text-white scale-110"
                              : "bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100"
                          }`}
                          title={
                            confirmDelete === video.id
                              ? "اضغط مرة أخرى للتأكيد"
                              : "حذف"
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/40 group-hover:border-purple-400/50 transition-all duration-500">
                          <Play
                            className="w-7 h-7 text-white ml-1"
                            fill="white"
                          />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/20">
                          {video.aiTool}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  poster={activeVideo.thumbnail || undefined}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/20">
                    {activeVideo.aiTool}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {activeVideo.duration}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl">
                  {activeVideo.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {activeVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
