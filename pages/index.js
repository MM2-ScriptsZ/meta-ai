import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

const ASPECT_RATIOS = [
  { id: '1:1', label: '1 : 1', w: 40, h: 40, desc: 'Square' },
  { id: '16:9', label: '16 : 9', w: 52, h: 29, desc: 'Landscape' },
  { id: '9:16', label: '9 : 16', w: 29, h: 52, desc: 'Portrait' },
  { id: '4:3', label: '4 : 3', w: 48, h: 36, desc: 'Classic' },
  { id: '3:2', label: '3 : 2', w: 48, h: 32, desc: 'Photo' },
  { id: '2:3', label: '2 : 3', w: 32, h: 48, desc: 'Tall' },
];

const FARM_TOPICS = [
  'Rice paddy irrigation system',
  'Organic vegetable garden with raised beds',
  'Traditional carabao plowing rice field',
  'Chicken brooder house interior',
  'Composting and organic fertilizer making',
  'Hydroponics lettuce growing system',
  'Fruit tree grafting technique',
  'Fish pond aquaculture setup',
  'Soil pH testing in farm',
  'Beekeeping and honey extraction',
];

const STYLES = [
  'Photorealistic',
  'Educational illustration',
  'Watercolor painting',
  'Infographic style',
  'Documentary photography',
  'Digital art',
  'Pencil sketch',
  'Oil painting',
];

const MOODS = [
  'Bright and educational',
  'Golden hour warmth',
  'Morning mist atmosphere',
  'Vibrant and colorful',
  'Natural and earthy',
  'Clean and professional',
  'Rustic and authentic',
];

const SEASONS = ['Any season', 'Dry season', 'Wet season / Monsoon', 'Harvest time', 'Planting season'];
const LEVELS = ['General audience', 'Elementary students', 'High school', 'College / University', 'Farming professionals'];

