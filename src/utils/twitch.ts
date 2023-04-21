import { Clip } from '@/remotion/Clip';
import { TwitchClip } from 'twitch-api-helix';

export function formatTwitchClip(clip: TwitchClip): Clip {
  const slicePoint = clip.thumbnail_url.indexOf('-preview-');
  const videoUrl = `${clip.thumbnail_url.slice(0, slicePoint)}.mp4`;
  return {
    id: clip.id,
    title: clip.title,
    broadcaster: clip.broadcaster_name,
    game: clip.game_id,
    embedUrl: clip.embed_url,
    thumbnailUrl: clip.thumbnail_url,
    videoUrl,
    views: clip.view_count,
    duration: clip.duration,
  };
}
