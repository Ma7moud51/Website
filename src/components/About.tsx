import { motion } from "framer-motion";
import { Cpu, Palette, Film, Zap } from "lucide-react";
import { useGallery } from "../context/GalleryContext";
import { useMemo } from "react";

const tools = [
  {
    icon: Palette,
    name: "Midjourney",
    description:
      "إنشاء صور فنية خيالية بتفاصيل مذهلة وتفسير إبداعي لا مثيل له.",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Cpu,
    name: "DALL·E 3",
    description:
      "توليد صور واقعية بدقة عالية مع فهم عميق للأوامر النصية والتكوين.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Zap,
    name: "Stable Diffusion",
    description:
      "صياغة أنماط فنية فريدة بمرونة المصدر المفتوح وتحكم دقيق.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    icon: Film,
    name: "Runway ML & Pika",
    description:
      "تحويل الصور الثابتة إلى فيديوهات مذهلة بتقنية الذكاء الاصطناعي.",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
];

export default function About() {
  const { allPhotos, allVideos, allDocuments } = useGallery();

  const stats = useMemo(() => {
    const aiTools = new Set([
      ...allPhotos.map((p) => p.aiTool),
      ...allVideos.map((v) => v.aiTool),
      ...allDocuments.map((d) => d.aiTool),
    ]);
    return [
      { value: `${allPhotos.length}`, label: "صور مرفوعة" },
      { value: `${allVideos.length}`, label: "فيديوهات مرفوعة" },
      { value: `${allDocuments.length}`, label: "مستندات مرفوعة" },
      { value: `${aiTools.size}`, label: "أدوات ذكاء اصطناعي" },
    ];
  }, [allPhotos, allVideos, allDocuments]);

  return (
    <section id="about" className="py-20 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-pink-400 text-sm font-medium tracking-widest uppercase">
            Behind The Art
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            أدوات الذكاء الاصطناعي
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            كل قطعة في هذه المجموعة تم إنشاؤها باستخدام أحدث منصات الذكاء
            الاصطناعي. إليك نظرة على التقنية وراء الإبداع.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl ${tool.bgColor} border ${tool.borderColor} hover:border-opacity-50 transition-all duration-300 group`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{tool.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/5"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
