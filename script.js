/**
 * ==========================================================================
 * BIRTHDAY SURPRISE WEBSITE - REACT 18 APPLICATION & AUDIO ENGINE
 * Target: 13th September | Birthday Surprise for Panda 🐼 / Dhane ✨
 * Background Audio: Yaelae-Yealae-Dhosthu-Da.mp3
 * ==========================================================================
 */

const { useState, useEffect, useRef } = React;

// Configurable Target Date for September 13th
const TARGET_BIRTHDAY_DATE = "2026-09-13T00:00:00";

let audioCtx = null;
let synthTimer = null;

// Friendship Song Melody - "Yaelae Yealae Dhosthu Da" Synth Notes Fallback
const friendshipMelodyNotes = [
  { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 },
  { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 },
  { note: 523.25, duration: 0.6 }, { note: 440.00, duration: 0.6 },
  { note: 392.00, duration: 0.6 },
  { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 },
  { note: 523.25, duration: 0.4 }, { note: 587.33, duration: 0.4 },
  { note: 523.25, duration: 0.6 }, { note: 440.00, duration: 0.8 },
  { note: 440.00, duration: 0.3 }, { note: 440.00, duration: 0.3 },
  { note: 523.25, duration: 0.5 }, { note: 587.33, duration: 0.5 },
  { note: 659.25, duration: 0.8 }, { note: 587.33, duration: 0.8 },
  { note: 523.25, duration: 1.2 }
];

function playSynthNote(freq, duration) {
  if (!audioCtx || audioCtx.state !== "running") return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Global Confetti Explosion Function
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#ff758c", "#ff7eb3", "#9d4edd", "#4cc9f0", "#ffd700", "#ffffff"];
  const particles = [];

  for (let i = 0; i < 140; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 40,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.8) * 20,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.25,
      friction: 0.98
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0 && p.y <= canvas.height) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) requestAnimationFrame(render);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render();
}

