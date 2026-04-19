'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Loader2, Search } from 'lucide-react';
import { User } from '@/lib/types';
import { findRelationshipPath } from '@/lib/relationship-finder';
import { getUsers } from '@/actions/users';
import RelationshipPathVisualization from './RelationshipPathVisualization';
import UserSelectionModal from './UserSelectionModal';

export default function RelationshipFinderClient() {
  const [personA, setPersonA] = useState<User | null>(null);
  const [personB, setPersonB] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [relationship, setRelationship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [showPersonAModal, setShowPersonAModal] = useState(false);
  const [showPersonBModal, setShowPersonBModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        const data = await getUsers();
        // Filter out deleted and deceased users for easier selection
        const active = data.filter(u => !u.isDeleted);
        setUsers(active);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load community data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFindRelationship = async () => {
    if (!personA || !personB) {
      setError('Please select both people');
      return;
    }

    setFinding(true);
    setError(null);
    try {
      const result = findRelationshipPath(personA, personB, users);
      setRelationship(result);
    } catch (error) {
      console.error('Error finding relationship:', error);
      setError('An error occurred while finding the relationship. Please try again.');
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Card */}
      <Card className="border-2 border-purple-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="text-2xl">Select Two People</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Available users: <span className="font-semibold">{users.length}</span>
          </p>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Person A Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👤 Person A
            </label>
            {personA ? (
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-300 shadow-sm">
                {personA.profilePictureUrl && (
                  <img
                    src={personA.profilePictureUrl}
                    alt={personA.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                  />
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg">{personA.name} {personA.surname}</p>
                  {personA.family && (
                    <p className="text-sm text-gray-600">{personA.family}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPersonAModal(true)}
                  className="text-purple-600 border-purple-600 hover:bg-purple-100"
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowPersonAModal(true)}
                className="w-full py-8 text-lg font-semibold rounded-lg border-2 border-dashed border-purple-300 hover:bg-purple-50 hover:border-purple-500"
                variant="outline"
              >
                <Search className="w-5 h-5 mr-2" />
                Select Person A
              </Button>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwap}
              variant="outline"
              size="sm"
              disabled={!personA || !personB}
              className="gap-2 border-2 border-gray-300 hover:bg-gray-100"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Swap
            </Button>
          </div>

          {/* Person B Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👤 Person B
            </label>
            {personB ? (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 shadow-sm">
                {personB.profilePictureUrl && (
                  <img
                    src={personB.profilePictureUrl}
                    alt={personB.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
                  />
                )}
                <div className="flex-1">
                  <p className="font-bold text-lg">{personB.name} {personB.surname}</p>
                  {personB.family && (
                    <p className="text-sm text-gray-600">{personB.family}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPersonBModal(true)}
                  className="text-blue-600 border-blue-600 hover:bg-blue-100"
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowPersonBModal(true)}
                className="w-full py-8 text-lg font-semibold rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-50 hover:border-blue-500"
                variant="outline"
              >
                <Search className="w-5 h-5 mr-2" />
                Select Person B
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleFindRelationship}
              disabled={!personA || !personB || finding}
              className="flex-1 py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {finding ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  🔍 Find Relationship
                </>
              )}
            </Button>
            {(personA || personB) && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="px-6"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {relationship && (
        <RelationshipPathVisualization
          relationship={relationship}
          users={users}
        />
      )}

      {/* Modals */}
      <UserSelectionModal
        open={showPersonAModal}
        onClose={() => setShowPersonAModal(false)}
        onSelect={(user) => {
          setPersonA(user);
          setShowPersonAModal(false);
          setRelationship(null);
        }}
        users={users}
        title="Select Person A"
        currentSelected={personB}
      />

      <UserSelectionModal
        open={showPersonBModal}
        onClose={() => setShowPersonBModal(false)}
        onSelect={(user) => {
          setPersonB(user);
          setShowPersonBModal(false);
          setRelationship(null);
        }}
        users={users}
        title="Select Person B"
        currentSelected={personA}
      />
    </div>
  );
}
