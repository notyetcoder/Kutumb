'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const translations = {
    gujarati: {
      title: '📊 સમુદાયને અન્વેષણ કરો',
      search: 'નામ દ્વારા શોધો...',
      noResults: 'કોઈ પરિણામ મળ્યું નથી',
      birthYear: 'જન્મ વર્ષ',
    },
    hindi: {
      title: '📊 समुदाय का अन्वेषण करें',
      search: 'नाम से खोजें...',
      noResults: 'कोई परिणाम नहीं मिला',
      birthYear: 'जन्म वर्ष',
    },
    english: {
      title: '📊 Explore Community',
      search: 'Search by name...',
      noResults: 'No results found',
      birthYear: 'Birth Year',
    }
  };

  const t = translations[language];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-gray-600">
            {language === 'gujarati' ? 'આપણો સમુદાય જાણો અને જોડાણ શોધો' : language === 'hindi' ? 'अपनी समुदाय को जानें' : 'Get to know our community'}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Users Grid */}
        {!loading && filteredUsers.length > 0 && (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user.name.charAt(0)}{user.surname.charAt(0)}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.surname}</p>
                  {user.birthYear && (
                    <p className="text-xs text-gray-500 mt-2">{t.birthYear}: {user.birthYear}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredUsers.length === 0 && users.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t.noResults}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {language === 'gujarati' ? 'કોઈ સદસ્ય મળ્યું નથી' : language === 'hindi' ? 'कोई सदस्य नहीं मिला' : 'No members found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
