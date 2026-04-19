'use client';

import { User, RelationshipResult, Language } from '@/lib/types';
import { getRelationshipLabel } from '@/lib/relationshipTranslator';
import { Heart, ArrowRight, MapPin } from 'lucide-react';

interface Props {
  relationship: RelationshipResult;
  personA: User | null;
  personB: User | null;
  language: Language;
}

export function RelationshipPathVisualization({
  relationship,
  personA,
  personB,
  language
}: Props) {
  if (!relationship) return null;

  const getClosenessColor = (distance?: number): string => {
    if (!distance) return 'bg-gray-100';
    if (distance === 1) return 'bg-red-100 border-red-300';
    if (distance <= 2) return 'bg-orange-100 border-orange-300';
    if (distance <= 3) return 'bg-yellow-100 border-yellow-300';
    return 'bg-blue-100 border-blue-300';
  };

  const translations = {
    gujarati: {
      connectionFound: '🔗 તમારો સંબંધ',
      howConnected: 'આપણે ક્યા જોડાયેલા છીએ?',
      relationshipType: 'સંબંધનો પ્રકાર',
      connectionPath: 'જોડાણનો માર્ગ',
      notRelated: '❌ સંબંધિત નથી'
    },
    hindi: {
      connectionFound: '🔗 आपका रिश्ता',
      howConnected: 'हम कहाँ जुड़े हैं?',
      relationshipType: 'रिश्ते का प्रकार',
      connectionPath: 'कनेक्शन पथ',
      notRelated: '❌ संबंधित नहीं'
    },
    english: {
      connectionFound: '🔗 Your Relationship',
      howConnected: 'How are we connected?',
      relationshipType: 'Relationship Type',
      connectionPath: 'Connection Path',
      notRelated: '❌ Not Related'
    }
  };

  const t = translations[language];

  if (!relationship.found) {
    return (
      <div className="p-6 border-2 border-red-200 bg-red-50 rounded-lg">
        <div className="text-center space-y-4">
          <div className="text-5xl">❌</div>
          <h3 className="text-xl font-bold text-red-900">{t.notRelated}</h3>
          <p className="text-red-700">{relationship.explanation || 'No direct relationship found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <div className={`p-6 border-2 rounded-lg ${getClosenessColor(relationship.distance)}`}>
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {t.connectionFound}
            </h3>
            <p className="text-sm text-gray-600">{t.howConnected}</p>
          </div>

          {/* Relationship Type */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase">{t.relationshipType}</h4>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {getRelationshipLabel(relationship.relationship, language)}
                </p>
                {relationship.explanation && (
                  <p className="text-sm text-gray-600 mt-1">{relationship.explanation}</p>
                )}
              </div>
            </div>
          </div>

          {/* Connection Path */}
          {relationship.path && relationship.path.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t.connectionPath}
              </h4>

              {/* Desktop View - Horizontal */}
              <div className="hidden md:flex overflow-x-auto gap-2 pb-2">
                {relationship.path.map((person, idx) => (
                  <div key={person.id} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {person.name.charAt(0)}
                      </div>
                      <p className="text-xs text-gray-700 mt-1 max-w-16 text-center truncate">
                        {person.name}
                      </p>
                    </div>
                    {idx < relationship.path!.length - 1 && (
                      <div className="mx-2 text-gray-400">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile View - Vertical */}
              <div className="md:hidden space-y-2">
                {relationship.path.map((person, idx) => (
                  <div key={person.id}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {person.name.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{person.name}</p>
                    </div>
                    {idx < relationship.path!.length - 1 && (
                      <div className="ml-5 my-1 text-gray-400">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {relationship.distance !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600">{relationship.distance}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {language === 'gujarati' ? 'પેઢીઓ' : language === 'hindi' ? 'पीढ़ियां' : 'Generations'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                <div className="text-3xl">
                  {relationship.distance === 1 ? '❤️' : relationship.distance === 2 ? '🧡' : '💛'}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {relationship.distance === 1 ? 'ખૂબ જ નજીક' : relationship.distance === 2 ? 'નજીક' : 'સંબંધી'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* People Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {personA && (
          <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              {personA.profilePictureUrl && (
                <img
                  src={personA.profilePictureUrl}
                  alt={personA.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{personA.name}</p>
                <p className="text-sm text-gray-600">{personA.surname}</p>
              </div>
            </div>
          </div>
        )}

        {personB && (
          <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-4">
              {personB.profilePictureUrl && (
                <img
                  src={personB.profilePictureUrl}
                  alt={personB.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-300"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{personB.name}</p>
                <p className="text-sm text-gray-600">{personB.surname}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
