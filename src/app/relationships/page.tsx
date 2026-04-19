'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { RelationshipFinderClient } from './_components/RelationshipFinderClient';
import { useLanguage } from '@/context/LanguageContext';
import { Zap } from 'lucide-react';

export default function RelationshipsPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to load users');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load community members');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const translations = {
    gujarati: {
      title: '🌳 આપણો પરિવાર',
      subtitle: 'શોધો કે આપણે ક્યા જોડાયેલા છીએ',
      finder: 'સંબંધ શોધક'
    },
    hindi: {
      title: '🌳 हमारा परिवार',
      subtitle: 'जानिए कि हम कैसे जुड़े हैं',
      finder: 'रिश्ता खोजक'
    },
    english: {
      title: '🌳 Our Family',
      subtitle: 'Discover how we are connected',
      finder: 'Relationship Finder'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
        <div className="relative z-10 container max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            {t.finder}
          </h2>
          <RelationshipFinderClient users={users} loading={loading} />
        </div>
      </div>

      {error && (
        <div className="container max-w-6xl mx-auto px-4">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
