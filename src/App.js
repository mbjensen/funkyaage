import React, { useState, useEffect } from 'react';
import { Music, Guitar, Plane, Car, MapPin, Calendar, Clock, ChevronDown, Play, X, Star, Heart, Check, Sun, Menu, ExternalLink, Users, Mic2, Piano, Home, Info, BookOpen, Map, Hotel, FileText, Gift } from 'lucide-react';

// Video placeholder component
const VideoEmbed = ({ placeholder, title, onFavorite, isFavorite }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <div className="relative group">
      <div 
        className="relative bg-gradient-to-br from-amber-900/50 to-black rounded-xl overflow-hidden cursor-pointer aspect-video"
        onClick={() => setShowVideo(true)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-black ml-1" fill="black" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </div>
      {onFavorite && (
        <button 
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
      )}
      
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl aspect-video">
            <button className="absolute -top-12 right-0 text-white hover:text-amber-400">
              <X className="w-8 h-8" />
            </button>
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Video: {placeholder}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Band member card component
const BandMemberCard = ({ member, featured, onFavoriteVideo, favorites }) => {
  const [expanded, setExpanded] = useState(featured);
  
  return (
    <div className={`bg-gradient-to-br ${featured ? 'from-amber-900/40 to-gray-900 ring-2 ring-amber-500' : 'from-gray-800/50 to-gray-900'} rounded-2xl overflow-hidden transition-all duration-300`}>
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-20 h-20 rounded-full ${featured ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-gray-600 to-gray-800'} flex items-center justify-center flex-shrink-0`}>
            {member.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              {featured && <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full">FEATURED</span>}
            </div>
            <p className="text-amber-400 font-medium">{member.instrument}</p>
            <p className="text-gray-400 text-sm mt-1">{member.shortBio}</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6 space-y-4 animate-fadeIn">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <p className="text-gray-300">{member.bio}</p>
          {member.funFact && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-400 text-sm"><strong>Fun fact:</strong> {member.funFact}</p>
            </div>
          )}
          {member.video && (
            <VideoEmbed 
              placeholder={member.video} 
              title={`${member.name} - ${member.instrument}`}
              onFavorite={() => onFavoriteVideo(member.video)}
              isFavorite={favorites.includes(member.video)}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Section wrapper component
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`min-h-screen py-20 px-4 md:px-8 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);

// Section title component
const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mb-4">
      {icon}
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
    {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
  </div>
);

// Main App Component
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashPhase, setSplashPhase] = useState(0);
  // Force dark mode always
  const darkMode = true; 
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [favorites, setFavorites] = useState([]);
  const [checklist, setChecklist] = useState({});

  // Check if it's birthday
  const today = new Date();
  const isBirthday = today.getMonth() === 0 && today.getDate() === 2;
  const birthdayDate = new Date('2026-01-02');
  const concertDate = new Date('2026-07-11');
  
  // Countdown calculations
  const getDaysUntil = (targetDate) => {
    const diff = targetDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Load from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage?.getItem?.('vulf-favorites') || '[]');
    const savedChecklist = JSON.parse(localStorage?.getItem?.('vulf-checklist') || '{}');
    const hasVisited = localStorage?.getItem?.('vulf-visited');
    
    setFavorites(savedFavorites);
    setChecklist(savedChecklist);
    
    if (hasVisited && !isBirthday) {
      setShowSplash(false);
    }
  }, [isBirthday]); // <--- FIX: Added isBirthday dependency here

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage?.setItem?.('vulf-favorites', JSON.stringify(favorites));
    } catch(e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage?.setItem?.('vulf-checklist', JSON.stringify(checklist));
    } catch(e) {}
  }, [checklist]);

  const toggleFavorite = (videoId) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(v => v !== videoId)
        : [...prev, videoId]
    );
  };

  const toggleChecklistItem = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const enterSite = () => {
    try {
      localStorage?.setItem?.('vulf-visited', 'true');
    } catch(e) {}
    setSplashPhase(1);
    setTimeout(() => setSplashPhase(2), 500);
    setTimeout(() => setShowSplash(false), 1000);
  };

  // Splash animation phases
  useEffect(() => {
    if (showSplash && isBirthday) {
      const timer1 = setTimeout(() => setSplashPhase(1), 1000);
      const timer2 = setTimeout(() => setSplashPhase(2), 2500);
      const timer3 = setTimeout(() => setSplashPhase(3), 4000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [showSplash, isBirthday]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'concert', 'band', 'fearless', 'learn', 'venue', 'travel', 'accommodation', 'practical'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { id: 'hero', label: 'Start', icon: <Home className="w-4 h-4" /> },
    { id: 'concert', label: 'Koncerten', icon: <Info className="w-4 h-4" /> },
    { id: 'band', label: 'Bandet', icon: <Users className="w-4 h-4" /> },
    { id: 'fearless', label: 'Fearless Flyers', icon: <Plane className="w-4 h-4" /> },
    { id: 'learn', label: 'Lær Guitar', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'venue', label: 'Spillested', icon: <MapPin className="w-4 h-4" /> },
    { id: 'travel', label: 'Rejsen', icon: <Map className="w-4 h-4" /> },
    { id: 'accommodation', label: 'Overnatning', icon: <Hotel className="w-4 h-4" /> },
    { id: 'practical', label: 'Praktisk', icon: <FileText className="w-4 h-4" /> },
  ];

  // Band members data
  const bandMembers = [
    {
      name: 'Cory Wong',
      instrument: 'Guitar',
      icon: <Guitar className="w-10 h-10 text-black" />,
      shortBio: 'Rhythm guitar virtuoso med den reneste funk tone',
      bio: 'Cory Wong er manden bag den ikoniske perkussive rhythm guitar stil, der definerer Vulfpecks lyd. Hans "chop" teknik og utroligt stramme timing har gjort ham til en af de mest eftertragtede guitarister i moderne funk.',
      funFact: 'Cory er også medlem af The Fearless Flyers og har en solokarriere med over 15 albums.',
      video: '[CORY_WONG_VIDEO_1]',
      featured: true
    },
    {
      name: 'Joe Dart',
      instrument: 'Bass',
      icon: <Music className="w-10 h-10 text-white" />,
      shortBio: 'Groovens fundament med minimal setup',
      bio: 'Joe Dart er basisten, der holder hele bandet sammen. Med sin Fender Jazz Bass og minimale pedalboard skaber han nogle af de mest genkendelige baslinjer i moderne musik.',
      funFact: 'Joe bruger ofte kun én bas og ingen pedaler live - bevis på at tone kommer fra fingrene.',
      video: '[JOE_DART_VIDEO_1]',
      featured: false
    },
    {
      name: 'Jack Stratton',
      instrument: 'Vocals, Guitar, Keys, Drums',
      icon: <Mic2 className="w-10 h-10 text-white" />,
      shortBio: 'Bandets kreative mastermind og leder',
      bio: 'Jack Stratton er hjernen bag Vulfpeck. Han producerer, komponerer og spiller multiple instrumenter. Hans unikke vision har skabt et af de mest originale bands i moderne musik.',
      funFact: 'Jack skabte "Sleepify" - et album med total stilhed, der indbragte $20,000 fra Spotify før det blev fjernet.',
      video: '[JACK_STRATTON_VIDEO_1]',
      featured: false
    },
    {
      name: 'Theo Katzman',
      instrument: 'Vocals, Guitar, Drums',
      icon: <Mic2 className="w-10 h-10 text-white" />,
      shortBio: 'Lead vokalist og multi-instrumentalist',
      bio: 'Theo Katzman bringer soul og grit til Vulfpecks lyd. Som hovedvokalist på mange af bandets hits og dygtig multi-instrumentalist er han essentiel for bandets live shows.',
      funFact: 'Theo har en succesfuld solokarriere og har udgivet flere kritikerroste albums.',
      video: '[THEO_KATZMAN_VIDEO_1]',
      featured: false
    },
    {
      name: 'Woody Goss',
      instrument: 'Keys',
      icon: <Piano className="w-10 h-10 text-white" />,
      shortBio: 'Vintage keyboard lyde og groovy hooks',
      bio: 'Woody Goss leverer de klassiske keyboard sounds, der giver Vulfpeck deres retro-moderne æstetik. Fra Wurlitzer til clavinet, hans spil er altid grooving.',
      funFact: 'Woody har sin egen instrumental funk trio ved navn "Woody and Jeremy" (senere "The Woody Goss Band").',
      video: '[WOODY_GOSS_VIDEO_1]',
      featured: false
    }
  ];

  // Checklist items
  const checklistItems = [
    'Billetter (udskrevet eller på telefon)',
    'Pas / ID',
    'Behageligt tøj og sko',
    'Solcreme og solbriller',
    'Regnjakke (for en sikkerheds skyld)',
    'Kamera',
    'Powerbank',
    'Siddeunderlag (stenene er hårde!)',
    'Vandflaske',
    'Lidt snacks til turen'
  ];

  // Birthday Splash Screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-purple-900/20" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.3
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-8 max-w-3xl">
          {isBirthday ? (
            <>
              {/* Birthday celebration */}
              <div className={`transition-all duration-1000 ${splashPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-6xl mb-4">🎂</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Tillykke med<br />
                  <span className="text-amber-400">70-års fødselsdagen</span>
                </h1>
                <p className="text-2xl text-amber-300">Aage!</p>
              </div>

              <div className={`mt-12 transition-all duration-1000 delay-1000 ${splashPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-xl text-gray-300 mb-4">
                  Du har spillet guitar i over 50 år,<br />
                  fra Roll'on til din stue derhjemme.
                </p>
              </div>

              <div className={`mt-8 transition-all duration-1000 delay-2000 ${splashPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <p className="text-2xl text-white mb-2">Nu skal du opleve</p>
                <h2 className="text-5xl md:text-7xl font-black text-amber-400 mb-4 tracking-tight">
                  VULFPECK
                </h2>
                <p className="text-xl text-amber-300">LIVE i Frankrig! 🇫🇷</p>
              </div>

              <div className={`mt-8 transition-all duration-1000 delay-3000 ${splashPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full mb-8">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="text-white font-medium">11. juli 2026</span>
                  <span className="text-gray-400">|</span>
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-white font-medium">Vienne, Frankrig</span>
                </div>

                <button
                  onClick={enterSite}
                  className="block mx-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-full hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
                >
                  Åbn din gave →
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Non-birthday countdown */}
              <div className="text-6xl mb-6">🎸</div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                En særlig gave til<br />
                <span className="text-amber-400">Aage</span>
              </h1>
              
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                  <p className="text-4xl font-bold text-amber-400">{getDaysUntil(birthdayDate)}</p>
                  <p className="text-gray-400 text-sm">dage til fødselsdag</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                  <p className="text-4xl font-bold text-amber-400">{getDaysUntil(concertDate)}</p>
                  <p className="text-gray-400 text-sm">dage til koncert</p>
                </div>
              </div>

              <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-white">VULFPECK · 11. juli 2026 · Vienne, Frankrig</span>
              </div>

              <button
                onClick={enterSite}
                className="mt-8 block mx-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-full hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-105"
              >
                Gå til siden →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main site
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-amber-50 text-gray-900'} transition-colors`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-950/90' : 'bg-amber-50/90'} backdrop-blur-lg border-b ${darkMode ? 'border-white/10' : 'border-amber-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollToSection('hero')} className="font-bold text-xl">
            <span className="text-amber-500">VULF</span>
            <span className={darkMode ? 'text-white' : 'text-gray-900'}>PECK</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id 
                    ? 'bg-amber-500 text-black' 
                    : darkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-amber-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-amber-100'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={`lg:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} border-t ${darkMode ? 'border-white/10' : 'border-amber-200'} p-4`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                  activeSection === item.id 
                    ? 'bg-amber-500 text-black' 
                    : darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-amber-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Concert countdown bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-amber-500' : 'bg-amber-600'} text-black py-2 px-4 z-40`}>
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>{getDaysUntil(concertDate)} dage til koncerten!</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">11. juli 2026 · Vienne, Frankrig</span>
        </div>
      </div>

      {/* Hero Section */}
      <Section id="hero" className="flex items-center pt-16">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-400 font-medium">En far-søn oplevelse i funkens tegn</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="text-amber-500">VULF</span>PECK
          </h1>
          <p className="text-2xl md:text-3xl text-amber-400 mb-2">+ THE FEARLESS FLYERS</p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>11. juli 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Jazz à Vienne</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-500" />
              <span>Théâtre Antique</span>
            </div>
          </div>

          <div className={`mt-12 p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-amber-100'} max-w-2xl mx-auto`}>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              70 år med musik. Nu med Vulfpeck live. 🎸
            </p>
          </div>

          <button
            onClick={() => scrollToSection('concert')}
            className="mt-12 animate-bounce"
          >
            <ChevronDown className="w-8 h-8 text-amber-500" />
          </button>
        </div>
      </Section>

      {/* Concert Info Section */}
      <Section id="concert">
        <SectionTitle 
          icon={<Info className="w-8 h-8 text-black" />}
          title="Om Koncerten"
          subtitle="Alt du behøver at vide om aftenen"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 text-amber-500">Jazz à Vienne Festival</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Jazz à Vienne er en af Europas største jazz- og funkfestivaler, afholdt i det spektakulære romerske amfiteater i Vienne, Frankrig. Festivalen har eksisteret siden 1981 og tiltrækker hvert år verdens bedste kunstnere.
            </p>
          </div>

          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 text-amber-500">Aftenens Program</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span><strong>Vulfpeck</strong> (headliner)</span>
              </li>
              <li className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span><strong>The Fearless Flyers</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <Music className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ludivine Issambourg, Souleance, ubaq</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-6 p-6 rounded-2xl ${darkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-100'}`}>
          <h3 className="text-xl font-bold mb-4 text-amber-500">Praktisk Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Døre åbner</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 timer før koncertstart</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Fri placering</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ingen reserverede pladser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Picnic tilladt</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mad og vandflasker OK</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sun className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Vejrforhold</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Koncert afholdes i al slags vejr</p>
              </div>
            </div>
          </div>
        </div>

        <a 
          href="https://jazzavienne.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium"
        >
          Besøg Jazz à Vienne's officielle side
          <ExternalLink className="w-4 h-4" />
        </a>
      </Section>

      {/* Band Section */}
      <Section id="band">
        <SectionTitle 
          icon={<Users className="w-8 h-8 text-black" />}
          title="Mød Bandet"
          subtitle="Vulfpecks talentfulde medlemmer"
        />

        <div className="space-y-4">
          {bandMembers.map((member, i) => (
            <BandMemberCard 
              key={i} 
              member={member} 
              featured={member.featured}
              onFavoriteVideo={toggleFavorite}
              favorites={favorites}
            />
          ))}
        </div>

        <div className={`mt-8 p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
          <h3 className="text-lg font-bold mb-3">Øvrige medlemmer</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Vulfpeck har også flere gæstemusikere og samarbejdspartnere, herunder <strong>Antwaun Stanley</strong> (vokal), <strong>Joey Dosik</strong> (vokal, sax, keys) og <strong>Jacob Jeffries</strong> (vokal, keys).
          </p>
        </div>
      </Section>

      {/* Fearless Flyers Section */}
      <Section id="fearless">
        <SectionTitle 
          icon={<Plane className="w-8 h-8 text-black" />}
          title="The Fearless Flyers"
          subtitle="Supergruppen med tre guitarer"
        />

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900' : 'bg-white'} mb-6`}>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
            The Fearless Flyers er et sideprojekt med medlemmer fra Vulfpeck og Snarky Puppy. 
            Konceptet er unikt: tre guitarer på stativer, pilotuniforms-æstetik, og kompromisløs funk.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Cory Wong', role: 'Rhythm Guitar', band: 'Vulfpeck' },
              { name: 'Mark Lettieri', role: 'Baritone Guitar', band: 'Snarky Puppy' },
              { name: 'Joe Dart', role: 'Bass', band: 'Vulfpeck' },
              { name: 'Nate Smith', role: 'Drums', band: 'Kinfolk' }
            ].map((member, i) => (
              <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-amber-50'}`}>
                <p className="font-bold text-amber-500">{member.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{member.role}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Fra: {member.band}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <VideoEmbed 
            placeholder="[FEARLESS_FLYERS_VIDEO_1]" 
            title="The Fearless Flyers - Live Performance"
            onFavorite={() => toggleFavorite('[FEARLESS_FLYERS_VIDEO_1]')}
            isFavorite={favorites.includes('[FEARLESS_FLYERS_VIDEO_1]')}
          />
          <VideoEmbed 
            placeholder="[FEARLESS_FLYERS_VIDEO_2]" 
            title="The Fearless Flyers - Studio Session"
            onFavorite={() => toggleFavorite('[FEARLESS_FLYERS_VIDEO_2]')}
            isFavorite={favorites.includes('[FEARLESS_FLYERS_VIDEO_2]')}
          />
        </div>
      </Section>

      {/* Learn Guitar Section */}
      <Section id="learn">
        <SectionTitle 
          icon={<Guitar className="w-8 h-8 text-black" />}
          title="Lær at Spille som Cory Wong"
          subtitle="Guitar-ressourcer til dig"
        />

        <div className="space-y-6">
          {/* Fundamentals */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">1</span>
              Grundlæggende Teknik
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Cory Wongs spillestil bygger på perfekt timing og en unik højrehånds-teknik. 
              Start med at mestre grundlæggende rhythm guitar og strumming patterns.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <VideoEmbed 
                placeholder="[CORY_TECHNIQUE_VIDEO_1]" 
                title="Right Hand Technique Basics"
                onFavorite={() => toggleFavorite('[CORY_TECHNIQUE_VIDEO_1]')}
                isFavorite={favorites.includes('[CORY_TECHNIQUE_VIDEO_1]')}
              />
              <VideoEmbed 
                placeholder="[CORY_TECHNIQUE_VIDEO_2]" 
                title="Rhythm Guitar Fundamentals"
                onFavorite={() => toggleFavorite('[CORY_TECHNIQUE_VIDEO_2]')}
                isFavorite={favorites.includes('[CORY_TECHNIQUE_VIDEO_2]')}
              />
            </div>
          </div>

          {/* Signature Moves */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">2</span>
              Cory Wong's Signatur Moves
            </h3>
            <ul className={`mb-4 space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500" />
                The "chop" technique - muted strumming
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500" />
                Perkussiv højrehånd
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500" />
                9th og 13th chord voicings
              </li>
            </ul>
            <div className="grid md:grid-cols-2 gap-4">
              <VideoEmbed 
                placeholder="[CORY_SIGNATURE_VIDEO_1]" 
                title="The Cory Wong Chop"
                onFavorite={() => toggleFavorite('[CORY_SIGNATURE_VIDEO_1]')}
                isFavorite={favorites.includes('[CORY_SIGNATURE_VIDEO_1]')}
              />
              <VideoEmbed 
                placeholder="[CORY_SIGNATURE_VIDEO_2]" 
                title="Funk Chord Voicings"
                onFavorite={() => toggleFavorite('[CORY_SIGNATURE_VIDEO_2]')}
                isFavorite={favorites.includes('[CORY_SIGNATURE_VIDEO_2]')}
              />
            </div>
          </div>

          {/* Songs to Practice */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">3</span>
              Sange at Øve
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Dean Town', artist: 'Vulfpeck', difficulty: 2 },
                { title: '1612', artist: 'Vulfpeck', difficulty: 1 },
                { title: 'Cory Wong', artist: 'Vulfpeck', difficulty: 2 },
                { title: 'Beastly', artist: 'Vulfpeck', difficulty: 3 },
                { title: 'Lunchmoney', artist: 'Vulfpeck', difficulty: 2 },
                { title: 'Birds of a Feather', artist: 'Vulfpeck', difficulty: 1 }
              ].map((song, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-amber-50'}`}>
                  <div>
                    <p className="font-medium">{song.title}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{song.artist}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= song.difficulty ? 'text-amber-500' : darkMode ? 'text-gray-700' : 'text-gray-300'}`}
                        fill={star <= song.difficulty ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fourth Position Academy */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-amber-900/30 to-amber-950/50' : 'from-amber-100 to-amber-200'} border ${darkMode ? 'border-amber-500/30' : 'border-amber-300'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Næste Niveau</span>
                <h3 className="text-xl font-bold mt-1">Fourth Position Academy</h3>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cory Wongs officielle online kursus ($175) inkluderer alt hvad du behøver for at mestre hans spillestil:
                </p>
                <ul className={`mt-3 space-y-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• 1-times Practice Workshops</li>
                  <li>• Rhythm Guitar Primer</li>
                  <li>• The Right Hand technique</li>
                  <li>• Chord Voicings & Principles of Practice</li>
                  <li>• Guitar Tabs inkluderet</li>
                </ul>
                <a 
                  href="https://www.fourthpositionacademy.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Besøg Fourth Position Academy
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  💡 Hvis du vil tage dit Cory Wong-spil til næste niveau, kan dette kursus være en mulighed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Venue Section */}
      <Section id="venue">
        <SectionTitle 
          icon={<MapPin className="w-8 h-8 text-black" />}
          title="Spillestedet"
          subtitle="Théâtre Antique de Vienne"
        />

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} mb-6`}>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-amber-900/30 to-gray-900 flex items-center justify-center mb-6">
            <p className="text-gray-500">[VENUE_IMAGE_1] - Théâtre Antique panorama</p>
          </div>
          
          <h3 className="text-xl font-bold mb-3">Et 2000 år gammelt amfiteater</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Théâtre Antique de Vienne er et antikt romersk amfiteater bygget i det 1. århundrede e.Kr. 
            Med plads til ca. 7.000 tilskuere er det nu hjemsted for Jazz à Vienne festivalen, 
            hvor den historiske stemning møder moderne musik under åben himmel.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-amber-50'}`}>
              <p className="font-bold text-amber-500">Beliggenhed</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vienne, Frankrig (30 km syd for Lyon)</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-amber-50'}`}>
              <p className="font-bold text-amber-500">Kapacitet</p>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>~7.000 personer</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-100'}`}>
          <h3 className="text-lg font-bold mb-3">💡 Tips til spillestedet</h3>
          <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-amber-500 mt-0.5" />
              <span>Kom tidligt for at få gode pladser (fri placering)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-amber-500 mt-0.5" />
              <span>Tag et siddeunderlag med - stensæderne er hårde!</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-amber-500 mt-0.5" />
              <span>Husk solcreme - juli i Sydfrankrig er varmt</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-amber-500 mt-0.5" />
              <span>Tag en tynd jakke med til aftenen</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Travel Section */}
      <Section id="travel">
        <SectionTitle 
          icon={<Plane className="w-8 h-8 text-black" />}
          title="Rejsen"
          subtitle="Fra Aalborg til Vienne"
        />

        <div className="space-y-6">
          {/* Fly fra Hamburg */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Option A: Fly fra Hamborg</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>HAM → LYS · ~1,5 timer</p>
              </div>
            </div>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Kør til Hamborg Lufthavn og flyv direkte til Lyon. Lyon ligger kun 30 km fra Vienne.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.google.com/travel/flights?q=Flights%20to%20LYS%20from%20HAM%20on%202026-07-10%20through%202026-07-12" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-2">
                Google Flights <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://www.momondo.dk/flight-search/HAM-LYS/2026-07-10/2026-07-12" target="_blank" rel="noopener noreferrer" className={`px-4 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} font-medium rounded-lg transition-colors inline-flex items-center gap-2`}>
                Momondo <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://www.skyscanner.dk/transport/flights/ham/lys/260710/260712/" target="_blank" rel="noopener noreferrer" className={`px-4 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} font-medium rounded-lg transition-colors inline-flex items-center gap-2`}>
                Skyscanner <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Fly fra Amsterdam */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Option B: Fly fra Amsterdam</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AMS → LYS · Flere afgange</p>
              </div>
            </div>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Amsterdam har ofte flere flymuligheder og kan være et godt alternativ.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.google.com/travel/flights?q=Flights%20to%20LYS%20from%20AMS%20on%202026-07-10%20through%202026-07-12" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-2">
                Google Flights <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kør selv */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Option C: Kør selv</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>~1.400 km · 14 timers kørsel</p>
              </div>
            </div>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ligesom turen til Luxembourg! Mulighed for overnatning undervejs i f.eks. Frankfurt eller Stuttgart.
            </p>
            <a href="https://www.google.com/maps/dir/Aalborg,+Denmark/Vienne,+France" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-2">
              Se rute på Google Maps <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Timing */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-100'}`}>
            <h3 className="text-lg font-bold mb-4">📅 Foreslået tidsplan</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-24 font-bold text-amber-500">10. juli</div>
                <div>
                  <p className="font-medium">Ankomst</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ankom til Lyon/Vienne om aftenen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 font-bold text-amber-500">11. juli</div>
                <div>
                  <p className="font-medium">Koncertdag! 🎸</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Udforsk Vienne, koncert om aftenen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-24 font-bold text-amber-500">12. juli</div>
                <div>
                  <p className="font-medium">Hjemrejse</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Eller en ekstra dag i området</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Accommodation Section */}
      <Section id="accommodation">
        <SectionTitle 
          icon={<Hotel className="w-8 h-8 text-black" />}
          title="Overnatning"
          subtitle="Hoteller i Vienne og Lyon"
        />

        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Book i god tid - Jazz à Vienne er populær og hotellerne fyldes hurtigt!
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            { name: 'Hôtel & Spa Le Petit Paradis', stars: 3, distance: '200m fra venue', price: '€€', location: 'Vienne' },
            { name: 'Best Western Hôtel de la Pyramide', stars: 4, distance: '500m fra venue', price: '€€€', location: 'Vienne' },
            { name: 'Ibis Budget Vienne', stars: 2, distance: '1 km fra venue', price: '€', location: 'Vienne' },
            { name: 'Hotel i Lyon Centrum', stars: 3, distance: '30 km fra venue', price: '€€', location: 'Lyon' }
          ].map((hotel, i) => (
            <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{hotel.name}</h3>
                <span className="text-amber-500 font-bold">{hotel.price}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(hotel.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-500" fill="currentColor" />
                ))}
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📍 {hotel.location} · {hotel.distance}
              </p>
              <a 
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.location + ' France')}&checkin=2026-07-10&checkout=2026-07-12`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium"
              >
                Søg på Booking.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Practical Section */}
      <Section id="practical" className="pb-32">
        <SectionTitle 
          icon={<FileText className="w-8 h-8 text-black" />}
          title="Praktisk Information"
          subtitle="Tjekliste og nyttige links"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">📋 Pakkeliste</h3>
            <div className="space-y-2">
              {checklistItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleChecklistItem(item)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    checklist[item] 
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      : darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    checklist[item] ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {checklist[item] && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={checklist[item] ? 'line-through' : ''}>{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
              <h3 className="text-xl font-bold mb-4">🔗 Nyttige links</h3>
              <div className="space-y-3">
                <a href="https://jazzavienne.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  <span>Jazz à Vienne (officiel)</span>
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                </a>
                <a href="https://vfrm.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  <span>Vulfpeck (officiel)</span>
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                </a>
                <a href="https://www.corywongmusic.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  <span>Cory Wong</span>
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                </a>
                <a href="https://www.fourthpositionacademy.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  <span>Fourth Position Academy</span>
                  <ExternalLink className="w-4 h-4 text-amber-500" />
                </a>
              </div>
            </div>

            {/* Personal message */}
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-amber-900/30 to-amber-950/50' : 'from-amber-100 to-amber-200'}`}>
              <h3 className="text-xl font-bold mb-4">💌 Personlig besked</h3>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>Kære Far,</p>
                <p>
                  Tak for alle de år med musik, fra du lærte mig de første akkorder, 
                  til vi har jammet sammen i garagen.
                </p>
                <p>
                  Nu skal vi opleve noget helt særligt sammen.
                </p>
                <p className="font-medium">
                  Glæder mig!<br />
                  Din søn 🎸
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className={`py-8 px-4 border-t ${darkMode ? 'border-white/10 bg-gray-900' : 'border-amber-200 bg-amber-50'} mb-10`}>
        <div className="max-w-5xl mx-auto text-center">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Lavet med <span className="text-red-500">♥</span> til Aage
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-500'} mt-2`}>
            © 2026 · En fødselsdagsgave fra din søn
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}