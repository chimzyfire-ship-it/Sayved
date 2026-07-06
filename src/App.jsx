import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  BookOpen,
  Check,
  ChevronLeft,
  Circle,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Headphones,
  Home,
  Library,
  LockKeyhole,
  Mic,
  Pause,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { teachers } from "./pastors";

// Pre-seeded Bible Verses database for Bible Reader / Search
const bibleVerses = [
  {
    id: "psalm-119-105",
    reference: "Psalm 119:105",
    book: "Psalms",
    text: "Your word is a lamp for my feet, a light on my path.",
  },
  {
    id: "luke-8-15",
    reference: "Luke 8:15",
    book: "Luke",
    text: "But the seed on good soil stands for those with a noble and good heart, who hear the word, retain it, and by persevering produce a crop.",
  },
  {
    id: "phil-4-6",
    reference: "Philippians 4:6",
    book: "Philippians",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
  },
  {
    id: "prov-3-5",
    reference: "Proverbs 3:5-6",
    book: "Proverbs",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
  },
  {
    id: "matt-11-28",
    reference: "Matthew 11:28",
    book: "Matthew",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
  },
  {
    id: "rom-8-28",
    reference: "Romans 8:28",
    book: "Romans",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
  },
  {
    id: "isa-40-31",
    reference: "Isaiah 40:31",
    book: "Isaiah",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
  },
  {
    id: "john-14-6",
    reference: "John 14:6",
    book: "John",
    text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
  },
];

const scripture = {
  id: "psalm-119-105",
  reference: "Psalm 119:105",
  text: "Your word is a lamp for my feet, a light on my path.",
  why: "Used as a quiet image of guidance. It grounds the answer without turning the moment into a proof-text dump.",
};

const initialMemoryItems = [
  {
    id: "memory-fear-behind",
    type: "Theme",
    title: "Fear of falling behind",
    body: "A repeated worry that life is moving faster than your capacity to respond.",
    source: "Talk, July 5",
  },
  {
    id: "memory-strength",
    type: "Strength",
    title: "You return to prayer before decisions",
    body: "You tend to pause, ask for wisdom, and look for the next faithful step before acting.",
    source: "Talk, June 30",
  },
  {
    id: "memory-commitment",
    type: "Commitment",
    title: "Morning quiet rhythm",
    body: "You wanted a short morning practice that does not feel like pressure or performance.",
    source: "The Well",
  },
];

const defaultDevotion = {
  title: "Tending the Soil of the Heart",
  scriptureRef: "Luke 8:15",
  readTime: "3 min read",
  reflection:
    "Growth is not performance. It is a protected place where the Word can remain long enough to bear fruit. When pressure tries to define you, return to the soil and ask what is true.",
  prayer:
    "Lord, soften my heart today. Help me receive enough light for the step in front of me, and lay down the need to prove my growth.",
};

function Mark({ small = false }) {
  return (
    <span className={small ? "mark mark-small" : "mark"} aria-hidden="true">
      <span />
    </span>
  );
}

