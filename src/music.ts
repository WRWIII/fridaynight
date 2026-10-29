// Background music via the Web Audio API, which loops a section of a track sample-accurately
// (an <audio loop> element can only loop the whole file, and with a gap).
//
// The track is started as soon as it has loaded. Whether the visitor hears it right away is
// up to the browser's autoplay policy: if sound is allowed it plays immediately, otherwise
// the audio clock stays suspended (still at 0:00) and a small hint asks for a click/tap,
// which starts it from the beginning. The corner button toggles music on/off; a track
// picker will hang off it later.

import { TRACKS, type Track } from './tracks.ts'

async function loadTrack(ctx: AudioContext, track: Track): Promise<AudioBuffer> {
  const res = await fetch(`${import.meta.env.BASE_URL}music/${track.file}`)
  if (!res.ok) throw new Error(`Failed to load ${track.file}: ${res.status}`)
  return ctx.decodeAudioData(await res.arrayBuffer())
}

export function initMusic(): void {
  const toggle = document.querySelector<HTMLButtonElement>('#music-toggle')
  const hint = document.querySelector<HTMLElement>('#sound-hint')
  if (!toggle || !hint || TRACKS.length === 0) return

  const track = TRACKS[0]
  const ctx = new AudioContext()
  const output = ctx.createGain()
  output.connect(ctx.destination)
  toggle.hidden = false
  if (matchMedia('(pointer: coarse)').matches) hint.textContent = 'Tap anywhere for sound'

  let userPaused = false

  const updateUi = () => {
    const playing = ctx.state === 'running'
    toggle.classList.toggle('is-playing', playing)
    toggle.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on')
    hint.hidden = playing || userPaused
  }
  ctx.addEventListener('statechange', updateUi)

  // Ask for sound straight away; this succeeds when the browser allows autoplay.
  ctx.resume().catch(() => {})

  loadTrack(ctx, track).then((buffer) => {
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    if (track.loopStart !== undefined) source.loopStart = track.loopStart
    if (track.loopEnd !== undefined) source.loopEnd = track.loopEnd
    source.connect(output)
    source.start()
    updateUi()
  })

  // Sound blocked: start on the first click, tap or key press anywhere.
  const stopListening = () => {
    document.removeEventListener('pointerdown', unlock)
    document.removeEventListener('keydown', unlock)
  }
  const unlock = (e: Event) => {
    if (e.target instanceof Node && toggle.contains(e.target)) return
    stopListening()
    if (!userPaused) ctx.resume()
  }
  document.addEventListener('pointerdown', unlock)
  document.addEventListener('keydown', unlock)

  toggle.addEventListener('click', () => {
    stopListening()
    userPaused = ctx.state === 'running'
    if (userPaused) ctx.suspend()
    else ctx.resume()
    updateUi()
  })

  // Only show the hint if sound didn't start on its own.
  setTimeout(updateUi, 800)
}
