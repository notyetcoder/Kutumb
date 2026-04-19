'use client';

import { useEffect, useState } from 'react';
import { User, RelationshipResult } from '@/lib/types';
import { findRelationshipPath } from '@/lib/relationship-finder';
import { RelationshipPathVisualization } from './RelationshipPathVisualization';
import { UserSelectionModal } from './UserSelectionModal';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRightLeft, Loader2, Search, AlertCircle } from 'lucide-react';

interface RelationshipFinderClientProps {
  users: User[];
  loading?: boolean;
}

export function RelationshipFinderClient({ users, loading = false }: RelationshipFinderClientProps) {
  const { language } = useLanguage();
  const [personA, setPersonA] = useState<User | null>(null);
  const [personB, setPersonB] = useState<User | null>(null);
  const [relationship, setRelationship] = useState<RelationshipResult | null>(null);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectingFor, setSelectingFor] = useState<'a' | 'b' | null>(null);

  const handleFindRelationship = async () => {
    if (!personA || !personB) {
      setError(language === 'gujarati' ? 'કૃપા કરીને બંને લોકો પસંદ કરો' : 'Please select both people');
      return;
    }

    if (personA.id === personB.id) {
      setRelationship({
        found: true,
        relationship: 'same',
        explanation: 'Same person'
      });
      return;
    }

    try {
      setFinding(true);
      setError(null);
      const result = findRelationshipPath(personA, personB, users);
      setRelationship(result);
    } catch (err) {
      console.error('Error:', err);
      setError('Error finding relationship');
    } finally {
      setFinding(false);
    }
  };

  const handleSwap = () => {
    const temp = personA;
    setPersonA(personB);
    setPersonB(temp);
    setRelationship(null);
  };

  const handleClear = () => {
    setPersonA(null);
    setPersonB(null);
    setRelationship(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Person A */}
        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-600">
              {language === 'gujarati' ? 'વ્યક્તિ ૧' : language === 'hindi' ? 'व्यक्ति 1' : 'Person 1'}
            </div>
            {personA ? (
              <div className="flex items-center gap-3">
                {personA.profilePictureUrl && (
                  <img
                    src={personA.profilePictureUrl}
                    alt={personA.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{personA.name}</p>
                  <p className="text-xs text-gray-600">{personA.surname}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              </div>
            )}
            <button
              onClick={() => setSelectingFor('a')}
              className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {personA ? 'બદલો' : 'પસંદ કરો'}
            </button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleSwap}
            disabled={!personA || !personB}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Swap"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Person B */}
        <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-600">
              {language === 'gujarati' ? 'વ્યક્તિ ૨' : language === 'hindi' ? 'व्यक्ति 2' : 'Person 2'}
            </div>
            {personB ? (
              <div className="flex items-center gap-3">
                {personB.profilePictureUrl && (
                  <img
                    src={personB.profilePictureUrl}
                    alt={personB.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{personB.name}</p>
                  <p className="text-xs text-gray-600">{personB.surname}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              </div>
            )}
            <button
              onClick={() => setSelectingFor('b')}
              className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {personB ? 'બદલો' : 'પસંદ કરો'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-900">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleFindRelationship}
          disabled={!personA || !personB || finding}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {finding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
              શોધી રહ્યા છીએ...
            </>
          ) : (
            '🔗 સંબંધ શોધો'
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={!personA && !personB && !relationship}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ક્લીયર
        </button>
      </div>

      {/* Results */}
      {relationship && (
        <RelationshipPathVisualization
          relationship={relationship}
          personA={personA}
          personB={personB}
          language={language}
        />
      )}

      {/* User Selection Modal */}
      {selectingFor && (
        <UserSelectionModal
          users={users}
          onSelect={(user) => {
            if (selectingFor === 'a') {
              setPersonA(user);
            } else {
              setPersonB(user);
            }
            setSelectingFor(null);
            setRelationship(null);
          }}
          onClose={() => setSelectingFor(null)}
          excludeUser={selectingFor === 'a' ? personB : personA}
        />
      )}
    </div>
  );
}