// --------------------------------------------------------------------------
// MAIN REACT APP COMPONENT
// --------------------------------------------------------------------------
function App() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [heroOpened, setHeroOpened] = useState(false);
  const [candlesExtinguished, setCandlesExtinguished] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  // Toggle Music Logic with Direct Audio Play & Synth Fallback
  const handleToggleMusic = (forceState) => {
    const nextState = forceState !== undefined ? forceState : !isPlayingMusic;
    setIsPlayingMusic(nextState);

    const audioEl = document.getElementById("friendship-audio");

    if (nextState) {
      if (audioEl) {
        audioEl.muted = isMuted;
        audioEl.volume = 1.0;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Audio play error, using synth:", err);
            startWebAudioSynth();
          });
        }
      } else {
        startWebAudioSynth();
      }
    } else {
      if (audioEl) audioEl.pause();
      if (synthTimer) clearTimeout(synthTimer);
    }
  };

  const handleToggleMute = () => {
    const audioEl = document.getElementById("friendship-audio");
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioEl) {
      audioEl.muted = nextMute;
    }
  };

  const startWebAudioSynth = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    let noteIdx = 0;
    function playNext() {
      if (synthTimer) clearTimeout(synthTimer);
      const curr = friendshipMelodyNotes[noteIdx];
      playSynthNote(curr.note, curr.duration);
      noteIdx = (noteIdx + 1) % friendshipMelodyNotes.length;
      synthTimer = setTimeout(playNext, curr.duration * 1000 + 150);
    }
    playNext();
  };

  const handleOpenSurprise = () => {
    setHeroOpened(true);
    launchConfetti();
    handleToggleMusic(true);
  };

  // First interaction listener to bypass browser autoplay blocks
  useEffect(() => {
    const handleFirstInteraction = () => {
      const audioEl = document.getElementById("friendship-audio");
      if (audioEl && audioEl.paused && isPlayingMusic) {
        audioEl.play().catch(() => {});
      }
    };
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
  }, [isPlayingMusic]);

  // Background Particles Engine
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random(),
        speedAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        speedY: -(Math.random() * 0.4 + 0.1),
        color: Math.random() > 0.5 ? "#ff758c" : "#9d4edd"
      });
    }

    let animId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.alpha += p.speedAlpha;
        if (p.alpha >= 1 || p.alpha <= 0.1) p.speedAlpha = -p.speedAlpha;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <React.Fragment>
      {/* Floating Music Notes Particle Generator */}
      {isPlayingMusic && <FloatingMusicNotes />}

      {/* Opening Hero Landing Screen */}
      <div className={`hero-screen ${heroOpened ? "fade-out" : ""}`}>
        <div className="balloon-container">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="balloon"
              style={{
                left: `${(i * 7.5) % 95}%`,
                animationDelay: `${i * 0.6}s`,
                background: i % 2 === 0 ? "linear-gradient(135deg, #ff758c, #9d4edd)" : "linear-gradient(135deg, #ffd700, #4cc9f0)"
              }}
            />
          ))}
        </div>

        <div className="hero-content glass-card">
          <div className="sparkle-badge">✨ A Special Day Is Coming... ✨</div>
          <h1 className="hero-title">🎂 HAPPY BIRTHDAY MY FRIEND 🎂</h1>
          <div className="hero-date-badge">13th September ❤️</div>
          <p className="hero-subtitle-sorry">VERY SORRY FOR EVERYTHING... 🥺❤️</p>

          <div className="hero-action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => handleToggleMusic()}
            >
              <span className="btn-icon">{isPlayingMusic ? "⏸" : "🎵"}</span>
              <span className="btn-text">{isPlayingMusic ? "Pause Song" : "Play Our Friendship Song"}</span>
            </button>

            <button
              className="btn btn-primary pulse-btn"
              onClick={handleOpenSurprise}
            >
              <span className="btn-icon">🎁</span>
              <span className="btn-text">Open Your Birthday Surprise</span>
            </button>
          </div>
        </div>

        <div className="scroll-hint">
          <span>Click above to begin</span>
          <div className="arrow-down">↓</div>
        </div>
      </div>

      {/* Main Experience Wrapper */}
      {heroOpened && (
        <main className="main-experience">
          {/* Cake Section */}
          <CakeSection
            candlesExtinguished={candlesExtinguished}
            onMakeWish={() => {
              setCandlesExtinguished(true);
              launchConfetti();
            }}
          />

          {/* Countdown Section for 13th September */}
          <CountdownSection />

          {/* Apology & Birthday Message Section */}
          <EmotionalMessageSection />

          {/* Memories Gallery */}
          <MemoriesSection onOpenPhoto={(photo) => setActivePhotoModal(photo)} />

          {/* Surprise Gift Section */}
          <GiftSection
            isOpen={isGiftOpen}
            onOpenGift={() => {
              setIsGiftOpen(true);
              launchConfetti();
            }}
          />

          {/* Final Screen */}
          <FinalSection />
        </main>
      )}

      {/* Photo Lightbox Modal */}
      {activePhotoModal && (
        <div className="photo-modal">
          <div className="modal-backdrop" onClick={() => setActivePhotoModal(null)} />
          <div className="modal-content glass-card">
            <button className="modal-close" onClick={() => setActivePhotoModal(null)}>&times;</button>
            <div className="modal-body">
              {activePhotoModal.src ? (
                <img
                  src={activePhotoModal.src}
                  alt={activePhotoModal.caption}
                  style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "12px", display: "block" }}
                />
              ) : (
                activePhotoModal.svg
              )}
            </div>
            <div className="modal-caption">{activePhotoModal.caption}</div>
          </div>
        </div>
      )}

      {/* Floating Friendship Music Player with Mute Toggle */}
      <FloatingMusicPlayer
        isPlaying={isPlayingMusic}
        isMuted={isMuted}
        onTogglePlay={() => handleToggleMusic()}
        onToggleMute={handleToggleMute}
      />
    </React.Fragment>
  );
}

// --------------------------------------------------------------------------
// FLOATING MUSIC NOTES COMPONENT
// --------------------------------------------------------------------------
function FloatingMusicNotes() {
  const notes = ["🎵", "🎶", "🎼", "💖", "🎵"];
  return (
    <div className="floating-notes-container">
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="music-note-particle"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            animationDelay: `${i * 0.6}s`,
            fontSize: `${Math.random() * 0.8 + 1.2}rem`
          }}
        >
          {notes[i % notes.length]}
        </span>
      ))}
    </div>
  );
}

