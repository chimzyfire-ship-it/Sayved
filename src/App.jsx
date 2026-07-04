import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Settings, 
  Sparkles, 
  Send, 
  Mic, 
  Plus, 
  BookOpen, 
  User, 
  Home, 
  MessageSquare, 
  Bookmark, 
  Copy, 
  Share2, 
  ChevronDown, 
  MoreHorizontal, 
  Volume2, 
  RefreshCw, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  Check,
  Heart,
  ExternalLink
} from 'lucide-react';
import { pastors } from './pastors';

// Mock Suggestions
const SUGGESTION_POOL = [
  "Strength for today",
  "Overcoming fear",
  "Purpose in life",
  "Help me pray",
  "Wisdom for work",
  "Finding peace",
  "Healing from pain",
  "Anxiety about the future",
  "Building relationships"
];

// Mock Scripture database
const SCRIPTURES = {
  "philippians_4_6_7": {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    explanation: "This passage teaches that anxiety is replaced by God's supernatural peace when we surrender our worries through prayer with a thankful heart. Pastor Poju emphasizes that thanksgiving is the ultimate proof of faith.",
    sermon: "Walking Through Anxiety",
    timestamp: "45:12"
  },
  "2_timothy_1_7": {
    reference: "2 Timothy 1:7",
    text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    explanation: "Fear does not originate from God. This verse grounds our identity in the spiritual authority (power), connection (love), and mental clarity (sound mind) that God provides. Pastor Mike highlights this as a vital weapon in spiritual renewal.",
    sermon: "Victory in Your Mind",
    timestamp: "22:08"
  },
  "jeremiah_29_11": {
    reference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    explanation: "Even in moments of exile or confusion, God's intentions are benevolent. He is actively planning our restoration. Pastor Ita teaches that wisdom lies in aligning our expectations with God's ultimate plan.",
    sermon: "Patience in the Middle",
    timestamp: "33:15"
  },
  "mark_4_39": {
    reference: "Mark 4:39",
    text: "He got up, rebuked the wind and said to the waves, 'Quiet! Be still!' Then the wind died down and it was completely calm.",
    explanation: "Jesus has absolute authority over the storms of life. Tapping into His calm allows us to experience quiet in the midst of turmoil. Pastor Poju often references this as the power of spoken word and inner rest.",
    sermon: "Peace in the Storm",
    timestamp: "18:40"
  },
  "proverbs_4_23": {
    reference: "Proverbs 4:23",
    text: "Above all else, guard your heart, for everything you do flows from it.",
    explanation: "Our inner life—our thoughts, motives, and desires—shapes the entire course of our lives. Guarding our heart means standing watch over what we allow to take root in our minds. General faith-based teachings focus heavily on this foundational wisdom.",
    sermon: "Guarding Your Heart (General Wisdom)",
    timestamp: "15:30"
  },
  "romans_8_28": {
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    explanation: "This scripture provides absolute assurance that no event, trial, or season is outside God's redeeming power. He orchestrates all details of our journey for our ultimate spiritual growth and good.",
    sermon: "All Things Working Together",
    timestamp: "28:45"
  }
};

// Mock Devotion Content
const DEVOTION = {
  title: "Tending the Soil of the Heart",
  readingTime: "3 min read",
  scriptureRef: "Luke 8:15",
  scriptureText: "But the seed on good soil stands for those with a noble and good heart, who hear the word, retain it, and by persevering produce a crop.",
  reflection: "In the busyness of modern life, the soil of our hearts easily becomes hard, shallow, or choked with thorns. The daily worries, noise of social media, and pursuits of material security can distract us from our true spiritual anchor. To grow, we must cultivate quietness. We must hear the Word, allow it to settle deep within, and protect it from daily distractions. Growth is not immediate; it requires patience, rest, and consistency. When we take five minutes daily to seek Him, we prepare the soil of our lives to yield abundance.",
  prayer: "Lord, soften the soil of my heart today. Help me clear away the weeds of worry and the rocks of pride. Grant me the grace to sit in stillness, to hear Your voice, and to carry Your peace into every interaction. Strengthen my patience as You work beneath the surface. In Jesus' name, Amen."
};

// Mock Initial Chat Message
const INITIAL_MESSAGES = [
  {
    id: "initial-assistant",
    sender: "assistant",
    text: "Hello! How can I help you grow in faith and walk closer with God today? Feel free to ask me anything about scripture, prayer, or topics on your heart.",
    time: "9:40 AM"
  }
];

