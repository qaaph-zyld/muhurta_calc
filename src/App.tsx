import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Star, Bell, Settings, MapPin, Sun, Moon } from 'lucide-react';

// TypeScript interfaces
interface BirthData {
  date: string;
  time: string;
  location: string;
}

interface Muhurat {
  id: string;
  date: string;
  time: string;
  type: string;
  score: number;
  nakshatra: string;
  tithi: string;
  description: string;
  details: string;
}

interface EventType {
  name: string;
  icon: string;
  color: string;
  auspicious: number[];
}

// Major cities for location suggestions
const MAJOR_CITIES = [
  // India - Major Cities
  'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India', 'Kolkata, India',
  'Hyderabad, India', 'Ahmedabad, India', 'Pune, India', 'Surat, India', 'Jaipur, India',
  'Lucknow, India', 'Kanpur, India', 'Nagpur, India', 'Indore, India', 'Thane, India',
  'Bhopal, India', 'Visakhapatnam, India', 'Patna, India', 'Vadodara, India', 'Ghaziabad, India',
  'Ludhiana, India', 'Agra, India', 'Nashik, India', 'Faridabad, India', 'Meerut, India',
  'Rajkot, India', 'Varanasi, India', 'Srinagar, India', 'Aurangabad, India', 'Dhanbad, India',
  'Amritsar, India', 'Allahabad, India', 'Ranchi, India', 'Howrah, India', 'Coimbatore, India',
  'Jabalpur, India', 'Gwalior, India', 'Vijayawada, India', 'Jodhpur, India', 'Madurai, India',
  'Raipur, India', 'Kota, India', 'Chandigarh, India', 'Guwahati, India', 'Mysore, India',
  'Bareilly, India', 'Tiruchirapalli, India', 'Bhubaneswar, India', 'Thiruvananthapuram, India',
  
  // USA - Major Cities
  'New York, USA', 'Los Angeles, USA', 'Chicago, USA', 'Houston, USA', 'Phoenix, USA',
  'Philadelphia, USA', 'San Antonio, USA', 'San Diego, USA', 'Dallas, USA', 'San Jose, USA',
  'Austin, USA', 'Jacksonville, USA', 'Fort Worth, USA', 'Columbus, USA', 'Indianapolis, USA',
  'Charlotte, USA', 'San Francisco, USA', 'Seattle, USA', 'Denver, USA', 'Washington DC, USA',
  'Boston, USA', 'El Paso, USA', 'Nashville, USA', 'Detroit, USA', 'Portland, USA',
  'Las Vegas, USA', 'Oklahoma City, USA', 'Memphis, USA', 'Louisville, USA', 'Baltimore, USA',
  'Milwaukee, USA', 'Albuquerque, USA', 'Tucson, USA', 'Fresno, USA', 'Sacramento, USA',
  'Atlanta, USA', 'Miami, USA', 'Tampa, USA', 'Orlando, USA', 'Pittsburgh, USA',
  
  // UK - Major Cities
  'London, UK', 'Birmingham, UK', 'Manchester, UK', 'Glasgow, UK', 'Liverpool, UK',
  'Bristol, UK', 'Sheffield, UK', 'Leeds, UK', 'Edinburgh, UK', 'Leicester, UK',
  'Coventry, UK', 'Cardiff, UK', 'Belfast, UK', 'Nottingham, UK', 'Newcastle, UK',
  'Southampton, UK', 'Portsmouth, UK', 'Aberdeen, UK', 'Cambridge, UK', 'Oxford, UK',
  
  // Europe - Major Cities
  'Paris, France', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy', 'Amsterdam, Netherlands',
  'Vienna, Austria', 'Brussels, Belgium', 'Munich, Germany', 'Milan, Italy', 'Barcelona, Spain',
  'Prague, Czech Republic', 'Warsaw, Poland', 'Budapest, Hungary', 'Stockholm, Sweden', 'Copenhagen, Denmark',
  'Dublin, Ireland', 'Athens, Greece', 'Lisbon, Portugal', 'Helsinki, Finland', 'Oslo, Norway',
  'Zurich, Switzerland', 'Geneva, Switzerland', 'Frankfurt, Germany', 'Hamburg, Germany', 'Lyon, France',
  'Marseille, France', 'Naples, Italy', 'Turin, Italy', 'Valencia, Spain', 'Seville, Spain',
  'Krakow, Poland', 'Rotterdam, Netherlands', 'Gothenburg, Sweden', 'Antwerp, Belgium', 'Nice, France',
  
  // Asia - Major Cities
  'Tokyo, Japan', 'Beijing, China', 'Shanghai, China', 'Seoul, South Korea', 'Singapore',
  'Hong Kong', 'Bangkok, Thailand', 'Jakarta, Indonesia', 'Manila, Philippines', 'Kuala Lumpur, Malaysia',
  'Taipei, Taiwan', 'Ho Chi Minh City, Vietnam', 'Hanoi, Vietnam', 'Osaka, Japan', 'Kyoto, Japan',
  'Yokohama, Japan', 'Shenzhen, China', 'Guangzhou, China', 'Chengdu, China', 'Wuhan, China',
  'Tianjin, China', 'Chongqing, China', 'Busan, South Korea', 'Incheon, South Korea', 'Yangon, Myanmar',
  'Karachi, Pakistan', 'Lahore, Pakistan', 'Dhaka, Bangladesh', 'Colombo, Sri Lanka', 'Kathmandu, Nepal',
  'Phnom Penh, Cambodia', 'Vientiane, Laos', 'Ulaanbaatar, Mongolia', 'Astana, Kazakhstan', 'Tashkent, Uzbekistan',
  
  // Middle East - Major Cities
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Doha, Qatar', 'Riyadh, Saudi Arabia', 'Jeddah, Saudi Arabia',
  'Istanbul, Turkey', 'Ankara, Turkey', 'Tehran, Iran', 'Baghdad, Iraq', 'Amman, Jordan',
  'Beirut, Lebanon', 'Jerusalem, Israel', 'Tel Aviv, Israel', 'Kuwait City, Kuwait', 'Muscat, Oman',
  'Manama, Bahrain', 'Damascus, Syria', 'Cairo, Egypt', 'Alexandria, Egypt', 'Casablanca, Morocco',
  
  // Africa - Major Cities
  'Cairo, Egypt', 'Lagos, Nigeria', 'Kinshasa, DR Congo', 'Johannesburg, South Africa', 'Cape Town, South Africa',
  'Durban, South Africa', 'Accra, Ghana', 'Nairobi, Kenya', 'Addis Ababa, Ethiopia', 'Dar es Salaam, Tanzania',
  'Algiers, Algeria', 'Tunis, Tunisia', 'Rabat, Morocco', 'Dakar, Senegal', 'Abidjan, Ivory Coast',
  'Khartoum, Sudan', 'Luanda, Angola', 'Maputo, Mozambique', 'Harare, Zimbabwe', 'Lusaka, Zambia',
  
  // Australia & Oceania - Major Cities
  'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia', 'Adelaide, Australia',
  'Gold Coast, Australia', 'Auckland, New Zealand', 'Wellington, New Zealand', 'Christchurch, New Zealand',
  'Suva, Fiji', 'Port Moresby, Papua New Guinea', 'Honolulu, USA', 'Nukualofa, Tonga', 'Apia, Samoa',
  
  // South & Central America - Major Cities
  'Rio de Janeiro, Brazil', 'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Lima, Peru', 'Bogotá, Colombia',
  'Santiago, Chile', 'Caracas, Venezuela', 'Mexico City, Mexico', 'Guadalajara, Mexico', 'Monterrey, Mexico',
  'Panama City, Panama', 'San José, Costa Rica', 'Havana, Cuba', 'Santo Domingo, Dominican Republic',
  'Guatemala City, Guatemala', 'San Salvador, El Salvador', 'Tegucigalpa, Honduras', 'Managua, Nicaragua',
  'Quito, Ecuador', 'La Paz, Bolivia', 'Asunción, Paraguay', 'Montevideo, Uruguay'
];

