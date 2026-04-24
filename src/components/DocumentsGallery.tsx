import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Presentation,
  Trash2,
  Plus,
  Download,
  Eye,
  X,
  File,
  ExternalLink,
} from "lucide-react";
import { useGallery } from "../context/GalleryContext";
import type { DocumentItem } from "../data/gallery";

function getFileIcon(type: "pdf" | "pptx") {
  return type === "pdf" ? FileText : Presentation;
}

function getFileGradient(type: "pdf" | "pptx") {
  return type === "pdf"
    ? "from-red-500/20 to-orange-500/20 border-red-500/20"
    : "from-orange-500/20 to-yellow-500/20 border-orange-500/20";
}

function getFileIconBg(type: "pdf" | "pptx") {
  return type === "pdf"
    ? "bg-red-500"
    : "bg-orange-500";
}

function getFileBadge(type: "pdf" | "pptx") {
  return type === "pdf"
    ? "bg-red-500/20 text-red-300 border-red-500/20"
    : "bg-orange-500/20 text-orange-300 border-orange-500/20";
}

export default function DocumentsGallery() {
  const { allDocuments, removeDocument, setUploadModalOpen } = useGallery();
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      removeDocument(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    const link = document.createElement("a");
    link.href = doc.src;
    link.download = doc.fileName;
    link.click();
  };

  const handleOpenNewTab = (doc: DocumentItem) => {
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head><title>${doc.title}</title></head>
          <body style="margin:0;padding:0;">
            <iframe src="${doc.src}" style="width:100%;height:100vh;border:none;"></iframe>
          </body>
        </html>
      `);
    }
  };

  return (
    <section
      id="documents"
      className="py-20 md:py-32 bg-gradient-to-b from-black via-gray-950/50 to-black"
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
          <span className="text-orange-400 text-sm font-medium tracking-widest uppercase">
            Documents
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            معرض المستندات
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ارفع ملفات PDF وعروض PPTX التقديمية المولدة بالذكاء الاصطناعي
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
            رفع مستند جديد
          </button>
        </motion.div>

        {/* Documents Grid or Empty State */}
        {allDocuments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
              <File className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              لا توجد مستندات بعد
            </h3>
            <p className="text-gray-400 mb-6">
              ارفع ملفات PDF أو PPTX لعرضها هنا
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:from-orange-500 hover:to-red-500 transition-all duration-300 hover:scale-105"
            >
              ارفع أول مستند 📄
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {allDocuments.map((doc, index) => {
                const Icon = getFileIcon(doc.fileType);
                const gradient = getFileGradient(doc.fileType);
                const iconBg = getFileIconBg(doc.fileType);
                const badge = getFileBadge(doc.fileType);
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                    className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-900/50 border border-white/5 hover:border-orange-500/30 transition-all duration-500"
                    onClick={() => setActiveDoc(doc)}
                  >
                    {/* Document Preview Area */}
                    <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      {/* Document icon */}
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-20 h-20 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/80 text-sm font-medium max-w-[200px] truncate px-4">
                            {doc.fileName}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {doc.fileSize}
                          </p>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(e, doc.id)}
                        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-300 ${
                          confirmDelete === doc.id
                            ? "bg-red-500 text-white scale-110"
                            : "bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100"
                        }`}
                        title={
                          confirmDelete === doc.id
                            ? "اضغط مرة أخرى للتأكيد"
                            : "حذف"
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Hover overlay with action buttons */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDoc(doc);
                          }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-purple-500/40 hover:border-purple-400/50 transition-all duration-300 hover:scale-110"
                          title="عرض"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-green-500/40 hover:border-green-400/50 transition-all duration-300 hover:scale-110"
                          title="تحميل"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNewTab(doc);
                          }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-cyan-500/40 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110"
                          title="فتح في نافذة جديدة"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 ${badge} text-xs font-medium rounded-full border`}>
                          {doc.fileType.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/20">
                          {doc.aiTool}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setActiveDoc(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveDoc(null)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Document info bar */}
              <div className="flex items-center justify-between mb-3 bg-gray-900/80 rounded-t-xl p-4 border border-white/10 border-b-0">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getFileIcon(activeDoc.fileType);
                    return <Icon className="w-5 h-5 text-orange-400" />;
                  })()}
                  <div>
                    <h3 className="text-white font-bold text-lg">{activeDoc.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${getFileBadge(activeDoc.fileType)} border`}>
                        {activeDoc.fileType.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-xs">{activeDoc.fileSize}</span>
                      <span className="text-gray-400 text-xs">• {activeDoc.fileName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(activeDoc)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 transition-colors border border-green-500/20"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </button>
                  <button
                    onClick={() => handleOpenNewTab(activeDoc)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors border border-cyan-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    نافذة جديدة
                  </button>
                </div>
              </div>

              {/* Document viewer */}
              <div className="flex-1 rounded-b-xl overflow-hidden border border-white/10 border-t-0">
                {activeDoc.fileType === "pdf" ? (
                  <iframe
                    src={activeDoc.src}
                    className="w-full h-full bg-gray-800"
                    title={activeDoc.title}
                  />
                ) : (
                  /* For PPTX - show a nice download/view prompt since browsers can't render PPTX directly */
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                      <Presentation className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {activeDoc.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">
                        {activeDoc.description || "عرض تقديمي PowerPoint"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {activeDoc.fileName} • {activeDoc.fileSize}
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm max-w-md text-center">
                      لا يمكن عرض ملفات PPTX مباشرة في المتصفح.
                      <br />
                      قم بتحميل الملف أو فتحه في نافذة جديدة.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownload(activeDoc)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:from-orange-500 hover:to-red-500 transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/25"
                      >
                        <Download className="w-5 h-5" />
                        تحميل الملف
                      </button>
                      <button
                        onClick={() => handleOpenNewTab(activeDoc)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        <ExternalLink className="w-5 h-5" />
                        فتح في نافذة جديدة
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