export default function App() {
  const [activeView, setActiveView] = useState("auth"); // auth, home, new-chat, chat, devotion, scripture, profile, chats-list
  const [selectedPastor, setSelectedPastor] = useState(null);
  const [promptText, setPromptText] = useState("");
  const [suggestions, setSuggestions] = useState(SUGGESTION_POOL.slice(0, 3));
  const [threads, setThreads] = useState([
    {
      id: "thread-1",
      title: "Dealing with Anxiety",
      pastorId: "poju",
      date: "2h ago",
      messages: [
        { id: "m1", sender: "user", text: "How do I handle fear and anxiety about the future?", time: "10:12 AM" },
        { 
          id: "m2", 
          sender: "assistant", 
          text: "God is not the author of fear, but of peace and a sound mind (2 Timothy 1:7). When you feel anxious, bring your worries to Him in prayer, and He will give you His peace that surpasses all understanding (Philippians 4:6-7). Trust that He has good plans for you, plans to prosper you and not to harm you, plans to give you hope and a future (Jeremiah 29:11). Faith is acting in confidence that God's plans are already established.", 
          time: "10:13 AM",
          scriptures: ["philippians_4_6_7", "2_timothy_1_7", "jeremiah_29_11"],
          sermonUrl: "https://www.youtube.com/watch?v=1oW_W1W86Qk"
        }
      ]
    },
    {
      id: "thread-2",
      title: "Patience and Growth",
      pastorId: "ita",
      date: "Yesterday",
      messages: [
        { id: "m3", sender: "user", text: "Why does it take so long for prayers to be answered?", time: "Yesterday" },
        { 
          id: "m4", 
          sender: "assistant", 
          text: "In the face of difficulty, we must anchor ourselves in divine wisdom. Luke 8:15 teaches us that a noble and good heart retains the Word and produces a harvest through perseverance. When your path seems uncertain, take shelter in His promises (Jeremiah 29:11). Ground your daily decisions in scripture, clear away the thorns of distractions, and let your soul rest in the knowledge that God's plans are designed to guide you securely.", 
          time: "Yesterday",
          scriptures: ["jeremiah_29_11", "mark_4_39"],
          sermonUrl: "https://www.youtube.com/watch?v=3g8K1U1y0bA"
        }
      ]
    },
    {
      id: "thread-3",
      title: "Guarding My Mind",
      pastorId: null, // General guidance
      date: "Jun 30",
      messages: [
        { id: "m5", sender: "user", text: "How can I protect my peace and mind during busy times?", time: "Jun 30" },
        { 
          id: "m6", 
          sender: "assistant", 
          text: "Based on general faith-based teachings, in times of difficulty or uncertainty, we are reminded to guard our hearts with diligence, for everything we do flows from it (Proverbs 4:23). When anxiety rises, we can rest in the promise that all things work together for the good of those who love God and are called according to His purpose (Romans 8:28). True strength is found in quietness and confidence, allowing His peace to anchor your soul in every storm.", 
          time: "Jun 30",
          scriptures: ["proverbs_4_23", "romans_8_28"],
          video: {
            title: "Finding Peace in Turbulent Times (General Teaching)",
            url: "https://www.youtube.com/watch?v=1oW_W1W86Qk",
            duration: "12:40"
          }
        }
      ]
    }
  ]);
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStateIndex, setTypingStateIndex] = useState(0);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [savedConversations, setSavedConversations] = useState([
    { id: "saved-1", title: "Dealing with Anxiety", pastorName: "Pastor Poju", date: "Jul 2, 2026" },
    { id: "saved-2", title: "Patience and Growth", pastorName: "Pastor Ita", date: "Jun 28, 2026" }
  ]);
  const [selectedScripture, setSelectedScripture] = useState(SCRIPTURES.philippians_4_6_7);
  const [savedMsgIds, setSavedMsgIds] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef(null);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const chatMessages = activeThread ? activeThread.messages : [];
  const activePastor = activeThread ? pastors.find(p => p.id === activeThread.pastorId) : null;

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Lock document-level scrolling & prevent viewport overscroll on iOS
  useEffect(() => {
    const handleTouchMove = (e) => {
      // Find the currently active scroll container
      const scrollable = document.querySelector('.screen-content');
      if (scrollable) {
        // If touch gesture is outside the scrollable content, block it
        if (!scrollable.contains(e.target)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      } else {
        // Block all if there is no scrollable area
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Handle suggest chip shuffle
  const handleShuffleSuggestions = () => {
    const shuffled = [...SUGGESTION_POOL].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  // Mock Voice Recording simulation
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setPromptText("Help me find peace and strength in the face of sudden life changes and worry.");
    } else {
      setIsRecording(true);
      setPromptText("Listening...");
      setTimeout(() => {
        setIsRecording(false);
        setPromptText("Help me find peace and strength in the face of sudden life changes and worry.");
      }, 3000);
    }
  };

  // Run AI Response simulator
  const handleSendPrompt = (textToSend) => {
    const queryText = textToSend || promptText;
    if (!queryText.trim() || queryText === "Listening...") return;

    // Tapping send clears prompt input
    setPromptText("");

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let targetThreadId = activeThreadId;

    if (activeView === "new-chat") {
      // Create a new thread dynamically
      targetThreadId = `thread-${Date.now()}`;
      const newThread = {
        id: targetThreadId,
        title: queryText.length > 25 ? queryText.substring(0, 25) + "..." : queryText,
        pastorId: selectedPastor ? selectedPastor.id : null,
        date: "Just now",
        messages: [userMessage]
      };
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(targetThreadId);
      setActiveView("chat");
    } else {
      // Append to existing thread
      setThreads(prev => prev.map(t => {
        if (t.id === targetThreadId) {
          return {
            ...t,
            date: "Just now",
            messages: [...t.messages, userMessage]
          };
        }
        return t;
      }));
    }

    setIsTyping(true);
    setTypingStateIndex(0);

    const currentPastor = activeView === "new-chat" ? selectedPastor : (activeThread ? pastors.find(p => p.id === activeThread.pastorId) : null);

    // Dynamic loading messages
    const loadingStates = currentPastor
      ? [
          `Searching ${currentPastor.name}'s teachings...`,
          "Grounding answer in Scripture...",
          "Preparing scriptural response..."
        ]
      : [
          "Searching general faith-based teachings...",
          "Grounding in Scriptures...",
          "Preparing general guidance..."
        ];

    const stateTimer = setInterval(() => {
      setTypingStateIndex(prev => {
        if (prev < loadingStates.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stateTimer);
          return prev;
        }
      });
    }, 900);

    // Simulate AI response generation
    setTimeout(() => {
      clearInterval(stateTimer);
      setIsTyping(false);

      let responseText = "";
      let scriptureChips = [];
      let videoReference = null;
      let sermonLink = null;

      // Grounding logic depending on selected pastor
      if (currentPastor) {
        if (currentPastor.id === "poju") {
          responseText = "God is not the author of fear, but of peace and a sound mind (2 Timothy 1:7). When you feel anxious, bring your worries to Him in prayer, and He will give you His peace that surpasses all understanding (Philippians 4:6-7). Trust that He has good plans for you, plans to prosper you and not to harm you, plans to give you hope and a future (Jeremiah 29:11). Faith is acting in confidence that God's plans are already established.";
          scriptureChips = ["philippians_4_6_7", "2_timothy_1_7", "jeremiah_29_11"];
          sermonLink = "https://www.youtube.com/watch?v=1oW_W1W86Qk";
        } else if (currentPastor.id === "ita") {
          responseText = "In the face of difficulty, we must anchor ourselves in divine wisdom. Luke 8:15 teaches us that a noble and good heart retains the Word and produces a harvest through perseverance. When your path seems uncertain, take shelter in His promises (Jeremiah 29:11). Ground your daily decisions in scripture, clear away the thorns of distractions, and let your soul rest in the knowledge that God's plans are designed to guide you securely.";
          scriptureChips = ["jeremiah_29_11", "mark_4_39"];
          sermonLink = "https://www.youtube.com/watch?v=3g8K1U1y0bA";
        } else {
          responseText = "Fear and adversity can feel overwhelming, but God's promise is clear: He has given us a spirit of power, love, and self-discipline, not of fear (2 Timothy 1:7). Let us remind ourselves of His power to calm every storm (Mark 4:39). Have courage! When you stand firm and declare His victory, He will strengthen you and give you a future filled with hope. Lean into prayer and let His strength flow through your family.";
          scriptureChips = ["2_timothy_1_7", "mark_4_39", "jeremiah_29_11"];
          sermonLink = "https://www.youtube.com/watch?v=Fq1vj1k7x-0";
        }
      } else {
        // General teachings
        responseText = "Based on general faith-based teachings, in times of difficulty or uncertainty, we are reminded to guard our hearts with diligence, for everything we do flows from it (Proverbs 4:23). When anxiety rises, we can rest in the promise that all things work together for the good of those who love God and are called according to His purpose (Romans 8:28). True strength is found in quietness and confidence, allowing His peace to anchor your soul in every storm.";
        scriptureChips = ["proverbs_4_23", "romans_8_28"];
        videoReference = {
          title: "Finding Peace in Turbulent Times (General Teaching)",
          url: "https://www.youtube.com/watch?v=1oW_W1W86Qk",
          duration: "12:40"
        };
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scriptures: scriptureChips,
        video: videoReference,
        sermonUrl: sermonLink
      };

      setThreads(prev => prev.map(t => {
        if (t.id === targetThreadId) {
          return {
            ...t,
            messages: [...t.messages, assistantMessage]
          };
        }
        return t;
      }));
    }, 3200);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard!");
  };

  const handleSaveMessage = (msgId) => {
    setSavedMsgIds(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) {
        next.delete(msgId);
      } else {
        next.add(msgId);
      }
      return next;
    });
  };

  const handleOpenScripture = (key) => {
    if (SCRIPTURES[key]) {
      setSelectedScripture(SCRIPTURES[key]);
      setActiveView("scripture");
    }
  };

  // Background asset based on view state for visual variety & cohesion
  const getBackgroundImage = () => {
    switch (activeView) {
      case "auth":
        return "/assets/bg_auth.jpg";
      case "home":
        return "/assets/sayved_main_background.jpg";
      case "new-chat":
        return "/assets/bg_new_chat.jpg";
      case "chat":
        return "/assets/bg_new_chat.jpg";
      default:
        return "/assets/bg_auth.jpg";
    }
  };

  const activeBg = getBackgroundImage();

  return (
    <div className="app-container">
      <div className="phone-viewport">
        {/* Dynamic Background */}
        <div 
          className="screen-bg" 
          style={{ backgroundImage: `url(${activeBg})` }}
        />
        <div className="screen-bg-overlay" />

        {/* Viewport Screen Content */}
        <div className="screen-wrapper">
          
          {/* ================= AUTH VIEW ================= */}
          {activeView === "auth" && (
            <div className="screen-content screen-elements" style={{ justifyContent: 'center', paddingBottom: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                {/* Stylized Gold Cross Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V22" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M5 9H19" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M12 5L15 9H9L12 5Z" fill="#B79A73"/>
                    <path d="M12 19L15 15H9L12 19Z" fill="#B79A73"/>
                    <path d="M5 9L9 6V12L5 9Z" fill="#B79A73"/>
                    <path d="M19 9L15 6V12L19 9Z" fill="#B79A73"/>
                  </svg>
                </div>
                
                <h1 className="brand-logo serif-display" style={{ fontSize: 38, marginBottom: 4 }}>Sayved</h1>
                <p style={{ 
                  fontFamily: 'var(--font-sans)', 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: 'var(--color-accent-taupe)', 
                  letterSpacing: 2, 
                  textTransform: 'uppercase',
                  marginBottom: 24
                }}>Faith. Answered.</p>

                <p style={{ 
                  fontSize: 15, 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.5,
                  maxWidth: '280px',
                  margin: '0 auto'
                }}>
                  Grow in faith. Get answers grounded in God's Word and trusted pastors.
                </p>
              </div>

              {/* Login Options */}
              <div style={{ width: '100%', padding: '0 8px' }}>
                <button className="auth-btn" onClick={() => setActiveView("home")}>
                  <span className="auth-btn-icon" style={{ color: 'var(--color-accent-taupe)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  Continue with Email
                </button>

                <button className="auth-btn" onClick={() => setActiveView("home")}>
                  <span className="auth-btn-icon" style={{ color: '#000' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.73-1.16 1.87-1.01 2.98.66.05 1.83-.56 2.94-1.43z"/></svg>
                  </span>
                  Continue with Apple
                </button>

                <button className="auth-btn" onClick={() => setActiveView("home")}>
                  <span className="auth-btn-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#EA4335' }}><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.207 4.114-3.515 0-6.375-2.859-6.375-6.375s2.859-6.375 6.375-6.375c1.558 0 2.977.564 4.08 1.492l3.056-3.056C18.895 2.128 15.753 1.2 12.24 1.2 6.273 1.2 1.44 6.033 1.44 12s4.833 10.8 10.8 10.8c5.787 0 10.457-4.74 10.457-10.8 0-.727-.082-1.255-.164-1.714H12.24z"/></svg>
                  </span>
                  Continue with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--color-text-muted)' }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border-soft)' }} />
                  <span style={{ padding: '0 12px', fontSize: 13, fontWeight: 500 }}>or</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border-soft)' }} />
                </div>

                <button className="auth-btn auth-btn-phone" onClick={() => setActiveView("home")}>
                  <span className="auth-btn-icon" style={{ color: 'var(--color-accent-taupe-dark)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  </span>
                  Continue with Phone
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Already have an account? <span onClick={() => setActiveView("home")} style={{ color: 'var(--color-accent-taupe-dark)', fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
              </div>
            </div>
          )}

          {/* ================= HOME VIEW ================= */}
          {activeView === "home" && (
            <div className="screen-content screen-elements">
              {/* Header branding */}
              <div className="header-row">
                <div className="brand-row">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V22" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M5 9H19" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  <span className="brand-logo serif-display">Sayved</span>
                </div>
                <button className="header-btn" onClick={() => setActiveView("profile")}>
                  <User size={18} />
                </button>
              </div>

              {/* Hero text */}
              <div style={{ marginTop: 24, marginBottom: 28 }}>
                <h2 className="serif-display" style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.05, color: 'var(--color-text-primary)' }}>Faith.</h2>
                <h2 className="serif-display" style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.05, color: 'var(--color-text-primary)' }}>Answered.</h2>
                <p style={{ 
                  fontSize: 14.5, 
                  lineHeight: 1.5, 
                  color: 'var(--color-text-secondary)', 
                  marginTop: 14,
                  maxWidth: '320px'
                }}>
                  Ask, reflect, grow. Get faith-filled answers grounded in Scripture and the wisdom of trusted pastors.
                </p>
              </div>

              {/* Search composer trigger */}
              <div 
                className="composer-input-wrapper" 
                style={{ height: 56, marginBottom: 32, cursor: 'pointer' }}
                onClick={() => setActiveView("new-chat")}
              >
                <div className="composer-input-sparkle">
                  <Sparkles size={18} />
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 15, flex: 1 }}>
                  Ask anything about faith...
                </div>
                <div className="composer-send-btn" style={{ width: 40, height: 40 }}>
                  <Send size={15} />
                </div>
              </div>

              {/* Pastor Carousel */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 }}>
                <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600 }}>Select Teacher</h3>
                <span onClick={() => setActiveView("new-chat")} style={{ fontSize: 13, color: 'var(--color-accent-taupe-dark)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
                  Compare teachers &gt;
                </span>
              </div>

              <div className="pastor-cards-container">
                {pastors.map(pastor => (
                  <div 
                    key={pastor.id} 
                    className={`pastor-card ${selectedPastor?.id === pastor.id ? 'pastor-card-selected' : ''}`}
                    onClick={() => {
                      const next = selectedPastor?.id === pastor.id ? null : pastor;
                      setSelectedPastor(next);
                      if (next) {
                        setActiveView("new-chat");
                      }
                    }}
                    style={{ paddingBottom: 16 }}
                  >
                    <div className="pastor-avatar-wrapper">
                      <img src={pastor.image} alt={pastor.name} className="pastor-avatar" />
                      {selectedPastor?.id === pastor.id && (
                        <div className="pastor-badge">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="pastor-name">{pastor.name}</div>
                  </div>
                ))}
              </div>

              {/* Daily devotion card preview */}
              <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginTop: 12, marginBottom: 8 }}>Today's reflection</h3>
              <div className="devotion-card" onClick={() => setActiveView("devotion")}>
                <div className="devotion-left">
                  <div className="devotion-tag">Today's Devotion</div>
                  <h4 className="devotion-title serif-display" style={{ margin: '4px 0' }}>{DEVOTION.title}</h4>
                  <p className="devotion-subtitle">{DEVOTION.readingTime} • Click to read</p>
                </div>
                <div className="devotion-right" style={{ backgroundImage: "url('/assets/devotion_preview.jpg')" }} />
              </div>
            </div>
          )}

          {/* ================= NEW CONVERSATION VIEW ================= */}
          {activeView === "new-chat" && (
            <div className="screen-content screen-elements">
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("home")}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className="header-title">New Conversation</h3>
                <button className="header-btn">
                  <Settings size={18} />
                </button>
              </div>

              {/* Central banner emblem */}
              <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V22" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M5 9H19" stroke="#B79A73" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                  How can we pray for you today?
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.4 }}>
                  Ask anything about faith, life, scripture, or something on your heart.
                </p>
              </div>

              {/* Choose Pastor section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>Select Teacher</span>
                <span style={{ fontSize: 13, color: 'var(--color-accent-taupe-dark)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
                  Compare teachers &gt;
                </span>
              </div>

              <div className="pastor-cards-container">
                {pastors.map(pastor => (
                  <div 
                    key={pastor.id} 
                    className={`pastor-card ${selectedPastor?.id === pastor.id ? 'pastor-card-selected' : ''}`}
                    onClick={() => setSelectedPastor(selectedPastor?.id === pastor.id ? null : pastor)}
                    style={{ paddingBottom: 16 }}
                  >
                    <div className="pastor-avatar-wrapper">
                      <img src={pastor.image} alt={pastor.name} className="pastor-avatar" />
                      {selectedPastor?.id === pastor.id && (
                        <div className="pastor-badge">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="pastor-name">{pastor.name}</div>
                  </div>
                ))}
              </div>

              {/* TextInput / Suggestion box */}
              <div 
                className="composer-input-wrapper" 
                style={{ 
                  height: 64, 
                  marginBottom: 16, 
                  marginTop: 12,
                  boxShadow: '0 4px 16px var(--color-shadow-warm)'
                }}
              >
                <input 
                  type="text" 
                  className="composer-input"
                  placeholder="Ask your question..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendPrompt(); }}
                />
                <button className={`composer-mic-btn ${isRecording ? 'recording-pulse' : ''}`} onClick={handleToggleVoice}>
                  <Mic size={20} />
                </button>
              </div>

              {/* Suggestion tags */}
              <div className="chips-container">
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="chip" onClick={() => setPromptText(sug)}>
                    {sug}
                  </div>
                ))}
                <button className="chip-refresh-btn" onClick={handleShuffleSuggestions}>
                  <RefreshCw size={15} style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>

              {/* CTA Action Bar */}
              {selectedPastor && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
                  <button className="composer-btn" style={{ width: 50, height: 50, flexShrink: 0 }}>
                    <ImageIcon size={18} />
                  </button>
                  <button 
                    className="composer-input-wrapper" 
                    style={{ 
                      height: 50, 
                      backgroundColor: 'var(--color-bg-warm)', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      border: 'none',
                      fontWeight: 600,
                      color: 'var(--color-accent-taupe-dark)'
                    }}
                    onClick={() => handleSendPrompt()}
                  >
                    Ask Teacher {selectedPastor.name.replace("Pastor ", "")}
                    <div className="composer-send-btn" style={{ width: 34, height: 34, marginLeft: 16 }}>
                      <Send size={13} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= AI CONVERSATION VIEW ================= */}
          {activeView === "chat" && (
            <div className="screen-content screen-elements" style={{ paddingBottom: 160 }}>
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("chats-list")}>
                  <ChevronLeft size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  {activePastor ? (
                    <>
                      <img src={activePastor.image} alt={activePastor.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                      <span className="serif-display" style={{ fontSize: 16, fontWeight: 600 }}>{activePastor.name}</span>
                    </>
                  ) : (
                    <>
                      <div style={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-accent-taupe)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          <path d="M5 9H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span className="serif-display" style={{ fontSize: 16, fontWeight: 600 }}>General Guidance</span>
                    </>
                  )}
                  <ChevronDown size={14} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <button className="header-btn">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Chat Thread */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginTop: 12 }}>
                
                {/* Assistant intro header */}
                <div style={{ textAlign: 'center', margin: '16px 0 28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    {activePastor ? (
                      <img src={activePastor.image} alt={activePastor.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border-soft)', boxShadow: '0 4px 12px var(--color-shadow-warm)' }} />
                    ) : (
                      <div style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-accent-taupe)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px var(--color-shadow-warm)'
                      }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M5 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="serif-display" style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                    {activePastor ? activePastor.name : "General Guidance"}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-taupe-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {activePastor ? activePastor.ministry : "Sayved Spiritual Engine"}
                  </p>
                </div>

                {/* Log messages */}
                {chatMessages.map((msg, index) => {
                  if (msg.sender === "user") {
                    return (
                      <div key={msg.id} className="chat-bubble-user">
                        <div className="chat-bubble-user-text">{msg.text}</div>
                        <div className="chat-bubble-time" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                          {msg.time} <Check size={12} style={{ color: 'var(--color-accent-taupe)' }} />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={msg.id} className="chat-bubble-assistant-row">
                        {activePastor ? (
                          <img src={activePastor.image} alt={activePastor.name} className="chat-bubble-assistant-avatar" />
                        ) : (
                          <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--color-accent-taupe)', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            color: 'white',
                            marginRight: 8,
                            flexShrink: 0
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                              <path d="M5 9H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                        <div className="chat-bubble-assistant-card">
                          <div className="chat-bubble-assistant-text">{msg.text}</div>
                                                {msg.scriptures && msg.scriptures.length > 0 && (
                            <>
                              <div className="chat-references-divider" />
                              <div className="chat-references-header" style={{ marginBottom: 4 }}>
                                Scripture References:
                              </div>
                              <div className="chat-references-list" style={{ gap: '4px 12px', marginBottom: 12 }}>
                                {msg.scriptures.map(scriptureKey => (
                                  <span 
                                    key={scriptureKey} 
                                    className="scripture-text-link"
                                    onClick={() => handleOpenScripture(scriptureKey)}
                                  >
                                    {SCRIPTURES[scriptureKey]?.reference || scriptureKey}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}

                          {msg.sermonUrl && (
                            <div style={{ marginTop: 8, marginBottom: 12 }}>
                              <a 
                                href={msg.sermonUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 12,
                                  color: 'var(--color-accent-taupe-dark)',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontWeight: 600,
                                  borderBottom: '1px solid var(--color-accent-taupe-dark)',
                                  paddingBottom: 2
                                }}
                              >
                                <ExternalLink size={12} />
                                Watch full teaching by {activePastor ? activePastor.name : "Teacher"} ↗
                              </a>
                            </div>
                          )}

                          {msg.video && (
                            <div style={{
                              backgroundColor: 'var(--color-surface-cream)',
                              border: '1px solid var(--color-border-soft)',
                              borderRadius: 16,
                              padding: 12,
                              marginTop: 14,
                              marginBottom: 14,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px var(--color-shadow-warm)'
                            }}
                            onClick={() => window.open(msg.video.url, '_blank')}
                            >
                              <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent-taupe)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexShrink: 0
                              }}>
                                <Play size={15} fill="currentColor" style={{ marginLeft: 2 }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-taupe-dark)', marginBottom: 2 }}>
                                  Recommended Teaching
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {msg.video.title}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                                  Video teaching • {msg.video.duration}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Action panel */}
                          <div className="chat-actions-row">
                            <div className="chat-actions">
                              <button className="chat-action-btn" onClick={() => handleCopyMessage(msg.text)}>
                                <Copy size={15} />
                              </button>
                              <button className="chat-action-btn" onClick={() => handleSaveMessage(msg.id)}>
                                <Bookmark size={15} style={{ fill: savedMsgIds.has(msg.id) ? "var(--color-accent-taupe)" : "none", color: savedMsgIds.has(msg.id) ? "var(--color-accent-taupe)" : "currentColor" }} />
                              </button>
                              <button className="chat-action-btn">
                                <Share2 size={15} />
                              </button>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

                {/* Typing / Loading simulation */}
                {isTyping && (
                  <div className="chat-bubble-assistant-row">
                    {activePastor ? (
                      <img src={activePastor.image} alt={activePastor.name} className="chat-bubble-assistant-avatar" />
                    ) : (
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-accent-taupe)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        color: 'white',
                        marginRight: 8,
                        flexShrink: 0
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          <path d="M5 9H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    )}
                    <div className="chat-bubble-assistant-card" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="loader-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                          {activePastor ? (
                            <>
                              {typingStateIndex === 0 && `Searching ${activePastor.name}'s teachings...`}
                              {typingStateIndex === 1 && "Grounding answer in Scripture..."}
                              {typingStateIndex === 2 && "Preparing response..."}
                            </>
                          ) : (
                            <>
                              {typingStateIndex === 0 && "Searching general faith teachings..."}
                              {typingStateIndex === 1 && "Grounding in Scriptures..."}
                              {typingStateIndex === 2 && "Preparing general guidance..."}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TTS Playback card for the latest message */}
                {chatMessages.length > 1 && !isTyping && (
                  <div className="tts-player-card" onClick={() => setTtsPlaying(!ttsPlaying)}>
                    <div className="tts-left">
                      <div className="tts-icon-wrapper">
                        {ttsPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </div>
                      <div className="tts-text">
                        {ttsPlaying ? "Playing answer audio..." : "Listen to this answer"}
                      </div>
                    </div>
                    <div className="tts-right">
                      {ttsPlaying && (
                        <div className="tts-playing-animation">
                          <div className="tts-bar tts-bar-1"></div>
                          <div className="tts-bar tts-bar-2"></div>
                          <div className="tts-bar tts-bar-3"></div>
                        </div>
                      )}
                      <span>01:32</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Composer Input fixed in bottom layout */}
              <div className="chat-composer-container">
                <div className="chat-composer-row">
                  <button className="composer-btn">
                    <Plus size={18} />
                  </button>
                  <div className="composer-input-wrapper">
                    <input 
                      type="text" 
                      className="composer-input"
                      placeholder="Ask anything..."
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSendPrompt(); }}
                    />
                    <button className="composer-mic-btn" onClick={handleToggleVoice}>
                      <Mic size={18} />
                    </button>
                  </div>
                  <button className="composer-send-btn" onClick={() => handleSendPrompt()}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= CHATS LIST VIEW ================= */}
          {activeView === "chats-list" && (
            <div className="screen-content screen-elements" style={{ paddingBottom: 100 }}>
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("home")}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className="header-title">Conversations</h3>
                <button 
                  className="header-btn" 
                  onClick={() => {
                    setSelectedPastor(null);
                    setActiveView("new-chat");
                  }}
                  style={{ backgroundColor: 'var(--color-accent-taupe)', color: 'white', borderColor: 'var(--color-accent-taupe)' }}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Chat threads list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {threads.map(thread => {
                  const pastor = pastors.find(p => p.id === thread.pastorId);
                  const lastMessage = thread.messages[thread.messages.length - 1];

                  return (
                    <div 
                      key={thread.id}
                      className="thread-list-card"
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        setActiveView("chat");
                      }}
                      style={{
                        backgroundColor: 'var(--color-surface-white)',
                        borderRadius: 20,
                        border: '1px solid var(--color-border-soft)',
                        padding: 16,
                        display: 'flex',
                        gap: 12,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px var(--color-shadow-warm)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Avatar or General logo */}
                      <div style={{ flexShrink: 0 }}>
                        {pastor ? (
                          <img src={pastor.image} alt={pastor.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border-soft)' }} />
                        ) : (
                          <div style={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--color-accent-taupe)', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            color: 'white'
                          }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                              <path d="M5 9H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Thread details */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent-taupe-dark)' }}>
                            {pastor ? pastor.name : "General Guidance"}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{thread.date}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {thread.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lastMessage ? lastMessage.text : "No messages yet"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Start new conversation button at bottom */}
              <button 
                className="auth-btn auth-btn-phone" 
                onClick={() => {
                  setSelectedPastor(null);
                  setActiveView("new-chat");
                }}
                style={{ marginTop: 24, justifyContent: 'center', margin: '24px 0 0' }}
              >
                <Plus size={16} style={{ marginRight: 8 }} />
                New Conversation
              </button>
            </div>
          )}

          {/* ================= SCRIPTURE DETAILS VIEW ================= */}
          {activeView === "scripture" && (
            <div className="screen-content screen-elements">
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("chat")}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className="header-title">Scripture & Grounding</h3>
                <div style={{ width: 44 }} />
              </div>

              {/* Content body */}
              <div style={{ marginTop: 12 }}>
                <div className="reference-card">
                  <h4 className="serif-display" style={{ fontSize: 24, color: 'var(--color-accent-taupe-dark)', marginBottom: 14 }}>
                    {selectedScripture.reference}
                  </h4>
                  <p className="reference-text">
                    "{selectedScripture.text}"
                  </p>
                </div>

                <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Why this verse?</h3>
                <div style={{ 
                  backgroundColor: 'var(--color-surface-white)', 
                  border: '1px solid var(--color-border-soft)',
                  borderRadius: 20, 
                  padding: 20,
                  boxShadow: '0 4px 12px var(--color-shadow-warm)',
                  lineHeight: 1.6,
                  fontSize: 14.5,
                  color: 'var(--color-text-primary)',
                  marginBottom: 24
                }}>
                  {selectedScripture.explanation}
                </div>

                <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Related teachings</h3>
                <div style={{ 
                  backgroundColor: 'var(--color-surface-cream)', 
                  border: '1px solid var(--color-accent-taupe)',
                  borderRadius: 20, 
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-taupe-dark)', marginBottom: 2 }}>
                      Grounded Sermon
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      "{selectedScripture.sermon}"
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      Timestamp: {selectedScripture.timestamp} • {selectedPastor ? selectedPastor.name : "General Guidance"}
                    </div>
                  </div>
                  <button 
                    className="header-btn" 
                    style={{ 
                      flexShrink: 0, 
                      backgroundColor: 'var(--color-accent-taupe)', 
                      borderColor: 'var(--color-accent-taupe)',
                      color: 'white' 
                    }}
                    onClick={() => alert("Simulating launching sermon video playback...")}
                  >
                    <Play size={15} style={{ fill: 'currentColor', marginLeft: 2 }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TODAY'S DEVOTION VIEW ================= */}
          {activeView === "devotion" && (
            <div className="screen-content screen-elements">
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("home")}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className="header-title">Today's Devotion</h3>
                <button className="header-btn" style={{ color: 'var(--color-accent-taupe)' }}>
                  <Heart size={18} style={{ fill: 'currentColor' }} />
                </button>
              </div>

              {/* Devotional Content */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-taupe-dark)', marginBottom: 4 }}>
                  Good Morning
                </div>
                <h2 className="serif-display" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.15, marginBottom: 12 }}>
                  {DEVOTION.title}
                </h2>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                  {DEVOTION.readingTime} read • Scripture Reference: <span onClick={() => handleOpenScripture("mark_4_39")} style={{ color: 'var(--color-accent-taupe-dark)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>{DEVOTION.scriptureRef}</span>
                </div>

                <div 
                  style={{ 
                    height: 180, 
                    borderRadius: 24, 
                    backgroundImage: "url('/assets/devotion_preview.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    marginBottom: 24,
                    boxShadow: '0 4px 16px var(--color-shadow-warm)'
                  }} 
                />

                <div className="devotion-verse-card">
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', lineHeight: 1.5, color: 'var(--color-text-primary)' }}>
                    "{DEVOTION.scriptureText}"
                  </p>
                </div>

                <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Reflection</h3>
                <p className="devotion-text-block">{DEVOTION.reflection}</p>

                <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>Prayer</h3>
                <p className="devotion-text-block" style={{ fontStyle: 'italic', backgroundColor: 'var(--color-surface-cream)', padding: 18, borderRadius: 20, border: '1px solid var(--color-border-soft)' }}>
                  {DEVOTION.prayer}
                </p>

                <div style={{ display: 'flex', gap: 12, marginTop: 28, marginBottom: 20 }}>
                  <button className="auth-btn" style={{ flex: 1, justifyContent: 'center', margin: 0 }}>
                    <Share2 size={16} style={{ marginRight: 8 }} />
                    Share Devotion
                  </button>
                  <button className="auth-btn auth-btn-phone" style={{ flex: 1, justifyContent: 'center', margin: 0 }}>
                    <Bookmark size={16} style={{ marginRight: 8 }} />
                    Save to Journal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PROFILE VIEW ================= */}
          {activeView === "profile" && (
            <div className="screen-content screen-elements">
              {/* Header row */}
              <div className="header-row">
                <button className="header-btn" onClick={() => setActiveView("home")}>
                  <ChevronLeft size={20} />
                </button>
                <h3 className="header-title">Profile & Journal</h3>
                <div style={{ width: 44 }} />
              </div>

              {/* User overview */}
              <div style={{ textAlign: 'center', margin: '16px 0 28px' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-chip-beige)', 
                  margin: '0 auto 12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'var(--color-accent-taupe-dark)'
                }}>
                  <User size={36} />
                </div>
                <h3 className="serif-display" style={{ fontSize: 22, fontWeight: 600 }}>Faith Seeker</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Member since July 2026</p>
              </div>

              {/* Preferred Pastor */}
              <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Preferred Pastor</h3>
              <div style={{ 
                backgroundColor: 'var(--color-surface-white)', 
                borderRadius: 20, 
                border: '1px solid var(--color-border-soft)',
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px var(--color-shadow-warm)',
                marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {selectedPastor ? (
                    <>
                      <img src={selectedPastor.image} alt={selectedPastor.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedPastor.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{selectedPastor.specialty}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--color-accent-taupe)', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          <path d="M5 9H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>General Guidance</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Grounded in Multi-Teacher teachings</div>
                      </div>
                    </>
                  )}
                </div>
                <ChevronDown size={18} style={{ color: 'var(--color-text-secondary)', cursor: 'pointer' }} />
              </div>

              {/* Saved items list */}
              <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Saved Conversations</h3>
              <div style={{ marginBottom: 24 }}>
                {savedConversations.map(conv => (
                  <div 
                    key={conv.id}
                    style={{ 
                      backgroundColor: 'var(--color-surface-white)', 
                      borderRadius: 16, 
                      padding: 16,
                      border: '1px solid var(--color-border-soft)',
                      marginBottom: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const selected = pastors.find(p => p.name === conv.pastorName) || selectedPastor;
                      setSelectedPastor(selected);
                      setActiveView("chat");
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{conv.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{conv.pastorName} • {conv.date}</div>
                    </div>
                    <ChevronLeft size={16} style={{ color: 'var(--color-text-muted)', transform: 'rotate(180deg)' }} />
                  </div>
                ))}
              </div>

              {/* Settings list */}
              <h3 className="serif-display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>App Settings</h3>
              <div style={{ 
                backgroundColor: 'var(--color-surface-white)', 
                borderRadius: 20, 
                border: '1px solid var(--color-border-soft)', 
                padding: '8px 16px',
                marginBottom: 24
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border-soft)' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Daily Devotional Reminders</span>
                  <div style={{ width: 44, height: 24, backgroundColor: 'var(--color-accent-taupe)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: 2, cursor: 'pointer', justifyContent: 'flex-end' }}>
                    <div style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: '50%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Autoplay Scripture Audio</span>
                  <div style={{ width: 44, height: 24, backgroundColor: 'var(--color-border-soft)', borderRadius: 12, display: 'flex', alignItems: 'center', padding: 2, cursor: 'pointer', justifyContent: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </div>
                </div>
              </div>

              {/* Version */}
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                Sayved Sharp MVP v1.0.0<br />
                Grounded in Wisdom and Truth.
              </div>
            </div>
          )}

          {/* ================= BOTTOM TAB BAR ================= */}
          {activeView !== "auth" && activeView !== "scripture" && (
            <div className="tab-bar">
              <button 
                className={`tab-item ${activeView === "home" ? 'tab-item-active' : ''}`}
                onClick={() => setActiveView("home")}
              >
                <Home size={20} />
                <span className="tab-label">Home</span>
              </button>
              <button 
                className={`tab-item ${activeView === "new-chat" || activeView === "chat" || activeView === "chats-list" ? 'tab-item-active' : ''}`}
                onClick={() => setActiveView("chats-list")}
              >
                <MessageSquare size={20} />
                <span className="tab-label">Chats</span>
              </button>
              <button 
                className={`tab-item ${activeView === "devotion" ? 'tab-item-active' : ''}`}
                onClick={() => setActiveView("devotion")}
              >
                <BookOpen size={20} />
                <span className="tab-label">Devotions</span>
              </button>
              <button 
                className={`tab-item ${activeView === "profile" ? 'tab-item-active' : ''}`}
                onClick={() => setActiveView("profile")}
              >
                <User size={20} />
                <span className="tab-label">Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loader CSS style block */}
      <style>{`
        .loader-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .loader-dots .dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-accent-taupe);
          border-radius: 50%;
          display: inline-block;
          animation: dotElastic 1.4s infinite ease-in-out both;
        }
        .loader-dots .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loader-dots .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes dotElastic {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
        
        .recording-pulse {
          animation: recordPulse 1.2s infinite ease-in-out alternate;
          background-color: rgba(234, 67, 53, 0.15) !important;
          color: #EA4335 !important;
          border-color: #EA4335 !important;
        }
        @keyframes recordPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
