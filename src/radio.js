/**
 * Voices to try first. Real weather radio uses a flat, robotic computer
 * voice, and "Fred" on macOS is the closest match most people have.
 */
const PREFERRED_VOICES = ['Fred', 'Microsoft David', 'Google US English', 'Alex', 'Daniel']

/** Weather radio data bursts send bits at 520.83 per second using two tones. */
const BIT_SECONDS = 1 / 520.83
const MARK_HZ = 2083.3
const SPACE_HZ = 1562.5
/** The long tone that comes before a watch or warning. */
const ALERT_HZ = 1050

export function canBroadcast() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices()
  for (const name of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.startsWith(name) && v.lang.startsWith('en'))
    if (match) return match
  }
  return voices.find((v) => v.lang === 'en-US') ?? voices.find((v) => v.lang.startsWith('en')) ?? null
}

/**
 * Play a broadcast: three short data bursts, the alert tone if there are
 * alerts, then each line read aloud in turn.
 *
 * @param {object} handlers
 * @param {(text: string) => void} handlers.onLine   Called as each line starts.
 * @param {(playing: boolean) => void} handlers.onState  Called on start and stop.
 */
export function createRadio({ onLine, onState }) {
  let audio = null
  let run = 0
  let playing = false

  // Some browsers load their voice list late; asking early warms it up.
  window.speechSynthesis.getVoices()

  function setPlaying(next) {
    if (playing === next) return
    playing = next
    onState(next)
  }

  /** Schedule the tones and resolve once they have finished. */
  function playTones(withAlert) {
    audio = new AudioContext()
    const out = audio.createGain()
    out.gain.value = 0.06
    out.connect(audio.destination)

    let t = audio.currentTime + 0.1
    for (let burst = 0; burst < 3; burst++) {
      const osc = audio.createOscillator()
      osc.type = 'square'
      osc.connect(out)
      const bits = Math.round(0.45 / BIT_SECONDS)
      for (let i = 0; i < bits; i++) {
        osc.frequency.setValueAtTime(Math.random() < 0.5 ? MARK_HZ : SPACE_HZ, t + i * BIT_SECONDS)
      }
      osc.start(t)
      osc.stop(t + bits * BIT_SECONDS)
      t += bits * BIT_SECONDS + 0.5
    }

    if (withAlert) {
      const osc = audio.createOscillator()
      const fade = audio.createGain()
      osc.frequency.value = ALERT_HZ
      fade.gain.setValueAtTime(0, t)
      fade.gain.linearRampToValueAtTime(1, t + 0.05)
      fade.gain.setValueAtTime(1, t + 2.4)
      fade.gain.linearRampToValueAtTime(0, t + 2.5)
      osc.connect(fade).connect(out)
      osc.start(t)
      osc.stop(t + 2.5)
      t += 3
    }

    const waitMs = (t - audio.currentTime) * 1000
    return new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  function speak(lines, index, myRun) {
    if (myRun !== run) return
    if (index >= lines.length) {
      stop()
      return
    }
    const utterance = new SpeechSynthesisUtterance(lines[index].speak)
    const voice = pickVoice()
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'en-US'
    utterance.rate = 0.92
    utterance.pitch = 0.8
    utterance.onend = () => speak(lines, index + 1, myRun)
    utterance.onerror = (event) => {
      // "interrupted" and "canceled" come from pressing stop; anything else, skip ahead.
      if (event.error !== 'interrupted' && event.error !== 'canceled') speak(lines, index + 1, myRun)
    }
    onLine(lines[index].show)
    window.speechSynthesis.speak(utterance)
  }

  async function play(lines, { withAlert = false } = {}) {
    stop()
    const myRun = ++run
    setPlaying(true)
    onLine('Receiving transmission…')
    try {
      await playTones(withAlert)
    } catch {
      // Sound effects are optional; carry on to the voice if audio fails.
    }
    speak(lines, 0, myRun)
  }

  function stop() {
    run++
    window.speechSynthesis.cancel()
    audio?.close().catch(() => {})
    audio = null
    onLine('')
    setPlaying(false)
  }

  return {
    play,
    stop,
    get playing() {
      return playing
    },
  }
}
