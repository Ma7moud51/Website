export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  description: string;
  category: "photo" | "video";
  aiTool: string;
  thumbnail?: string;
  isUploaded?: boolean;
}

export interface VideoItem {
  id: number;
  title: string;
  description: string;
  aiTool: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  isUploaded?: boolean;
}

export interface DocumentItem {
  id: number;
  src: string; // base64 data URL
  title: string;
  description: string;
  aiTool: string;
  fileType: "pdf" | "pptx";
  fileName: string;
  fileSize: string;
  pageCount?: string;
  isUploaded?: boolean;
}

export const galleryItems: GalleryItem[] = [];

export const videoItems: VideoItem[] = [];
