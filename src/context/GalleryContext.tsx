import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type GalleryItem, type VideoItem, type DocumentItem } from "../data/gallery";

interface StoredPhoto {
  id: number;
  src: string;
  title: string;
  description: string;
  aiTool: string;
  category: "photo";
}

interface StoredVideo {
  id: number;
  src: string;
  title: string;
  description: string;
  aiTool: string;
  thumbnail: string;
  duration: string;
  category: "video";
}

interface StoredDocument {
  id: number;
  src: string;
  title: string;
  description: string;
  aiTool: string;
  fileType: "pdf" | "pptx";
  fileName: string;
  fileSize: string;
  pageCount?: string;
}

interface GalleryContextType {
  allPhotos: GalleryItem[];
  allVideos: VideoItem[];
  allDocuments: DocumentItem[];
  addUploadedPhoto: (item: Omit<StoredPhoto, "id">) => void;
  addUploadedVideo: (item: Omit<StoredVideo, "id">) => void;
  addUploadedDocument: (item: Omit<StoredDocument, "id">) => void;
  removePhoto: (id: number) => void;
  removeVideo: (id: number) => void;
  removeDocument: (id: number) => void;
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

const UPLOADED_PHOTOS_KEY = "ai_creations_uploaded_photos";
const UPLOADED_VIDEOS_KEY = "ai_creations_uploaded_videos";


function loadFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage full, could not save:", e);
  }
}

// Use IndexedDB for large files (PDFs, PPTX)
const IDB_NAME = "ai_creations_db";
const IDB_VERSION = 1;
const IDB_STORE = "documents";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIDB(item: StoredDocument & { id: number }) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadAllFromIDB(): Promise<(StoredDocument & { id: number })[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteFromIDB(id: number) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [uploadedPhotos, setUploadedPhotos] = useState<StoredPhoto[]>(() =>
    loadFromStorage<StoredPhoto>(UPLOADED_PHOTOS_KEY)
  );
  const [uploadedVideos, setUploadedVideos] = useState<StoredVideo[]>(() =>
    loadFromStorage<StoredVideo>(UPLOADED_VIDEOS_KEY)
  );
  const [uploadedDocuments, setUploadedDocuments] = useState<StoredDocument[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Load documents from IndexedDB on mount
  useEffect(() => {
    loadAllFromIDB().then((docs) => {
      setUploadedDocuments(docs);
    }).catch(console.error);
  }, []);

  // Persist uploaded photos
  useEffect(() => {
    saveToStorage(UPLOADED_PHOTOS_KEY, uploadedPhotos);
  }, [uploadedPhotos]);

  // Persist uploaded videos
  useEffect(() => {
    saveToStorage(UPLOADED_VIDEOS_KEY, uploadedVideos);
  }, [uploadedVideos]);

  // Only uploaded photos
  const allPhotos: GalleryItem[] = uploadedPhotos.map((p) => ({
    ...p,
    category: "photo" as const,
    isUploaded: true,
  }));

  // Only uploaded videos
  const allVideos: VideoItem[] = uploadedVideos.map((v) => ({
    ...v,
    videoUrl: v.src,
    isUploaded: true,
  }));

  // Only uploaded documents
  const allDocuments: DocumentItem[] = uploadedDocuments.map((d) => ({
    ...d,
    isUploaded: true,
  }));

  const addUploadedPhoto = useCallback((item: Omit<StoredPhoto, "id">) => {
    const id = Date.now();
    setUploadedPhotos((prev) => [...prev, { ...item, id }]);
  }, []);

  const addUploadedVideo = useCallback((item: Omit<StoredVideo, "id">) => {
    const id = Date.now();
    setUploadedVideos((prev) => [...prev, { ...item, id }]);
  }, []);

  const addUploadedDocument = useCallback((item: Omit<StoredDocument, "id">) => {
    const id = Date.now();
    const doc = { ...item, id };
    setUploadedDocuments((prev) => [...prev, doc]);
    // Save to IndexedDB
    saveToIDB(doc).catch(console.error);
  }, []);

  const removePhoto = useCallback((id: number) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeVideo = useCallback((id: number) => {
    setUploadedVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const removeDocument = useCallback((id: number) => {
    setUploadedDocuments((prev) => prev.filter((d) => d.id !== id));
    deleteFromIDB(id).catch(console.error);
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        allPhotos,
        allVideos,
        allDocuments,
        addUploadedPhoto,
        addUploadedVideo,
        addUploadedDocument,
        removePhoto,
        removeVideo,
        removeDocument,
        uploadModalOpen,
        setUploadModalOpen,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used within GalleryProvider");
  return ctx;
}
