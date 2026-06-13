"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { useAdmin, type Track } from "@/lib/AdminContext";
import { GUIDED_MEDITATIONS, DAILY_QUOTE } from "@/lib/data";
import { cn } from "@/lib/utils";

interface PlayerState {
  trackId: string | null;
  playing: boolean;
  muted: boolean;
  volume: number;
  elapsed: number;
  duration: number;
}

export default function MeditationPage() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<PlayerState>({
    trackId: null,
    playing: false,
    muted: false,
    volume: 0.7,
    elapsed: 0,
    duration: 0,
  });
  const { meditationTracks: tracks } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meritRef = useRef(0);

  const categories = ["全部", ...Array.from(new Set(tracks.map((t) => t.category)))];

  const filteredTracks =
    selectedCategory === "全部"
      ? tracks
      : tracks.filter((t) => t.category === selectedCategory);

  const currentTrack = state.trackId
    ? tracks.find((t) => t.id === state.trackId)
    : null;

  // Init audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("play", () => {
      setState((prev) => ({ ...prev, playing: true }));
    });
    audio.addEventListener("pause", () => {
      setState((prev) => ({ ...prev, playing: false }));
    });
    audio.addEventListener("ended", () => {
      setState((prev) => ({ ...prev, playing: false }));
    });
    audio.addEventListener("timeupdate", () => {
      setState((prev) => ({ ...prev, elapsed: audio.currentTime }));
    });
    audio.addEventListener("loadedmetadata", () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    });

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Sync volume/mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.muted ? 0 : state.volume;
  }, [state.volume, state.muted]);

  // Simulated loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const playTrack = useCallback((track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.trackId === track.id) {
      // Toggle play/pause for same track
      if (state.playing) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      return;
    }

    audio.src = track.url;
    audio.currentTime = 0;
    setState((prev) => ({ ...prev, trackId: track.id, elapsed: 0, duration: track.duration }));
    meritRef.current = 0;
    audio.play().catch(() => {});
  }, [state.trackId, state.playing]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !state.trackId) return;
    if (state.playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const reset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = "";
    setState({ trackId: null, playing: false, muted: false, volume: 0.7, elapsed: 0, duration: 0 });
  };

  const setMuted = (muted: boolean) => {
    setState((prev) => ({ ...prev, muted }));
  };

  const setVolume = (volume: number) => {
    setState((prev) => ({ ...prev, volume, muted: volume === 0 }));
  };

  const seekTo = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !state.duration) return;
    audio.currentTime = ratio * state.duration;
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = state.duration > 0 ? state.elapsed / state.duration : 0;

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">静心禅坐</h1>
          </div>
        </ScrollReveal>

        {loading && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🧘
            </motion.div>
            <p className="text-base text-gold/70 animate-pulse">加载禅修曲目...</p>
          </div>
        )}

        {!loading && (
          <div className="mt-6 space-y-6">
            {/* Hero */}
            <ScrollReveal delay={0.05}>
              <div className="space-y-3 pt-6 text-center">
                <motion.div
                  animate={state.playing ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto size-24"
                >
                  <div
                    className="absolute inset-0 rounded-full bg-gold/15 blur-xl"
                    style={{ animation: state.playing ? "halo-pulse 4s ease-in-out infinite" : "none" }}
                  />
                  <div className="relative flex size-24 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                    <span className="text-5xl">🪷</span>
                  </div>
                </motion.div>

                <h1 className="font-display text-3xl tracking-widest text-gold">静心禅坐</h1>
                <p className="text-base leading-relaxed text-paper-dark/80">
                  一念心生 · 一念心灭 · 但有觉知 · 莫住莫离
                </p>

                {/* Daily Quote */}
                <div className="mx-auto max-w-md rounded-xl border border-gold/30 bg-xuan-surface/40 px-4 py-3">
                  <p className="font-display text-base text-paper">
                    「{DAILY_QUOTE.text}」
                  </p>
                  <p className="mt-1 text-sm text-paper-dark/65">
                    — {DAILY_QUOTE.source}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Player */}
            {currentTrack && (
              <ScrollReveal delay={0.05}>
                <div className="rounded-xl border border-gold/40 bg-xuan-card p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    {/* Album art */}
                    <div
                      className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-gradient-to-br from-gold/15 to-vermillion/10 text-4xl"
                      style={{
                        animation: state.playing ? "spin-slow 18s linear infinite" : "none",
                        boxShadow: state.playing
                          ? "0 0 24px rgba(201,169,110,0.4)"
                          : "0 0 12px rgba(201,169,110,0.2)",
                      }}
                    >
                      {currentTrack.icon}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-display text-xl text-gold">{currentTrack.name}</p>
                      <p className="truncate text-sm text-paper-dark/80">{currentTrack.description}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-paper-dark/65">
                        <span className="font-mono">{formatTime(state.elapsed)}</span>
                        <span>/</span>
                        <span className="font-mono">{formatTime(currentTrack.duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <button
                      onClick={togglePlay}
                      aria-label={state.playing ? "暂停" : "播放"}
                      className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
                    >
                      {state.playing ? (
                        <Pause className="size-7" />
                      ) : (
                        <Play className="size-7" />
                      )}
                    </button>

                    <button
                      onClick={() => setMuted(!state.muted)}
                      aria-label={state.muted ? "取消静音" : "静音"}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10"
                    >
                      {state.muted ? (
                        <VolumeX className="size-5" />
                      ) : (
                        <Volume2 className="size-5" />
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      seekTo(Math.max(0, Math.min(1, ratio)));
                    }}
                    className="group relative h-2.5 w-full overflow-hidden rounded-full bg-xuan-surface/80 cursor-pointer"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-gold to-vermillion transition-all duration-200"
                      style={{ width: `${progress * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${progress * 100}%` }}
                    />
                  </button>

                  {/* Volume slider */}
                  <div className="flex items-center gap-2 text-xs text-paper-dark/65">
                    <Volume2 className="size-3.5" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={state.muted ? 0 : Math.round(state.volume * 100)}
                      onChange={(e) => setVolume(Number(e.target.value) / 100)}
                      className="flex-1 accent-gold"
                    />
                    <span className="w-8 font-mono">{Math.round((state.muted ? 0 : state.volume) * 100)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-paper-dark/65">
                      累计禅修 {Math.floor(state.elapsed / 60)} 分 {Math.floor(state.elapsed % 60)} 秒
                    </p>
                    <button
                      onClick={reset}
                      className="rounded-full border border-gold/30 bg-xuan-surface/40 px-4 py-1.5 text-sm text-gold hover:bg-gold/10"
                    >
                      结束禅修
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Track library */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-3">
                <h2 className="font-display text-xl text-gold">禅音曲库</h2>
                <p className="text-sm text-paper-dark/55">
                  10 首禅修音乐 · 全部为正版授权
                </p>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors",
                        selectedCategory === cat
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/15 text-paper-dark hover:border-gold/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Track list */}
                <div className="grid gap-2 md:grid-cols-2">
                  {filteredTracks.map((track) => {
                    const isActive = state.trackId === track.id;
                    return (
                      <button
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                          isActive
                            ? "border-gold/60 bg-gold/10"
                            : "border-gold/15 bg-xuan-surface/40 hover:border-gold/40"
                        )}
                      >
                        <span
                          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-xuan-surface text-2xl"
                          style={{
                            animation: isActive && state.playing ? "spin-slow 18s linear infinite" : "none",
                          }}
                        >
                          {track.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-display text-base text-gold">{track.name}</p>
                          <p className="truncate text-sm text-paper-dark/80">{track.description}</p>
                          <p className="text-xs text-paper-dark/55">
                            {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, "0")} · {track.source}
                          </p>
                        </div>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                          {isActive && state.playing ? (
                            <Pause className="size-4" />
                          ) : (
                            <Play className="size-4" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Guided meditation */}
            <ScrollReveal delay={0.15}>
              <div className="space-y-3">
                <h2 className="font-display text-xl text-gold">禅修引导</h2>
                <div className="grid gap-3 md:grid-cols-3">
                  {GUIDED_MEDITATIONS.map((guide) => (
                    <div
                      key={guide.id}
                      className="rounded-xl border border-gold/20 bg-xuan-surface/40 p-4"
                    >
                      <p className="font-display text-lg text-gold">{guide.title}</p>
                      <p className="mt-1 text-sm text-paper-dark/80">{guide.subtitle}</p>
                      <span className="mt-2 inline-flex items-center rounded-full border border-gold/30 bg-gradient-to-r from-gold/20 to-gold/5 px-2.5 py-1 text-xs font-medium text-gold">
                        {Math.floor(guide.duration / 60)} 分钟
                      </span>
                      <ol className="mt-3 space-y-1.5 text-sm text-paper-dark/80">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="shrink-0 text-gold">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Footer */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-xl border border-gold/10 bg-xuan/40 p-4 text-center">
                <p className="text-sm text-paper-dark/70 leading-relaxed">
                  日日一坐，福报自来。禅坐不在久，在心念专一、持之以恒。
                </p>
                <p className="mt-1 text-sm text-paper-dark/50">
                  《六祖坛经》：「外离相为禅，内不乱为定。」
                </p>
              </div>
            </ScrollReveal>

            <div className="text-center">
              <ShareButton title="静心禅坐" description="钟磬古乐、佛号梵音、深山流水。日日一坐，福报自来。" />
            </div>
          </div>
        )}
      </div>

      {/* CSS animations for player */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes halo-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </main>
  );
}
