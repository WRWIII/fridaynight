// Video player setup. Custom controls and music sync will hook in here later.

const VIDEO_SRC = `${import.meta.env.BASE_URL}video/club-dance.mp4`

export function initPlayer(): HTMLVideoElement {
  const video = document.querySelector<HTMLVideoElement>('#player')
  if (!video) throw new Error('Missing #player video element')

  video.src = VIDEO_SRC
  return video
}
