import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize,
  SkipForward, SkipBack, Loader2, AlertCircle, ExternalLink
} from "lucide-react";

interface Track {
  file: string;
  label?: string;
  kind?: string;
  default?: boolean;
}

interface VideoPlayerProps {
  src?: string;
  embedUrl?: string;
  tracks?: Track[];
  poster?: string;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
}

export default function VideoPlayer({ src, embedUrl, tracks = [], poster, onProgress, onEnded }: VideoPlayerProps) {
  if (embedUrl) {
    return (
      <div className="aspect-video bg-black relative rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        />
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 flex items-center gap-1 text-xs text-white/60 hover:text-white bg-black/50 rounded px-2 py-1 transition-colors z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </a>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center rounded-lg">
        <div className="text-center text-muted-foreground">
          <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Select an episode to start watching</p>
        </div>
      </div>
    );
  }

  return (
    <HlsPlayer
      src={src}
      tracks={tracks}
      poster={poster}
      onProgress={onProgress}
      onEnded={onEnded}
    />
  );
}

function HlsPlayer({ src, tracks = [], poster, onProgress, onEnded }: Omit<VideoPlayerProps, "embedUrl">) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    setError(null);
    setLoading(true);
    setPlaying(false);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (src.includes(".m3u8") || src.includes("m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().then(() => setPlaying(true)).catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) { setError("Failed to load video stream"); setLoading(false); }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src; video.load(); setLoading(false);
      }
    } else {
      video.src = src; video.load(); setLoading(false);
    }
    return () => { hlsRef.current?.destroy(); hlsRef.current = null; };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1));
      if (video.duration > 0) onProgress?.(video.currentTime / video.duration);
    };
    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded_ = () => { setPlaying(false); onEnded?.(); };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded_);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded_);
    };
  }, [onProgress, onEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); } else { video.pause(); }
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted; setMuted(!muted);
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = (Number(e.target.value) / 100) * duration;
    video.currentTime = time; setCurrentTime(time);
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Number(e.target.value) / 100;
    video.volume = v; setVolume(v); setMuted(v === 0);
  };
  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) { containerRef.current.requestFullscreen(); }
    else { document.exitFullscreen(); }
  };
  const showControlsTemp = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="aspect-video bg-black relative group rounded-lg overflow-hidden"
      onMouseMove={showControlsTemp}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={togglePlay}
    >
      <video ref={videoRef} poster={poster} className="w-full h-full object-contain" crossOrigin="anonymous">
        {tracks.map((t, i) => (
          <track key={i} src={t.file} kind={(t.kind as any) || "subtitles"} label={t.label} default={t.default} />
        ))}
      </video>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">{error}</p>
            <p className="text-sm text-muted-foreground">Try a different server or category</p>
          </div>
        </div>
      )}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/30 to-transparent px-4 pb-4 pt-16">
          <div className="relative mb-3 h-1 group/progress">
            <div className="absolute inset-y-0 w-full bg-white/20 rounded-full" />
            <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full" style={{ width: `${bufPct}%` }} />
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${pct}%` }} />
            <input type="range" min={0} max={100} value={pct} onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="w-9 h-9 flex items-center justify-center text-white hover:text-primary transition-colors">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button onClick={() => skip(-10)} className="text-white/70 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={() => skip(10)} className="text-white/70 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input type="range" min={0} max={100} value={muted ? 0 : volume * 100} onChange={handleVolume}
                className="w-20 accent-primary cursor-pointer" />
            </div>
            <span className="text-xs text-white/70 ml-1">{fmt(currentTime)} / {fmt(duration)}</span>
            <div className="flex-1" />
            <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
