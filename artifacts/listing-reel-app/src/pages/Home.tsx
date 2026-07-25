import React from 'react';

import {
  CSSProperties,
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Step = "photos" | "property" | "agent" | "style" | "preview";
type Format = "vertical" | "square" | "landscape";
type Platform = "ig-reels" | "ig-story" | "ig-post" | "tiktok" | "facebook" | "yt-shorts" | "x-twitter" | "linkedin";

const platforms: Record<Platform, { label: string; sub: string; width: number; height: number; color: string; icon: string }> = {
  "ig-reels":  { label: "Instagram", sub: "Reels",    width: 1080, height: 1920, color: "#C13584", icon: "IG" },
  "ig-story":  { label: "Instagram", sub: "Story",    width: 1080, height: 1920, color: "#833AB4", icon: "IG" },
  "ig-post":   { label: "Instagram", sub: "Post",     width: 1080, height: 1080, color: "#E1306C", icon: "IG" },
  "tiktok":    { label: "TikTok",    sub: "Video",    width: 1080, height: 1920, color: "#010101", icon: "TK" },
  "facebook":  { label: "Facebook",  sub: "Reels",    width: 1080, height: 1920, color: "#1877F2", icon: "FB" },
  "yt-shorts": { label: "YouTube",   sub: "Shorts",   width: 1080, height: 1920, color: "#FF0000", icon: "YT" },
  "x-twitter": { label: "X",         sub: "Twitter",  width: 1280, height: 720,  color: "#14171A", icon: "𝕏"  },
  "linkedin":  { label: "LinkedIn",  sub: "Video",    width: 1920, height: 1080, color: "#0A66C2", icon: "in" },
};
type Style = "editorial" | "modern" | "energy" | "triptych";
type ExportMode = "social" | "mls";

type Photo = {
  id: string;
  name: string;
  url: string;
  demoIndex?: number;
};

type Project = {
  campaign: string;
  address: string;
  cityStateZip: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  propertyType: string;
  units: string;
  mlsNumber: string;
  description: string;
  highlights: string;
  agentName: string;
  agentTitle: string;
  brokerage: string;
  phone: string;
  email: string;
  website: string;
  license: string;
  cta: string;
};

const initialProject: Project = {
  campaign: "Just Listed",
  address: "1234 Sunset View Drive",
  cityStateZip: "Los Angeles, CA 90046",
  price: "$1,295,000",
  beds: "4",
  baths: "3",
  sqft: "2,850",
  propertyType: "SFR",
  units: "",
  mlsNumber: "SR26123456",
  description:
    "A beautifully updated contemporary home with warm natural finishes, effortless indoor-outdoor living, and a private resort-style backyard.",
  highlights: "Open-concept living, Designer kitchen, Pool & spa",
  agentName: "Edward Frish",
  agentTitle: "REALTOR® / President",
  brokerage: "Century 21 Hollywood",
  phone: "818-371-1665",
  email: "efrish@c21edva.com",
  website: "",
  license: "DRE #01252271",
  cta: "Schedule a private showing",
};

const steps: { id: Step; number: string; label: string }[] = [
  { id: "photos", number: "01", label: "Photos" },
  { id: "property", number: "02", label: "Property" },
  { id: "agent", number: "03", label: "Agent" },
  { id: "style", number: "04", label: "Style" },
  { id: "preview", number: "05", label: "Preview" },
];

const demoPhotos: Photo[] = Array.from({ length: 6 }, (_, index) => ({
  id: `demo-${index}`,
  name: ["Exterior", "Living room", "Kitchen", "Primary suite", "Bath", "Pool"][
    index
  ],
  url: "/demo-property-grid.png",
  demoIndex: index,
}));

const formats: Record<
  Format,
  { label: string; detail: string; width: number; height: number }
> = {
  vertical: {
    label: "Vertical",
    detail: "Reels · TikTok · Shorts",
    width: 1080,
    height: 1920,
  },
  square: {
    label: "Square",
    detail: "Instagram · Facebook",
    width: 1080,
    height: 1080,
  },
  landscape: {
    label: "Landscape",
    detail: "YouTube · Website",
    width: 1920,
    height: 1080,
  },
};

const styleThemes: Record<
  Style,
  { label: string; detail: string; accent: string; dark: string; light: string }
> = {
  editorial: {
    label: "Editorial",
    detail: "Quiet luxury, cinematic pacing",
    accent: "#d5b56f",
    dark: "#101713",
    light: "#f5f0e7",
  },
  modern: {
    label: "Modern",
    detail: "Clean geometry, crisp type",
    accent: "#63d7c5",
    dark: "#0d1d20",
    light: "#eef7f5",
  },
  energy: {
    label: "Social Energy",
    detail: "Faster cuts, bolder moments",
    accent: "#ff8066",
    dark: "#1f1421",
    light: "#fff0e9",
  },
  triptych: {
    label: "Triptych",
    detail: "Blurred surround · centered panel",
    accent: "#ffffff",
    dark: "#111111",
    light: "#ffffff",
  },
};

const CAMPAIGN_TYPES = [
  "Just Listed",
  "Open House",
  "Price Reduction",
  "Just Reduced",
  "Back on Market",
  "Coming Soon",
  "Under Contract",
  "Sold",
  "Investment Opportunity",
  "New Construction",
];

const PROPERTY_TYPES = [
  "SFR",
  "Townhouse",
  "Condo",
  "Multi-Family / Building",
  "Land / Lot",
  "Commercial",
  "Mobile Home",
  "Other",
];

const presetTracks = [
  { id: "cinematic", name: "Cinematic", description: "Elegant · atmospheric", url: "/music/cinematic.mp3" },
  { id: "upbeat", name: "Upbeat", description: "Bright · energetic", url: "/music/upbeat.mp3" },
  { id: "corporate", name: "Corporate", description: "Clean · professional", url: "/music/corporate.mp3" },
] as const;

function getSlideText(
  index: number,
  project: Project,
  highlights: string[],
): { headline: string; subline: string } {
  const unitSuffix = project.units ? ` · ${project.units} units` : "";
  switch (index % 6) {
    case 0:
      return {
        headline: project.campaign.toUpperCase(),
        subline: `${project.price}  ·  ${project.beds} BED  ·  ${project.baths} BATH`,
      };
    case 1:
      return {
        headline: (highlights[0] || project.propertyType).toUpperCase(),
        subline: project.address.toUpperCase(),
      };
    case 2:
      return {
        headline: (highlights[1] || `${project.beds} bed · ${project.baths} bath`).toUpperCase(),
        subline: project.address.toUpperCase(),
      };
    case 3:
      return {
        headline: (highlights[2] || `${project.sqft} sq ft`).toUpperCase(),
        subline: project.cityStateZip.toUpperCase(),
      };
    case 4:
      return {
        headline: `${project.beds} BED  ·  ${project.baths} BATH  ·  ${project.sqft} SQ FT`,
        subline: (project.propertyType + unitSuffix).toUpperCase(),
      };
    case 5:
      return {
        headline: project.cta.toUpperCase(),
        subline: project.phone,
      };
    default:
      return {
        headline: project.campaign.toUpperCase(),
        subline: project.address.toUpperCase(),
      };
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        {!options.includes(value) && (
          <option value={value}>{value}</option>
        )}
      </select>
    </label>
  );
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  zoom = 1,
  demoIndex?: number,
) {
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (demoIndex !== undefined) {
    sourceWidth = image.naturalWidth / 3;
    sourceHeight = image.naturalHeight / 2;
    sourceX = (demoIndex % 3) * sourceWidth;
    sourceY = Math.floor(demoIndex / 3) * sourceHeight;
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (sourceRatio > targetRatio) {
    cropWidth = sourceHeight * targetRatio;
  } else {
    cropHeight = sourceWidth / targetRatio;
  }

  cropWidth /= zoom;
  cropHeight /= zoom;
  const cropX = sourceX + (sourceWidth - cropWidth) / 2;
  const cropY = sourceY + (sourceHeight - cropHeight) / 2;
  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height,
  );
}

function fitFont(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  weight = 700,
) {
  let size = startSize;
  while (size > 28) {
    context.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    if (context.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
  return lines.length;
}

// ── IndexedDB helpers ────────────────────────────────────────────────────────
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("listing-reel", 1);
    req.onupgradeneeded = () => { req.result.createObjectStore("projects"); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbSave(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readwrite");
    tx.objectStore("projects").put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function dbLoad<T>(key: string): Promise<T | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projects", "readonly");
    const req = tx.objectStore("projects").get(key);
    req.onsuccess = () => { db.close(); resolve((req.result as T) ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function blobToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Home() {
  const [activeStep, setActiveStep] = useState<Step>("photos");
  const [project, setProject] = useState<Project>(initialProject);
  const [photos, setPhotos] = useState<Photo[]>(demoPhotos);
  const [format, setFormat] = useState<Format>("vertical");
  const [style, setStyle] = useState<Style>("editorial");
  const [exportMode, setExportMode] = useState<ExportMode>("social");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [music, setMusic] = useState<{ name: string; url: string } | null>(null);
  const [headshot, setHeadshot] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [renderState, setRenderState] = useState<
    "idle" | "preparing" | "rendering" | "complete" | "error"
  >("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMessage, setRenderMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<number | null>(null);
  const hasLoaded = useRef(false);
  const [photoDragIndex, setPhotoDragIndex] = useState<number | null>(null);
  const [photoDragOver, setPhotoDragOver] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const theme = styleThemes[style];
  const previewPhoto = photos[previewIndex % Math.max(photos.length, 1)];
  const highlightList = useMemo(
    () =>
      project.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
    [project.highlights],
  );

  const slideText = useMemo(
    () =>
      getSlideText(
        previewIndex % Math.max(photos.length, 1),
        project,
        highlightList,
      ),
    [previewIndex, photos.length, project, highlightList],
  );

  const updateProject = useCallback((key: keyof Project, value: string) => {
    setProject((current) => ({ ...current, [key]: value }));
  }, []);

  // Load full project from IndexedDB on mount
  useEffect(() => {
    type Saved = {
      project?: Partial<Project>;
      format?: Format;
      style?: Style;
      exportMode?: ExportMode;
      photos?: Photo[];
      headshot?: string | null;
      logo?: string | null;
      music?: { name: string; url: string } | null;
    };
    (async () => {
      try {
        const saved = await dbLoad<Saved>("listing-reel-v1");
        if (saved) {
          if (saved.project) setProject({ ...initialProject, ...saved.project });
          if (saved.format) setFormat(saved.format);
          if (saved.style) setStyle(saved.style);
          if (saved.exportMode) setExportMode(saved.exportMode);
          if (saved.photos?.length) setPhotos(saved.photos);
          if (saved.headshot !== undefined) setHeadshot(saved.headshot);
          if (saved.logo !== undefined) setLogo(saved.logo);
          if (saved.music !== undefined) setMusic(saved.music);
        } else {
          // Migrate from old localStorage save
          const lsData = window.localStorage.getItem("listing-reel-project");
          if (lsData) {
            try { setProject({ ...initialProject, ...JSON.parse(lsData) }); } catch { /* ignore */ }
          }
        }
      } catch { /* ignore */ }
      hasLoaded.current = true;
    })();
  }, []);

  // Auto-save full project to IndexedDB (debounced 1.5 s)
  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveStatus("unsaved");
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const savedPhotos = await Promise.all(
          photos.map(async (p) => ({
            ...p,
            url: p.url.startsWith("blob:") ? await blobToDataUrl(p.url) : p.url,
          })),
        );
        await dbSave("listing-reel-v1", {
          project,
          format,
          style,
          exportMode,
          photos: savedPhotos,
          headshot: headshot
            ? headshot.startsWith("blob:") ? await blobToDataUrl(headshot) : headshot
            : null,
          logo: logo
            ? logo.startsWith("blob:") ? await blobToDataUrl(logo) : logo
            : null,
          music: music && music.url.startsWith("blob:") ? null : music,
        });
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1500);
  }, [project, format, style, exportMode, photos, headshot, logo, music]);

  useEffect(() => {
    if (!isPlaying || photos.length < 2) return;
    const timer = window.setInterval(
      () => setPreviewIndex((current) => (current + 1) % photos.length),
      style === "energy" ? 1800 : 2600,
    );
    return () => window.clearInterval(timer);
  }, [isPlaying, photos.length, style]);

  function addPhotos(files: FileList | File[]) {
    const incoming = Array.from(files)
      .filter(
        (file) =>
          file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name),
      )
      .slice(0, 6);
    if (!incoming.length) return;
    photos.forEach((photo) => {
      if (photo.url.startsWith("blob:")) URL.revokeObjectURL(photo.url);
    });
    setPhotos(
      incoming.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        url: URL.createObjectURL(file),
      })),
    );
    setPreviewIndex(0);
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addPhotos(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addPhotos(event.dataTransfer.files);
  }

  function movePhoto(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    setPhotos((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const photo = current[index];
      if (photo?.url.startsWith("blob:")) URL.revokeObjectURL(photo.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
    setPreviewIndex(0);
  }

  function uploadSingle(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
    event.target.value = "";
  }

  async function renderVideo() {
    if (!photos.length) {
      setRenderState("error");
      setRenderMessage("Add at least one property photo first.");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setRenderState("error");
      setRenderMessage("Video export is not supported in this browser.");
      return;
    }

    setRenderState("preparing");
    setRenderProgress(2);
    setRenderMessage("Preparing your photos…");

    try {
      const config = selectedPlatform ? platforms[selectedPlatform] : formats[format];
      const canvas = document.createElement("canvas");
      canvas.width = config.width;
      canvas.height = config.height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Canvas is unavailable");

      const loadedPhotos = await Promise.all(
        photos.map(async (photo) => ({
          ...photo,
          image: await loadImage(photo.url),
        })),
      );
      const loadedHeadshot = headshot ? await loadImage(headshot) : null;
      const loadedLogo = logo ? await loadImage(logo) : null;

      const canvasStream = canvas.captureStream(30);
      const tracks = [...canvasStream.getVideoTracks()];
      let audioElement: HTMLAudioElement | null = null;
      let audioContext: AudioContext | null = null;

      if (music && exportMode === "social") {
        audioElement = new Audio(music.url);
        audioElement.loop = true;
        audioElement.volume = 0.36;
        audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audioElement);
        const destination = audioContext.createMediaStreamDestination();
        const gain = audioContext.createGain();
        gain.gain.value = 0.45;
        source.connect(gain);
        gain.connect(destination);
        tracks.push(...destination.stream.getAudioTracks());
        await audioContext.resume();
        await audioElement.play();
      }

      const stream = new MediaStream(tracks);
      const supportedTypes = [
        ...(music && exportMode === "social"
          ? ["video/mp4;codecs=avc1.42E01E,mp4a.40.2"]
          : ["video/mp4;codecs=avc1.42E01E"]),
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];
      const mimeType =
        supportedTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: config.width >= config.height ? 10_000_000 : 8_000_000,
      });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };

      const finish = new Promise<Blob>((resolve) => {
        recorder.onstop = () =>
          resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
      });

      const photoDuration = style === "energy" ? 1900 : style === "triptych" ? 3200 : 2600;
      const scenes =
        exportMode === "social"
          ? [
              { type: "opening", duration: 2600 },
              ...loadedPhotos.map((photo, index) => ({
                type: "photo",
                duration: photoDuration,
                photo,
                index,
              })),
              { type: "closing", duration: 3000 },
            ]
          : loadedPhotos.map((photo, index) => ({
              type: "photo",
              duration: 3000,
              photo,
              index,
            }));
      const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

      function drawFrame(
        scene: (typeof scenes)[number],
        sceneProgress: number,
      ) {
        if (!context) return;
        const width = canvas.width;
        const height = canvas.height;
        context.fillStyle = theme.dark;
        context.fillRect(0, 0, width, height);


        // ── Triptych helper: draw one image region with optional blur ─────────
        function drawTriptychLayer(
          img: HTMLImageElement,
          demoIdx: number | undefined,
          blurBg: boolean,
          rx: number,
          ry: number,
          rw: number,
          rh: number,
          zoom = 1,
        ) {
          context.save();
          if (blurBg) context.filter = "blur(22px) brightness(0.5) saturate(0.75)";
          context.beginPath();
          context.rect(rx, ry, rw, rh);
          context.clip();
          context.translate(rx, ry);
          drawImageCover(context, img, rw, rh, zoom, demoIdx);
          if (blurBg) context.filter = "none";
          context.restore();
        }


        // ── Top branding overlay ──────────────────────────────────────────────
        function drawBranding() {
          if (exportMode !== "social") return;
          const fs = Math.round(width * 0.033);
          const topY = Math.round(height * 0.046);
          const rightX = width - Math.round(width * 0.045);
          context.save();
          context.textAlign = "right";
          context.shadowColor = "rgba(0,0,0,0.75)";
          context.shadowBlur = 8;
          // Measure widths to position the two-tone text
          context.font = `700 ${fs}px Arial, sans-serif`;
          const brandW = context.measureText("ListingReel").width;
          context.font = `400 ${fs}px Arial, sans-serif`;
          const byW = context.measureText(` by ${project.agentName}`).width;
          const totalW = brandW + byW;
          const startX = rightX - totalW;
          // Draw "ListingReel" bold white
          context.textAlign = "left";
          context.fillStyle = "white";
          context.font = `700 ${fs}px Arial, sans-serif`;
          context.fillText("ListingReel", startX, topY);
          // Draw " by [name]" lighter
          context.fillStyle = "rgba(255,255,255,0.72)";
          context.font = `400 ${fs}px Arial, sans-serif`;
          context.fillText(` by ${project.agentName}`, startX + brandW, topY);
          context.shadowBlur = 0;
          context.textAlign = "left";
          context.restore();
        }

        if (scene.type === "photo" && "photo" in scene) {
          if (style === "triptych") {
            const { image, demoIndex } = scene.photo;
            const px = Math.round(width * 0.11);
            const pw = width - px * 2;
            // Blurred full-frame backdrop
            drawTriptychLayer(image, demoIndex, true, 0, 0, width, height);
            // Clean center panel with slow zoom
            drawTriptychLayer(image, demoIndex, false, px, 0, pw, height, 1.02 + sceneProgress * 0.04);
            if (exportMode === "social") {
              // Bottom gradient
              const grad = context.createLinearGradient(0, height * 0.68, 0, height);
              grad.addColorStop(0, "rgba(0,0,0,0)");
              grad.addColorStop(1, "rgba(0,0,0,0.68)");
              context.fillStyle = grad;
              context.fillRect(0, 0, width, height);
              // Centered white text
              const st = getSlideText(scene.index, project, highlightList);
              const fsMain = Math.round(width * 0.062);
              context.textAlign = "center";
              context.shadowColor = "rgba(0,0,0,0.9)";
              context.shadowBlur = 12;
              context.fillStyle = "white";
              context.font = `700 ${fsMain}px Arial, sans-serif`;
              context.fillText(st.headline, width / 2, height * 0.876);
              context.fillStyle = "rgba(255,255,255,0.78)";
              context.font = `500 ${Math.round(fsMain * 0.62)}px Arial, sans-serif`;
              context.fillText(st.subline, width / 2, height * 0.921);
              context.textAlign = "left";
              context.shadowBlur = 0;
            }
            drawBranding();
            return;
          }
          drawImageCover(
            context,
            scene.photo.image,
            width,
            height,
            1.02 + sceneProgress * 0.055,
            scene.photo.demoIndex,
          );
          const vignette = context.createLinearGradient(0, height * 0.52, 0, height);
          vignette.addColorStop(0, "rgba(0,0,0,0)");
          vignette.addColorStop(1, exportMode === "mls" ? "rgba(0,0,0,.08)" : "rgba(0,0,0,.72)");
          context.fillStyle = vignette;
          context.fillRect(0, 0, width, height);

          if (exportMode === "social") {
            const pad = Math.round(width * 0.075);
            const st = getSlideText(scene.index, project, highlightList);
            context.fillStyle = "rgba(255,255,255,.92)";
            context.font = `600 ${Math.round(width * 0.032)}px Arial, sans-serif`;
            context.fillText(st.subline, pad, height - pad * 1.55);
            context.fillStyle = theme.accent;
            context.font = `700 ${Math.round(width * 0.038)}px Arial, sans-serif`;
            context.fillText(st.headline, pad, height - pad * 2.18);
            context.fillStyle = theme.accent;
            context.fillRect(pad, height - pad * 1.25, width * 0.18, Math.max(4, width * 0.006));
          }
          drawBranding();
          return;
        }

        const pad = Math.round(width * 0.085);
        if (scene.type === "opening") {
          if (style === "triptych") {
            const hero = loadedPhotos[0];
            const px = Math.round(width * 0.11);
            const pw = width - px * 2;
            drawTriptychLayer(hero.image, hero.demoIndex, true, 0, 0, width, height);
            drawTriptychLayer(hero.image, hero.demoIndex, false, px, 0, pw, height, 1.05);
            // Soft dark overlay on center panel
            context.fillStyle = "rgba(0,0,0,0.38)";
            context.fillRect(px, 0, pw, height);
            // Centered property info
            context.textAlign = "center";
            context.shadowColor = "rgba(0,0,0,0.9)";
            context.shadowBlur = 14;
            context.fillStyle = "rgba(255,255,255,0.72)";
            context.font = `600 ${Math.round(width * 0.04)}px Arial, sans-serif`;
            context.fillText(project.campaign.toUpperCase(), width / 2, height * 0.36);
            context.fillStyle = "white";
            const ts = fitFont(context, project.address, pw - Math.round(width * 0.08), Math.round(width * 0.075));
            context.font = `700 ${ts}px Arial, sans-serif`;
            context.fillText(project.address, width / 2, height * 0.43);
            context.fillStyle = "rgba(255,255,255,0.76)";
            context.font = `500 ${Math.round(width * 0.037)}px Arial, sans-serif`;
            context.fillText(project.cityStateZip, width / 2, height * 0.49);
            context.fillStyle = "white";
            context.font = `700 ${Math.round(width * 0.058)}px Arial, sans-serif`;
            context.fillText(project.price, width / 2, height * 0.575);
            context.fillStyle = "rgba(255,255,255,0.85)";
            context.font = `600 ${Math.round(width * 0.034)}px Arial, sans-serif`;
            context.fillText(
              `${project.beds} BED  ·  ${project.baths} BATH  ·  ${project.sqft} SQ FT`,
              width / 2, height * 0.625,
            );
            context.textAlign = "left";
            context.shadowBlur = 0;
            drawBranding();
            return;
          }
          const hero = loadedPhotos[0];
          drawImageCover(context, hero.image, width, height, 1.05, hero.demoIndex);
          context.fillStyle = "rgba(8,14,11,.7)";
          context.fillRect(0, 0, width, height);
          context.fillStyle = theme.accent;
          context.font = `700 ${Math.round(width * 0.032)}px Arial, sans-serif`;
          context.fillText(project.campaign.toUpperCase(), pad, height * 0.22);
          context.fillStyle = theme.light;
          const titleSize = fitFont(
            context,
            project.address,
            width - pad * 2,
            Math.round(width * 0.092),
          );
          context.font = `700 ${titleSize}px Arial, sans-serif`;
          context.fillText(project.address, pad, height * 0.34);
          context.fillStyle = "rgba(255,255,255,.76)";
          context.font = `500 ${Math.round(width * 0.036)}px Arial, sans-serif`;
          context.fillText(project.cityStateZip, pad, height * 0.39);
          context.fillStyle = theme.light;
          context.font = `700 ${Math.round(width * 0.064)}px Arial, sans-serif`;
          context.fillText(project.price, pad, height * 0.5);
          context.font = `600 ${Math.round(width * 0.032)}px Arial, sans-serif`;
          context.fillStyle = "rgba(255,255,255,.9)";
          context.fillText(
            `${project.beds} BED  ·  ${project.baths} BATH  ·  ${project.sqft} SQ FT`,
            pad,
            height * 0.56,
          );
          context.fillStyle = theme.accent;
          context.fillRect(pad, height * 0.17, width * 0.14, Math.max(5, width * 0.006));
          drawBranding();
          return;
        }

        if (style === "triptych") {
          const leftW = Math.round(width * 0.22);
          const centerW = width - leftW * 2;
          const lp = loadedPhotos[loadedPhotos.length - 1];
          const cp = loadedPhotos.length >= 2 ? loadedPhotos[loadedPhotos.length - 2] : loadedPhotos[0];
          const rp = loadedPhotos.length >= 3 ? loadedPhotos[1] : loadedPhotos[0];
          // Left strip (slightly darkened)
          drawTriptychLayer(lp.image, lp.demoIndex, false, 0, 0, leftW, height);
          context.fillStyle = "rgba(0,0,0,0.35)";
          context.fillRect(0, 0, leftW, height);
          // Center strip (main)
          drawTriptychLayer(cp.image, cp.demoIndex, false, leftW, 0, centerW, height);
          // Right strip (slightly darkened)
          drawTriptychLayer(rp.image, rp.demoIndex, false, leftW + centerW, 0, leftW, height);
          context.fillStyle = "rgba(0,0,0,0.35)";
          context.fillRect(leftW + centerW, 0, leftW, height);
          // Bottom dark bar
          context.fillStyle = "rgba(0,0,0,0.8)";
          context.fillRect(0, height * 0.72, width, height);
          // Contact info centered
          context.textAlign = "center";
          context.shadowBlur = 0;
          context.fillStyle = "rgba(255,255,255,0.78)";
          context.font = `500 ${Math.round(width * 0.042)}px Arial, sans-serif`;
          context.fillText(`Please call ${project.agentName}`, width / 2, height * 0.787);
          context.fillStyle = "white";
          context.font = `700 ${Math.round(width * 0.057)}px Arial, sans-serif`;
          context.fillText(project.phone, width / 2, height * 0.851);
          context.font = `700 ${Math.round(width * 0.044)}px Arial, sans-serif`;
          context.fillText(project.brokerage.toUpperCase(), width / 2, height * 0.908);
          context.textAlign = "left";
          drawBranding();
          return;
        }

        context.fillStyle = theme.dark;
        context.fillRect(0, 0, width, height);
        context.fillStyle = theme.accent;
        context.fillRect(pad, height * 0.14, width * 0.15, Math.max(5, width * 0.006));
        context.fillStyle = theme.light;
        context.font = `700 ${Math.round(width * 0.055)}px Arial, sans-serif`;
        context.fillText(project.cta, pad, height * 0.25);
        context.fillStyle = "rgba(255,255,255,.68)";
        context.font = `400 ${Math.round(width * 0.03)}px Arial, sans-serif`;
        wrapText(
          context,
          project.description,
          pad,
          height * 0.33,
          width - pad * 2,
          Math.round(width * 0.044),
          3,
        );

        const photoSize = Math.round(width * 0.17);
        if (loadedHeadshot) {
          context.save();
          context.translate(pad, height * 0.64);
          context.beginPath();
          context.arc(
            photoSize / 2,
            photoSize / 2,
            photoSize / 2,
            0,
            Math.PI * 2,
          );
          context.clip();
          drawImageCover(
            context,
            loadedHeadshot,
            photoSize,
            photoSize,
            1,
          );
          context.restore();
        }
        const agentX = loadedHeadshot ? pad + photoSize + pad * 0.4 : pad;
        context.fillStyle = theme.light;
        context.font = `700 ${Math.round(width * 0.043)}px Arial, sans-serif`;
        context.fillText(project.agentName, agentX, height * 0.69);
        context.fillStyle = theme.accent;
        context.font = `600 ${Math.round(width * 0.027)}px Arial, sans-serif`;
        context.fillText(
          `${project.agentTitle} · ${project.brokerage}`,
          agentX,
          height * 0.735,
        );
        context.fillStyle = "rgba(255,255,255,.78)";
        context.font = `500 ${Math.round(width * 0.027)}px Arial, sans-serif`;
        context.fillText(
          `${project.phone}  ·  ${project.email}`,
          agentX,
          height * 0.78,
        );
        context.fillText(project.license, agentX, height * 0.82);
        if (loadedLogo) {
          const logoWidth = width * 0.2;
          const logoHeight = logoWidth * (loadedLogo.height / loadedLogo.width);
          context.drawImage(
            loadedLogo,
            width - pad - logoWidth,
            height - pad - logoHeight,
            logoWidth,
            logoHeight,
          );
        }
        drawBranding();
      }

      recorder.start(250);
      setRenderState("rendering");
      setRenderMessage("Rendering your finished video…");
      const started = performance.now();
      let sceneStart = 0;

      await new Promise<void>((resolve) => {
        function frame(now: number) {
          const elapsed = now - started;
          let cumulative = 0;
          let currentScene = scenes[scenes.length - 1];
          sceneStart = 0;
          for (const scene of scenes) {
            if (elapsed < cumulative + scene.duration) {
              currentScene = scene;
              sceneStart = cumulative;
              break;
            }
            cumulative += scene.duration;
          }
          const sceneProgress = Math.min(
            1,
            (elapsed - sceneStart) / currentScene.duration,
          );
          drawFrame(currentScene, sceneProgress);
          setRenderProgress(Math.min(99, Math.round((elapsed / totalDuration) * 100)));
          if (elapsed < totalDuration) {
            requestAnimationFrame(frame);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });

      recorder.stop();
      audioElement?.pause();
      await audioContext?.close();
      const blob = await finish;
      const url = URL.createObjectURL(blob);
      const extension = blob.type.includes("mp4") ? "mp4" : "webm";
      const safeAddress =
        project.address.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") ||
        "listing";
      const anchor = document.createElement("a");
      anchor.href = url;
      const platformSlug = selectedPlatform ? `${platforms[selectedPlatform].label.toLowerCase()}-${platforms[selectedPlatform].sub.toLowerCase()}` : format;
      anchor.download = `${safeAddress}-${exportMode}-${platformSlug}.${extension}`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setRenderProgress(100);
      setRenderState("complete");
      setRenderMessage(
        extension === "mp4"
          ? "Your HD MP4 has downloaded."
          : "Your HD video has downloaded in the best format supported by this browser.",
      );
    } catch (error) {
      console.error(error);
      setRenderState("error");
      setRenderMessage(
        "The video could not be rendered. Try JPG, PNG, or WebP photos and generate again.",
      );
    }
  }

  const currentStepIndex = steps.findIndex((step) => step.id === activeStep);
  const nextStep = steps[Math.min(currentStepIndex + 1, steps.length - 1)].id;

  return (
    <main className="app-shell" style={{ "--accent": theme.accent } as CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => setActiveStep("photos")}>
          <span className="brand-mark">LR</span>
          <span>
            <strong>ListingReel</strong>
            <small>Property video studio</small>
          </span>
        </button>
        <div className={`save-status ${saveStatus}`}>
          <span />
          {saveStatus === "saving"
            ? "Saving…"
            : saveStatus === "unsaved"
            ? "Unsaved changes"
            : "All changes saved"}
        </div>
      </header>

      <nav className="step-nav" aria-label="Project steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={activeStep === step.id ? "active" : ""}
            onClick={() => setActiveStep(step.id)}
          >
            <span>{step.number}</span>
            {step.label}
            {index < steps.length - 1 && <i />}
          </button>
        ))}
      </nav>

      <section className="workspace">
        <div className="editor-panel">
          {activeStep === "photos" && (
            <section className="step-content">
              <div className="section-kicker">Step 01 · The visual story</div>
              <h1>Choose up to six unforgettable views.</h1>
              <p className="section-intro">
                Use your strongest exterior, living, kitchen, primary suite, and
                lifestyle photos. Six is enough for a focused, scroll-stopping reel.
              </p>

              <div
                className={`dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (event.dataTransfer.types.includes("Files")) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="upload-symbol">+</div>
                <strong>Drop your MLS photos here</strong>
                <span>JPG, PNG, WEBP or HEIC · maximum 6 photos</span>
                <button className="secondary-button" onClick={() => fileInput.current?.click()}>
                  Choose photos
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*,.heic,.heif"
                  multiple
                  hidden
                  onChange={handleUpload}
                />
              </div>

              <div className="photo-header">
                <span>{photos.length} of 6 photos</span>
                <button
                  className="text-button"
                  onClick={() => {
                    setPhotos(demoPhotos);
                    setPreviewIndex(0);
                  }}
                >
                  Restore demo
                </button>
              </div>
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`photo-card${photoDragOver === index ? " photo-drag-over" : ""}${photoDragIndex === index ? " photo-dragging" : ""}`}
                    draggable
                    onDragStart={(e) => {
                      setPhotoDragIndex(index);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (photoDragOver !== index) setPhotoDragOver(index);
                    }}
                    onDragLeave={() => setPhotoDragOver(null)}
                    onDrop={() => {
                      if (photoDragIndex !== null && photoDragIndex !== index) {
                        setPhotos((prev) => {
                          const next = [...prev];
                          const [item] = next.splice(photoDragIndex, 1);
                          next.splice(index, 0, item);
                          return next;
                        });
                      }
                      setPhotoDragIndex(null);
                      setPhotoDragOver(null);
                    }}
                    onDragEnd={() => {
                      setPhotoDragIndex(null);
                      setPhotoDragOver(null);
                    }}
                  >
                    <div
                      className={`photo-image demo-${photo.demoIndex ?? "upload"}`}
                      style={{
                        backgroundImage: `url("${photo.url}")`,
                      }}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="photo-actions">
                      <strong>{photo.name}</strong>
                      <div>
                        <button
                          aria-label={`Move ${photo.name} earlier`}
                          disabled={index === 0}
                          onClick={() => movePhoto(index, -1)}
                        >
                          ←
                        </button>
                        <button
                          aria-label={`Move ${photo.name} later`}
                          disabled={index === photos.length - 1}
                          onClick={() => movePhoto(index, 1)}
                        >
                          →
                        </button>
                        <button
                          aria-label={`Remove ${photo.name}`}
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeStep === "property" && (
            <section className="step-content">
              <div className="section-kicker">Step 02 · MLS essentials</div>
              <h1>Give buyers the story and the facts.</h1>
              <p className="section-intro">
                Keep the description factual. The social version will use it for the
                closing story; the MLS-safe version remains property-only.
              </p>
              <div className="form-grid">
                <SelectField
                  label="Campaign"
                  value={project.campaign}
                  onChange={(value) => updateProject("campaign", value)}
                  options={CAMPAIGN_TYPES}
                />
                <Field
                  label="Listing price"
                  value={project.price}
                  onChange={(value) => updateProject("price", value)}
                />
                <Field
                  label="Property address"
                  className="wide"
                  value={project.address}
                  onChange={(value) => updateProject("address", value)}
                />
                <Field
                  label="City, state & ZIP"
                  className="wide"
                  value={project.cityStateZip}
                  onChange={(value) => updateProject("cityStateZip", value)}
                />
                <Field
                  label="Bedrooms"
                  value={project.beds}
                  onChange={(value) => updateProject("beds", value)}
                />
                <Field
                  label="Bathrooms"
                  value={project.baths}
                  onChange={(value) => updateProject("baths", value)}
                />
                <Field
                  label="Approx. sq. ft."
                  value={project.sqft}
                  onChange={(value) => updateProject("sqft", value)}
                />
                <Field
                  label="MLS number"
                  value={project.mlsNumber}
                  onChange={(value) => updateProject("mlsNumber", value)}
                />
                <SelectField
                  label="Property type"
                  className="wide"
                  value={project.propertyType}
                  onChange={(value) => updateProject("propertyType", value)}
                  options={PROPERTY_TYPES}
                />
                {project.propertyType === "Multi-Family / Building" && (
                  <Field
                    label="Number of units"
                    value={project.units}
                    onChange={(value) => updateProject("units", value)}
                    placeholder="e.g. 6"
                  />
                )}
                <label className="field wide">
                  <span>Property description</span>
                  <textarea
                    rows={5}
                    value={project.description}
                    onChange={(event) =>
                      updateProject("description", event.target.value.slice(0, 520))
                    }
                  />
                  <small>{project.description.length}/520</small>
                </label>
                <Field
                  label="Three highlights, separated by commas"
                  className="wide"
                  value={project.highlights}
                  onChange={(value) => updateProject("highlights", value)}
                />
              </div>
            </section>
          )}

          {activeStep === "agent" && (
            <section className="step-content">
              <div className="section-kicker">Step 03 · Your brand</div>
              <h1>Make the final frame unmistakably yours.</h1>
              <p className="section-intro">
                Agent information appears only in the branded social version. The
                MLS-safe export automatically removes all branding.
              </p>
              <div className="brand-uploads">
                <label>
                  <span
                    className="round-upload"
                    style={headshot ? { backgroundImage: `url("${headshot}")` } : {}}
                  >
                    {!headshot && "EF"}
                  </span>
                  <strong>Agent headshot</strong>
                  <small>Square JPG or PNG</small>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => uploadSingle(event, setHeadshot)}
                  />
                </label>
                <label>
                  <span
                    className="logo-upload"
                    style={logo ? { backgroundImage: `url("${logo}")` } : {}}
                  >
                    {!logo && "Add logo"}
                  </span>
                  <strong>Brokerage logo</strong>
                  <small>PNG with transparent background</small>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => uploadSingle(event, setLogo)}
                  />
                </label>
              </div>
              <div className="form-grid">
                <Field
                  label="Agent name"
                  value={project.agentName}
                  onChange={(value) => updateProject("agentName", value)}
                />
                <Field
                  label="Title"
                  value={project.agentTitle}
                  onChange={(value) => updateProject("agentTitle", value)}
                />
                <Field
                  label="Brokerage"
                  className="wide"
                  value={project.brokerage}
                  onChange={(value) => updateProject("brokerage", value)}
                />
                <Field
                  label="Phone"
                  value={project.phone}
                  onChange={(value) => updateProject("phone", value)}
                />
                <Field
                  label="Email"
                  value={project.email}
                  onChange={(value) => updateProject("email", value)}
                />
                <Field
                  label="Website"
                  value={project.website}
                  onChange={(value) => updateProject("website", value)}
                  placeholder="Optional"
                />
                <Field
                  label="License number"
                  value={project.license}
                  onChange={(value) => updateProject("license", value)}
                />
                <Field
                  label="Call to action"
                  className="wide"
                  value={project.cta}
                  onChange={(value) => updateProject("cta", value)}
                />
              </div>
            </section>
          )}

          {activeStep === "style" && (
            <section className="step-content">
              <div className="section-kicker">Step 04 · Creative direction</div>
              <h1>One listing. Every important screen.</h1>
              <p className="section-intro">
                Choose a presentation style and output shape. The finished file is
                rendered directly in your browser; your listing photos are not sent
                to a third party.
              </p>

              <div className="option-block">
                <h2>Presentation style</h2>
                <div className="style-options">
                  {(Object.keys(styleThemes) as Style[]).map((item) => (
                    <button
                      key={item}
                      className={style === item ? "selected" : ""}
                      onClick={() => setStyle(item)}
                    >
                      <span
                        className="style-swatch"
                        style={{
                          background: `linear-gradient(135deg, ${styleThemes[item].dark} 0 68%, ${styleThemes[item].accent} 68%)`,
                        }}
                      />
                      <strong>{styleThemes[item].label}</strong>
                      <small>{styleThemes[item].detail}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-block">
                <h2>Video format</h2>
                <div className="format-options">
                  {(Object.keys(formats) as Format[]).map((item) => (
                    <button
                      key={item}
                      className={format === item ? "selected" : ""}
                      onClick={() => setFormat(item)}
                    >
                      <span className={`format-shape ${item}`} />
                      <strong>{formats[item].label}</strong>
                      <small>{formats[item].detail}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-block">
                <h2>Soundtrack</h2>
                <div className="music-presets">
                  {presetTracks.map((track) => (
                    <button
                      key={track.id}
                      className={`music-preset${music?.url === track.url ? " selected" : ""}`}
                      onClick={() =>
                        setMusic(
                          music?.url === track.url
                            ? null
                            : { name: track.name, url: track.url },
                        )
                      }
                    >
                      <span className="music-note">♪</span>
                      <strong>{track.name}</strong>
                      <small>{track.description}</small>
                    </button>
                  ))}
                </div>
                <div className="music-row">
                  <div>
                    <strong>
                      {music ? `Selected: ${music.name}` : "No music selected"}
                    </strong>
                    <small>
                      Choose a built-in track or upload music you own. MLS-safe
                      exports are always silent.
                    </small>
                  </div>
                  <label className="secondary-button">
                    {music && music.url.startsWith("blob:") ? "Replace track" : "Upload custom"}
                    <input
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setMusic({ name: file.name, url: URL.createObjectURL(file) });
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </section>
          )}

          {activeStep === "preview" && (
            <section className="step-content">
              <div className="section-kicker">Step 05 · Review & export</div>
              <h1>Your listing is ready for its close-up.</h1>
              <p className="section-intro">
                Generate a branded social video or switch to the silent, unbranded
                MLS-safe version.
              </p>

              <div className="export-toggle" role="group" aria-label="Export version">
                <button
                  className={exportMode === "social" ? "selected" : ""}
                  onClick={() => setExportMode("social")}
                >
                  <strong>Branded social</strong>
                  <small>Agent, facts, CTA and optional music</small>
                </button>
                <button
                  className={exportMode === "mls" ? "selected" : ""}
                  onClick={() => setExportMode("mls")}
                >
                  <strong>MLS-safe</strong>
                  <small>Property-only, unbranded and silent</small>
                </button>
              </div>

              <div className="option-block platform-section">
                <h2>Export for platform</h2>
                <div className="platform-grid">
                  {(Object.entries(platforms) as [Platform, typeof platforms[Platform]][]).map(([id, p]) => (
                    <button
                      key={id}
                      className={`platform-card${selectedPlatform === id ? " selected" : ""}`}
                      style={{ "--platform-color": p.color } as CSSProperties}
                      onClick={() => setSelectedPlatform(selectedPlatform === id ? null : id)}
                    >
                      <span className="platform-icon-badge">{p.icon}</span>
                      <span className="platform-card-label">{p.label}</span>
                      <span className="platform-card-sub">{p.sub}</span>
                      <span className="platform-card-dim">
                        {p.width < p.height ? "9∶16" : p.width === p.height ? "1∶1" : "16∶9"}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedPlatform && (
                  <p className="platform-note">
                    Exporting for <strong>{platforms[selectedPlatform].label} {platforms[selectedPlatform].sub}</strong>
                    &nbsp;·&nbsp;{platforms[selectedPlatform].width}×{platforms[selectedPlatform].height}&nbsp;px
                    &nbsp;·&nbsp;<button className="link-button" onClick={() => setSelectedPlatform(null)}>Clear</button>
                  </p>
                )}
              </div>

              <div className="review-list">
                <div>
                  <span>Photos</span>
                  <strong>{photos.length} selected</strong>
                </div>
                <div>
                  <span>Platform</span>
                  <strong>
                    {selectedPlatform
                      ? `${platforms[selectedPlatform].label} ${platforms[selectedPlatform].sub}`
                      : `${formats[format].label} (custom)`}
                  </strong>
                </div>
                <div>
                  <span>Style</span>
                  <strong>{theme.label}</strong>
                </div>
                <div>
                  <span>Sound</span>
                  <strong>
                    {exportMode === "mls" ? "Silent" : music?.name || "No music"}
                  </strong>
                </div>
              </div>

              <button
                className="render-button"
                onClick={renderVideo}
                disabled={renderState === "preparing" || renderState === "rendering"}
              >
                {renderState === "preparing" || renderState === "rendering"
                  ? `Creating video · ${renderProgress}%`
                  : `Generate ${exportMode === "mls" ? "MLS-safe" : "social"} video`}
              </button>
              {renderState !== "idle" && (
                <div className={`render-status ${renderState}`}>
                  <div>
                    <span style={{ width: `${renderProgress}%` }} />
                  </div>
                  <p>{renderMessage}</p>
                </div>
              )}
              <p className="compliance-note">
                MLS requirements vary. This mode follows current CRMLS guidance by
                removing agent branding, contact information, marketing text and
                music; always review your MLS’s rules before uploading.
              </p>
            </section>
          )}

          {activeStep !== "preview" && (
            <div className="editor-footer">
              <span>
                {currentStepIndex + 1} of {steps.length}
              </span>
              <button className="primary-button" onClick={() => setActiveStep(nextStep)}>
                Continue to {steps[currentStepIndex + 1]?.label || "preview"} →
              </button>
            </div>
          )}
        </div>

        <aside className="preview-panel">
          <div className="preview-heading">
            <div>
              <span>Live preview</span>
              <strong>
                {formats[format].label} · {theme.label}
              </strong>
            </div>
            <button onClick={() => setIsPlaying((current) => !current)}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>

          <div className={`device-stage ${format}`}>
            <div
              className={`video-preview${style === "triptych" ? " triptych-preview" : ` demo-${previewPhoto?.demoIndex ?? "upload"}`}`}
              style={
                previewPhoto && style !== "triptych"
                  ? {
                      backgroundImage: `url("${previewPhoto.url}")`,
                      "--preview-accent": theme.accent,
                      "--preview-dark": theme.dark,
                    } as CSSProperties
                  : undefined
              }
            >
              {!previewPhoto && <div className="empty-preview">Add a property photo</div>}
              {previewPhoto && (
                <>
                  {style === "triptych" ? (
                    <>
                      <div
                        className={`triptych-bg demo-${previewPhoto.demoIndex ?? "upload"}`}
                        style={{ backgroundImage: `url("${previewPhoto.url}")` }}
                      />
                      <div
                        className={`triptych-panel demo-${previewPhoto.demoIndex ?? "upload"}`}
                        style={{ backgroundImage: `url("${previewPhoto.url}")` }}
                      />
                    </>
                  ) : (
                    <div className="preview-vignette" />
                  )}
                  {exportMode === "social" && (
                    <div className={`preview-copy${style === "triptych" ? " triptych-copy" : ""}`}>
                      <span className="preview-slide-headline">{slideText.headline}</span>
                      <p className="preview-slide-subline">{slideText.subline}</p>
                    </div>
                  )}
                  <div className="preview-progress">
                    {photos.map((photo, index) => (
                      <button
                        key={photo.id}
                        className={index === previewIndex % photos.length ? "active" : ""}
                        aria-label={`Preview photo ${index + 1}`}
                        onClick={() => {
                          setPreviewIndex(index);
                          setIsPlaying(false);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="preview-summary">
            <div>
              <span>VERSION</span>
              <strong>{exportMode === "social" ? "Branded social" : "MLS-safe"}</strong>
            </div>
            <div>
              <span>EST. LENGTH</span>
              <strong>{exportMode === "social" ? "15 sec" : "12 sec"}</strong>
            </div>
            <div>
              <span>OUTPUT</span>
              <strong>{(selectedPlatform ? platforms[selectedPlatform] : formats[format]).width} × {(selectedPlatform ? platforms[selectedPlatform] : formats[format]).height}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
