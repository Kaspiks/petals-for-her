import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const ACCENT = '#E8365D'

/*
 * Animation data ported from the original Ruby flower-bloom one-liner.
 * Each 0x00 byte separates frame deltas; pairs of (position, xor_value)
 * are applied cumulatively starting from an all-0xFF 64-byte canvas.
 * The result is a 32×16 dot-art flower that "blooms" over 13 frames.
 */
const RAW = [
  53,1,54,128,0,
  49,1,50,128,0,
  45,1,46,128,54,128,0,
  41,1,42,128,50,128,0,
  37,3,38,128,41,2,46,128,0,
  29,4,30,64,33,3,34,192,37,4,41,2,42,128,0,
  25,4,26,64,29,1,30,32,33,5,37,14,38,128,0,
  21,13,22,192,25,9,26,48,29,15,30,192,33,27,34,176,37,8,0,
  21,2,22,32,25,16,34,8,37,8,38,64,0,
  17,24,18,48,21,48,26,8,37,48,38,32,0,
  17,32,18,12,21,64,22,28,33,32,34,4,37,68,38,28,0,
  13,64,14,3,17,64,21,1,41,96,42,14,
]

const FRAMES = (() => {
  const segs = []
  let buf = []
  for (const b of RAW) {
    if (b === 0) { if (buf.length) segs.push(buf); buf = [] }
    else buf.push(b)
  }
  if (buf.length) segs.push(buf)

  const frames = []
  let prev = Array(64).fill(255)
  frames.push([...prev])

  for (const seg of segs) {
    const f = [...prev]
    for (let i = 0; i < seg.length; i += 2) f[seg[i]] ^= seg[i + 1]
    frames.push(f)
    prev = f
  }

  return frames.map(f => {
    const rows = []
    for (let r = 0; r < 16; r++) {
      let bits = ''
      for (let c = 0; c < 4; c++) bits += f[r * 4 + c].toString(2).padStart(8, '0')
      rows.push(bits.replace(/0/g, ' ').replace(/1/g, '•'))
    }
    return rows.join('\n')
  })
})()

function encodeMsg(text) {
  const bytes = new TextEncoder().encode(text)
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''))
}

function decodeMsg(encoded) {
  try {
    const binary = atob(encoded)
    return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)))
  } catch {
    return null
  }
}

export default function DigitalBloomPage() {
  const [params] = useSearchParams()
  const viewerMsg = params.has('m') ? decodeMsg(params.get('m')) : null
  const isViewer = viewerMsg !== null

  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [showMsg, setShowMsg] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!playing || frame >= FRAMES.length - 1) {
      if (playing) setPlaying(false)
      return
    }
    const id = setTimeout(() => setFrame(f => f + 1), 200)
    return () => clearTimeout(id)
  }, [frame, playing])

  useEffect(() => {
    if (playing) return
    const id = setTimeout(() => setShowMsg(true), 400)
    return () => clearTimeout(id)
  }, [playing])

  const replay = () => {
    setFrame(0)
    setShowMsg(false)
    setPlaying(true)
  }

  const share = () => {
    if (!message.trim()) return
    const url = `${window.location.origin}/bloom?m=${encodeURIComponent(encodeMsg(message.trim()))}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const displayMsg = isViewer ? viewerMsg : message

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 50%)' }}
    >
      <header className="text-center pt-6 sm:pt-8">
        <Link
          to="/"
          className="font-serif text-lg sm:text-xl font-semibold text-stone-800 hover:opacity-70 transition"
        >
          Petals for Her
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: ACCENT }}
          >
            {isViewer ? 'Someone sent you a bloom' : 'Create a digital gift'}
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-semibold text-stone-900">
            {isViewer ? 'A Digital Bloom for You' : 'Send a Digital Bloom'}
          </h1>
          {!isViewer && (
            <p className="mt-3 text-stone-500 max-w-sm mx-auto text-sm leading-relaxed">
              Write a heartfelt message and share a blooming flower with someone special.
            </p>
          )}
        </div>

        {!isViewer && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-stone-600 mb-2">
              Your message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Happy Women's Day! Wishing you all the joy..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-none transition"
            />
            <p className="text-xs text-stone-400 mt-1.5 text-right">
              {message.length}/200
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden">
          <div className="bg-[#1a1a2e] m-4 sm:m-6 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#151528]">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="px-4 sm:px-6 py-5 sm:py-6 flex justify-center overflow-hidden">
              <pre
                className="font-mono text-xs sm:text-sm select-none"
                style={{ color: '#f4a0b8', lineHeight: '1.15', letterSpacing: '0.12em' }}
              >
                {FRAMES[frame]}
              </pre>
            </div>
          </div>

          {displayMsg && (
            <div
              className={`px-6 pb-6 text-center transition-all duration-700 ease-out ${
                isViewer
                  ? showMsg
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                  : 'opacity-100'
              }`}
            >
              <p className="font-serif text-xl sm:text-2xl text-stone-800 italic leading-relaxed whitespace-pre-wrap">
                &ldquo;{displayMsg}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!isViewer && (
            <button
              onClick={share}
              disabled={!message.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              style={{ backgroundColor: ACCENT }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              {copied ? 'Link Copied!' : 'Send Digital'}
            </button>
          )}

          <button
            onClick={replay}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border-2 transition hover:bg-rose-50/50"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Replay
          </button>

          {isViewer && (
            <Link
              to="/bloom"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border-2 transition hover:bg-rose-50/50"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Your Own
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
