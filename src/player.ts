// Full-screen background video. It is silent, so it can autoplay muted on every browser.

const VIDEO_SRC = `${import.meta.env.BASE_URL}video/club-dance.mp4`

export function initPlayer(): HTMLVideoElement {
  const video = document.querySelector<HTMLVideoElement>('#player')
  if (!video) throw new Error('Missing #player video element')

  video.src = VIDEO_SRC
  video.play().catch(() => {
    // Some browsers (e.g. low-power mode) still block autoplay; start on first interaction.
    document.addEventListener('pointerdown', () => video.play(), { once: true })
  })
  return video
}