function IconButton({ children, label, onClick, tone = "" }) {
  return (
    <button
      className={`icon-button ${tone}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function TopBar({ title, eyebrow, onBack, action, go }) {
  return (
    <header className={`top-bar ${onBack ? "with-back" : "with-brand"}`}>
      {onBack ? (
        <IconButton label="Back" onClick={onBack}>
          <ChevronLeft size={20} />
        </IconButton>
      ) : (
        <div className="brand-lockup">
          <Mark small />
          <span>Sayved</span>
        </div>
      )}
      <div className="top-title">
        {eyebrow && <span>{eyebrow}</span>}
        <strong>{title}</strong>
      </div>
      {action || (
        <IconButton
          label="Settings"
          onClick={() => go && go("settings", "walk")}
        >
          <Settings size={18} />
        </IconButton>
      )}
    </header>
  );
}

function Pill({ children, tone = "" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function TeacherBadge({ teacher }) {
  const label = teacher.status === "estate" ? "Estate" : "Unverified";
  return (
    <Pill tone={teacher.status === "estate" ? "clay" : "beige"}>{label}</Pill>
  );
}

function SourceCard({ teacher, compact = false, onOpen, onRequest }) {
  return (
    <article className={`source-card ${compact ? "compact" : ""}`}>
      <div>
        <div className="meta-row">
          <Library size={14} />
          <span>Official route</span>
        </div>
        <h4>{teacher.name}</h4>
        <p style={{ margin: "4px 0 8px", fontSize: "12px", lineHeight: "1.4" }}>
          {teacher.relationship}. Sayved routes to official public sources but
          will not pretend to speak as {teacher.name}.
        </p>
      </div>
      <div className="card-actions">
        <button className="quiet-button" onClick={onOpen}>
          <Play size={14} /> Play Route
        </button>
        <button className="quiet-button" onClick={onRequest}>
          <Plus size={14} /> Request
        </button>
      </div>
    </article>
  );
}

function TeacherCard({ teacher, onOpen, onSeat, isSeated }) {
  return (
    <article className="teacher-card">
      <img src={teacher.image} alt={teacher.name} />
      <div className="teacher-main">
        <div className="teacher-name-line">
          <h3>{teacher.name}</h3>
          <TeacherBadge teacher={teacher} />
        </div>
        <p>{teacher.ministry}</p>
        <span>{teacher.relationship}</span>
        <div className="topic-row">
          {teacher.topics.slice(0, 3).map((topic) => (
            <Pill key={topic}>{topic}</Pill>
          ))}
        </div>
      </div>
      <div className="card-actions">
        <button className="quiet-button" onClick={onOpen}>
          <ExternalLink size={14} /> Profile
        </button>
        <button className="quiet-button" onClick={onSeat}>
          {isSeated ? <X size={14} /> : <Plus size={14} />}{" "}
          {isSeated ? "Unseat" : "Seat"}
        </button>
      </div>
    </article>
  );
}

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState("welcome"); // welcome, privacy, rhythm, consent
  const [userIntent, setUserIntent] = useState("");
  const [notificationRhythm, setNotificationRhythm] = useState(
    "Daily morning quiet",
  );
  const [consents, setConsents] = useState({
    privacy: false,
    ai: false,
    memory: false,
  });

  const [tab, setTab] = useState("talk");
  const [screen, setScreen] = useState("talk");
  const [scope, setScope] = useState("Sayved");
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [selectedMemory, setSelectedMemory] = useState(initialMemoryItems[0]);
  const [composer, setComposer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bibleSearchQuery, setBibleSearchQuery] = useState("");

  const [memories, setMemories] = useState(initialMemoryItems);
  const [recoveryContact, setRecoveryContact] = useState({
    name: "",
    contact: "",
    relationship: "",
  });
  const [councilSeats, setCouncilSeats] = useState([
    teachers[0].id,
    teachers[1].id,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [activeCapture, setActiveCapture] = useState(false);
  const [captureDuration, setCaptureDuration] = useState(0);
  const [capturedSermons, setCapturedSermons] = useState([]);
  const [compareTeachers, setCompareTeachers] = useState([
    teachers[0].id,
    teachers[1].id,
  ]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null); // id of playing element
  const [audioProgress, setAudioProgress] = useState(40); // mock percentage
  const [devotionSaved, setDevotionSaved] = useState(false);
  const [completedRhythmDays, setCompletedRhythmDays] = useState([]);
  const [isCouncilDrawerOpen, setIsCouncilDrawerOpen] = useState(false);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: "director-1",
      role: "director",
      text: "I am here with you. We can go slowly. Tell me what is actually on your heart, and I will answer as Sayved, grounded in Scripture and careful with anything I cite.",
    },
    {
      id: "user-1",
      role: "user",
      text: "I feel like I am falling behind.",
    },
    {
      id: "director-2",
      role: "director",
      text: "Can I name something gently? This sounds like the old fear of being behind wearing new clothes. We do not have to solve your whole life tonight. The next faithful step may be smaller than the pressure is telling you.",
      scripture: true,
      memory: true,
      source: true,
    },
  ]);

  // Synchronize dynamic tab selection
  const activeTab = useMemo(() => {
    if (
      [
        "follow",
        "teacher",
        "source",
        "request",
        "council",
        "request-confirm",
      ].includes(screen)
    )
      return "follow";
    if (
      [
        "walk",
        "well",
        "devotion",
        "memory",
        "memory-detail",
        "autobiography",
        "echo",
        "rhythm",
        "settings",
        "bible",
        "recovery",
        "dashboard",
      ].includes(screen)
    )
      return "walk";
    return "talk";
  }, [screen]);

  // Scroll to top on screen change
  useEffect(() => {
    document
      .querySelector(".screen-content")
      ?.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  // Capture timer effect
  useEffect(() => {
    let interval;
    if (activeCapture) {
      interval = setInterval(() => {
        setCaptureDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCaptureDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCapture]);

  function go(nextScreen, nextTab = tab) {
    setTab(nextTab);
    setScreen(nextScreen);
  }

  function handleSend() {
    if (!composer.trim()) return;
    const prompt = composer.trim();
    setComposer("");

    // Crisis Override Check
    if (
      /suicide|kill myself|end my life|want to die|hurt myself/i.test(prompt)
    ) {
      go("crisis", "talk");
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const directorMessageId = `director-${Date.now()}`;

    setMessages((items) => [
      ...items,
      { id: userMessageId, role: "user", text: prompt },
    ]);

    setTimeout(() => {
      let replyText = "";
      let hasScripture = false;
      let hasMemory = false;
      let hasSource = false;

      if (scope === "Sayved") {
        replyText =
          "I hear the weight in that. Let us take it one clear step: name what is true, receive what Scripture can steady, and choose one obedient action you can carry today.";
        hasScripture = true;
        hasMemory = true;
      } else if (scope === "My Council") {
        const seatedNames = councilSeats
          .map((id) => teachers.find((t) => t.id === id))
          .filter(Boolean)
          .map((t) => t.name)
          .join(", ");

        replyText = `Gathering the Council. I have checked the seats for ${
          seatedNames || "no teachers currently seated"
        }. Since they are unverified or estate-owned, I will hold the voice as Sayved and avoid synthesized responses. Here are their public routes.`;
        hasSource = true;
      } else {
        // My Teachers mode
        replyText = `Consulting ${selectedTeacher.name}'s library. As a ${selectedTeacher.type.toLowerCase()}, they are unverified. I will stay as Sayved and route you to official public sources.`;
        hasSource = true;
        hasScripture = true;
      }

      setMessages((items) => [
        ...items,
        {
          id: directorMessageId,
          role: "director",
          text: replyText,
          scripture: hasScripture,
          memory: hasMemory,
          source: hasSource,
        },
      ]);
    }, 800);
  }

  // Helper formatting for seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Check if teacher is in Council Seats
  const isTeacherSeated = (id) => councilSeats.includes(id);

  // Toggle seat placement
  const toggleSeat = (id) => {
    if (councilSeats.includes(id)) {
      setCouncilSeats(councilSeats.map((s) => (s === id ? null : s)));
    } else {
      const openIdx = councilSeats.indexOf(null);
      if (openIdx !== -1) {
        const newSeats = [...councilSeats];
        newSeats[openIdx] = id;
        setCouncilSeats(newSeats);
      } else {
        alert("Your Council is full. Unseat a teacher to open a seat.");
      }
    }
  };

  // Filter teachers by search query
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Filter Bible database
  const filteredBibleVerses = bibleVerses.filter(
    (v) =>
      v.text.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
      v.reference.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
      v.book.toLowerCase().includes(bibleSearchQuery.toLowerCase()),
  );

  // Export private local memory as JSON
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          { memories, recoveryContact, notificationRhythm },
          null,
          2,
        ),
      );
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "sayved_private_walk_export.json");
    dlAnchorElem.click();
  };

  // Reset and delete data
  const handleDeleteAllData = () => {
    if (
      confirm(
        "Are you absolutely sure you want to forget and delete all private Memory? This cannot be undone.",
      )
    ) {
      setMemories([]);
      setRecoveryContact({ name: "", contact: "", relationship: "" });
      setCouncilSeats([null, null, null, null, null, null, null]);
      setMessages([
        {
          id: "director-init",
          role: "director",
          text: "All local data has been forgotten. I am here to walk with you again.",
        },
      ]);
      setOnboarded(false);
      setOnboardingStep("welcome");
      go("talk", "talk");
    }
  };

  // Toggle play/pause mock audio state
  const handleToggleAudio = (id) => {
    if (isPlayingAudio === id) {
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(id);
      // Simulate progress increment
      const interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 3));
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  // Onboarding screens render before Tab system
  if (!onboarded) {
    return (
      <Shell hideNav activeTab={activeTab} onTab={(next) => go(next, next)}>
        <section className="screen-content onboarding">
          {onboardingStep === "welcome" && (
            <>
              <div className="onboarding-mark">
                <Mark />
                <h1 style={{ marginTop: "16px" }}>Sayved</h1>
                <p>Walked with.</p>
              </div>
              <div className="question-block" style={{ marginTop: "16px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    color: "var(--textPrimary)",
                    marginBottom: "16px",
                    fontFamily: "var(--serif)",
                  }}
                >
                  What brings you here today?
                </h2>
                {[
                  "I'm going through something",
                  "I want to grow",
                  "I'm curious",
                  "I honestly don't know",
                ].map((answer) => (
                  <button
                    key={answer}
                    className="answer-row"
                    onClick={() => {
                      setUserIntent(answer);
                      setOnboardingStep("privacy");
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {answer}
                    </span>
                    <ChevronLeft
                      size={16}
                      style={{
                        transform: "rotate(180deg)",
                        color: "var(--accentTaupe)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {onboardingStep === "privacy" && (
            <>
              <div className="onboarding-mark">
                <Mark />
                <h1 style={{ marginTop: "16px" }}>Privacy Promise</h1>
                <p>Your walk belongs to you.</p>
              </div>
              <div
                className="promise-panel"
                style={{ padding: "20px", marginTop: "16px" }}
              >
                <LockKeyhole
                  size={24}
                  style={{ color: "var(--accentTaupe)", gridColumn: "1" }}
                />
                <div style={{ gridColumn: "2" }}>
                  <strong
                    style={{
                      fontSize: "15px",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    We cannot read your prayers.
                  </strong>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5" }}>
                    Sayved does not store private Memory on open servers.
                    Processing is done locally, and your private data keys
                    remain encrypted.
                  </p>
                </div>
              </div>
              <button
                className="primary-button"
                style={{ marginTop: "24px" }}
                onClick={() => setOnboardingStep("rhythm")}
              >
                Receive Privacy Promise
              </button>
            </>
          )}

          {onboardingStep === "rhythm" && (
            <>
              <div className="onboarding-mark">
                <Mark />
                <h1 style={{ marginTop: "16px" }}>Devotional Rhythm</h1>
                <p>Quiet anchors, no engagement bait.</p>
              </div>
              <div className="question-block" style={{ marginTop: "16px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    color: "var(--textPrimary)",
                    marginBottom: "16px",
                    fontFamily: "var(--serif)",
                  }}
                >
                  Choose your notification pace:
                </h2>
                {[
                  "Daily morning quiet reflection",
                  "Weekly anchor verse prompts",
                  "Quiet mode (No notification prompts)",
                ].map((rhythm) => (
                  <button
                    key={rhythm}
                    className="answer-row"
                    onClick={() => {
                      setNotificationRhythm(rhythm);
                      setOnboardingStep("consent");
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {rhythm}
                    </span>
                    <Check size={16} style={{ color: "var(--successOlive)" }} />
                  </button>
                ))}
              </div>
            </>
          )}

          {onboardingStep === "consent" && (
            <>
              <div className="onboarding-mark">
                <Mark />
                <h1 style={{ marginTop: "16px" }}>Disclosures & Consent</h1>
                <p>Grounding our expectations.</p>
              </div>
              <div
                className="consent-list"
                style={{
                  padding: "16px",
                  background: "rgba(254,253,252,0.8)",
                  borderRadius: "8px",
                  border: "1px solid var(--borderSoft)",
                  marginTop: "16px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "start",
                    marginBottom: "14px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consents.privacy}
                    onChange={(e) =>
                      setConsents({ ...consents, privacy: e.target.checked })
                    }
                    style={{ marginTop: "3px" }}
                  />
                  <span style={{ fontSize: "12px", lineHeight: "1.4" }}>
                    I agree to the Terms of Service and Privacy Policy. My data
                    is handled locally.
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "start",
                    marginBottom: "14px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consents.ai}
                    onChange={(e) =>
                      setConsents({ ...consents, ai: e.target.checked })
                    }
                    style={{ marginTop: "3px" }}
                  />
                  <span style={{ fontSize: "12px", lineHeight: "1.4" }}>
                    I understand Sayved is an AI Director, not a replacement for
                    sacrament, confession, or human counseling.
                  </span>
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "start",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={consents.memory}
                    onChange={(e) =>
                      setConsents({ ...consents, memory: e.target.checked })
                    }
                    style={{ marginTop: "3px" }}
                  />
                  <span style={{ fontSize: "12px", lineHeight: "1.4" }}>
                    I consent to letting the Director extract private themes
                    (Memory) locally to help guide future answers.
                  </span>
                </label>
              </div>
              <button
                className="primary-button"
                style={{
                  marginTop: "24px",
                  opacity:
                    consents.privacy && consents.ai && consents.memory
                      ? 1
                      : 0.6,
                }}
                disabled={!(consents.privacy && consents.ai && consents.memory)}
                onClick={() => setOnboarded(true)}
              >
                Enter Sayved
              </button>
            </>
          )}
        </section>
      </Shell>
    );
  }

  return (
    <Shell
      activeTab={activeTab}
      onTab={(next) => go(next, next)}
      hideNav={screen === "crisis"}
    >
      {/* 2. Talk / Director Conversation */}
      {screen === "talk" && (
        <section className="screen-content talk-screen has-composer">
          <TopBar
            title="Talk"
            eyebrow="One continuous Director conversation"
            go={go}
            action={
              <IconButton
                label="Crisis help"
                onClick={() => go("crisis", "talk")}
                tone="warning"
              >
                <AlertTriangle size={18} />
              </IconButton>
            }
          />

          {/* 3. Source Switcher / Composer Layer */}
          <div
            className="source-switcher"
            role="tablist"
            aria-label="Source scope"
          >
            {["Sayved", "My Council", "My Teachers"].map((item) => (
              <button
                key={item}
                className={scope === item ? "active" : ""}
                onClick={() => setScope(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Quick Focus Selector */}
          <div className="quick-teachers">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                className={
                  selectedTeacher.id === teacher.id && scope === "My Teachers"
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setSelectedTeacher(teacher);
                  setScope("My Teachers");
                }}
                title={teacher.name}
              >
                <img src={teacher.image} alt={teacher.name} />
              </button>
            ))}
          </div>

          <div className="message-stack">
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "user" ? "user-message" : "director-card"
                }
              >
                {message.role === "director" && (
                  <div className="director-head">
                    <Mark small />
                    <div>
                      <strong>Sayved</strong>
                      <span>Director voice</span>
                    </div>
                  </div>
                )}
                <p>{message.text}</p>

                {/* 4. Scripture / Reference chip */}
                {message.scripture && (
                  <button
                    className="scripture-chip"
                    onClick={() => go("scripture", "talk")}
                  >
                    <BookOpen size={14} /> {scripture.reference}
                  </button>
                )}

                {/* 7. Official Source Card */}
                {message.source && (
                  <SourceCard
                    compact
                    teacher={selectedTeacher}
                    onOpen={() => go("source", "follow")}
                    onRequest={() => go("request-confirm", "follow")}
                  />
                )}

                {/* Surfaced Memory Thread Card */}
                {message.memory && (
                  <button
                    className="memory-thread"
                    onClick={() => go("memory", "walk")}
                  >
                    <Archive size={14} /> Connects to private Theme:{" "}
                    {memories[0]?.title || "Fear of falling behind"}
                  </button>
                )}

                {message.role === "director" && (
                  <div className="listen-row">
                    <button onClick={() => handleToggleAudio(message.id)}>
                      {isPlayingAudio === message.id ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>
                    <span>Listen reflection</span>
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        background: "var(--borderSoft)",
                        borderRadius: "2px",
                        margin: "0 8px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width:
                            isPlayingAudio === message.id
                              ? `${audioProgress}%`
                              : "0%",
                          background: "var(--accentTaupe)",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Theological tool buttons to access compare/disputation */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              margin: "20px 0 10px",
              justifyContent: "center",
            }}
          >
            <button
              className="quiet-button"
              style={{
                borderRadius: "20px",
                minHeight: "34px",
                padding: "0 12px",
              }}
              onClick={() => go("compare", "talk")}
            >
              <Sparkles size={13} /> Compare
            </button>
            <button
              className="quiet-button"
              style={{
                borderRadius: "20px",
                minHeight: "34px",
                padding: "0 12px",
              }}
              onClick={() => go("disputation", "talk")}
            >
              <AlertTriangle size={13} /> Disputation
            </button>
          </div>

          <Composer
            value={composer}
            onChange={setComposer}
            onSend={handleSend}
          />
        </section>
      )}

      {/* 4. Scripture / References Screen */}
      {screen === "scripture" && (
        <Detail
          title="Scripture"
          eyebrow="Grounding context"
          onBack={() => go("talk", "talk")}
        >
          <article className="quiet-panel scripture-page">
            <Pill tone="olive">Referenced by Director</Pill>
            <h2 style={{ marginTop: "12px" }}>{scripture.reference}</h2>
            <p className="scripture-text">"{scripture.text}"</p>
          </article>
          <InfoBlock
            icon={<BookOpen size={17} />}
            title="Why this verse?"
            text={scripture.why}
          />
          <div className="action-grid" style={{ marginTop: "18px" }}>
            <button onClick={() => go("bible", "walk")}>
              <BookOpen size={16} /> Open Bible
            </button>
            <button
              onClick={() => alert("Saved reference to private bookmarks")}
            >
              <Archive size={16} /> Save
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${scripture.reference}: ${scripture.text}`,
                );
                alert("Copied reference to clipboard");
              }}
            >
              <FileText size={16} /> Copy
            </button>
          </div>
        </Detail>
      )}

      {/* 12. Crisis Hand-Off */}
      {screen === "crisis" && (
        <section className="screen-content crisis-screen">
          <div className="crisis-card">
            <AlertTriangle size={34} style={{ marginBottom: "12px" }} />
            <h1>You do not have to carry this alone.</h1>
            <p>
              If you are in immediate distress or thinking about self-harm,
              please reach out to professional human care. Sayved is stepping
              back to put you in touch.
            </p>
            <a
              href="tel:911"
              className="primary-button"
              style={{
                textDecoration: "none",
                display: "flex",
                marginBottom: "12px",
                background: "var(--warningClay)",
                borderColor: "var(--warningClay)",
              }}
            >
              Call Emergency (911)
            </a>
            <a
              href="tel:988"
              className="primary-button"
              style={{
                textDecoration: "none",
                display: "flex",
                marginBottom: "12px",
              }}
            >
              Call or Text Crisis Line (988)
            </a>
            {recoveryContact.name && (
              <a
                href={`tel:${recoveryContact.contact}`}
                className="secondary-button"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Call Recovery: {recoveryContact.name}
              </a>
            )}
            <span
              style={{
                fontSize: "11px",
                color: "var(--textSecondary)",
                display: "block",
                marginTop: "16px",
              }}
            >
              No private Memory logs will capture crisis queries.
            </span>
            <button
              className="quiet-button"
              style={{ marginTop: "24px", width: "100%" }}
              onClick={() => go("talk", "talk")}
            >
              I am safe now, return to conversation
            </button>
          </div>
        </section>
      )}

      {/* 5. Follow / Teacher Discovery */}
      {screen === "follow" && (
        <section className="screen-content">
          <TopBar title="Follow" eyebrow="Teachers & Council" go={go} />

          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search teachers, ministries, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 0,
                outline: 0,
                background: "transparent",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <SectionTitle
              title="Prototype Teacher Slots"
              action="Four active slots"
            />
            <button
              className="quiet-button"
              style={{ minHeight: "30px", fontSize: "12px", padding: "0 10px" }}
              onClick={() => go("council", "follow")}
            >
              Build Council
            </button>
          </div>

          <div className="teacher-list">
            {filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isSeated={isTeacherSeated(teacher.id)}
                onOpen={() => {
                  setSelectedTeacher(teacher);
                  go("teacher", "follow");
                }}
                onSeat={() => toggleSeat(teacher.id)}
              />
            ))}
            {filteredTeachers.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--textSecondary)",
                  padding: "20px",
                }}
              >
                No teachers match your search query.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 6. Teacher Profile */}
      {screen === "teacher" && (
        <Detail
          title="Teacher Profile"
          eyebrow="Verification & Scope"
          onBack={() => go("follow", "follow")}
        >
          <article className="teacher-profile" style={{ marginBottom: "16px" }}>
            <img src={selectedTeacher.image} alt={selectedTeacher.name} />
            <div>
              <TeacherBadge teacher={selectedTeacher} />
              <h2 style={{ fontSize: "20px" }}>{selectedTeacher.name}</h2>
              <p>{selectedTeacher.ministry}</p>
              <strong>{selectedTeacher.relationship}</strong>
            </div>
          </article>

          <InfoBlock
            icon={
              <ShieldCheck size={18} style={{ color: "var(--successOlive)" }} />
            }
            title="Sourced Information Mode"
            text={`Sayved routes to official publications or public media channels. No synthetic first-person chat is permitted.`}
          />
          <InfoBlock
            icon={<X size={18} style={{ color: "var(--warningClay)" }} />}
            title="Librarian Guardrails"
            text="Unlicensed audio catalogs cannot be ingested or directly cited in disputation sessions."
          />

          <div className="topic-row" style={{ margin: "16px 0" }}>
            {selectedTeacher.topics.map((topic) => (
              <Pill key={topic}>{topic}</Pill>
            ))}
          </div>

          <SourceCard
            teacher={selectedTeacher}
            onOpen={() => go("source", "follow")}
            onRequest={() => go("request-confirm", "follow")}
          />

          <button
            className="secondary-button"
            style={{
              marginTop: "12px",
              background: isTeacherSeated(selectedTeacher.id)
                ? "rgba(167, 111, 91, 0.08)"
                : "var(--surfaceCream)",
            }}
            onClick={() => {
              toggleSeat(selectedTeacher.id);
              go("follow", "follow");
            }}
          >
            {isTeacherSeated(selectedTeacher.id)
              ? "Unseat from Council"
              : "Seat in Council"}
          </button>
        </Detail>
      )}

      {/* 7. Official Source Player */}
      {screen === "source" && (
        <Detail
          title="Source Player"
          eyebrow="Official routing player"
          onBack={() => go("follow", "follow")}
        >
          <article className="player-card">
            <div
              className="player-art"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <Headphones
                size={42}
                style={{
                  opacity: isPlayingAudio === "source-player" ? 0.3 : 1,
                }}
              />
              {isPlayingAudio === "source-player" && (
                <div
                  style={{
                    display: "flex",
                    gap: "3px",
                    position: "absolute",
                    bottom: "16px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      style={{
                        width: "3px",
                        height: "18px",
                        background: "var(--accentTaupe)",
                        animation: "bounce 0.8s infinite ease-in-out",
                        animationDelay: `${bar * 0.15}s`,
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes bounce {
                      0%, 100% { transform: scaleY(0.3); }
                      50% { transform: scaleY(1.2); }
                    }
                  `}</style>
                </div>
              )}
            </div>
            <Pill tone="beige">{selectedTeacher.relationship}</Pill>
            <h2 style={{ fontSize: "20px", marginTop: "8px" }}>
              {selectedTeacher.name} sermon stream
            </h2>
            <p style={{ margin: "4px 0 16px" }}>
              Connecting to public broadcasts. Playback logs remain encrypted on
              your device.
            </p>

            <div
              style={{
                width: "100%",
                height: "4px",
                background: "var(--borderSoft)",
                borderRadius: "2px",
                position: "relative",
                overflow: "hidden",
                margin: "16px 0 8px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width:
                    isPlayingAudio === "source-player"
                      ? `${audioProgress}%`
                      : "40%",
                  background: "var(--accentTaupe)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "var(--textSecondary)",
                marginBottom: "8px",
              }}
            >
              <span>
                {isPlayingAudio === "source-player"
                  ? formatTime(Math.floor(630 * (audioProgress / 100)))
                  : "04:12"}
              </span>
              <span>10:30</span>
            </div>

            <div className="player-controls">
              <button
                onClick={() =>
                  setAudioProgress(Math.max(0, audioProgress - 10))
                }
              >
                <ChevronLeft size={20} style={{ transform: "rotate(0)" }} />
              </button>
              <button
                className="play-large"
                onClick={() => handleToggleAudio("source-player")}
              >
                {isPlayingAudio === "source-player" ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} style={{ marginLeft: "3px" }} />
                )}
              </button>
              <button
                onClick={() =>
                  setAudioProgress(Math.min(100, audioProgress + 10))
                }
              >
                <ChevronLeft
                  size={20}
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>
            </div>
          </article>

          <SectionTitle title="Official Public Channels" />
          <div
            style={{
              background: "rgba(254,253,252,0.8)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {selectedTeacher.officialSources.map((source, index) => (
              <a
                href="#external-source"
                key={index}
                className="list-row"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Routing to external browser path: ${source}`);
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ExternalLink size={14} /> {source}
                </span>
                <ChevronLeft
                  size={14}
                  style={{
                    transform: "rotate(180deg)",
                    color: "var(--textMuted)",
                  }}
                />
              </a>
            ))}
          </div>
        </Detail>
      )}

      {/* 19. Teacher Request Confirmation */}
      {screen === "request-confirm" && (
        <Detail
          title="Request Submitted"
          eyebrow="Demand Signalling"
          onBack={() => go("teacher", "follow")}
        >
          <div
            className="quiet-panel"
            style={{ textAlign: "center", padding: "30px 20px" }}
          >
            <Check
              size={48}
              style={{ color: "var(--successOlive)", margin: "0 auto 16px" }}
            />
            <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
              Request logged for {selectedTeacher.name}
            </h2>
            <p
              style={{
                color: "var(--textSecondary)",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              We track licensing request volumes to prioritize copyright
              negotiations with estates and ministries. You will be notified if
              a verified RAG catalog becomes active.
            </p>
          </div>
          <button
            className="primary-button"
            style={{ marginTop: "20px" }}
            onClick={() => go("follow", "follow")}
          >
            Back to Follow
          </button>
        </Detail>
      )}

      {/* 14. Council Builder */}
      {screen === "council" && (
        <Detail
          title="Council Builder"
          eyebrow="Assemble seven seats"
          onBack={() => go("follow", "follow")}
        >
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "rgba(183, 154, 115, 0.08)",
              borderRadius: "8px",
              border: "1px solid rgba(183, 154, 115, 0.2)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.5",
                color: "var(--accentTaupeDark)",
              }}
            >
              <strong>The Council Principle</strong>: You change who the
              Director consults in the library. Seated unverified/estate
              teachers will contribute in source-mode routing only.
            </p>
          </div>

          <div className="council-grid">
            {councilSeats.map((seatId, idx) => {
              const teacher = seatId
                ? teachers.find((t) => t.id === seatId)
                : null;
              return (
                <button
                  key={idx}
                  className="seat"
                  onClick={() => {
                    setSelectedSeatIndex(idx);
                    setIsCouncilDrawerOpen(true);
                  }}
                  style={{ position: "relative" }}
                >
                  {teacher ? (
                    <>
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "block",
                          marginTop: "6px",
                        }}
                      >
                        {teacher.name.split(" ").slice(-2).join(" ")}
                      </span>
                      <small
                        style={{
                          display: "block",
                          fontSize: "10px",
                          color: "var(--textSecondary)",
                        }}
                      >
                        Seat {idx + 1}
                      </small>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSeats = [...councilSeats];
                          newSeats[idx] = null;
                          setCouncilSeats(newSeats);
                        }}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          border: 0,
                          background: "rgba(167, 111, 91, 0.15)",
                          color: "var(--warningClay)",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          padding: 0,
                        }}
                      >
                        <X size={10} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px dashed var(--borderSoft)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Plus size={16} style={{ color: "var(--textMuted)" }} />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--textMuted)",
                          display: "block",
                          marginTop: "6px",
                        }}
                      >
                        Empty seat
                      </span>
                      <small
                        style={{ fontSize: "10px", color: "var(--textMuted)" }}
                      >
                        Seat {idx + 1}
                      </small>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="primary-button"
            style={{ marginTop: "24px" }}
            onClick={() => go("council-session", "talk")}
          >
            Preview Council Session
          </button>

          {/* Seat selection drawer */}
          {isCouncilDrawerOpen && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 100,
                background: "rgba(32,31,31,0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
              }}
            >
              <div
                style={{
                  background: "var(--surfaceWhite)",
                  padding: "20px",
                  borderRadius: "20px 20px 0 0",
                  borderTop: "1px solid var(--borderSoft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <strong style={{ fontSize: "15px" }}>
                    Choose Teacher for Seat {selectedSeatIndex + 1}
                  </strong>
                  <IconButton
                    label="Close"
                    onClick={() => setIsCouncilDrawerOpen(false)}
                  >
                    <X size={16} />
                  </IconButton>
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => {
                        const newSeats = [...councilSeats];
                        // Remove from existing seat to avoid duplicates
                        const prevIdx = newSeats.indexOf(teacher.id);
                        if (prevIdx !== -1) newSeats[prevIdx] = null;
                        newSeats[selectedSeatIndex] = teacher.id;
                        setCouncilSeats(newSeats);
                        setIsCouncilDrawerOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px",
                        border: "1px solid var(--borderSoft)",
                        borderRadius: "8px",
                        background:
                          councilSeats[selectedSeatIndex] === teacher.id
                            ? "var(--chipBeige)"
                            : "var(--surfaceCream)",
                        textAlign: "left",
                      }}
                    >
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600" }}>
                          {teacher.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--textSecondary)",
                          }}
                        >
                          {teacher.relationship}
                        </div>
                      </div>
                      {councilSeats.includes(teacher.id) && (
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            background: "var(--accentTaupe)",
                            color: "var(--surfaceWhite)",
                            borderRadius: "4px",
                          }}
                        >
                          Seated
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Detail>
      )}

      {/* 15. Council Session */}
      {screen === "council-session" && (
        <Detail
          title="Council Session"
          eyebrow="Director synthesis"
          onBack={() => go("talk", "talk")}
        >
          <article className="director-card" style={{ marginBottom: "16px" }}>
            <div className="director-head">
              <Mark small />
              <div>
                <strong>Sayved</strong>
                <span>Gathering the Seated Seats</span>
              </div>
            </div>
            <p style={{ margin: 0 }}>
              I have checked the Council seats. As these teachers are in
              librarian mode, I will synthesize general themes from their public
              works rather than generating speech in their name.
            </p>
          </article>

          <SectionTitle title="Council Contributions" />
          <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
            {councilSeats
              .map((id) => teachers.find((t) => t.id === id))
              .filter(Boolean)
              .map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: "12px",
                    background: "var(--surfaceWhite)",
                    borderRadius: "8px",
                    border: "1px solid var(--borderSoft)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <strong style={{ fontSize: "13px" }}>{t.name}</strong>
                    <Pill tone="beige">{t.type}</Pill>
                  </div>
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: "12px",
                      color: "var(--textSecondary)",
                      lineHeight: "1.4",
                    }}
                  >
                    Sermon content references public themes of trust, divine
                    order, and daily prayer steps.
                  </p>
                  <button
                    className="quiet-button"
                    style={{
                      minHeight: "28px",
                      fontSize: "11px",
                      width: "100%",
                    }}
                    onClick={() => {
                      setSelectedTeacher(t);
                      go("source", "follow");
                    }}
                  >
                    <Play size={10} /> Open Official Route
                  </button>
                </div>
              ))}
          </div>

          <InfoBlock
            icon={<Sparkles size={17} />}
            title="Director Close"
            text="What is one faithful step you can take today before demanding a verdict?"
          />
        </Detail>
      )}

      {/* 20. Compare Teachings */}
      {screen === "compare" && (
        <Detail
          title="Compare Teachings"
          eyebrow="Theological review"
          onBack={() => go("talk", "talk")}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Teacher A
              </label>
              <select
                value={compareTeachers[0]}
                onChange={(e) =>
                  setCompareTeachers([e.target.value, compareTeachers[1]])
                }
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 8px",
                  background: "var(--surfaceWhite)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                }}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Teacher B
              </label>
              <select
                value={compareTeachers[1]}
                onChange={(e) =>
                  setCompareTeachers([compareTeachers[0], e.target.value])
                }
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 8px",
                  background: "var(--surfaceWhite)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                }}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "rgba(167, 111, 91, 0.08)",
              borderRadius: "8px",
              border: "1px solid rgba(167, 111, 91, 0.2)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                lineHeight: "1.4",
                color: "var(--warningClay)",
              }}
            >
              <strong>Phase A Mode active</strong>: Deeper comparison is
              disabled until verified RAG catalogs are authorized. Only public
              themes and links can be aligned.
            </p>
          </div>

          <div className="compare-grid" style={{ marginBottom: "20px" }}>
            {compareTeachers
              .map((id) => teachers.find((t) => t.id === id))
              .filter(Boolean)
              .map((t) => (
                <article key={t.id} className="compare-card">
                  <TeacherBadge teacher={t} />
                  <h3 style={{ margin: "8px 0 4px" }}>{t.name}</h3>
                  <p style={{ fontSize: "12px" }}>
                    Focus: {t.topics.join(", ")}
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid var(--borderSoft)",
                      marginTop: "10px",
                      paddingTop: "10px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "11px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Legal Status:
                    </strong>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--textSecondary)",
                      }}
                    >
                      {t.relationship}
                    </span>
                  </div>
                  <button
                    className="quiet-button"
                    style={{
                      minHeight: "30px",
                      marginTop: "12px",
                      width: "100%",
                      fontSize: "11px",
                    }}
                    onClick={() => {
                      setSelectedTeacher(t);
                      go("source", "follow");
                    }}
                  >
                    View Route
                  </button>
                </article>
              ))}
          </div>
        </Detail>
      )}

      {/* 21. Disputation */}
      {screen === "disputation" && (
        <Detail
          title="Disputation"
          eyebrow="Structured debate"
          onBack={() => go("talk", "talk")}
        >
          <div className="quiet-panel" style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px" }}>The Disputation Discipline</h2>
            <p
              style={{
                color: "var(--textSecondary)",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Disputation is a tool where the Director presents different
              theological angles on a topic. It is built to resolve tensions
              without picking winners or staging fictitious conversations.
            </p>
          </div>

          <div
            style={{
              background: "rgba(254,253,252,0.8)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "13px",
                color: "var(--warningClay)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LockKeyhole size={14} /> Feature Locked
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: "1.5",
                color: "var(--textSecondary)",
              }}
            >
              The current four prototype teachers are unverified or
              estate-owned. Disputation is restricted to public-domain or fully
              verified ministry licenses.
            </p>
          </div>

          <SectionTitle title="Disputation Canons" />
          <div className="rule-list">
            <span>No first-person pastor dialog simulation.</span>
            <span>No winner declared; closes with a quiet prompt.</span>
            <span>Core creedal truths are never contested.</span>
          </div>
        </Detail>
      )}

      {/* 10. Memory / My Walk */}
      {screen === "walk" && (
        <section className="screen-content">
          <TopBar title="My Walk" eyebrow="Private Spiritual Record" go={go} />

          <div className="walk-hero" style={{ marginBottom: "16px" }}>
            <Pill tone="olive">Owned by you</Pill>
            <h2 style={{ fontSize: "20px", marginTop: "8px" }}>
              Memory is not chat history.
            </h2>
            <p style={{ margin: "6px 0 12px" }}>
              It is a corrected, structured reflection of your patterns and
              strengths. Everything is stored locally.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="primary-button"
                style={{ flex: 1, minHeight: "36px", fontSize: "12px" }}
                onClick={() => go("autobiography", "walk")}
              >
                Autobiography
              </button>
              <button
                className="secondary-button"
                style={{
                  flex: 1,
                  minHeight: "36px",
                  fontSize: "12px",
                  marginTop: 0,
                }}
                onClick={handleExport}
              >
                <Download size={13} /> Export Backup
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <SectionTitle title="Private Memory Themes" />
            <button
              onClick={() => {
                const newMem = {
                  id: `mem-${Date.now()}`,
                  type: "Spiritual Marker",
                  title: "New Spiritual Focus",
                  body: "Enter your custom notes here...",
                  source: "Added manually",
                };
                setMemories([newMem, ...memories]);
                setSelectedMemory(newMem);
                go("memory-detail", "walk");
              }}
              style={{
                border: 0,
                background: "transparent",
                color: "var(--accentTaupeDark)",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="memory-list" style={{ marginBottom: "20px" }}>
            {memories.map((item) => (
              <button
                key={item.id}
                className="memory-card"
                onClick={() => {
                  setSelectedMemory(item);
                  go("memory-detail", "walk");
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Pill>{item.type}</Pill>
                  <span style={{ fontSize: "11px", color: "var(--textMuted)" }}>
                    {item.source}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body.slice(0, 72)}...</p>
              </button>
            ))}
            {memories.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--textSecondary)",
                  fontSize: "13px",
                  padding: "16px",
                }}
              >
                No memories stored locally yet.
              </p>
            )}
          </div>

          <SectionTitle title="Walk Tools" />
          <div className="tool-grid" style={{ marginBottom: "20px" }}>
            <ToolButton
              icon={<BookOpen />}
              title="The Well"
              text="Finite daily feed"
              onClick={() => go("well", "walk")}
            />
            <ToolButton
              icon={<FileText />}
              title="Daily Devotion"
              text="Good Morning reflection"
              onClick={() => go("devotion", "walk")}
            />
            <ToolButton
              icon={<Radio />}
              title="Echo sermon"
              text="Sermon capture"
              onClick={() => go("echo", "walk")}
            />
            <ToolButton
              icon={<BookOpen />}
              title="Bible Reader"
              text="Scripture database"
              onClick={() => go("bible", "walk")}
            />
            <ToolButton
              icon={<LockKeyhole />}
              title="Recovery setup"
              text="Secure recovery contact"
              onClick={() => go("recovery", "walk")}
            />
            <ToolButton
              icon={<UsersRound />}
              title="Pastor dashboard"
              text="Church admin preview"
              onClick={() => go("dashboard", "walk")}
            />
          </div>

          <button
            className="secondary-button"
            style={{
              color: "var(--warningClay)",
              borderColor: "rgba(167, 111, 91, 0.3)",
              background: "rgba(167, 111, 91, 0.04)",
              width: "100%",
              minHeight: "40px",
            }}
            onClick={handleDeleteAllData}
          >
            <Trash2 size={14} style={{ marginRight: "6px" }} /> Forget All Local
            Data
          </button>
        </section>
      )}

      {/* 8. The Well */}
      {screen === "well" && (
        <Detail
          title="The Well"
          eyebrow="A daily feed that ends"
          onBack={() => go("walk", "walk")}
        >
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "var(--surfaceCream)",
              borderRadius: "8px",
              border: "1px solid var(--borderSoft)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", color: "var(--textSecondary)" }}>
              Rhythmic Anchor active
            </span>
            <button
              className="quiet-button"
              style={{ minHeight: "26px", fontSize: "10px", padding: "0 8px" }}
              onClick={() => handleToggleAudio("well-audio")}
            >
              {isPlayingAudio === "well-audio" ? (
                <Pause size={10} />
              ) : (
                <Play size={10} />
              )}{" "}
              Narration
            </button>
          </div>

          <WellItem
            icon={<BookOpen size={16} />}
            title="Today's Scripture"
            text="Psalm 119:105. Your word is a lamp for my feet, a light on my path."
          />
          <WellItem
            icon={<FileText size={16} />}
            title="Reflection"
            text="A lamp gives enough light for the immediate step, not the full roadmap. Rest in that scope today."
          />

          <WellItem
            icon={<Library size={16} />}
            title="Teacher Insight"
            text={`${teachers[0].name}: official route is open for consultation on Faith.`}
            onClick={() => {
              setSelectedTeacher(teachers[0]);
              go("source", "follow");
            }}
          />

          <WellItem
            icon={<Archive size={16} />}
            title="Connecting Memory"
            text="Gently links to your focus to pause quiet rhythm before making rush decisions."
            onClick={() => go("memory", "walk")}
          />

          <div className="end-state" style={{ marginTop: "24px" }}>
            The Well ends here today.
          </div>
        </Detail>
      )}

      {/* 9. Today's Devotion */}
      {screen === "devotion" && (
        <Detail
          title="Today's Devotion"
          eyebrow="Good Morning"
          onBack={() => go("walk", "walk")}
        >
          <article className="devotion-page" style={{ position: "relative" }}>
            <span>Reflection of the Day</span>
            <h2>{defaultDevotion.title}</h2>
            <p>
              {defaultDevotion.readTime} • Grounded in{" "}
              {defaultDevotion.scriptureRef}
            </p>
            <button
              className="scripture-chip"
              onClick={() => go("scripture", "talk")}
            >
              <BookOpen size={14} /> Luke 8:15
            </button>

            <div
              style={{
                borderTop: "1px solid var(--borderSoft)",
                marginTop: "16px",
                paddingTop: "16px",
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--textPrimary)",
                }}
              >
                "{defaultDevotion.reflection}"
              </p>
            </div>

            <div
              style={{
                background: "var(--backgroundWarm)",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "16px",
              }}
            >
              <strong
                style={{
                  fontSize: "12px",
                  display: "block",
                  marginBottom: "4px",
                  color: "var(--accentTaupeDark)",
                }}
              >
                Prayer prompt:
              </strong>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "var(--textSecondary)",
                }}
              >
                {defaultDevotion.prayer}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "16px",
                alignItems: "center",
                padding: "8px",
                background: "var(--surfaceCream)",
                borderRadius: "6px",
              }}
            >
              <button
                onClick={() => handleToggleAudio("devotion-audio")}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: 0,
                  background: "var(--accentTaupe)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {isPlayingAudio === "devotion-audio" ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} style={{ marginLeft: "2px" }} />
                )}
              </button>
              <span style={{ fontSize: "12px", color: "var(--textSecondary)" }}>
                Listen Audio Devotional (2:45)
              </span>
            </div>
          </article>

          <div className="action-grid" style={{ marginTop: "12px" }}>
            <button
              onClick={() => {
                setDevotionSaved(!devotionSaved);
                alert(
                  devotionSaved
                    ? "Removed from bookmarks"
                    : "Saved to private bookmarks",
                );
              }}
            >
              <Archive size={16} /> {devotionSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(defaultDevotion.reflection);
                alert("Copied reflection content");
              }}
            >
              <FileText size={16} /> Copy
            </button>
            <button onClick={() => alert("Shared link to devotion")}>
              <ExternalLink size={16} /> Share
            </button>
          </div>
        </Detail>
      )}

      {/* 11. Memory Detail / Edit / Forget */}
      {screen === "memory-detail" && (
        <Detail
          title="Memory Detail"
          eyebrow={selectedMemory.type}
          onBack={() => go("memory", "walk")}
        >
          <article className="quiet-panel" style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--textSecondary)",
                  marginBottom: "4px",
                }}
              >
                Memory Category
              </label>
              <select
                value={selectedMemory.type}
                onChange={(e) => {
                  const updated = { ...selectedMemory, type: e.target.value };
                  setSelectedMemory(updated);
                  setMemories(
                    memories.map((m) =>
                      m.id === selectedMemory.id ? updated : m,
                    ),
                  );
                }}
                style={{
                  height: "36px",
                  width: "100%",
                  background: "var(--surfaceWhite)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  padding: "0 8px",
                }}
              >
                {[
                  "Theme",
                  "Facts",
                  "Strengths",
                  "Commitment",
                  "Spiritual Marker",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--textSecondary)",
                  marginBottom: "4px",
                }}
              >
                Title
              </label>
              <input
                type="text"
                value={selectedMemory.title}
                onChange={(e) => {
                  const updated = { ...selectedMemory, title: e.target.value };
                  setSelectedMemory(updated);
                  setMemories(
                    memories.map((m) =>
                      m.id === selectedMemory.id ? updated : m,
                    ),
                  );
                }}
                style={{
                  height: "36px",
                  width: "100%",
                  background: "var(--surfaceWhite)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  padding: "0 8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "var(--textSecondary)",
                  marginBottom: "4px",
                }}
              >
                Reflections
              </label>
              <textarea
                value={selectedMemory.body}
                onChange={(e) => {
                  const updated = { ...selectedMemory, body: e.target.value };
                  setSelectedMemory(updated);
                  setMemories(
                    memories.map((m) =>
                      m.id === selectedMemory.id ? updated : m,
                    ),
                  );
                }}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "8px",
                  background: "var(--surfaceWhite)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  resize: "none",
                }}
              />
            </div>

            <span style={{ fontSize: "11px", color: "var(--textMuted)" }}>
              Source: {selectedMemory.source}
            </span>
          </article>

          <div className="action-grid" style={{ marginTop: "16px" }}>
            <button
              onClick={() => {
                alert("Changes saved locally");
                go("memory", "walk");
              }}
            >
              <Check size={16} /> Save Changes
            </button>
            <button
              style={{
                color: "var(--warningClay)",
                background: "rgba(167, 111, 91, 0.08)",
              }}
              onClick={() => {
                setMemories(memories.filter((m) => m.id !== selectedMemory.id));
                alert("Memory forgotten and removed from device");
                go("memory", "walk");
              }}
            >
              <Trash2 size={16} /> Forget Memory
            </button>
          </div>
        </Detail>
      )}

      {/* 18. Spiritual Autobiography Preview */}
      {screen === "autobiography" && (
        <Detail
          title="Autobiography"
          eyebrow="narrative feedback"
          onBack={() => go("memory", "walk")}
        >
          <article
            className="quiet-panel"
            style={{
              padding: "24px",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Pill tone="olive">Day 90 preview</Pill>
              <h2
                style={{
                  fontSize: "22px",
                  marginTop: "12px",
                  borderBottom: "1px solid var(--borderSoft)",
                  paddingBottom: "12px",
                }}
              >
                The story Sayved is learning with you
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.65",
                  color: "var(--textPrimary)",
                  marginTop: "16px",
                }}
              >
                You are becoming someone who pauses before panic. Your records
                show a steady movement away from rushing when life feels fast,
                grounding decisions in short morning reflections.
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.65",
                  color: "var(--textPrimary)",
                }}
              >
                You have returned to Psalm 119 repeatedly, seeking light for the
                next step rather than demands for a full blueprint.
              </p>
            </div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                color: "var(--textSecondary)",
                fontStyle: "italic",
                borderTop: "1px solid var(--borderSoft)",
                paddingTop: "12px",
              }}
            >
              Derived from local private memories. Updates as you live your
              walk.
            </span>
          </article>
          <button
            className="primary-button"
            style={{ marginTop: "16px" }}
            onClick={() => go("memory", "walk")}
          >
            Done
          </button>
        </Detail>
      )}

      {/* 16. Echo Sermon Capture */}
      {screen === "echo" && (
        <Detail
          title="Echo Capture"
          eyebrow="Sunday sermon capture"
          onBack={() => go("walk", "walk")}
        >
          <article className="capture-card" style={{ padding: "30px 20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: activeCapture
                  ? "rgba(167, 111, 91, 0.12)"
                  : "var(--chipBeige)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
              }}
            >
              <Mic
                size={32}
                style={{
                  color: activeCapture
                    ? "var(--warningClay)"
                    : "var(--accentTaupeDark)",
                }}
              />
            </div>

            {activeCapture ? (
              <>
                <h2 style={{ color: "var(--warningClay)" }}>
                  Capturing Audio...
                </h2>
                <p style={{ fontSize: "14px" }}>
                  Duration: {formatTime(captureDuration)}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    justifyContent: "center",
                    margin: "24px 0",
                  }}
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "4px",
                        height: "24px",
                        background: "var(--warningClay)",
                        animation: "wave 0.6s infinite alternate ease-in-out",
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes wave {
                      0% { transform: scaleY(0.2); }
                      100% { transform: scaleY(1.3); }
                    }
                  `}</style>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--textSecondary)",
                    margin: "0 0 20px",
                  }}
                >
                  Audio stays local. Transcribed on-device. Place phone face
                  down on pew.
                </p>
                <button
                  className="primary-button"
                  style={{
                    background: "var(--warningClay)",
                    borderColor: "var(--warningClay)",
                  }}
                  onClick={() => {
                    setActiveCapture(false);
                    const summary = {
                      id: `sermon-${Date.now()}`,
                      title: `Sermon Capture (${new Date().toLocaleDateString()})`,
                      text: "Sermon focused on the soil of the heart, quiet obedience, and laying down performance pressures.",
                      date: new Date().toLocaleDateString(),
                    };
                    setCapturedSermons([summary, ...capturedSermons]);
                    go("rhythm", "walk");
                  }}
                >
                  <Pause size={15} /> End Sermon Capture
                </button>
              </>
            ) : (
              <>
                <h2>Face-Down sermon capture</h2>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "var(--textSecondary)",
                    margin: "8px 0 20px",
                  }}
                >
                  Place your phone face down on the pew. Sayved will listen
                  locally and build a Monday-to-Saturday rhythm from your
                  church's sermon without uploading audio.
                </p>
                <button
                  className="primary-button"
                  onClick={() => setActiveCapture(true)}
                >
                  <Play size={15} style={{ marginRight: "4px" }} /> Start
                  Capturing Sermon
                </button>
              </>
            )}
          </article>
        </Detail>
      )}

      {/* 17. Echo Seven-Day Rhythm */}
      {screen === "rhythm" && (
        <Detail
          title="Echo Rhythm"
          eyebrow="Monday to Saturday anchors"
          onBack={() => go("walk", "walk")}
        >
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "var(--surfaceCream)",
              borderRadius: "8px",
              border: "1px solid var(--borderSoft)",
            }}
          >
            <strong
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Sermon Anchor generated:
            </strong>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--textSecondary)",
                lineHeight: "1.4",
              }}
            >
              Focus on quiet obedience, softening the soil, and avoiding
              performance pressures.
            </p>
          </div>

          <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
            {[
              {
                day: "Monday anchor verse",
                task: "Read Luke 8:15 and reflect for 2 mins.",
              },
              {
                day: "Tuesday memory thread",
                task: "Review your theme: fear of falling behind.",
              },
              {
                day: "Wednesday practice",
                task: "Pause 2 minutes before making major decisions today.",
              },
              {
                day: "Thursday deeper reflection",
                task: "Consider which expectations are yours or external.",
              },
              {
                day: "Friday examen",
                task: "Note down where you felt the soil of the heart soften.",
              },
              {
                day: "Saturday preparation",
                task: "Quiet evening prep for tomorrow's community worship.",
              },
            ].map((item, idx) => {
              const isCompleted = completedRhythmDays.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isCompleted) {
                      setCompletedRhythmDays(
                        completedRhythmDays.filter((i) => i !== idx),
                      );
                    } else {
                      setCompletedRhythmDays([...completedRhythmDays, idx]);
                    }
                  }}
                  className="list-row"
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "24px 1fr 24px",
                    alignItems: "center",
                    textAlign: "left",
                    background: isCompleted
                      ? "rgba(123, 130, 102, 0.08)"
                      : "var(--surfaceWhite)",
                    border: "1px solid var(--borderSoft)",
                    borderRadius: "8px",
                    marginBottom: "4px",
                    minHeight: "54px",
                  }}
                >
                  <div style={{ display: "grid", placeItems: "center" }}>
                    {isCompleted ? (
                      <Check
                        size={16}
                        style={{ color: "var(--successOlive)" }}
                      />
                    ) : (
                      <Circle size={16} style={{ color: "var(--textMuted)" }} />
                    )}
                  </div>
                  <div>
                    <strong
                      style={{
                        fontSize: "12px",
                        display: "block",
                        color: isCompleted
                          ? "var(--successOlive)"
                          : "var(--textPrimary)",
                      }}
                    >
                      {item.day}
                    </strong>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--textSecondary)",
                      }}
                    >
                      {item.task}
                    </span>
                  </div>
                  <ChevronLeft
                    size={14}
                    style={{
                      transform: "rotate(180deg)",
                      color: "var(--textMuted)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </Detail>
      )}

      {/* 22. Bible Reader / Search */}
      {screen === "bible" && (
        <Detail
          title="Bible Reader"
          eyebrow="scripture search"
          onBack={() => go("walk", "walk")}
        >
          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search verses (e.g. lamp, anxious, seed)..."
              value={bibleSearchQuery}
              onChange={(e) => setBibleSearchQuery(e.target.value)}
              style={{
                border: 0,
                outline: 0,
                background: "transparent",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          <SectionTitle
            title={bibleSearchQuery ? "Search Results" : "Featured Scriptures"}
          />
          <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
            {filteredBibleVerses.map((verse) => (
              <div
                key={verse.id}
                onClick={() => {
                  alert(`Copied ${verse.reference} to composer`);
                  setComposer(
                    `Comparing regarding ${verse.reference}: "${verse.text}"`,
                  );
                  go("talk", "talk");
                }}
                style={{
                  padding: "12px",
                  background: "var(--surfaceWhite)",
                  borderRadius: "8px",
                  border: "1px solid var(--borderSoft)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ fontSize: "13px" }}>
                    {verse.reference}
                  </strong>
                  <span style={{ fontSize: "11px", color: "var(--textMuted)" }}>
                    {verse.book}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: "1.4",
                    fontStyle: "italic",
                  }}
                >
                  "{verse.text}"
                </p>
                <span
                  style={{
                    display: "block",
                    marginTop: "6px",
                    fontSize: "10px",
                    color: "var(--accentTaupe)",
                  }}
                >
                  Tap to add to Talk composer
                </span>
              </div>
            ))}
            {filteredBibleVerses.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--textSecondary)",
                  fontSize: "13px",
                }}
              >
                No verses match your search query.
              </p>
            )}
          </div>
        </Detail>
      )}

      {/* 23. Recovery Contact Setup */}
      {screen === "recovery" && (
        <Detail
          title="Recovery Setup"
          eyebrow="Two-person memory recovery"
          onBack={() => go("walk", "walk")}
        >
          <div
            className="quiet-panel"
            style={{ marginBottom: "16px", padding: "16px" }}
          >
            <LockKeyhole
              size={24}
              style={{ color: "var(--accentTaupe)", marginBottom: "8px" }}
            />
            <h2 style={{ fontSize: "16px", margin: "4px 0" }}>
              Two-Person key hold recovery
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "var(--textSecondary)",
                lineHeight: "1.5",
              }}
            >
              Configure a recovery contact. They can hold the keys to verify
              your identity if you lock your vault, but they will never be able
              to read your private Memory content.
            </p>
          </div>

          <div
            style={{
              background: "var(--surfaceWhite)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Contact Name
              </label>
              <input
                type="text"
                placeholder="E.g. Pastor Mike or trusted friend"
                value={recoveryContact.name}
                onChange={(e) =>
                  setRecoveryContact({
                    ...recoveryContact,
                    name: e.target.value,
                  })
                }
                style={{
                  height: "36px",
                  width: "100%",
                  padding: "0 8px",
                  background: "var(--surfaceCream)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Phone or Email
              </label>
              <input
                type="text"
                placeholder="E.g. +234 803 000 0000"
                value={recoveryContact.contact}
                onChange={(e) =>
                  setRecoveryContact({
                    ...recoveryContact,
                    contact: e.target.value,
                  })
                }
                style={{
                  height: "36px",
                  width: "100%",
                  padding: "0 8px",
                  background: "var(--surfaceCream)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                Relationship
              </label>
              <input
                type="text"
                placeholder="E.g. Pastor, Mentor, Spouse"
                value={recoveryContact.relationship}
                onChange={(e) =>
                  setRecoveryContact({
                    ...recoveryContact,
                    relationship: e.target.value,
                  })
                }
                style={{
                  height: "36px",
                  width: "100%",
                  padding: "0 8px",
                  background: "var(--surfaceCream)",
                  border: "1px solid var(--borderSoft)",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              if (recoveryContact.name && recoveryContact.contact) {
                alert(`Recovery contact saved: ${recoveryContact.name}`);
                go("walk", "walk");
              } else {
                alert("Please enter a name and contact point.");
              }
            }}
          >
            Save Recovery Contact
          </button>
        </Detail>
      )}

      {/* 24. Pastor Dashboard Preview */}
      {screen === "dashboard" && (
        <Detail
          title="Pastor Dashboard"
          eyebrow="Future church preview"
          onBack={() => go("walk", "walk")}
        >
          <div
            className="quiet-panel"
            style={{ padding: "20px", marginBottom: "16px" }}
          >
            <Pill tone="olive">Vanguard Christian Center admin</Pill>
            <h2 style={{ fontSize: "18px", marginTop: "10px" }}>
              Anonymous Congregation Insights
            </h2>
            <p
              style={{
                color: "var(--textSecondary)",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              A preview of the dashboard church leaders see. It displays
              aggregated patterns like sermon completion levels and weekly
              anchors without exposing individual prayers.
            </p>
          </div>

          <SectionTitle title="Weekly Metrics" />
          <div className="compare-grid" style={{ marginBottom: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--surfaceWhite)",
                border: "1px solid var(--borderSoft)",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--textSecondary)",
                  fontWeight: "600",
                }}
              >
                ECHO CAPTURES
              </span>
              <strong
                style={{ display: "block", fontSize: "20px", marginTop: "4px" }}
              >
                142
              </strong>
              <small style={{ fontSize: "9px", color: "var(--successOlive)" }}>
                +12% vs last week
              </small>
            </div>
            <div
              style={{
                padding: "12px",
                background: "var(--surfaceWhite)",
                border: "1px solid var(--borderSoft)",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--textSecondary)",
                  fontWeight: "600",
                }}
              >
                RHYTHM MET
              </span>
              <strong
                style={{ display: "block", fontSize: "20px", marginTop: "4px" }}
              >
                78%
              </strong>
              <small style={{ fontSize: "9px", color: "var(--successOlive)" }}>
                High engagement
              </small>
            </div>
          </div>

          <div
            style={{
              background: "rgba(254,253,252,0.8)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <strong
              style={{
                fontSize: "12px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Primary Congregation Themes (Aggregated)
            </strong>
            <div style={{ display: "grid", gap: "6px" }}>
              {[
                { theme: "Seeking peace in rush schedules", weight: "45%" },
                { theme: "Tending faith before big choices", weight: "32%" },
                { theme: "Family wisdom anchors", weight: "23%" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  <span style={{ color: "var(--textSecondary)" }}>
                    {item.theme}
                  </span>
                  <strong style={{ color: "var(--accentTaupeDark)" }}>
                    {item.weight}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </Detail>
      )}

      {/* 13. Settings / Legal */}
      {screen === "settings" && (
        <Detail
          title="Settings"
          eyebrow="Privacy & Legal settings"
          onBack={() => go("walk", "walk")}
        >
          <div
            style={{
              background: "var(--surfaceWhite)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              className="list-row"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Onboarding Intent: {userIntent || "None"}</span>
              <Pill>Local</Pill>
            </div>
            <div
              className="list-row"
              style={{ display: "flex", justifyContent: "space-between" }}
              onClick={() => {
                const newRhythm = notificationRhythm.includes("Daily")
                  ? "Weekly anchor only"
                  : "Daily morning quiet reflection";
                setNotificationRhythm(newRhythm);
                alert(`Rhythm updated: ${newRhythm}`);
              }}
            >
              <span>Rhythm: {notificationRhythm}</span>
              <Edit3 size={14} style={{ color: "var(--accentTaupe)" }} />
            </div>
            <div
              className="list-row"
              style={{ display: "flex", justifyContent: "space-between" }}
              onClick={handleExport}
            >
              <span>Export Private Vault (JSON backup)</span>
              <Download size={14} style={{ color: "var(--accentTaupe)" }} />
            </div>
            <div
              className="list-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "var(--warningClay)",
              }}
              onClick={handleDeleteAllData}
            >
              <span>Forget private memory data</span>
              <Trash2 size={14} />
            </div>
          </div>

          <SectionTitle title="Legal Documents & Disclosures" />
          <div
            style={{
              background: "var(--surfaceWhite)",
              border: "1px solid var(--borderSoft)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {[
              {
                title: "AI Disclosure Statement",
                text: "Sayved's Director AI is a theological guide drawing from official library routing. It is not licensed for psychological counseling or church sacrament administration.",
              },
              {
                title: "Takedown Objection Policy",
                text: "Ministries and estate owners can submit takedown signals for metadata or route listings directly to copyright@sayved.org.",
              },
              {
                title: "Terms and Privacy Policy",
                text: "Privacy-first structure: we do not sell data, track identity metrics, or upload plaintext sermon capture files to outer clouds.",
              },
              {
                title: "About Sayved v2.0",
                text: "Designed to keep you walked with. Developed with modern, minimalist, native mobile principles.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "14px",
                  borderBottom: "1px solid var(--borderSoft)",
                }}
              >
                <strong
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "var(--textSecondary)",
                    lineHeight: "1.4",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Detail>
      )}
    </Shell>
  );
}

function Shell({
  children,
  hideNav = false,
  activeTab = "talk",
  onTab = () => {},
}) {
  return (
    <div className="app-container">
      <main className="phone-viewport">
        <div className="ambient-photo" />
        <div className="screen-wrapper">{children}</div>
        {!hideNav && (
          <nav className="bottom-nav" aria-label="Primary">
            <button
              className={activeTab === "talk" ? "active" : ""}
              onClick={() => onTab("talk")}
            >
              <Home size={20} />
              <span>Talk</span>
            </button>
            <button
              className={activeTab === "follow" ? "active" : ""}
              onClick={() => onTab("follow")}
            >
              <UsersRound size={20} />
              <span>Follow</span>
            </button>
            <button
              className={activeTab === "walk" ? "active" : ""}
              onClick={() => onTab("walk")}
            >
              <UserRound size={20} />
              <span>My Walk</span>
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}

function Detail({ title, eyebrow, onBack, children, go }) {
  return (
    <section className="screen-content">
      <TopBar title={title} eyebrow={eyebrow} onBack={onBack} go={go} />
      {children}
    </section>
  );
}

function Composer({ value, onChange, onSend }) {
  return (
    <div className="composer">
      <IconButton
        label="Voice input"
        onClick={() =>
          alert("Local voice transcription is not active in this prototype")
        }
      >
        <Mic size={18} />
      </IconButton>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tell Sayved what is on your heart..."
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
      />
      <IconButton label="Send" onClick={onSend} tone="send">
        <Send size={18} />
      </IconButton>
    </div>
  );
}

// Memory block used inside Devotion / Well
function WellItem({ icon, title, text, onClick }) {
  return (
    <button
      className="well-item"
      onClick={onClick}
      style={{
        width: "100%",
        background: "var(--surfaceWhite)",
        border: "1px solid var(--borderSoft)",
        borderRadius: "8px",
        textAlign: "left",
        marginBottom: "8px",
      }}
    >
      <div style={{ color: "var(--accentTaupeDark)" }}>{icon}</div>
      <section>
        <h3 style={{ fontSize: "13px", margin: "0 0 2px" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.4" }}>{text}</p>
      </section>
    </button>
  );
}

function ToolButton({ icon, title, text, onClick }) {
  return (
    <button className="tool-button" onClick={onClick}>
      {icon}
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

export default App;