const FARM_EMOJIS = ['🌾', '🌱', '🚜', '🐄', '🌽', '🍅', '🥬', '🌿', '🐔', '🌻'];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [mood, setMood] = useState('Bright and educational');
  const [season, setSeason] = useState('Any season');
  const [level, setLevel] = useState('General audience');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const promptRef = useRef(null);
  const animFrameRef = useRef(null);

  const animatePrompt = (text) => {
    if (!promptRef.current) return;
    promptRef.current.innerHTML = '';
    let i = 0;
    const step = () => {
      if (i < text.length) {
        const span = document.createElement('span');
        span.className = 'prompt-char';
        span.textContent = text[i];
        span.style.animationDelay = `${i * 18}ms`;
        promptRef.current.appendChild(span);
        i++;
        animFrameRef.current = requestAnimationFrame(step);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    if (result?.prompt) {
      animatePrompt(result.prompt);
    }
  }, [result]);

  const generate = async () => {
    if (!topic.trim()) {
      setError('Please enter a farm topic to generate a prompt.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, mood, season, educationalLevel: level, aspectRatio }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResult(data);

      // Add to history
      setHistory(prev => [{
        topic,
        prompt: data.prompt,
        aspectRatio,
        emoji: FARM_EMOJIS[Math.floor(Math.random() * FARM_EMOJIS.length)],
        id: Date.now(),
      }, ...prev.slice(0, 4)]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async () => {
    if (!result?.prompt) return;
    await navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMetaAI = () => {
    if (!result?.prompt) return;
    const encoded = encodeURIComponent(result.prompt);
    window.open(`https://www.meta.ai/?q=${encoded}`, '_blank');
  };

  const loadFromHistory = (item) => {
    setTopic(item.topic);
    setAspectRatio(item.aspectRatio);
    setResult({ prompt: item.prompt, aspectRatio: item.aspectRatio });
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') generate();
  };

  return (
    <>
      <Head>
        <title>FarmPrompt — AI Image Prompt Generator for Agriculture</title>
        <meta name="description" content="Generate stunning AI image prompts for farm and agricultural educational content. Optimized for Meta AI, Midjourney, and DALL-E." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌾</text></svg>" />
      </Head>

      <div className="container">
        {/* Header */}
        <header className="header">
          <svg className="wheat-deco left" width="80" height="140" viewBox="0 0 80 140" fill="none">
            <path d="M40 130 Q38 100 35 80 Q30 60 20 45" stroke="#4a7040" strokeWidth="2" fill="none"/>
            <ellipse cx="18" cy="40" rx="8" ry="14" fill="#4a7040" transform="rotate(-20 18 40)"/>
            <ellipse cx="28" cy="55" rx="7" ry="12" fill="#4a7040" transform="rotate(-10 28 55)"/>
            <ellipse cx="22" cy="70" rx="6" ry="11" fill="#4a7040" transform="rotate(-25 22 70)"/>
          </svg>
          <svg className="wheat-deco right" width="80" height="140" viewBox="0 0 80 140" fill="none">
            <path d="M40 130 Q38 100 35 80 Q30 60 20 45" stroke="#4a7040" strokeWidth="2" fill="none"/>
            <ellipse cx="18" cy="40" rx="8" ry="14" fill="#4a7040" transform="rotate(-20 18 40)"/>
            <ellipse cx="28" cy="55" rx="7" ry="12" fill="#4a7040" transform="rotate(-10 28 55)"/>
            <ellipse cx="22" cy="70" rx="6" ry="11" fill="#4a7040" transform="rotate(-25 22 70)"/>
          </svg>

          <div className="header-badge">🌱 Farm Educational AI Tool</div>
          <h1>
            FarmPrompt
            <span>Image Prompt Generator</span>
          </h1>
          <p>Generate detailed AI image prompts for farm & agricultural education — optimized for Meta AI, Midjourney & DALL-E</p>
        </header>

        {/* Generator Form */}
        <div className="form-card">
          <div className="form-grid">

            {/* Topic */}
            <div className="field full">
              <label>Farm Topic *</label>
              <input
                type="text"
                placeholder="e.g. Rice paddy irrigation, organic composting, carabao plowing..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                list="topic-suggestions"
              />
              <datalist id="topic-suggestions">
                {FARM_TOPICS.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>

            {/* Style */}
            <div className="field">
              <label>Visual Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)}>
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Mood */}
            <div className="field">
              <label>Mood / Atmosphere</label>
              <select value={mood} onChange={e => setMood(e.target.value)}>
                {MOODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            {/* Season */}
            <div className="field">
              <label>Season</label>
              <select value={season} onChange={e => setSeason(e.target.value)}>
                {SEASONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Educational Level */}
            <div className="field">
              <label>Audience Level</label>
              <select value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="field full">
              <label>Aspect Ratio</label>
              <div className="aspect-grid">
                {ASPECT_RATIOS.map(ar => (
                  <button
                    key={ar.id}
                    className={`aspect-btn ${aspectRatio === ar.id ? 'active' : ''}`}
                    onClick={() => setAspectRatio(ar.id)}
                    type="button"
                  >
                    <div
                      className="aspect-preview"
                      style={{ width: ar.w * 0.7, height: ar.h * 0.7 }}
                    />
                    <span className="aspect-label">{ar.label}</span>
                    <span style={{ fontSize: '10px', color: 'inherit', opacity: 0.7 }}>{ar.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button
            className={`generate-btn ${loading ? 'generating' : ''}`}
            onClick={generate}
            disabled={loading}
          >
            <div className="spinner" />
            <span className="btn-text">
              {loading ? 'Generating your prompt' : '✦ Generate Farm Prompt'}
            </span>
          </button>

          <p style={{ fontSize: '11px', color: 'var(--bark)', textAlign: 'center', marginTop: '8px', opacity: 0.7 }}>
            Powered by Meta Llama 4 via Groq (free) · Ctrl+Enter to generate
          </p>

          {error && <div className={`error-msg ${error ? 'show' : ''}`}>{error}</div>}
        </div>

        {/* Result */}
        <div className={`result-card ${result ? 'visible' : ''}`}>
          <div className="result-header">
            <div className="result-label">
              <span className="dot" />
              Generated Prompt
            </div>
            {result && (
              <span className="model-badge">
                {result.model?.includes('llama-4') ? '🦙 Llama 4 Scout' : '🦙 Llama 3.3 70B'} · {result.aspectRatio}
              </span>
            )}
          </div>

          {loading ? (
            <>
              <div className="skeleton" style={{ width: '100%' }} />
              <div className="skeleton" style={{ width: '85%' }} />
              <div className="skeleton" style={{ width: '92%' }} />
              <div className="skeleton" style={{ width: '70%' }} />
            </>
          ) : (
            <div className="prompt-output">
              <span ref={promptRef} />
            </div>
          )}

          <div className="action-row">
            <button
              className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
              onClick={copyPrompt}
            >
              {copied ? '✓ Copied!' : '⎘ Copy Prompt'}
            </button>

            <button
              className="action-btn meta-btn"
              onClick={openMetaAI}
              title="Open in Meta AI Imagine"
            >
              ✦ Use in Meta AI
            </button>

            <button
              className="action-btn copy-btn"
              onClick={() => {
                const text = result?.prompt || '';
                const encoded = encodeURIComponent(text);
                window.open(`https://www.midjourney.com/imagine?q=${encoded}`, '_blank');
              }}
            >
              🎨 Try Midjourney
            </button>
          </div>

          {result && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--parchment)', borderRadius: '10px' }}>
              <p style={{ fontSize: '11px', color: 'var(--bark)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--sage-dark)' }}>💡 Meta AI Tip:</strong> Paste this prompt into{' '}
                <a href="https://www.meta.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--sage-dark)' }}>meta.ai</a>
                {' '}and type <em>"Imagine: [paste prompt]"</em> or click the image icon. The aspect ratio is already embedded in the prompt.
              </p>
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <h2 className="section-title">
              🕐 Recent Prompts
            </h2>
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                  <div className="history-icon">{item.emoji}</div>
                  <div className="history-text">
                    <div className="history-topic">{item.topic}</div>
                    <div className="history-preview">{item.prompt}</div>
                  </div>
                  <span className="history-ratio">{item.aspectRatio}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>FarmPrompt — Built for Filipino farmers & agricultural educators 🌾</p>
          <p style={{ marginTop: '4px' }}>
            Free forever · Powered by{' '}
            <a href="https://console.groq.com" target="_blank" rel="noreferrer">Groq</a>
            {' '}+{' '}
            <a href="https://llama.com" target="_blank" rel="noreferrer">Meta Llama</a>
          </p>
        </footer>
      </div>
    </>
  );
}
