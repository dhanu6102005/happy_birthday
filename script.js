"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * ==========================================================================
 * BIRTHDAY SURPRISE WEBSITE - REACT 18 APPLICATION & AUDIO ENGINE
 * Target: 13th September | Birthday Surprise for Panda 🐼 / Dhane ✨
 * Background Audio: Yaelae-Yealae-Dhosthu-Da.mp3
 * ==========================================================================
 */

var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect,
    useRef = _React.useRef;

// Configurable Target Date for September 13th

var TARGET_BIRTHDAY_DATE = "2026-09-13T00:00:00";

var audioCtx = null;
var synthTimer = null;

// Friendship Song Melody - "Yaelae Yealae Dhosthu Da" Synth Notes Fallback
var friendshipMelodyNotes = [{ note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 }, { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 }, { note: 523.25, duration: 0.6 }, { note: 440.00, duration: 0.6 }, { note: 392.00, duration: 0.6 }, { note: 392.00, duration: 0.3 }, { note: 440.00, duration: 0.3 }, { note: 523.25, duration: 0.4 }, { note: 587.33, duration: 0.4 }, { note: 523.25, duration: 0.6 }, { note: 440.00, duration: 0.8 }, { note: 440.00, duration: 0.3 }, { note: 440.00, duration: 0.3 }, { note: 523.25, duration: 0.5 }, { note: 587.33, duration: 0.5 }, { note: 659.25, duration: 0.8 }, { note: 587.33, duration: 0.8 }, { note: 523.25, duration: 1.2 }];

