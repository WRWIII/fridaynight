// Music tracks. Put audio files in public/music/ and list them here.
// The first track is the default. If the list is empty, the music button is hidden.
//
// loopStart/loopEnd (seconds) are optional: the track plays from the beginning once,
// then loops that section forever. Without them the whole track loops.

export interface Track {
  title: string
  file: string // path inside public/music/
  loopStart?: number
  loopEnd?: number
}

export const TRACKS: Track[] = [
  // Loop is 128 beats at 125.8 BPM (61.0493 s); end found by matching the waveform at the seam.
  { title: 'Friday Night', file: 'friday-night.mp3', loopStart: 22.9, loopEnd: 83.94929 },
]
