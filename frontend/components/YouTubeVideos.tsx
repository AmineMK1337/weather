"use client";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface YouTubeVideosProps {
  location: string | null;
}

export default function YouTubeVideos({ location }: YouTubeVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey) return;

    const abortController = new AbortController();
    setLoading(true);
    
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(location + " travel")}` +
      `&type=video&maxResults=4&key=${apiKey}`,
      { signal: abortController.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        if (!abortController.signal.aborted) {
          setVideos(
            (data.items || []).map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.medium.url,
              channelTitle: item.snippet.channelTitle,
            }))
          );
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // Silent fail for API errors
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      });

    return () => abortController.abort();
  }, [location]);

  if (!location || (!loading && videos.length === 0)) {
    return <div className="card p-5 min-h-[260px] invisible" aria-hidden="true" />;
  }

  return (
    <div className="card p-5 min-h-[260px]">
      <h2 className="font-display text-2xl text-text-primary mb-4">
        📺 Explore {location}
      </h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-bg-hover rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 items-center p-2.5 rounded-xl hover:bg-bg-hover transition-all group"
            >
              <img src={v.thumbnail} alt={v.title} className="w-24 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-sans line-clamp-2 group-hover:text-accent-blue transition-colors">{v.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{v.channelTitle}</p>
              </div>
              <ExternalLink size={12} className="text-text-muted flex-shrink-0 group-hover:text-accent-blue transition-colors" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