// Astronomical calculation utilities (simplified ephemeris)
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const EVENT_TYPES: Record<string, EventType> = {
  wedding: { name: 'Wedding', icon: '💍', color: 'bg-rose-100 text-rose-800', auspicious: [1, 3, 5, 7, 10, 11, 13] },
  travel: { name: 'Travel', icon: '✈️', color: 'bg-blue-100 text-blue-800', auspicious: [2, 4, 6, 8, 10, 12, 14] },
  business: { name: 'Business', icon: '🚀', color: 'bg-green-100 text-green-800', auspicious: [1, 2, 5, 9, 11, 13, 15] },
  property: { name: 'Property', icon: '🏠', color: 'bg-amber-100 text-amber-800', auspicious: [2, 5, 7, 10, 12, 14] },
  education: { name: 'Education', icon: '📚', color: 'bg-purple-100 text-purple-800', auspicious: [1, 4, 5, 9, 10, 11] }
};

// Simplified astronomical calculations
const calculateLunarDay = (date: Date): number => {
  const baseDate = new Date('2024-01-01');
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % 30) + 1;
};

const getNakshatra = (date: Date): string => {
  const baseDate = new Date('2024-01-01');
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return NAKSHATRAS[diffDays % 27];
};

const calculateMuhuratScore = (date: Date, eventType: string, birthData: BirthData): number => {
  const tithi = calculateLunarDay(date);
  const nakshatra = getNakshatra(date);
  const dayOfWeek = date.getDay();
  
  let score = 50; // Base score
  
  // Tithi scoring
  if (EVENT_TYPES[eventType].auspicious.includes(tithi)) score += 25;
  
  // Day of week scoring
  const auspiciousDays = { 1: 15, 3: 20, 4: 10, 5: 15 }; // Mon, Wed, Thu, Fri
  score += auspiciousDays[dayOfWeek] || 0;
  
  // Nakshatra bonus (simplified)
  const auspiciousNakshatras = ['Rohini', 'Pushya', 'Hasta', 'Swati', 'Uttara Phalguni'];
  if (auspiciousNakshatras.includes(nakshatra)) score += 15;
  
  // Birth chart compatibility (mock calculation)
  const birthMonth = new Date(birthData.date).getMonth();
  const currentMonth = date.getMonth();
  if ((currentMonth - birthMonth) % 6 === 0) score += 10;
  
  return Math.min(100, Math.max(10, score));
};