function playSynthNote(freq, duration) {
  if (!audioCtx || audioCtx.state !== "running") return;
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
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
  var canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var colors = ["#ff758c", "#ff7eb3", "#9d4edd", "#4cc9f0", "#ffd700", "#ffffff"];
  var particles = [];

  for (var i = 0; i < 140; i++) {
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
    var alive = false;

    particles.forEach(function (p) {
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
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) requestAnimationFrame(render);else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render();
}

// --------------------------------------------------------------------------
// MAIN REACT APP COMPONENT
// --------------------------------------------------------------------------
function App() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPlayingMusic = _useState2[0],
      setIsPlayingMusic = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isMuted = _useState4[0],
      setIsMuted = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      heroOpened = _useState6[0],
      setHeroOpened = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      candlesExtinguished = _useState8[0],
      setCandlesExtinguished = _useState8[1];

  var _useState9 = useState(null),
      _useState10 = _slicedToArray(_useState9, 2),
      activePhotoModal = _useState10[0],
      setActivePhotoModal = _useState10[1];

  var _useState11 = useState(false),
      _useState12 = _slicedToArray(_useState11, 2),
      isGiftOpen = _useState12[0],
      setIsGiftOpen = _useState12[1];

  // Toggle Music Logic with Direct Audio Play & Synth Fallback


  var handleToggleMusic = function handleToggleMusic(forceState) {
    var nextState = forceState !== undefined ? forceState : !isPlayingMusic;
    setIsPlayingMusic(nextState);

    var audioEl = document.getElementById("friendship-audio");

    if (nextState) {
      if (audioEl) {
        audioEl.muted = isMuted;
        audioEl.volume = 1.0;
        var playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(function (err) {
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

  var handleToggleMute = function handleToggleMute() {
    var audioEl = document.getElementById("friendship-audio");
    var nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioEl) {
      audioEl.muted = nextMute;
    }
  };

  var startWebAudioSynth = function startWebAudioSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    var noteIdx = 0;
    function playNext() {
      if (synthTimer) clearTimeout(synthTimer);
      var curr = friendshipMelodyNotes[noteIdx];
      playSynthNote(curr.note, curr.duration);
      noteIdx = (noteIdx + 1) % friendshipMelodyNotes.length;
      synthTimer = setTimeout(playNext, curr.duration * 1000 + 150);
    }
    playNext();
  };

  var handleOpenSurprise = function handleOpenSurprise() {
    setHeroOpened(true);
    launchConfetti();
    handleToggleMusic(true);
  };

  // First interaction listener to bypass browser autoplay blocks
  useEffect(function () {
    var handleFirstInteraction = function handleFirstInteraction() {
      var audioEl = document.getElementById("friendship-audio");
      if (audioEl && audioEl.paused && isPlayingMusic) {
        audioEl.play().catch(function () {});
      }
    };
    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
  }, [isPlayingMusic]);

  // Background Particles Engine
  useEffect(function () {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var particles = [];
    for (var i = 0; i < 90; i++) {
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

    var animId = void 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
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

    return function () {
      return cancelAnimationFrame(animId);
    };
  }, []);

  return React.createElement(
    React.Fragment,
    null,
    isPlayingMusic && React.createElement(FloatingMusicNotes, null),
    React.createElement(
      "div",
      { className: "hero-screen " + (heroOpened ? "fade-out" : "") },
      React.createElement(
        "div",
        { className: "balloon-container" },
        [].concat(_toConsumableArray(Array(14))).map(function (_, i) {
          return React.createElement("div", {
            key: i,
            className: "balloon",
            style: {
              left: i * 7.5 % 95 + "%",
              animationDelay: i * 0.6 + "s",
              background: i % 2 === 0 ? "linear-gradient(135deg, #ff758c, #9d4edd)" : "linear-gradient(135deg, #ffd700, #4cc9f0)"
            }
          });
        })
      ),
      React.createElement(
        "div",
        { className: "hero-content glass-card" },
        React.createElement(
          "div",
          { className: "sparkle-badge" },
          "\u2728 A Special Day Is Coming... \u2728"
        ),
        React.createElement(
          "h1",
          { className: "hero-title" },
          "\uD83C\uDF82 HAPPY BIRTHDAY MY FRIEND \uD83C\uDF82"
        ),
        React.createElement(
          "div",
          { className: "hero-date-badge" },
          "13th September \u2764\uFE0F"
        ),
        React.createElement(
          "p",
          { className: "hero-subtitle-sorry" },
          "VERY SORRY FOR EVERYTHING... \uD83E\uDD7A\u2764\uFE0F"
        ),
        React.createElement(
          "div",
          { className: "hero-action-buttons" },
          React.createElement(
            "button",
            {
              className: "btn btn-secondary",
              onClick: function onClick() {
                return handleToggleMusic();
              }
            },
            React.createElement(
              "span",
              { className: "btn-icon" },
              isPlayingMusic ? "⏸" : "🎵"
            ),
            React.createElement(
              "span",
              { className: "btn-text" },
              isPlayingMusic ? "Pause Song" : "Play Our Friendship Song"
            )
          ),
          React.createElement(
            "button",
            {
              className: "btn btn-primary pulse-btn",
              onClick: handleOpenSurprise
            },
            React.createElement(
              "span",
              { className: "btn-icon" },
              "\uD83C\uDF81"
            ),
            React.createElement(
              "span",
              { className: "btn-text" },
              "Open Your Birthday Surprise"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "scroll-hint" },
        React.createElement(
          "span",
          null,
          "Click above to begin"
        ),
        React.createElement(
          "div",
          { className: "arrow-down" },
          "\u2193"
        )
      )
    ),
    heroOpened && React.createElement(
      "main",
      { className: "main-experience" },
      React.createElement(CakeSection, {
        candlesExtinguished: candlesExtinguished,
        onMakeWish: function onMakeWish() {
          setCandlesExtinguished(true);
          launchConfetti();
        }
      }),
      React.createElement(CountdownSection, null),
      React.createElement(EmotionalMessageSection, null),
      React.createElement(MemoriesSection, { onOpenPhoto: function onOpenPhoto(photo) {
          return setActivePhotoModal(photo);
        } }),
      React.createElement(GiftSection, {
        isOpen: isGiftOpen,
        onOpenGift: function onOpenGift() {
          setIsGiftOpen(true);
          launchConfetti();
        }
      }),
      React.createElement(FinalSection, null)
    ),
    activePhotoModal && React.createElement(
      "div",
      { className: "photo-modal" },
      React.createElement("div", { className: "modal-backdrop", onClick: function onClick() {
          return setActivePhotoModal(null);
        } }),
      React.createElement(
        "div",
        { className: "modal-content glass-card" },
        React.createElement(
          "button",
          { className: "modal-close", onClick: function onClick() {
              return setActivePhotoModal(null);
            } },
          "\xD7"
        ),
        React.createElement(
          "div",
          { className: "modal-body" },
          activePhotoModal.src ? React.createElement("img", {
            src: activePhotoModal.src,
            alt: activePhotoModal.caption,
            style: { width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "12px", display: "block" }
          }) : activePhotoModal.svg
        ),
        React.createElement(
          "div",
          { className: "modal-caption" },
          activePhotoModal.caption
        )
      )
    ),
    React.createElement(FloatingMusicPlayer, {
      isPlaying: isPlayingMusic,
      isMuted: isMuted,
      onTogglePlay: function onTogglePlay() {
        return handleToggleMusic();
      },
      onToggleMute: handleToggleMute
    })
  );
}

// --------------------------------------------------------------------------
// FLOATING MUSIC NOTES COMPONENT
// --------------------------------------------------------------------------
function FloatingMusicNotes() {
  var notes = ["🎵", "🎶", "🎼", "💖", "🎵"];
  return React.createElement(
    "div",
    { className: "floating-notes-container" },
    [].concat(_toConsumableArray(Array(12))).map(function (_, i) {
      return React.createElement(
        "span",
        {
          key: i,
          className: "music-note-particle",
          style: {
            left: Math.random() * 90 + 5 + "%",
            animationDelay: i * 0.6 + "s",
            fontSize: Math.random() * 0.8 + 1.2 + "rem"
          }
        },
        notes[i % notes.length]
      );
    })
  );
}

// --------------------------------------------------------------------------
// CAKE SECTION COMPONENT
// --------------------------------------------------------------------------
function CakeSection(_ref) {
  var candlesExtinguished = _ref.candlesExtinguished,
      onMakeWish = _ref.onMakeWish;

  return React.createElement(
    "section",
    { className: "section cake-section" },
    React.createElement(
      "div",
      { className: "container text-center" },
      React.createElement(
        "div",
        { className: "special-surprise-banner" },
        "This little website is made especially for you \u2764\uFE0F"
      ),
      React.createElement(
        "h2",
        { className: "section-title cursive-title" },
        "Let's Celebrate Your Special Day! \uD83C\uDF89"
      ),
      React.createElement(
        "p",
        { className: "section-desc" },
        "Close your eyes, make a wish, and blow out the candles... \u2728"
      ),
      React.createElement(
        "div",
        { className: "cake-wrapper" },
        React.createElement(
          "div",
          { className: "cake" },
          React.createElement(
            "div",
            { className: "candles" },
            [1, 2, 3].map(function (c) {
              return React.createElement(
                "div",
                { key: c, className: "candle" },
                React.createElement("div", { className: "flame " + (candlesExtinguished ? "extinguished" : "") }),
                React.createElement("div", { className: "thread" })
              );
            })
          ),
          React.createElement(
            "div",
            { className: "layer layer-top" },
            React.createElement("div", { className: "icing" }),
            React.createElement("div", { className: "drip drip-1" }),
            React.createElement("div", { className: "drip drip-2" }),
            React.createElement("div", { className: "drip drip-3" })
          ),
          React.createElement("div", { className: "layer layer-middle" }),
          React.createElement("div", { className: "layer layer-bottom" }),
          React.createElement("div", { className: "cake-plate" })
        )
      ),
      React.createElement(
        "div",
        { className: "wish-action-area" },
        React.createElement(
          "button",
          {
            className: "btn btn-glow",
            onClick: onMakeWish,
            disabled: candlesExtinguished,
            style: { opacity: candlesExtinguished ? 0.8 : 1 }
          },
          React.createElement(
            "span",
            { className: "btn-icon" },
            "\u2728"
          ),
          React.createElement(
            "span",
            { className: "btn-text" },
            candlesExtinguished ? "Wish Sent to the Stars! ✨" : "Make a Wish & Blow Candles"
          )
        ),
        candlesExtinguished && React.createElement(
          "div",
          { className: "wish-message-box" },
          React.createElement(
            "div",
            { className: "wish-stars" },
            "\uD83C\uDF1F\u2728\uD83C\uDF88\u2728\uD83C\uDF1F"
          ),
          React.createElement(
            "h3",
            null,
            "Your Wish Has Been Sent to the Stars! \u2728"
          ),
          React.createElement(
            "p",
            null,
            "May all your dreams come true and every day be filled with laughter, love, and light! \u2764\uFE0F"
          )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// COUNTDOWN SECTION COMPONENT (13th SEPTEMBER)
// --------------------------------------------------------------------------
function CountdownSection() {
  var _useState13 = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" }),
      _useState14 = _slicedToArray(_useState13, 2),
      timeLeft = _useState14[0],
      setTimeLeft = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      isToday = _useState16[0],
      setIsToday = _useState16[1];

  useEffect(function () {
    var target = new Date(TARGET_BIRTHDAY_DATE).getTime();

    var update = function update() {
      var now = new Date().getTime();
      var diff = target - now;

      if (diff <= 0) {
        setIsToday(true);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      var m = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
      var s = Math.floor(diff % (1000 * 60) / 1000);

      setTimeLeft({
        days: d < 10 ? "0" + d : "" + d,
        hours: h < 10 ? "0" + h : "" + h,
        minutes: m < 10 ? "0" + m : "" + m,
        seconds: s < 10 ? "0" + s : "" + s
      });
    };

    update();
    var interval = setInterval(update, 1000);
    return function () {
      return clearInterval(interval);
    };
  }, []);

  return React.createElement(
    "section",
    { className: "section countdown-section" },
    React.createElement(
      "div",
      { className: "container text-center" },
      React.createElement(
        "h2",
        { className: "section-title cursive-title" },
        "\uD83C\uDF82 COUNTDOWN TO YOUR SPECIAL DAY \uD83C\uDF82"
      ),
      React.createElement(
        "p",
        { className: "section-desc" },
        "Counting down every second to 13th September! \u2764\uFE0F"
      ),
      isToday ? React.createElement(
        "div",
        { className: "today-special-banner" },
        React.createElement(
          "h3",
          null,
          "\uD83C\uDF89 TODAY IS YOUR SPECIAL DAY! \uD83C\uDF89"
        ),
        React.createElement(
          "h4",
          null,
          "HAPPY BIRTHDAY, MY FRIEND! \u2764\uFE0F\uD83C\uDF82"
        )
      ) : React.createElement(
        "div",
        { className: "countdown-container glass-card" },
        React.createElement(
          "div",
          { className: "countdown-box" },
          React.createElement(
            "span",
            { className: "count-num" },
            timeLeft.days
          ),
          React.createElement(
            "span",
            { className: "count-label" },
            "Days"
          )
        ),
        React.createElement(
          "div",
          { className: "countdown-sep" },
          ":"
        ),
        React.createElement(
          "div",
          { className: "countdown-box" },
          React.createElement(
            "span",
            { className: "count-num" },
            timeLeft.hours
          ),
          React.createElement(
            "span",
            { className: "count-label" },
            "Hours"
          )
        ),
        React.createElement(
          "div",
          { className: "countdown-sep" },
          ":"
        ),
        React.createElement(
          "div",
          { className: "countdown-box" },
          React.createElement(
            "span",
            { className: "count-num" },
            timeLeft.minutes
          ),
          React.createElement(
            "span",
            { className: "count-label" },
            "Minutes"
          )
        ),
        React.createElement(
          "div",
          { className: "countdown-sep" },
          ":"
        ),
        React.createElement(
          "div",
          { className: "countdown-box" },
          React.createElement(
            "span",
            { className: "count-num" },
            timeLeft.seconds
          ),
          React.createElement(
            "span",
            { className: "count-label" },
            "Seconds"
          )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// EMOTIONAL APOLOGY + BIRTHDAY MESSAGE SECTION COMPONENT
// --------------------------------------------------------------------------
function EmotionalMessageSection() {
  var _useState17 = useState(0),
      _useState18 = _slicedToArray(_useState17, 2),
      visibleLines = _useState18[0],
      setVisibleLines = _useState18[1];

  var sectionRef = useRef(null);

  var lines = ["Happy Birthday, my dear friend! 🎂❤️", "I know things may not always have been perfect between us, and for everything that happened, I am truly sorry.", "I never wanted to hurt you or make you feel bad. If my words or actions ever caused you pain, please forgive me.", "No matter what happened, I still value our friendship and all the beautiful memories we have shared.", "Today, on September 13th, I just want to wish you happiness, peace, success, and everything your heart wishes for.", "May this new year of your life bring you countless smiles, beautiful memories, and wonderful moments.", "Once again...", "HAPPY BIRTHDAY, MY FRIEND! 🎂🎉❤️", "VERY SORRY FOR EVERYTHING. 🥺❤️"];

  useEffect(function () {
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        lines.forEach(function (_, idx) {
          setTimeout(function () {
            setVisibleLines(function (prev) {
              return Math.max(prev, idx + 1);
            });
          }, idx * 400);
        });
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return function () {
      return observer.disconnect();
    };
  }, []);

  return React.createElement(
    "section",
    { className: "section message-section", ref: sectionRef },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "glass-card message-card" },
        React.createElement(
          "div",
          { className: "card-header-icon" },
          "\uD83D\uDC8C"
        ),
        React.createElement(
          "h2",
          { className: "section-title cursive-title" },
          "To My Dear Friend \u2764\uFE0F"
        ),
        React.createElement(
          "div",
          { className: "emotional-text-container" },
          lines.map(function (line, idx) {
            return React.createElement(
              "p",
              {
                key: idx,
                className: "fade-line " + (idx < visibleLines ? "visible" : "") + " " + (idx === 6 ? "highlight-text" : "") + " " + (idx === 7 ? "main-wishes" : "") + " " + (idx === 8 ? "sorry-text" : "")
              },
              line
            );
          })
        ),
        React.createElement(
          "div",
          { className: "signature-area" },
          React.createElement(
            "span",
            { className: "heart-pulse" },
            "\u2764\uFE0F"
          ),
          " Always your well-wisher"
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// MEMORIES GALLERY COMPONENT ("Our Beautiful Memories ❤️📸")
// --------------------------------------------------------------------------
function MemoriesSection(_ref2) {
  var onOpenPhoto = _ref2.onOpenPhoto;

  var photos = [{ id: 1, src: "images/photo_9.jpg", caption: "Golden Traditional Celebration ✨🌸", title: "Traditional Vibes ✨", grad: "linear-gradient(135deg, #ff758c, #ff7eb3)" }, { id: 2, src: "images/photo_10.jpg", caption: "Classroom Selfies & Study Memories 📚✨", title: "Classroom Moments 📚", grad: "linear-gradient(135deg, #7b2cbf, #9d4edd)" }, { id: 3, src: "images/photo_11.jpg", caption: "Canteen Chill Sessions & Endless Chatting ☕️", title: "Canteen Fun ☕️", grad: "linear-gradient(135deg, #ffb703, #fb8500)" }, { id: 4, src: "images/photo_12.jpg", caption: "Campus Walk & Special Friendship 🌿🤝", title: "Campus Vibes 🌿", grad: "linear-gradient(135deg, #4cc9f0, #4361ee)" }, { id: 5, src: "images/photo_13.jpg", caption: "Computer Lab Filter Fun & Sweet Memories 💕", title: "Lab Fun 💕", grad: "linear-gradient(135deg, #f72585, #b5179e)" }, { id: 6, src: "images/photo_14.jpg", caption: "Canteen Gathering with Best Friends 🍔☕️", title: "Cafeteria Laughs ☕️", grad: "linear-gradient(135deg, #06d6a0, #118ab2)" }, { id: 7, src: "images/photo_15.jpg", caption: "Lawn Selfie Under Bright Blue Skies ☀️🌳", title: "Sunshine Smiles ☀️", grad: "linear-gradient(135deg, #e71d36, #ff9f1c)" }, { id: 8, src: "images/photo_16.jpg", caption: "Classroom Group Picture & Special Moments 🏫✨", title: "Classroom Family 🏫", grad: "linear-gradient(135deg, #ff758c, #7b2cbf)" }, { id: 9, src: "images/photo_1.jpg", caption: "Pure Laughter & Unforgettable Joy ❤️", title: "Unforgettable Joy ❤️", grad: "linear-gradient(135deg, #4361ee, #3f37c9)" }, { id: 10, src: "images/photo_2.jpg", caption: "Crazy Adventures & Special Moments ✨", title: "Crazy Adventures ✨", grad: "linear-gradient(135deg, #7209b7, #560bad)" }, { id: 11, src: "images/photo_3.jpg", caption: "Golden Sunset & Endless Stories 🌅", title: "Sunset Stories 🌅", grad: "linear-gradient(135deg, #4895ef, #4cc9f0)" }, { id: 12, src: "images/photo_4.jpg", caption: "Celebrating Friendship & Special Times 🥂", title: "Cheers to Us 🥂", grad: "linear-gradient(135deg, #f72585, #7209b7)" }, { id: 13, src: "images/photo_5.jpg", caption: "Always Being There For Each Other 🤝", title: "Friendship Bond 🤝", grad: "linear-gradient(135deg, #ff9e00, #ff6000)" }, { id: 14, src: "images/photo_6.jpg", caption: "Best Wishes & Brightest Futures 🌟", title: "Bright Future 🌟", grad: "linear-gradient(135deg, #3a0ca3, #4361ee)" }, { id: 15, src: "images/photo_7.jpg", caption: "Precious Smiles Frozen in Time 💖", title: "Precious Smiles 💖", grad: "linear-gradient(135deg, #f72585, #4cc9f0)" }, { id: 16, src: "images/photo_8.jpg", caption: "True Friendship That Lasts Forever 🐼❤️", title: "Forever Besties 🐼", grad: "linear-gradient(135deg, #7209b7, #f72585)" }];

  var renderSvg = function renderSvg(item) {
    return React.createElement(
      "svg",
      { className: "photo-svg", viewBox: "0 0 400 300", xmlns: "http://www.w3.org/2000/svg" },
      React.createElement("rect", { width: "100%", height: "100%", fill: "url(#grad-" + item.id + ")" }),
      React.createElement(
        "defs",
        null,
        React.createElement(
          "linearGradient",
          { id: "grad-" + item.id, x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
          React.createElement("stop", { offset: "0%", stopColor: item.grad.split(",")[1].trim() }),
          React.createElement("stop", { offset: "100%", stopColor: item.grad.split(",")[2].replace(")", "").trim() })
        )
      ),
      React.createElement("circle", { cx: "200", cy: "120", r: "45", fill: "rgba(255,255,255,0.25)" }),
      React.createElement(
        "text",
        { x: "50%", y: "85%", fontFamily: "Outfit", fontSize: "19", fill: "#ffffff", textAnchor: "middle", fontWeight: "600" },
        item.title
      )
    );
  };

  return React.createElement(
    "section",
    { className: "section gallery-section" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "section-header text-center" },
        React.createElement(
          "h2",
          { className: "section-title cursive-title" },
          "Our Beautiful Memories \u2764\uFE0F\uD83D\uDCF8"
        ),
        React.createElement(
          "p",
          { className: "section-desc" },
          "Treasured moments frozen in time. Click any photo to expand!"
        )
      ),
      React.createElement(
        "div",
        { className: "gallery-grid" },
        photos.map(function (item) {
          return React.createElement(
            "div",
            {
              key: item.id,
              className: "photo-card",
              onClick: function onClick() {
                return onOpenPhoto({ caption: item.caption, src: item.src, svg: renderSvg(item) });
              }
            },
            React.createElement(
              "div",
              { className: "photo-frame" },
              item.src ? React.createElement("img", {
                src: item.src,
                alt: item.caption,
                className: "photo-img",
                onError: function onError(e) {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = 'block';
                  }
                }
              }) : null,
              React.createElement(
                "div",
                { style: { display: item.src ? 'none' : 'block', width: '100%', height: '100%' } },
                renderSvg(item)
              ),
              React.createElement(
                "div",
                { className: "photo-overlay" },
                React.createElement(
                  "span",
                  { className: "heart-icon" },
                  "\u2764\uFE0F"
                ),
                React.createElement(
                  "span",
                  { className: "zoom-icon" },
                  "\uD83D\uDD0D"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "photo-caption" },
              item.caption
            )
          );
        })
      )
    )
  );
}

// --------------------------------------------------------------------------
// SURPRISE GIFT SECTION COMPONENT
// --------------------------------------------------------------------------
function GiftSection(_ref3) {
  var isOpen = _ref3.isOpen,
      onOpenGift = _ref3.onOpenGift;

  var _useState19 = useState(false),
      _useState20 = _slicedToArray(_useState19, 2),
      modalVisible = _useState20[0],
      setModalVisible = _useState20[1];

  var handleOpen = function handleOpen() {
    onOpenGift();
    setTimeout(function () {
      return setModalVisible(true);
    }, 500);
  };

  return React.createElement(
    "section",
    { className: "section gift-section" },
    React.createElement(
      "div",
      { className: "container text-center" },
      React.createElement(
        "h2",
        { className: "section-title cursive-title" },
        "One Last Surprise For You... \uD83C\uDF81"
      ),
      React.createElement(
        "p",
        { className: "section-desc" },
        "Tap the magic gift box below to open your surprise!"
      ),
      React.createElement(
        "div",
        { className: "gift-area" },
        React.createElement(
          "div",
          { className: "gift-box " + (isOpen ? "open" : ""), onClick: handleOpen },
          React.createElement(
            "div",
            { className: "gift-lid" },
            React.createElement("div", { className: "gift-bow" })
          ),
          React.createElement(
            "div",
            { className: "gift-body" },
            React.createElement("div", { className: "gift-ribbon-v" }),
            React.createElement("div", { className: "gift-ribbon-h" })
          )
        ),
        React.createElement(
          "button",
          { className: "btn btn-primary pulse-btn", onClick: handleOpen },
          React.createElement(
            "span",
            { className: "btn-icon" },
            "\uD83C\uDF81"
          ),
          React.createElement(
            "span",
            { className: "btn-text" },
            "Open My Gift \uD83C\uDF81"
          )
        )
      )
    ),
    modalVisible && React.createElement(
      "div",
      { className: "gift-modal" },
      React.createElement("div", { className: "modal-backdrop", onClick: function onClick() {
          return setModalVisible(false);
        } }),
      React.createElement(
        "div",
        { className: "gift-modal-content glass-card text-center" },
        React.createElement(
          "div",
          { className: "gift-modal-header" },
          React.createElement(
            "span",
            { className: "confetti-icon" },
            "\uD83C\uDF89\u2728\uD83C\uDF81\u2728\uD83C\uDF89"
          )
        ),
        React.createElement(
          "h2",
          { className: "cursive-title text-gold" },
          "A Special Wish For You \u2764\uFE0F"
        ),
        React.createElement(
          "p",
          { className: "gift-secret-message" },
          "\"You deserve all the happiness in the world! \u2764\uFE0F\""
        ),
        React.createElement(
          "p",
          { className: "gift-sub-message" },
          "Never forget how bright your smile is and how much light you bring into life. Wishing you endless smiles, true joy, and peace always!"
        ),
        React.createElement(
          "button",
          { className: "btn btn-glow", onClick: function onClick() {
              return setModalVisible(false);
            } },
          "Close & Celebrate \uD83C\uDF89"
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// FINAL SCREEN COMPONENT (SPECIAL FOR PANDA 🐼 / DHANE ✨)
// --------------------------------------------------------------------------
function FinalSection() {
  return React.createElement(
    "section",
    { className: "section final-section" },
    React.createElement(
      "div",
      { className: "container text-center" },
      React.createElement(
        "div",
        { className: "final-card glass-card" },
        React.createElement(
          "div",
          { className: "panda-emoji" },
          "\uD83D\uDC3C\uD83D\uDC96"
        ),
        React.createElement(
          "h1",
          { className: "final-title cursive-title" },
          "\uD83C\uDF82 HAPPY BIRTHDAY, PANDA\uD83D\uDC3C! \uD83C\uDF82"
        ),
        React.createElement(
          "div",
          { className: "final-date-tag" },
          "13th September \u2764\uFE0F"
        ),
        React.createElement(
          "h3",
          { className: "final-sorry" },
          "VERY SORRY FOR EVERYTHING... \uD83E\uDD7A"
        ),
        React.createElement(
          "p",
          { className: "final-thankyou" },
          "Thank you for being a beautiful friend ."
        ),
        React.createElement(
          "div",
          { className: "final-dhane" },
          "SORRY DHANE\u2728\uD83D\uDC3C"
        ),
        React.createElement("div", { className: "final-divider" }),
        React.createElement(
          "p",
          { className: "final-footer-quote" },
          "Keep smiling. Keep shining. Stay happy always. \u2764\uFE0F\u2728"
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// FLOATING FRIENDSHIP MUSIC PLAYER & MUTE TOGGLE COMPONENT
// --------------------------------------------------------------------------
function FloatingMusicPlayer(_ref4) {
  var isPlaying = _ref4.isPlaying,
      isMuted = _ref4.isMuted,
      onTogglePlay = _ref4.onTogglePlay,
      onToggleMute = _ref4.onToggleMute;

  return React.createElement(
    "div",
    { className: "floating-music-player " + (isPlaying ? "playing" : ""), title: "Yaelae Yealae Dhosthu Da" },
    React.createElement(
      "button",
      { className: "music-player-btn", onClick: onTogglePlay, title: isPlaying ? "Pause Song" : "Play Song" },
      isPlaying ? "⏸" : "🎵"
    ),
    React.createElement(
      "button",
      { className: "mute-player-btn", onClick: onToggleMute, title: isMuted ? "Unmute" : "Mute" },
      isMuted ? "🔇" : "🔊"
    ),
    React.createElement(
      "div",
      { className: "music-info" },
      React.createElement(
        "span",
        { className: "music-title" },
        "Yaelae Yealae Dhosthu Da \uD83C\uDFB5"
      ),
      React.createElement(
        "div",
        { className: "equalizer-bars " + (isPlaying && !isMuted ? "active" : "") },
        React.createElement("span", null),
        React.createElement("span", null),
        React.createElement("span", null),
        React.createElement("span", null)
      )
    )
  );
}

// Render React App
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));