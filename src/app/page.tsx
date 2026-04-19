'use client';

import Link from 'next/link';
import { Heart, Users, Zap, TreePine } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();

  const translations = {
    gujarati: {
      title: '🌳 કુટુંબમાં આપનું સ્વાગત છે',
      subtitle: 'આપણો પરિવાર વૃક્ષ શોધો',
      description: 'આપણા સમુદાયમાં તમારું સ્થાન શોધો અને જાણો કે આપણે ક્યા જોડાયેલા છીએ।',
      explore: 'સમુદાયને અન્વેષણ કરો',
      findRelations: 'સંબંધ શોધો',
      features: [
        { icon: '🔍', title: 'શોધ કરો', desc: 'સમુદાયમાં લોકો શોધો' },
        { icon: '🌍', title: 'જોડાણ', desc: 'આપણે કેવી રીતે જોડાયેલા છીએ તે શોધો' },
        { icon: '❤️', title: 'સંબંધ', desc: 'પરિવારની બંધતા જાણો' },
        { icon: '🎊', title: 'સંસ્કાર', desc: 'આપણો વારસો સાચવો' },
      ]
    },
    hindi: {
      title: '🌳 कुटुंब में आपका स्वागत है',
      subtitle: 'हमारा पारिवारिक वृक्ष खोजें',
      description: 'हमारे समुदाय में अपना स्थान खोजें और जानें कि हम कैसे जुड़े हैं।',
      explore: 'समुदाय का अन्वेषण करें',
      findRelations: 'रिश्ता खोजें',
      features: [
        { icon: '🔍', title: 'खोजें', desc: 'समुदाय में लोगों को खोजें' },
        { icon: '🌍', title: 'जुड़ाव', desc: 'जानें कि हम कैसे जुड़े हैं' },
        { icon: '❤️', title: 'रिश्ता', desc: 'पारिवारिक बंधन जानें' },
        { icon: '🎊', title: 'परंपरा', desc: 'हमारी विरासत को संरक्षित करें' },
      ]
    },
    english: {
      title: '🌳 Welcome to Kutumb',
      subtitle: 'Discover Our Family Tree',
      description: 'Find your place in our community and discover how we are all connected.',
      explore: 'Explore Community',
      findRelations: 'Find Relationships',
      features: [
        { icon: '🔍', title: 'Search', desc: 'Find people in our community' },
        { icon: '🌍', title: 'Connection', desc: 'Discover how we are connected' },
        { icon: '❤️', title: 'Relations', desc: 'Understand family bonds' },
        { icon: '🎊', title: 'Heritage', desc: 'Preserve our legacy' },
      ]
    }
  };

  const t = translations[language];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <p className="text-lg opacity-75 max-w-3xl mx-auto">
              {t.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/explore"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t.explore}
              </Link>
              <Link
                href="/relationships"
                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t.findRelations}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {t.features.map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">
            {language === 'gujarati' ? 'તૈયાર છો શરુ કરવા માટે?' : language === 'hindi' ? 'शुरू करने के लिए तैयार हैं?' : 'Ready to Get Started?'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              {language === 'gujarati' ? 'સમુદાય બ્રાઉজ કરો' : language === 'hindi' ? 'समुदाय ब्राउज़ करें' : 'Browse Community'}
            </Link>
            <Link
              href="/relationships"
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors inline-block"
            >
              {language === 'gujarati' ? 'સંબંધ શોધો' : language === 'hindi' ? 'रिश्ता खोजें' : 'Find Relationships'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
