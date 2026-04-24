import { useState, useRef, useCallback, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image, Video, Sparkles, Trash2, FileText, Presentation } from "lucide-react";
import { useGallery } from "../context/GalleryContext";

type FileType = "image" | "video" | "pdf" | "pptx";

interface PendingFile {
  file: File;
  preview: string;
  type: FileType;
  title: string;
  description: string;
  aiTool: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileType(file: File): FileType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.name.toLowerCase().endsWith(".pptx")
  ) return "pptx";
  // fallback
  if (file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (file.name.toLowerCase().endsWith(".pptx")) return "pptx";
  return "image"; // default fallback
}

function getFileIcon(type: FileType) {
  switch (type) {
    case "pdf": return FileText;
    case "pptx": return Presentation;
    case "video": return Video;
    default: return Image;
  }
}

function getFileIconColor(type: FileType) {
  switch (type) {
    case "pdf": return "text-red-400";
    case "pptx": return "text-orange-400";
    case "video": return "text-cyan-400";
    default: return "text-purple-400";
  }
}

export default function UploadModal() {
  const { uploadModalOpen, setUploadModalOpen, addUploadedPhoto, addUploadedVideo, addUploadedDocument } = useGallery();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const allowedTypes: FileType[] = ["image", "video", "pdf", "pptx"];

    const newFiles: PendingFile[] = arr
      .filter((f) => {
        const ft = getFileType(f);
        return allowedTypes.includes(ft);
      })
      .map((f) => {
        const ft = getFileType(f);
        return {
          file: f,
          preview: ft === "image" || ft === "video" ? URL.createObjectURL(f) : "",
          type: ft,
          title: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          description: "",
          aiTool: "My Creation",
        };
      });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      if (prev[index].preview) URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateFile = (index: number, field: string, value: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const f of files) {
        const readFileAsDataURL = (): Promise<string> =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(f.file);
          });

        const dataUrl = await readFileAsDataURL();

        if (f.type === "image") {
          const compressed = await compressImage(dataUrl, 1200, 0.8);
          addUploadedPhoto({
            src: compressed,
            title: f.title || "Untitled",
            description: f.description || "",
            aiTool: f.aiTool || "My Creation",
            category: "photo",
          });
        } else if (f.type === "video") {
          addUploadedVideo({
            src: dataUrl,
            title: f.title || "Untitled",
            description: f.description || "",
            aiTool: f.aiTool || "My Creation",
            thumbnail: "",
            duration: "0:00",
            category: "video",
          });
        } else if (f.type === "pdf" || f.type === "pptx") {
          addUploadedDocument({
            src: dataUrl,
            title: f.title || "Untitled",
            description: f.description || "",
            aiTool: f.aiTool || "My Creation",
            fileType: f.type,
            fileName: f.file.name,
            fileSize: formatFileSize(f.file.size),
          });
        }
      }
      // Cleanup
      files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
      setFiles([]);
      setUploadModalOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const close = () => {
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setFiles([]);
    setUploadModalOpen(false);
  };

  return (
    <AnimatePresence>
      {uploadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">رفع محتوى جديد</h2>
                  <p className="text-gray-400 text-sm">ارفع صورك، فيديوهاتك، ملفات PDF و PPTX</p>
                </div>
              </div>
              <button
                onClick={close}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-purple-400 bg-purple-500/10 scale-[1.02]"
                    : "border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/5"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      dragOver
                        ? "bg-purple-500/30 scale-110"
                        : "bg-white/10"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 transition-colors ${
                        dragOver ? "text-purple-300" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {dragOver ? "افلت الملفات هنا" : "اسحب وأفلت ملفاتك"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      أو اضغط لاختيار الملفات من جهازك
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Image className="w-4 h-4" />
                      <span>JPG, PNG, GIF, WEBP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Video className="w-4 h-4" />
                      <span>MP4, WEBM, MOV</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <FileText className="w-4 h-4" />
                      <span>PDF</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Presentation className="w-4 h-4" />
                      <span>PPTX</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    الملفات المختارة ({files.length})
                  </h3>
                  <div className="space-y-3">
                    {files.map((f, i) => {
                      const Icon = getFileIcon(f.type);
                      const iconColor = getFileIconColor(f.type);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4"
                        >
                          {/* Preview */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 flex items-center justify-center">
                            {f.type === "image" ? (
                              <img
                                src={f.preview}
                                alt={f.title}
                                className="w-full h-full object-cover"
                              />
                            ) : f.type === "video" ? (
                              <video
                                src={f.preview}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1">
                                <Icon className={`w-8 h-8 ${iconColor}`} />
                                <span className="text-[10px] text-gray-400 font-bold uppercase">
                                  {f.type}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Fields */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Icon className={`w-3 h-3 ${iconColor}`} />
                                  {f.type.toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {formatFileSize(f.file.size)}
                                </span>
                              </div>
                              <button
                                onClick={() => removeFile(i)}
                                className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="عنوان العمل"
                              value={f.title}
                              onChange={(e) => updateFile(i, "title", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                            />
                            <input
                              type="text"
                              placeholder="وصف (اختياري)"
                              value={f.description}
                              onChange={(e) => updateFile(i, "description", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                            />
                            <input
                              type="text"
                              placeholder="اسم أداة الذكاء الاصطناعي (اختياري)"
                              value={f.aiTool}
                              onChange={(e) => updateFile(i, "aiTool", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {files.length > 0 && (
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  {files.length} ملف جاهز للرفع
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={close}
                    className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        جاري الرفع...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        رفع الملفات
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compress image using canvas
function compressImage(dataUrl: string, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = dataUrl;
  });
}
