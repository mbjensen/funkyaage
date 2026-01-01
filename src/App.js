import React, { useState, useEffect } from 'react';
import { Music, Guitar, Plane, Car, MapPin, Calendar, Clock, ChevronDown, Play, X, Star, Heart, Check, Sun, Menu, ExternalLink, Users, Mic2, Piano, Home, Info, BookOpen, Map, Hotel, FileText, Gift, Video, Zap, GraduationCap, Utensils, Droplets, Footprints } from 'lucide-react';

// Video component that plays actual YouTube videos
const VideoEmbed = ({ videoId, title, start = 0, onFavorite, isFavorite }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  // FIX: Added window.location.origin to satisfy YouTube's security requirements on live sites
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${start}&origin=${origin}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative group h-full">
      {/* Thumbnail / Play Button */}
      <div 
        className="relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer aspect-video shadow-lg hover:shadow-xl transition-all"
        onClick={() => setShowVideo(true)}
      >
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-black ml-1" fill="black" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      </div>

      {/* Favorite Button */}
      {onFavorite && (
        <button 
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
      )}
      
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <button className="absolute -top-12 right-0 text-white hover:text-amber-400">
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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
          <div className={`w-20 h-20 rounded-full ${featured ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-gray-600 to-gray-800'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
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
          {member.videoId && (
            <VideoEmbed 
              videoId={member.videoId}
              start={member.videoStart}
              title={`${member.name} - ${member.instrument}`}
              onFavorite={() => onFavoriteVideo(member.videoId)}
              isFavorite={favorites.includes(member.videoId)}
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
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mb-4 shadow-lg shadow-amber-500/20">
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
  const darkMode = true; 
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [favorites, setFavorites] = useState([]);
  const [checklist, setChecklist] = useState({});

  // Check if it's birthday
  // const today = new Date(); // Normal date
  const today = new Date('2026-01-02'); // Force Birthday for testing
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
  }, [isBirthday]);

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
      const sections = ['hero', 'concert', 'band', 'live', 'learn', 'venue', 'travel', 'accommodation', 'practical'];
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
    { id: 'live', label: 'Live', icon: <Video className="w-4 h-4" /> },
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
      videoId: 'BtYYnqfb4xw',
      featured: true
    },
    {
      name: 'Joe Dart',
      instrument: 'Bass',
      icon: <Music className="w-10 h-10 text-white" />,
      shortBio: 'Groovens fundament med minimal setup',
      bio: 'Joe Dart er basisten, der holder hele bandet sammen. Med sin Fender Jazz Bass og minimale pedalboard skaber han nogle af de mest genkendelige baslinjer i moderne musik.',
      funFact: 'Joe bruger ofte kun én bas og ingen pedaler live - bevis på at tone kommer fra fingrene.',
      videoId: 'rhxQoDlt2AU',
      featured: false
    },
    {
      name: 'Jack Stratton',
      instrument: 'Vocals, Guitar, Keys, Drums',
      icon: <Mic2 className="w-10 h-10 text-white" />,
      shortBio: 'Bandets kreative mastermind og leder',
      bio: 'Jack Stratton er hjernen bag Vulfpeck. Han producerer, komponerer og spiller multiple instrumenter. Hans unikke vision har skabt et af de mest originale bands i moderne musik.',
      funFact: 'Jack skabte "Sleepify" - et album med total stilhed, der indbragte $20,000 fra Spotify før det blev fjernet.',
      videoId: 'rv4wf7bzfFE',
      videoStart: 6015,
      featured: false
    },
    {
      name: 'Theo Katzman',
      instrument: 'Vocals, Guitar, Drums',
      icon: <Mic2 className="w-10 h-10 text-white" />,
      shortBio: 'Lead vokalist og multi-instrumentalist',
      bio: 'Theo Katzman bringer soul og grit til Vulfpecks lyd. Som hovedvokalist på mange af bandets hits og dygtig multi-instrumentalist er han essentiel for bandets live shows.',
      funFact: 'Theo har en succesfuld solokarriere og har udgivet flere kritikerroste albums.',
      videoId: 'tCO6NwoOo1c',
      featured: false
    },
    {
      name: 'Woody Goss',
      instrument: 'Keys',
      icon: <Piano className="w-10 h-10 text-white" />,
      shortBio: 'Vintage keyboard lyde og groovy hooks',
      bio: 'Woody Goss leverer de klassiske keyboard sounds, der giver Vulfpeck deres retro-moderne æstetik. Fra Wurlitzer til clavinet, hans spil er altid grooving.',
      funFact: 'Woody har sin egen instrumental funk trio ved navn "Woody and Jeremy" (senere "The Woody Goss Band").',
      videoId: 'Ru9ObPeoCwQ',
      videoStart: 200,
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
    'Mobil',
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
            <span className="text-amber-400 font-medium">En oplevelse i funkens tegn</span>
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

      {/* Live Concerts Section */}
      <Section id="live">
        <SectionTitle 
          icon={<Video className="w-8 h-8 text-black" />}
          title="Vulfpeck Live"
          subtitle="Oplev energien fra deres legendariske koncerter"
        />

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900' : 'bg-white'} mb-6`}>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
            Vulfpeck er kendt for deres utrolige live-energi, improvisation og publikumsinteraktion. 
            Her er to ikoniske koncerter, du kan varme op med – inklusive deres seneste optræden i Frankrig!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-amber-500 mb-2">Live at Madison Square Garden (2019)</h3>
              <p className="text-gray-400 mb-3 text-sm">Den legendariske koncert hvor de solgte MSG ud uden et pladeselskab.</p>
              <VideoEmbed 
                videoId="rv4wf7bzfFE" 
                title="Vulfpeck Live at MSG"
                onFavorite={() => toggleFavorite('rv4wf7bzfFE')}
                isFavorite={favorites.includes('rv4wf7bzfFE')}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-500 mb-2">Live at Jazz à Vienne (2024)</h3>
              <p className="text-gray-400 mb-3 text-sm">En forsmag på hvad der venter dig! Hele koncerten fra samme festival.</p>
              <VideoEmbed 
                videoId="0ZL2q9hBPwU" 
                title="Vulfpeck - Jazz à Vienne 2024"
                onFavorite={() => toggleFavorite('0ZL2q9hBPwU')}
                isFavorite={favorites.includes('0ZL2q9hBPwU')}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Learn Guitar Section */}
      <Section id="learn">
        <SectionTitle 
          icon={<Guitar className="w-8 h-8 text-black" />}
          title="Lær at Spille som Cory Wong"
          subtitle="Fra Woodstock til Wong: Et kursus til Far"
        />

        <div className="space-y-12">
          
          {/* Introduction */}
          <div className={`p-8 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-amber-900/40 to-black' : 'from-amber-100 to-white'} border-l-4 border-amber-500 shadow-lg`}>
            <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <Guitar className="w-6 h-6 text-amber-500" />
              Den Store Udfordring
            </h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>
              I 60'er rocken (som Hendrix) er guitaren <strong>heroisk</strong> – den fylder rummet. 
              I funk er guitaren <strong>ydmyg</strong> – den er en del af rytmesektionen.
              <br/><br/>
              <span className="text-amber-400 italic font-medium">Målet er ikke at spille guitar igen. Målet er at "spille trommer på guitaren".</span>
            </p>
          </div>

          {/* Phase 1: The Masterclass */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-black font-bold">1</span>
              <h3 className="text-2xl font-bold text-amber-500">Start Her: Vulfpeck Lyden</h3>
            </div>
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <p className="text-gray-300 mb-4">
                En times masterclass hvor Cory forklarer hele sin filosofi, sit grej og sin teknik. Det føles som en premium lektion, men den er gratis.
              </p>
              <VideoEmbed 
                videoId="EMqRS1wYbNs" 
                title="Rhythm Guitar Masterclass with Cory Wong"
                onFavorite={() => toggleFavorite('EMqRS1wYbNs')}
                isFavorite={favorites.includes('EMqRS1wYbNs')}
              />
            </div>
          </div>

          {/* Module 1 & 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Module 1: Right Hand */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold">Værkstedet: Højre Hånd</h3>
              </div>
              <div className="">
                <h4 className="font-bold text-sm text-gray-300 mb-2">Øvelse: The Rubber Wrist Technique</h4>
                <p className="text-gray-400 mb-4 text-sm italic">
                "Denne lektion handler om at gøre din højre hånd til en trommestik. Cory forklarer, hvordan man holder hånden i konstant bevægelse – hemmeligheden bag aldrig at tabe tempoet. Læg mærke til hans løse håndled; det handler ikke om kraft, men om flow."
              </p>
              <VideoEmbed 
                videoId="yOTGNW7-E4U" 
                title="The Rubber Wrist Technique"
                onFavorite={() => toggleFavorite('yOTGNW7-E4U')}
                isFavorite={favorites.includes('yOTGNW7-E4U')}
              />
              </div>
              <div className="mt-4 pt-4">
                <h4 className="font-bold text-sm text-gray-300 mb-2">Øvelse: "The Trap"</h4>
                <p className="text-xs text-gray-500 mb-2">En øvelse fra hans workshop der isolerer håndleddet.</p>
                <VideoEmbed 
                  videoId="APHHNG_hYm0" 
                  title="Practice Workshop (Start at 0:55)"
                  start={55}
                  onFavorite={() => toggleFavorite('APHHNG_hYm0')}
                  isFavorite={favorites.includes('APHHNG_hYm0')}
                />
              </div>
            </div>

            {/* Module 2: Left Hand */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold">Den Harmoniske Bro</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm italic">
                "I 60'erne skulle man fylde hele rummet med lyd. I Vulfpeck fylder bassisten (Joe Dart) det hele, så guitaren skal holde sig væk. Brug 'The Hendrix Thumb' til at dæmpe de dybe strenge. Spil 'små' akkorder der groover hårdere end de store."
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-amber-400 mb-1">James Brown Akkorden (E9)</h4>
                  <VideoEmbed 
                    videoId="DdVkSxZ52eE" 
                    title="The James Brown Chord Explained"
                    onFavorite={() => toggleFavorite('DdVkSxZ52eE')}
                    isFavorite={favorites.includes('DdVkSxZ52eE')}
                  />
                </div>
                <div className="mt-4 pt-8"></div>
                <div>
                  <h4 className="font-bold text-sm text-amber-400 mb-1">Kun 3 strenge (Triads)</h4>
                  <VideoEmbed 
                    videoId="jTo1B7ceIWo" 
                    title="Funk Rhythm Lesson"
                    onFavorite={() => toggleFavorite('jTo1B7ceIWo')}
                    isFavorite={favorites.includes('jTo1B7ceIWo')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Module 3: Songs */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-black font-bold">2</span>
              <h3 className="text-2xl font-bold text-amber-500">Sætlisten: Sange til Koncerten</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dean Town */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                <h4 className="text-lg font-bold text-white mb-1">Dean Town</h4>
                <p className="text-amber-400 text-sm font-bold mb-2">PUBLIKUMS FAVORITTEN</p>
                <p className="text-gray-400 text-sm mb-3 italic">
                  "Du behøver ikke spille melodien – det klarer Joe Dart. Dit job er at være lilletrommen. Korte, stramme hug på 2 og 4."
                </p>
                <VideoEmbed 
                  videoId="FF3Oyu9tCII" 
                  title="Dean Town Guitar Tutorial"
                  onFavorite={() => toggleFavorite('FF3Oyu9tCII')}
                  isFavorite={favorites.includes('FF3Oyu9tCII')}
                />
              </div>

              {/* Cory Wong */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                <h4 className="text-lg font-bold text-white mb-1">Cory Wong</h4>
                <p className="text-amber-400 text-sm font-bold mb-2">UDHOLDENHEDS TESTEN</p>
                <p className="text-gray-400 text-sm mb-3 italic">
                  "Sangen de ofte slutter med. Det er et marathon for højre hånd. Start med 50% hastighed!"
                </p>
                <VideoEmbed 
                  videoId="-Qkm20HtEmA" 
                  title="Cory Wong (Live at MSG) Lesson"
                  onFavorite={() => toggleFavorite('-Qkm20HtEmA')}
                  isFavorite={favorites.includes('-Qkm20HtEmA')}
                />
              </div>

              {/* 1612 */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                <h4 className="text-lg font-bold text-white mb-1">1612</h4>
                <p className="text-amber-400 text-sm font-bold mb-2">SOUL STANDARDEN</p>
                <p className="text-gray-400 text-sm mb-3 italic">
                  "Denne føles som en Jackson 5 sang. Den har det klassiske soul swing. Brug tommelfingeren til at dæmpe ligesom Jimi ville gøre."
                </p>
                <VideoEmbed 
                  videoId="drorB6DbZIk" 
                  title="1612 Guitar Lesson"
                  onFavorite={() => toggleFavorite('drorB6DbZIk')}
                  isFavorite={favorites.includes('drorB6DbZIk')}
                />
              </div>

              {/* Animal Spirits */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                <h4 className="text-lg font-bold text-white mb-1">Animal Spirits</h4>
                <p className="text-amber-400 text-sm font-bold mb-2">POP FUNK</p>
                <p className="text-gray-400 text-sm mb-3 italic">
                  "Her skal guitaren lyde som et rasleæg (shaker). Hurtig strumming med lav volumen der skaber tekstur."
                </p>
                <VideoEmbed 
                  videoId="LOQZRafZPOc" 
                  title="Animal Spirits Tutorial"
                  onFavorite={() => toggleFavorite('LOQZRafZPOc')}
                  isFavorite={favorites.includes('LOQZRafZPOc')}
                />
              </div>
            </div>
          </div>

          {/* Fourth Position Academy Link */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-amber-900/30 to-amber-950/50' : 'from-amber-100 to-amber-200'} border ${darkMode ? 'border-amber-500/30' : 'border-amber-300'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Næste Niveau</span>
                <h3 className="text-xl font-bold mt-1">Fourth Position Academy</h3>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Har du fået blod på tanden efter videoerne?
                </p>
                <div className="mt-3 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg">
                  <p className="text-amber-400 font-bold flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    En del af gaven
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Hvis du ønsker adgang til det fulde kursus, så siger du bare til. Det betaler jeg med glæde som en udvidelse af din gave! 🎁
                  </p>
                </div>
                <a 
                  href="https://www.fourthpositionacademy.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Besøg Fourth Position Academy
                  <ExternalLink className="w-4 h-4" />
                </a>
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
          <div className="aspect-video rounded-xl bg-gradient-to-br from-amber-900/30 to-gray-900 flex items-center justify-center mb-6 overflow-hidden">
            {/* Using a standard Google Maps Embed for the location (Public) - HYBRID MODE */}
            <iframe 
              src="https://maps.google.com/maps?q=Théâtre+Antique+de+Vienne&t=h&z=17&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Théâtre Antique de Vienne Map"
            ></iframe>
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
          subtitle="Fly fra Hamborg eller Amsterdam?"
        />

        <div className="space-y-8">
          
          {/* Option A: Hamburg */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Option A: Fly fra Hamborg (HAM)</h3>
            </div>

            <div className="space-y-6">
              {/* Option A1 */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                <h4 className="font-bold text-lg mb-2">1. Fredag d. 10. Juli - Søndag d. 12. Juli</h4>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Udrejse</p>
                    <p className="font-medium">HAM → LYS (10. Juli)</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Hjemrejse</p>
                    <p className="font-medium">LYS → HAM (12. Juli)</p>
                  </div>
                </div>
                <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded mb-4">
                  💡 Tip: Vælg afgang efter kl. 20:00 (ud) og efter kl. 14:00 (hjem)
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.google.com/travel/flights?q=Flights%20to%20LYS%20from%20HAM%20on%202026-07-10%20through%202026-07-12" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors">Google Flights ↗</a>
                  <a href="https://www.momondo.dk/flight-search/HAM-LYS/2026-07-10/2026-07-12" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Momondo ↗</a>
                  <a href="https://www.skyscanner.dk/transport/flights/ham/lys/260710/260712" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Skyscanner ↗</a>
                </div>
              </div>

              {/* Option A2 */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                <h4 className="font-bold text-lg mb-2">2. Lørdag d. 11. Juli - Søndag d. 12. Juli</h4>
                <div className="flex flex-col sm:flex-row gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Udrejse</p>
                    <p className="font-medium">HAM → LYS (11. Juli)</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Hjemrejse</p>
                    <p className="font-medium">LYS → HAM (12. Juli)</p>
                  </div>
                </div>
                <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded mb-4">
                  💡 Tip: Vælg tidlig morgenafgang før kl. 10:00 (ud)
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.google.com/travel/flights?q=Flights%20to%20LYS%20from%20HAM%20on%202026-07-11%20through%202026-07-12" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors">Google Flights ↗</a>
                  <a href="https://www.momondo.dk/flight-search/HAM-LYS/2026-07-11/2026-07-12" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Momondo ↗</a>
                  <a href="https://www.skyscanner.dk/transport/flights/ham/lys/260711/260712" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Skyscanner ↗</a>
                </div>
              </div>
            </div>
          </div>

          {/* Option B: Amsterdam */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Option B: Fly fra Amsterdam (AMS)</h3>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
              <h4 className="font-bold text-lg mb-2">Lørdag d. 11. Juli - Søndag d. 12. Juli</h4>
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Udrejse</p>
                  <p className="font-medium">AMS → LYS (11. Juli)</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Hjemrejse</p>
                  <p className="font-medium">LYS → AMS (12. Juli)</p>
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded mb-4">
                💡 Tip: Vælg tidlig morgenafgang før kl. 10:00 (ud) og hjem efter kl. 14:00
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.google.com/travel/flights?q=Flights%20to%20LYS%20from%20AMS%20on%202026-07-11%20through%202026-07-12" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors">Google Flights ↗</a>
                <a href="https://www.momondo.dk/flight-search/AMS-LYS/2026-07-11/2026-07-12" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Momondo ↗</a>
                <a href="https://www.skyscanner.dk/transport/flights/ams/lys/260711/260712" target="_blank" rel="noopener noreferrer" className={`px-3 py-2 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200'} text-sm font-medium rounded transition-colors`}>Skyscanner ↗</a>
              </div>
            </div>
          </div>

          {/* Option C: Kør selv */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Option C: Kør selv (fra Vojens)</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>~1.412 km · 13,5 timers kørsel</p>
              </div>
            </div>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Direkte fra Vojens til Maison Mori i Vienne. En smuk tur ned gennem Tyskland og Frankrig.
            </p>
            <a href="https://www.google.com/maps/dir/Vojens,+Denmark/Maison+Mori,+611+Chemin+du+Boucon,+Vienne,+France/data=!4m14!4m13!1m5!1m1!19sChIJc2F2Zt5VS0YR9okesQ8k4BE!2m2!1d9.3019649!2d55.249489!1m5!1m1!19sChIJpabF8Vjf9EcReaWRXg5Mf3U!2m2!1d4.8835269!2d45.5415537!3e0" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors inline-flex items-center gap-2">
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
          subtitle="Jeres base i Vienne"
        />

        <div className="mb-8">
          <div className={`relative p-6 rounded-2xl border-2 border-amber-500 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="absolute top-0 right-0 bg-amber-500 text-black font-bold px-4 py-1 rounded-bl-xl shadow-lg z-10">
              BOOKET & KLAR
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Maison Mori</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-500 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">(9.2 Superb)</span>
                </div>
                
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  En smuk "Guesthouse" med spa og pool, perfekt til at slappe af inden koncerten.
                  Stedet ligger i naturskønne omgivelser, kun en kort tur fra amfiteateret.
                </p>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">11. - 12. Juli 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">4 Personer (Quadruple Room)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Pool & Spa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Morgenmad kan tilkøbes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Gratis Parkering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">39 min gang til venue</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'}`}>
                  <p className={`text-sm flex items-start gap-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Fleksibel booking:</strong> Vi har sikret dette værelse, men det kan afbestilles gratis indtil 4. juli 2026, hvis planerne ændres (f.eks. hvis vi flyver og har brug for flere overnatninger).
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 aspect-video md:aspect-auto rounded-xl overflow-hidden bg-gray-200">
                {/* Fixed Map Link: Using output=embed for free access */}
                <iframe 
                  src="https://maps.google.com/maps?q=Maison+Mori+Vienne&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Maison Mori Map"
                ></iframe>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <a 
                href="https://www.booking.com/hotel/fr/maison-mori.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Se hotellet på Booking.com
                <ExternalLink className="w-4 h-4" />
              </a>
              <a 
                href="https://www.google.com/maps/dir/?api=1&origin=Maison+Mori,+611+Chemin+du+Boucon,+38200+Vienne,+France&destination=Théâtre+Antique+de+Vienne,+7+Rue+de+Goris,+38200+Vienne,+France&travelmode=walking" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-bold transition-colors ${darkMode ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10' : 'border-amber-600 text-amber-700 hover:bg-amber-50'}`}
              >
                <Footprints className="w-4 h-4" />
                Se gå-ruten på Google Maps (39 min)
              </a>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white'} opacity-75`}>
          <h3 className="text-lg font-bold mb-3">Alternative overvejelser</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Hvis vi beslutter at tage en længere tur (f.eks. 10.-12. juli) eller flyve, kan vi justere bookingen eller finde alternativer i Lyon. Men lige nu har vi en sikker base med plads til alle og parkering til bilen!
          </p>
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
              <h3 className="text-xl font-bold mb-4">Tillykke med de 70 år, far! 🎸</h3>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <p>Et nyt årti kalder og med det nye eventyr.</p>
                <p>
                Som gave får du en rejse til Sydfrankrig, hvor vi sammen skal opleve Vulfpeck live i det antikke teater i Vienne den 11. juli 2026. Funk i verdensklasse under åben himmel!
                </p>
                <p>
                Måske bliver det startskuddet til at dykke ned i funk-verdenen eller bare en fed oplevelse vi kan dele sammen. Uanset hvad, glæder jeg mig helt vildt til at tage afsted med dig.
                </p>
                <p>
                Jeg ser frem til denne tur og til mange fremtidige musikalske eventyr og rejser sammen med resten af familien.
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