// --------------------------------------------------------------------------
// CAKE SECTION COMPONENT
// --------------------------------------------------------------------------
function CakeSection({ candlesExtinguished, onMakeWish }) {
  return (
    <section className="section cake-section">
      <div className="container text-center">
        <div className="special-surprise-banner">
          This little website is made especially for you ❤️
        </div>
        <h2 className="section-title cursive-title">Let's Celebrate Your Special Day! 🎉</h2>
        <p className="section-desc">Close your eyes, make a wish, and blow out the candles... ✨</p>

        <div className="cake-wrapper">
          <div className="cake">
            <div className="candles">
              {[1, 2, 3].map((c) => (
                <div key={c} className="candle">
                  <div className={`flame ${candlesExtinguished ? "extinguished" : ""}`} />
                  <div className="thread" />
                </div>
              ))}
            </div>
            <div className="layer layer-top">
              <div className="icing" />
              <div className="drip drip-1" />
              <div className="drip drip-2" />
              <div className="drip drip-3" />
            </div>
            <div className="layer layer-middle" />
            <div className="layer layer-bottom" />
            <div className="cake-plate" />
          </div>
        </div>

        <div className="wish-action-area">
          <button
            className="btn btn-glow"
            onClick={onMakeWish}
            disabled={candlesExtinguished}
            style={{ opacity: candlesExtinguished ? 0.8 : 1 }}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">
              {candlesExtinguished ? "Wish Sent to the Stars! ✨" : "Make a Wish & Blow Candles"}
            </span>
          </button>

          {candlesExtinguished && (
            <div className="wish-message-box">
              <div className="wish-stars">🌟✨🎈✨🌟</div>
              <h3>Your Wish Has Been Sent to the Stars! ✨</h3>
              <p>May all your dreams come true and every day be filled with laughter, love, and light! ❤️</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// COUNTDOWN SECTION COMPONENT (13th SEPTEMBER)
// --------------------------------------------------------------------------
function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const target = new Date(TARGET_BIRTHDAY_DATE).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsToday(true);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d < 10 ? `0${d}` : `${d}`,
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section countdown-section">
      <div className="container text-center">
        <h2 className="section-title cursive-title">🎂 COUNTDOWN TO YOUR SPECIAL DAY 🎂</h2>
        <p className="section-desc">Counting down every second to 13th September! ❤️</p>

        {isToday ? (
          <div className="today-special-banner">
            <h3>🎉 TODAY IS YOUR SPECIAL DAY! 🎉</h3>
            <h4>HAPPY BIRTHDAY, MY FRIEND! ❤️🎂</h4>
          </div>
        ) : (
          <div className="countdown-container glass-card">
            <div className="countdown-box">
              <span className="count-num">{timeLeft.days}</span>
              <span className="count-label">Days</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-box">
              <span className="count-num">{timeLeft.hours}</span>
              <span className="count-label">Hours</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-box">
              <span className="count-num">{timeLeft.minutes}</span>
              <span className="count-label">Minutes</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-box">
              <span className="count-num">{timeLeft.seconds}</span>
              <span className="count-label">Seconds</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// EMOTIONAL APOLOGY + BIRTHDAY MESSAGE SECTION COMPONENT
// --------------------------------------------------------------------------
function EmotionalMessageSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const sectionRef = useRef(null);

  const lines = [
    "Happy Birthday, my dear friend! 🎂❤️",
    "I know things may not always have been perfect between us, and for everything that happened, I am truly sorry.",
    "I never wanted to hurt you or make you feel bad. If my words or actions ever caused you pain, please forgive me.",
    "No matter what happened, I still value our friendship and all the beautiful memories we have shared.",
    "Today, on September 13th, I just want to wish you happiness, peace, success, and everything your heart wishes for.",
    "May this new year of your life bring you countless smiles, beautiful memories, and wonderful moments.",
    "Once again...",
    "HAPPY BIRTHDAY, MY FRIEND! 🎂🎉❤️",
    "VERY SORRY FOR EVERYTHING. 🥺❤️"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          lines.forEach((_, idx) => {
            setTimeout(() => {
              setVisibleLines((prev) => Math.max(prev, idx + 1));
            }, idx * 400);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section message-section" ref={sectionRef}>
      <div className="container">
        <div className="glass-card message-card">
          <div className="card-header-icon">💌</div>
          <h2 className="section-title cursive-title">To My Dear Friend ❤️</h2>

          <div className="emotional-text-container">
            {lines.map((line, idx) => (
              <p
                key={idx}
                className={`fade-line ${idx < visibleLines ? "visible" : ""} ${
                  idx === 6 ? "highlight-text" : ""
                } ${idx === 7 ? "main-wishes" : ""} ${idx === 8 ? "sorry-text" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="signature-area">
            <span className="heart-pulse">❤️</span> Always your well-wisher
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// MEMORIES GALLERY COMPONENT ("Our Beautiful Memories ❤️📸")
// --------------------------------------------------------------------------
function MemoriesSection({ onOpenPhoto }) {
  const photos = [
    { id: 1, src: "images/photo_9.jpg", caption: "Golden Traditional Celebration ✨🌸", title: "Traditional Vibes ✨", grad: "linear-gradient(135deg, #ff758c, #ff7eb3)" },
    { id: 2, src: "images/photo_10.jpg", caption: "Classroom Selfies & Study Memories 📚✨", title: "Classroom Moments 📚", grad: "linear-gradient(135deg, #7b2cbf, #9d4edd)" },
    { id: 3, src: "images/photo_11.jpg", caption: "Canteen Chill Sessions & Endless Chatting ☕️", title: "Canteen Fun ☕️", grad: "linear-gradient(135deg, #ffb703, #fb8500)" },
    { id: 4, src: "images/photo_12.jpg", caption: "Campus Walk & Special Friendship 🌿🤝", title: "Campus Vibes 🌿", grad: "linear-gradient(135deg, #4cc9f0, #4361ee)" },
    { id: 5, src: "images/photo_13.jpg", caption: "Computer Lab Filter Fun & Sweet Memories 💕", title: "Lab Fun 💕", grad: "linear-gradient(135deg, #f72585, #b5179e)" },
    { id: 6, src: "images/photo_14.jpg", caption: "Canteen Gathering with Best Friends 🍔☕️", title: "Cafeteria Laughs ☕️", grad: "linear-gradient(135deg, #06d6a0, #118ab2)" },
    { id: 7, src: "images/photo_15.jpg", caption: "Lawn Selfie Under Bright Blue Skies ☀️🌳", title: "Sunshine Smiles ☀️", grad: "linear-gradient(135deg, #e71d36, #ff9f1c)" },
    { id: 8, src: "images/photo_16.jpg", caption: "Classroom Group Picture & Special Moments 🏫✨", title: "Classroom Family 🏫", grad: "linear-gradient(135deg, #ff758c, #7b2cbf)" },
    { id: 9, src: "images/photo_1.jpg", caption: "Pure Laughter & Unforgettable Joy ❤️", title: "Unforgettable Joy ❤️", grad: "linear-gradient(135deg, #4361ee, #3f37c9)" },
    { id: 10, src: "images/photo_2.jpg", caption: "Crazy Adventures & Special Moments ✨", title: "Crazy Adventures ✨", grad: "linear-gradient(135deg, #7209b7, #560bad)" },
    { id: 11, src: "images/photo_3.jpg", caption: "Golden Sunset & Endless Stories 🌅", title: "Sunset Stories 🌅", grad: "linear-gradient(135deg, #4895ef, #4cc9f0)" },
    { id: 12, src: "images/photo_4.jpg", caption: "Celebrating Friendship & Special Times 🥂", title: "Cheers to Us 🥂", grad: "linear-gradient(135deg, #f72585, #7209b7)" },
    { id: 13, src: "images/photo_5.jpg", caption: "Always Being There For Each Other 🤝", title: "Friendship Bond 🤝", grad: "linear-gradient(135deg, #ff9e00, #ff6000)" },
    { id: 14, src: "images/photo_6.jpg", caption: "Best Wishes & Brightest Futures 🌟", title: "Bright Future 🌟", grad: "linear-gradient(135deg, #3a0ca3, #4361ee)" },
    { id: 15, src: "images/photo_7.jpg", caption: "Precious Smiles Frozen in Time 💖", title: "Precious Smiles 💖", grad: "linear-gradient(135deg, #f72585, #4cc9f0)" },
    { id: 16, src: "images/photo_8.jpg", caption: "True Friendship That Lasts Forever 🐼❤️", title: "Forever Besties 🐼", grad: "linear-gradient(135deg, #7209b7, #f72585)" }
  ];

  const renderSvg = (item) => (
    <svg className="photo-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill={`url(#grad-${item.id})`} />
      <defs>
        <linearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={item.grad.split(",")[1].trim()} />
          <stop offset="100%" stopColor={item.grad.split(",")[2].replace(")", "").trim()} />
        </linearGradient>
      </defs>
      <circle cx="200" cy="120" r="45" fill="rgba(255,255,255,0.25)" />
      <text x="50%" y="85%" fontFamily="Outfit" fontSize="19" fill="#ffffff" textAnchor="middle" fontWeight="600">
        {item.title}
      </text>
    </svg>
  );

  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title cursive-title">Our Beautiful Memories ❤️📸</h2>
          <p className="section-desc">Treasured moments frozen in time. Click any photo to expand!</p>
        </div>

        <div className="gallery-grid">
          {photos.map((item) => (
            <div
              key={item.id}
              className="photo-card"
              onClick={() => onOpenPhoto({ caption: item.caption, src: item.src, svg: renderSvg(item) })}
            >
              <div className="photo-frame">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="photo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <div style={{ display: item.src ? 'none' : 'block', width: '100%', height: '100%' }}>
                  {renderSvg(item)}
                </div>
                <div className="photo-overlay">
                  <span className="heart-icon">❤️</span>
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
              <div className="photo-caption">{item.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// SURPRISE GIFT SECTION COMPONENT
// --------------------------------------------------------------------------
function GiftSection({ isOpen, onOpenGift }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => {
    onOpenGift();
    setTimeout(() => setModalVisible(true), 500);
  };

  return (
    <section className="section gift-section">
      <div className="container text-center">
        <h2 className="section-title cursive-title">One Last Surprise For You... 🎁</h2>
        <p className="section-desc">Tap the magic gift box below to open your surprise!</p>

        <div className="gift-area">
          <div className={`gift-box ${isOpen ? "open" : ""}`} onClick={handleOpen}>
            <div className="gift-lid">
              <div className="gift-bow" />
            </div>
            <div className="gift-body">
              <div className="gift-ribbon-v" />
              <div className="gift-ribbon-h" />
            </div>
          </div>

          <button className="btn btn-primary pulse-btn" onClick={handleOpen}>
            <span className="btn-icon">🎁</span>
            <span className="btn-text">Open My Gift 🎁</span>
          </button>
        </div>
      </div>

      {modalVisible && (
        <div className="gift-modal">
          <div className="modal-backdrop" onClick={() => setModalVisible(false)} />
          <div className="gift-modal-content glass-card text-center">
            <div className="gift-modal-header">
              <span className="confetti-icon">🎉✨🎁✨🎉</span>
            </div>
            <h2 className="cursive-title text-gold">A Special Wish For You ❤️</h2>
            <p className="gift-secret-message">
              "You deserve all the happiness in the world! ❤️"
            </p>
            <p className="gift-sub-message">
              Never forget how bright your smile is and how much light you bring into life. Wishing you endless smiles, true joy, and peace always!
            </p>
            <button className="btn btn-glow" onClick={() => setModalVisible(false)}>
              Close & Celebrate 🎉
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// --------------------------------------------------------------------------
// FINAL SCREEN COMPONENT (SPECIAL FOR PANDA 🐼 / DHANE ✨)
// --------------------------------------------------------------------------
function FinalSection() {
  return (
    <section className="section final-section">
      <div className="container text-center">
        <div className="final-card glass-card">
          <div className="panda-emoji">🐼💖</div>
          <h1 className="final-title cursive-title">🎂 HAPPY BIRTHDAY, PANDA🐼! 🎂</h1>
          <div className="final-date-tag">13th September ❤️</div>
          <h3 className="final-sorry">VERY SORRY FOR EVERYTHING... 🥺</h3>
          <p className="final-thankyou">Thank you for being a beautiful friend .</p>
          <div className="final-dhane">SORRY DHANE✨🐼</div>

          <div className="final-divider" />
          <p className="final-footer-quote">Keep smiling. Keep shining. Stay happy always. ❤️✨</p>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// FLOATING FRIENDSHIP MUSIC PLAYER & MUTE TOGGLE COMPONENT
// --------------------------------------------------------------------------
function FloatingMusicPlayer({ isPlaying, isMuted, onTogglePlay, onToggleMute }) {
  return (
    <div className={`floating-music-player ${isPlaying ? "playing" : ""}`} title="Yaelae Yealae Dhosthu Da">
      <button className="music-player-btn" onClick={onTogglePlay} title={isPlaying ? "Pause Song" : "Play Song"}>
        {isPlaying ? "⏸" : "🎵"}
      </button>
      <button className="mute-player-btn" onClick={onToggleMute} title={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? "🔇" : "🔊"}
      </button>
      <div className="music-info">
        <span className="music-title">Yaelae Yealae Dhosthu Da 🎵</span>
        <div className={`equalizer-bars ${isPlaying && !isMuted ? "active" : ""}`}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

// Render React App
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