const generateOptimizedMuhurats = (birthData: BirthData, eventType: string): Muhurat[] => {
  const muhurats: Muhurat[] = [];
  const startDate = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const score = calculateMuhuratScore(date, eventType, birthData);
    
    if (score >= 60) {
      const tithi = calculateLunarDay(date);
      const nakshatra = getNakshatra(date);
      
      // Multiple time slots per day
      const timeSlots = ['06:00', '07:30', '10:15', '11:45'];
      const selectedTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      muhurats.push({
        id: `muhurat_${i}`,
        date: date.toISOString().split('T')[0],
        time: selectedTime,
        type: eventType,
        score: Math.floor(score),
        nakshatra,
        tithi: tithi.toString(),
        description: score > 85 ? 'Exceptionally auspicious' : score > 75 ? 'Highly favorable' : 'Auspicious',
        details: `${nakshatra} nakshatra, Tithi ${tithi}. Planetary alignment favorable for ${EVENT_TYPES[eventType].name.toLowerCase()}.`
      });
    }
  }
  
  return muhurats.sort((a, b) => b.score - a.score).slice(0, 20);
};

export default function MuhuratFinderLite() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [birthData, setBirthData] = useState<BirthData>({ date: '', time: '', location: '' });
  const [selectedEventType, setSelectedEventType] = useState<string>('wedding');
  const [muhurats, setMuhurats] = useState<Muhurat[]>([]);
  const [selectedMuhurat, setSelectedMuhurat] = useState<Muhurat | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('muhuratBirthData');
    if (savedData) {
      setBirthData(JSON.parse(savedData) as BirthData);
      setCurrentView('dashboard');
    }

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthData.date && birthData.time && birthData.location) {
      localStorage.setItem('muhuratBirthData', JSON.stringify(birthData));
      generateMuhurats();
      setCurrentView('dashboard');
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthData(prev => ({ ...prev, location: value }));
    
    if (value.length > 1) {
      const filteredSuggestions = MAJOR_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setLocationSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setBirthData(prev => ({ ...prev, location }));
    setShowSuggestions(false);
  };

  const generateMuhurats = (eventType = selectedEventType) => {
    const calculatedMuhurats = generateOptimizedMuhurats(birthData, eventType);
    setMuhurats(calculatedMuhurats);
  };

  const scheduleReminder = (muhurat: Muhurat) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setTimeout(() => {
            new Notification(`Muhurat Reminder: ${EVENT_TYPES[muhurat.type].name}`, {
              body: `${muhurat.description} - ${muhurat.time} on ${new Date(muhurat.date).toLocaleDateString()}`,
              icon: '/favicon.ico'
            });
          }, 2000);
        }
      });
    }
  };

  const theme = darkMode ? 'dark' : '';

  if (currentView === 'onboarding') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 ${theme}`}>
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Muhurat Finder</h1>
            <p className="text-gray-600">Discover your personalized auspicious times</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Birth Date
              </label>
              <input
                type="date"
                value={birthData.date}
                onChange={(e) => setBirthData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Birth Time
              </label>
              <input
                type="time"
                value={birthData.time}
                onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Birth Location
              </label>
              <div className="relative" ref={suggestionsRef}>
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, Country"
                  value={birthData.location}
                  onChange={handleLocationChange}
                  onFocus={() => birthData.location.length > 1 && setShowSuggestions(true)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {locationSuggestions.map((location, index) => (
                      <div 
                        key={index}
                        className="px-4 py-2 hover:bg-amber-50 cursor-pointer transition-colors"
                        onClick={() => selectLocation(location)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span>{location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Calculate My Muhurats ✨
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Privacy-first: All calculations performed locally
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${theme}`}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Your Muhurats</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-600 hover:text-amber-500 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="p-2 text-gray-600 hover:text-amber-500 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Type Selector */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Object.entries(EVENT_TYPES).map(([key, type]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedEventType(key);
                generateMuhurats(key);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedEventType === key
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-amber-300'
              }`}
            >
              {type.icon} {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Muhurat List */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <div className="space-y-4">
          {muhurats.map((muhurat, index) => (
            <div
              key={muhurat.id}
              className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${EVENT_TYPES[muhurat.type].color}`}>
                    {EVENT_TYPES[muhurat.type].icon} {EVENT_TYPES[muhurat.type].name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{muhurat.score}</span>
                  </div>
                </div>
                <button
                  onClick={() => scheduleReminder(muhurat)}
                  className="p-2 text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-6 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(muhurat.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800">{muhurat.time}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{muhurat.description}</p>
              
              <div className="flex items-center gap-6 text-xs text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  🌟 <strong>{muhurat.nakshatra}</strong>
                </span>
                <span className="flex items-center gap-1">
                  🌙 <strong>Tithi {muhurat.tithi}</strong>
                </span>
              </div>
              
              <button
                onClick={() => setSelectedMuhurat(muhurat)}
                className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                View Full Details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Muhurat Detail Modal */}
      {selectedMuhurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Muhurat Details</h3>
              <button
                onClick={() => setSelectedMuhurat(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${EVENT_TYPES[selectedMuhurat.type].color}`}>
                  {EVENT_TYPES[selectedMuhurat.type].icon} {EVENT_TYPES[selectedMuhurat.type].name}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-current" />
                  <span className="text-lg font-bold text-gray-700">{selectedMuhurat.score}/100</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Date</span>
                  <p className="font-semibold">{new Date(selectedMuhurat.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Time</span>
                  <p className="font-semibold">{selectedMuhurat.time}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Nakshatra</span>
                  <p className="font-semibold">{selectedMuhurat.nakshatra}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Tithi</span>
                  <p className="font-semibold">{selectedMuhurat.tithi}</p>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Astrological Insight</h4>
                <p className="text-amber-700 text-sm">{selectedMuhurat.details}</p>
              </div>
              
              <button
                onClick={() => {
                  scheduleReminder(selectedMuhurat);
                  setSelectedMuhurat(null);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
              >
                Set Reminder 🔔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}