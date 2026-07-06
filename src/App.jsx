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
  HeartHandshake,
  Home,
  Library,
  LockKeyhole,
  Mic,
  MoreHorizontal,
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
  Volume2,
  X,
} from "lucide-react";
import { teachers } from "./pastors";

const tabs = [
  { id: "talk", label: "Talk", icon: Home },
  { id: "follow", label: "Follow", icon: UsersRound },
  { id: "walk", label: "My Walk", icon: UserRound },
];

const scripture = {
  id: "psalm-119-105",
  reference: "Psalm 119:105",
  text: "Your word is a lamp for my feet, a light on my path.",
  why: "Used as a quiet image of guidance. It grounds the answer without turning the moment into a proof-text dump.",
};

const memoryItems = [
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

const flowScreens = [
  "Onboarding / Privacy Promise",
  "Talk / Director Conversation",
  "Source Switcher / Composer",
  "Scripture / References",
  "Teacher Discovery",
  "Teacher Profile",
  "Official Source Player",
  "The Well",
  "Today's Devotion",
  "Memory / My Walk",
  "Memory Detail / Edit / Forget",
  "Crisis Hand-Off",
  "Settings / Legal",
  "Council Builder",
  "Council Session",
  "Echo Sermon Capture",
  "Echo Seven-Day Rhythm",
  "Spiritual Autobiography Preview",
  "Teacher Request Confirmation",
  "Compare Teachings",
  "Disputation",
  "Bible Reader / Search",
  "Recovery Contact Setup",
  "Pastor Dashboard Preview",
];

function Mark({ small = false }) {
  return (
    <span className={small ? "mark mark-small" : "mark"} aria-hidden="true">
      <span />
    </span>
  );
}

function IconButton({ children, label, onClick, tone = "" }) {
  return (
    <button className={`icon-button ${tone}`} onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  );
}

function TopBar({ title, eyebrow, onBack, action }) {
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
        <IconButton label="Settings">
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
  return <Pill tone={teacher.status === "estate" ? "clay" : "beige"}>{label}</Pill>;
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
        <p>{teacher.relationship}. Sayved can route you to public official sources, but will not pretend to speak from a licensed catalog.</p>
      </div>
      <div className="card-actions">
        <button className="quiet-button" onClick={onOpen}>
          <Play size={15} /> Play
        </button>
        <button className="quiet-button" onClick={onRequest}>
          <Plus size={15} /> Request
        </button>
      </div>
    </article>
  );
}

function TeacherCard({ teacher, onOpen, onSeat }) {
  return (
    <article className="teacher-card">
      <img src={teacher.image} alt="" />
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
          <ExternalLink size={15} /> Profile
        </button>
        <button className="quiet-button" onClick={onSeat}>
          <Plus size={15} /> Seat
        </button>
      </div>
    </article>
  );
}

function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("talk");
  const [screen, setScreen] = useState("talk");
  const [scope, setScope] = useState("Sayved");
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [selectedMemory, setSelectedMemory] = useState(memoryItems[0]);
  const [composer, setComposer] = useState("");
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

  const activeTab = useMemo(() => {
    if (["follow", "teacher", "council", "source", "request"].includes(screen)) return "follow";
    if (["walk", "well", "devotion", "memory", "autobiography", "echo", "rhythm", "settings", "bible", "recovery", "dashboard"].includes(screen)) return "walk";
    return tab;
  }, [screen, tab]);

  useEffect(() => {
    document.querySelector(".screen-content")?.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  function go(nextScreen, nextTab = tab) {
    setTab(nextTab);
    setScreen(nextScreen);
  }

  function handleSend() {
    if (!composer.trim()) return;
    const prompt = composer.trim();
    setComposer("");
    if (/suicide|kill myself|end it/i.test(prompt)) {
      go("crisis", "talk");
      return;
    }
    setMessages((items) => [
      ...items,
      { id: `user-${Date.now()}`, role: "user", text: prompt },
      {
        id: `director-${Date.now()}`,
        role: "director",
        text:
          scope === "My Teachers"
            ? `${selectedTeacher.name} is ${selectedTeacher.relationship.toLowerCase()}, so I will not guess at that catalog. I can stay with you as Sayved and open official source routes that relate to this question.`
            : "I hear the weight in that. Let us take it one clear step at a time: name what is true, receive what Scripture can steady, and choose one obedient action you can actually carry today.",
        scripture: true,
        memory: scope !== "My Teachers",
        source: scope === "My Teachers",
      },
    ]);
  }

  if (!onboarded) {
    return (
      <Shell hideNav>
        <section className="screen-content onboarding">
          <div className="onboarding-mark">
            <Mark />
            <h1>Sayved</h1>
            <p>Walked with.</p>
          </div>
          <div className="question-block">
            <h2>What brings you here today?</h2>
            {["I'm going through something", "I want to grow", "I'm curious", "I honestly don't know"].map((answer) => (
              <button key={answer} className="answer-row" onClick={() => setOnboarded(true)}>
                <span>{answer}</span>
                <ChevronLeft size={17} />
              </button>
            ))}
          </div>
          <div className="promise-panel">
            <LockKeyhole size={19} />
            <div>
              <strong>Privacy promise</strong>
              <p>Sayved cannot read your prayers. Even we do not have the keys when private Memory is stored locally or end-to-end encrypted.</p>
            </div>
          </div>
          <div className="consent-list">
            {["Privacy Policy", "Terms", "AI disclosure", "Memory controls", "Notification rhythm"].map((item) => (
              <label key={item}>
                <input type="checkbox" defaultChecked />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <button className="primary-button" onClick={() => setOnboarded(true)}>
            Continue to Talk
          </button>
        </section>
      </Shell>
    );
  }

  return (
    <Shell activeTab={activeTab} onTab={(next) => go(next, next)}>
      {screen === "talk" && (
        <section className="screen-content talk-screen has-composer">
          <TopBar
            title="Talk"
            eyebrow="One continuous Director conversation"
            action={
              <IconButton label="Crisis help" onClick={() => go("crisis", "talk")} tone="warning">
                <AlertTriangle size={18} />
              </IconButton>
            }
          />
          <div className="source-switcher" role="tablist" aria-label="Source scope">
            {["Sayved", "My Council", "My Teachers"].map((item) => (
              <button key={item} className={scope === item ? "active" : ""} onClick={() => setScope(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="quick-teachers">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                className={selectedTeacher.id === teacher.id ? "selected" : ""}
                onClick={() => {
                  setSelectedTeacher(teacher);
                  setScope("My Teachers");
                }}
                title={teacher.name}
              >
                <img src={teacher.image} alt="" />
              </button>
            ))}
          </div>
          <div className="message-stack">
            {messages.map((message) => (
              <article key={message.id} className={message.role === "user" ? "user-message" : "director-card"}>
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
                {message.scripture && (
                  <button className="scripture-chip" onClick={() => go("scripture", "talk")}>
                    <BookOpen size={14} /> {scripture.reference}
                  </button>
                )}
                {message.source && (
                  <SourceCard
                    compact
                    teacher={selectedTeacher}
                    onOpen={() => go("source", "follow")}
                    onRequest={() => go("request", "follow")}
                  />
                )}
                {message.memory && (
                  <button className="memory-thread" onClick={() => go("memory", "walk")}>
                    <Archive size={14} /> This may connect to your fear of falling behind.
                  </button>
                )}
                {message.role === "director" && (
                  <div className="listen-row">
                    <Volume2 size={15} />
                    <span>Director audio</span>
                    <div />
                    <button><Play size={14} /></button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <Composer value={composer} onChange={setComposer} onSend={handleSend} />
        </section>
      )}

      {screen === "scripture" && (
        <Detail title="Scripture" eyebrow="Reference" onBack={() => go("talk", "talk")}>
          <article className="quiet-panel scripture-page">
            <Pill>Referenced in Talk</Pill>
            <h2>{scripture.reference}</h2>
            <p className="scripture-text">{scripture.text}</p>
          </article>
          <InfoBlock icon={<BookOpen size={17} />} title="Why this verse?" text={scripture.why} />
          <div className="action-grid">
            <button><BookOpen size={16} /> Open Bible</button>
            <button><Archive size={16} /> Save</button>
            <button><FileText size={16} /> Copy</button>
          </div>
        </Detail>
      )}

      {screen === "crisis" && (
        <section className="screen-content crisis-screen">
          <div className="crisis-card">
            <AlertTriangle size={28} />
            <h1>You should not be alone with this.</h1>
            <p>If you may hurt yourself or someone else, call emergency services now. Sayved will step back and help you reach a human.</p>
            <button className="primary-button">Call 911</button>
            <button className="secondary-button">Call or text 988</button>
            <button className="secondary-button">Contact Recovery Person</button>
            <span>No pastor cards, no debate, no Memory save.</span>
          </div>
        </section>
      )}

      {screen === "follow" && (
        <section className="screen-content">
          <TopBar title="Follow" eyebrow="Teachers, sources, Council" />
          <div className="search-box">
            <Search size={17} />
            <span>Search teachers, sources, topics</span>
          </div>
          <SectionTitle title="Prototype Teacher Slots" action="Four narrow MVP slots" />
          <div className="teacher-list">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onOpen={() => {
                  setSelectedTeacher(teacher);
                  go("teacher", "follow");
                }}
                onSeat={() => go("council", "follow")}
              />
            ))}
          </div>
          <SectionTitle title="Follow Flow" action="Source-safe" />
          <div className="screen-map compact-map">
            {["Follow", "Teacher profile", "Open official sources", "Request teacher", "Seat in Council"].map((item) => (
              <button key={item} onClick={() => item === "Request teacher" && go("request", "follow")}>
                <Circle size={9} /> {item}
              </button>
            ))}
          </div>
          <button className="primary-button" onClick={() => go("council", "follow")}>
            Build Council
          </button>
        </section>
      )}

      {screen === "teacher" && (
        <Detail title="Teacher Profile" eyebrow="Trust and source status" onBack={() => go("follow", "follow")}>
          <article className="teacher-profile">
            <img src={selectedTeacher.image} alt="" />
            <div>
              <TeacherBadge teacher={selectedTeacher} />
              <h2>{selectedTeacher.name}</h2>
              <p>{selectedTeacher.ministry}</p>
              <strong>{selectedTeacher.relationship}</strong>
            </div>
          </article>
          <InfoBlock icon={<ShieldCheck size={17} />} title="What Sayved can do" text="Route to official sources, show public facts, and use brief attributed material when safe." />
          <InfoBlock icon={<X size={17} />} title="What Sayved will not do" text="No first-person teacher simulation, no deep transcript retrieval, no Disputation for unverified or estate teachers." />
          <div className="topic-row">
            {selectedTeacher.topics.map((topic) => <Pill key={topic}>{topic}</Pill>)}
          </div>
          <SourceCard teacher={selectedTeacher} onOpen={() => go("source", "follow")} onRequest={() => go("request", "follow")} />
        </Detail>
      )}

      {screen === "source" && (
        <Detail title="Source Player" eyebrow="Official public route" onBack={() => go("follow", "follow")}>
          <article className="player-card">
            <div className="player-art"><Headphones size={34} /></div>
            <Pill tone="beige">{selectedTeacher.relationship}</Pill>
            <h2>{selectedTeacher.name}</h2>
            <p>Official source route selected for mobile playback. No catalog synthesis is implied.</p>
            <div className="player-controls">
              <button><ChevronLeft size={17} /></button>
              <button className="play-large"><Play size={22} /></button>
              <button><MoreHorizontal size={17} /></button>
            </div>
          </article>
          <SectionTitle title="Official Routes" />
          {selectedTeacher.officialSources.map((source) => (
            <div className="list-row" key={source}>
              <ExternalLink size={16} />
              <span>{source}</span>
            </div>
          ))}
        </Detail>
      )}

      {screen === "request" && (
        <Detail title="Request Teacher" eyebrow="Licensing signal" onBack={() => go("teacher", "follow")}>
          <InfoBlock icon={<Check size={18} />} title="Request logged" text={`${selectedTeacher.name} was added to licensing demand signals. Until approval exists, Sayved stays in official-source mode.`} />
          <button className="primary-button" onClick={() => go("follow", "follow")}>Done</button>
        </Detail>
      )}

      {screen === "council" && (
        <Detail title="Council Builder" eyebrow="Seven seats" onBack={() => go("follow", "follow")}>
          <div className="council-grid">
            {Array.from({ length: 7 }).map((_, index) => {
              const teacher = teachers[index % teachers.length];
              return (
                <button key={index} className="seat">
                  {index < 4 ? <img src={teacher.image} alt="" /> : <Plus size={20} />}
                  <span>{index < 4 ? teacher.name : "Open seat"}</span>
                  {index < 4 && <small>{teacher.status === "estate" ? "Source mode" : "Unverified"}</small>}
                </button>
              );
            })}
          </div>
          <InfoBlock icon={<UsersRound size={17} />} title="Council rule" text="Council voices can weigh in proactively, but the Director gathers them. No one speaks as themselves." />
          <button className="primary-button" onClick={() => go("council-session", "talk")}>Preview Council Session</button>
        </Detail>
      )}

      {screen === "council-session" && (
        <Detail title="Council Session" eyebrow="Director-gathered" onBack={() => go("talk", "talk")}>
          <article className="director-card">
            <div className="director-head"><Mark small /><div><strong>Sayved</strong><span>Gathering the Council</span></div></div>
            <p>I can bring the Council near, but I will keep the voice as Sayved. Each seat is checked before anything is used.</p>
          </article>
          {teachers.slice(0, 3).map((teacher) => (
            <SourceCard key={teacher.id} teacher={teacher} compact onOpen={() => go("source", "follow")} onRequest={() => go("request", "follow")} />
          ))}
          <InfoBlock icon={<Sparkles size={17} />} title="Director close" text="What is one faithful step you can take before asking for a verdict?" />
        </Detail>
      )}

      {screen === "compare" && (
        <Detail title="Compare Teachings" eyebrow="Verification-aware" onBack={() => go("talk", "talk")}>
          <div className="compare-grid">
            {teachers.slice(0, 2).map((teacher) => (
              <article key={teacher.id} className="compare-card">
                <TeacherBadge teacher={teacher} />
                <h3>{teacher.name}</h3>
                <p>Brief public themes and official links only. Deep comparison is disabled until licensed or public-domain content exists.</p>
              </article>
            ))}
          </div>
          <InfoBlock icon={<ShieldCheck size={17} />} title="Honest depth" text="Any unverified or estate participant keeps the comparison in source-routing mode." />
        </Detail>
      )}

      {screen === "disputation" && (
        <Detail title="Disputation" eyebrow="Locked rules" onBack={() => go("talk", "talk")}>
          <InfoBlock icon={<X size={17} />} title="Unavailable for this set" text="The current four MVP teachers are unverified or estate. Disputation requires verified or public-domain voices." />
          <div className="rule-list">
            {["No winner", "No first-person simulation", "No estate voices", "Core creedal truths are not staged"].map((rule) => <span key={rule}>{rule}</span>)}
          </div>
        </Detail>
      )}

      {screen === "walk" && (
        <section className="screen-content">
          <TopBar title="My Walk" eyebrow="Memory, Echo, Well, settings" />
          <div className="walk-hero">
            <Pill tone="olive">Your walk belongs to you</Pill>
            <h2>Memory is not chat history.</h2>
            <p>It is a structured, correctable understanding of your walk. You can edit, export, or forget it.</p>
          </div>
          <SectionTitle title="Today" />
          <div className="tool-grid">
            <ToolButton icon={<BookOpen />} title="The Well" text="A feed that ends" onClick={() => go("well", "walk")} />
            <ToolButton icon={<FileText />} title="Devotion" text="Good Morning" onClick={() => go("devotion", "walk")} />
            <ToolButton icon={<Archive />} title="Memory" text="Edit or forget" onClick={() => go("memory", "walk")} />
            <ToolButton icon={<Radio />} title="Echo" text="Sunday to Saturday" onClick={() => go("echo", "walk")} />
          </div>
          <SectionTitle title="Complete Screen Map" action="All flows" />
          <div className="screen-map">
            {flowScreens.map((item) => (
              <button key={item} onClick={() => routeFromMap(item, go)}>
                <Circle size={9} /> {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "well" && (
        <Detail title="The Well" eyebrow="Daily feed that ends" onBack={() => go("walk", "walk")}>
          <WellItem icon={<BookOpen size={17} />} title="Today's Scripture" text="Psalm 119:105. A lamp, not a floodlight." />
          <WellItem icon={<FileText size={17} />} title="Short Reflection" text="You only need enough light for the next faithful step." />
          <WellItem icon={<Library size={17} />} title="Teacher Source" text={`${selectedTeacher.name}: official source route available.`} onClick={() => go("source", "follow")} />
          <WellItem icon={<Archive size={17} />} title="Memory Thread" text="This connects gently to your morning rhythm commitment." onClick={() => go("memory", "walk")} />
          <div className="end-state">The Well ends here today.</div>
        </Detail>
      )}

      {screen === "devotion" && (
        <Detail title="Today's Devotion" eyebrow="Minimal reflection" onBack={() => go("walk", "walk")}>
          <article className="devotion-page">
            <span>Good Morning.</span>
            <h2>Tending the Soil of the Heart</h2>
            <p>3 min read</p>
            <button className="scripture-chip" onClick={() => go("scripture", "talk")}><BookOpen size={14} /> Luke 8:15</button>
          </article>
          <InfoBlock icon={<FileText size={17} />} title="Reflection" text="Growth is not performance. It is a protected place where the Word can remain long enough to bear fruit." />
          <InfoBlock icon={<HeartHandshake size={17} />} title="Prayer" text="Lord, soften my heart today. Help me receive enough light for the step in front of me." />
          <div className="action-grid">
            <button><Archive size={16} /> Save</button>
            <button><Volume2 size={16} /> Listen</button>
            <button><ExternalLink size={16} /> Share</button>
          </div>
        </Detail>
      )}

      {screen === "memory" && (
        <Detail title="Memory" eyebrow="Owned by you" onBack={() => go("walk", "walk")}>
          <div className="memory-list">
            {memoryItems.map((item) => (
              <button
                key={item.id}
                className="memory-card"
                onClick={() => {
                  setSelectedMemory(item);
                  go("memory-detail", "walk");
                }}
              >
                <Pill>{item.type}</Pill>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </button>
            ))}
          </div>
          <div className="action-grid">
            <button onClick={() => go("autobiography", "walk")}><FileText size={16} /> Autobiography</button>
            <button><Download size={16} /> Export</button>
            <button onClick={() => go("recovery", "walk")}><LockKeyhole size={16} /> Recovery</button>
          </div>
        </Detail>
      )}

      {screen === "memory-detail" && (
        <Detail title="Memory Detail" eyebrow={selectedMemory.type} onBack={() => go("memory", "walk")}>
          <article className="quiet-panel">
            <h2>{selectedMemory.title}</h2>
            <p>{selectedMemory.body}</p>
            <span>{selectedMemory.source}</span>
          </article>
          <div className="action-grid">
            <button><Edit3 size={16} /> Edit</button>
            <button><Trash2 size={16} /> Forget</button>
          </div>
        </Detail>
      )}

      {screen === "autobiography" && (
        <Detail title="Autobiography" eyebrow="Preview" onBack={() => go("walk", "walk")}>
          <article className="quiet-panel">
            <Pill tone="olive">Day 90 preview</Pill>
            <h2>The story Sayved is learning with you</h2>
            <p>You are becoming someone who pauses before panic, asks for wisdom before speed, and returns to prayer when pressure tries to become your identity.</p>
          </article>
        </Detail>
      )}

      {screen === "echo" && (
        <Detail title="Echo Capture" eyebrow="Sunday sermon" onBack={() => go("walk", "walk")}>
          <article className="capture-card">
            <Mic size={30} />
            <h2>Face-down capture</h2>
            <p>Audio stays local for MVP unless explicit consent and legal church context exist.</p>
            <button className="primary-button"><Pause size={16} /> End Capture</button>
          </article>
          <button className="secondary-button" onClick={() => go("rhythm", "walk")}>Open Seven-Day Rhythm</button>
        </Detail>
      )}

      {screen === "rhythm" && (
        <Detail title="Echo Rhythm" eyebrow="Monday to Saturday" onBack={() => go("walk", "walk")}>
          {["Monday anchor verse", "Tuesday memory thread", "Wednesday practice", "Thursday deeper reflection", "Friday examen", "Saturday preparation"].map((day) => (
            <div className="list-row" key={day}><Check size={16} /><span>{day}</span></div>
          ))}
        </Detail>
      )}

      {screen === "settings" && (
        <Detail title="Settings / Legal" eyebrow="Privacy controls" onBack={() => go("walk", "walk")}>
          {["Account", "Preferred teacher", "Notification rhythm", "Privacy controls", "Export data", "Delete data", "AI disclosure", "Terms and Privacy Policy", "Takedown / teacher objection policy", "About Sayved"].map((item) => (
            <div className="list-row" key={item}><Settings size={16} /><span>{item}</span></div>
          ))}
        </Detail>
      )}

      {screen === "bible" && (
        <Detail title="Bible Reader" eyebrow="Search" onBack={() => go("walk", "walk")}>
          <div className="search-box"><Search size={17} /><span>Search Scripture</span></div>
          <InfoBlock icon={<BookOpen size={17} />} title="Psalm 119:105" text={scripture.text} />
        </Detail>
      )}

      {screen === "recovery" && (
        <Detail title="Recovery Contact" eyebrow="Memory recovery" onBack={() => go("memory", "walk")}>
          <InfoBlock icon={<LockKeyhole size={17} />} title="Two-person recovery" text="A trusted human can hold recovery access without seeing your Memory." />
          <button className="primary-button">Add Contact</button>
        </Detail>
      )}

      {screen === "dashboard" && (
        <Detail title="Pastor Dashboard" eyebrow="Preview" onBack={() => go("walk", "walk")}>
          <InfoBlock icon={<Radio size={17} />} title="Echo for churches" text="Future church dashboard for sermon capture, rhythm prompts, and congregation-safe insights." />
        </Detail>
      )}
    </Shell>
  );
}

function Shell({ children, hideNav = false, activeTab = "talk", onTab = () => {} }) {
  return (
    <div className="app-container">
      <main className="phone-viewport">
        <div className="ambient-photo" />
        <div className="screen-wrapper">{children}</div>
        {!hideNav && (
          <nav className="bottom-nav" aria-label="Primary">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => onTab(item.id)}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </main>
    </div>
  );
}

function Detail({ title, eyebrow, onBack, children }) {
  return (
    <section className="screen-content">
      <TopBar title={title} eyebrow={eyebrow} onBack={onBack} />
      {children}
    </section>
  );
}

function Composer({ value, onChange, onSend }) {
  return (
    <div className="composer">
      <IconButton label="Voice">
        <Mic size={18} />
      </IconButton>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Tell Sayved what is on your heart..." />
      <IconButton label="Send" onClick={onSend} tone="send">
        <Send size={18} />
      </IconButton>
    </div>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <span>{action}</span>}
    </div>
  );
}

function InfoBlock({ icon, title, text }) {
  return (
    <article className="info-block">
      <div>{icon}</div>
      <section>
        <h3>{title}</h3>
        <p>{text}</p>
      </section>
    </article>
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

function WellItem({ icon, title, text, onClick }) {
  return (
    <button className="well-item" onClick={onClick}>
      <div>{icon}</div>
      <section>
        <h3>{title}</h3>
        <p>{text}</p>
      </section>
    </button>
  );
}

function routeFromMap(item, go) {
  const routes = {
    "Onboarding / Privacy Promise": "talk",
    "Talk / Director Conversation": "talk",
    "Source Switcher / Composer": "talk",
    "Scripture / References": "scripture",
    "Teacher Discovery": "follow",
    "Teacher Profile": "teacher",
    "Official Source Player": "source",
    "The Well": "well",
    "Today's Devotion": "devotion",
    "Memory / My Walk": "memory",
    "Memory Detail / Edit / Forget": "memory-detail",
    "Crisis Hand-Off": "crisis",
    "Settings / Legal": "settings",
    "Council Builder": "council",
    "Council Session": "council-session",
    "Echo Sermon Capture": "echo",
    "Echo Seven-Day Rhythm": "rhythm",
    "Spiritual Autobiography Preview": "autobiography",
    "Teacher Request Confirmation": "request",
    "Compare Teachings": "compare",
    "Disputation": "disputation",
    "Bible Reader / Search": "bible",
    "Recovery Contact Setup": "recovery",
    "Pastor Dashboard Preview": "dashboard",
  };
  const next = routes[item] || "walk";
  const tab = ["follow", "teacher", "source", "request", "council"].includes(next) ? "follow" : ["talk", "scripture", "crisis", "compare", "disputation", "council-session"].includes(next) ? "talk" : "walk";
  go(next, tab);
}

export default App;
