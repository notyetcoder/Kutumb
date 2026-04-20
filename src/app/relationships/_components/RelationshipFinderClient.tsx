'use client';

import { useEffect, useState, useMemo } from 'react';
import { User } from '@/lib/types';
import { findAllRelationshipPaths, FoundPath } from '@/lib/relationship-engine';
import { getAllUsersForPublic } from '@/actions/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '@/components/UserAvatar';
import { ArrowRight, ArrowRightLeft, ChevronRight, Loader2, Search, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ─── Person Selector Modal ───────────────────────────────────────────────────

function PersonSelectorModal({
  open, onClose, onSelect, users, title, exclude,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (u: User) => void;
  users: User[];
  title: string;
  exclude?: User | null;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users
      .filter(u => u.id !== exclude?.id)
      .filter(u => !term || `${u.name} ${u.surname}`.toLowerCase().includes(term))
      .slice(0, 80);
  }, [users, q, exclude]);

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search by name..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-2 space-y-1">
            {filtered.map(u => (
              <button
                key={u.id}
                onClick={() => { onSelect(u); onClose(); setQ(''); }}
                className="flex items-center gap-3 w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
              >
                <UserAvatar name={u.name} profilePictureUrl={u.profilePictureUrl} size={40} isDeceased={u.isDeceased} />
                <div>
                  <p className="font-medium text-sm">{u.name} {u.surname}</p>
                  {u.family && <p className="text-xs text-muted-foreground">{u.family}</p>}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Path Tree Visualization ────────────────────────────────────────────────

function EdgeLabel({ label }: { label: string }) {
  const map: Record<string, string> = {
    father: 'Father ↑', mother: 'Mother ↑',
    son: 'Son ↓', daughter: 'Daughter ↓',
    spouse: 'Spouse →',
  };
  return (
    <div className="flex flex-col items-center gap-1 mx-1">
      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full whitespace-nowrap">
        {map[label] ?? label}
      </span>
      <ChevronRight className="h-4 w-4 text-primary/60 shrink-0" />
    </div>
  );
}

function PathVisualization({ path, index, isActive, onClick }: {
  path: FoundPath;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
        isActive
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-white/10 bg-card/20 hover:border-primary/40',
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            Connection {index + 1}
          </span>
          <span className="text-xs text-muted-foreground">{path.distance} step{path.distance !== 1 ? 's' : ''}</span>
        </div>
        {/* Relationship badge */}
        <div className="text-right">
          <p className="text-sm font-bold text-primary">{path.labels.gujarati}</p>
          <p className="text-xs text-muted-foreground">{path.labels.english}</p>
        </div>
      </div>

      {/* Chain */}
      <div className="overflow-x-auto">
        <div className="flex items-center min-w-max gap-0">
          {path.steps.map((step, i) => (
            <div key={`${step.id}-${i}`} className="flex items-center">
              {i > 0 && <EdgeLabel label={step.edgeLabel} />}
              <Link
                href={`/profile/${step.id}`}
                onClick={e => e.stopPropagation()}
                className="flex flex-col items-center gap-1 group min-w-[70px]"
              >
                <UserAvatar
                  name={step.name}
                  profilePictureUrl={step.profilePictureUrl}
                  size={i === 0 || i === path.steps.length - 1 ? 56 : 44}
                  isDeceased={false}
                  className={cn(
                    'transition-transform group-hover:scale-110',
                    (i === 0 || i === path.steps.length - 1) && 'ring-2 ring-primary ring-offset-2',
                  )}
                />
                <p className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors max-w-[70px] truncate">
                  {step.name}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Hindi label */}
      <p className="text-xs text-muted-foreground mt-2 text-right">{path.labels.hindi}</p>
    </div>
  );
}

// ─── Person Card (selector UI) ───────────────────────────────────────────────

function PersonCard({ user, label, onClear, onSelect }: {
  user: User | null;
  label: string;
  onClear: () => void;
  onSelect: () => void;
}) {
  if (!user) {
    return (
      <button
        onClick={onSelect}
        className="flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/60 hover:bg-primary/5 transition-all"
      >
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Click to select</p>
      </button>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-2 w-full h-36 rounded-xl border-2 border-primary/40 bg-primary/5 p-3 justify-center">
      <button
        onClick={onClear}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <UserAvatar name={user.name} profilePictureUrl={user.profilePictureUrl} size={52} isDeceased={user.isDeceased} />
      <p className="font-semibold text-sm text-center">{user.name} {user.surname}</p>
      {user.family && <p className="text-xs text-muted-foreground">{user.family}</p>}
      <button onClick={onSelect} className="text-xs text-primary hover:underline">Change</button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RelationshipFinderClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [personA, setPersonA] = useState<User | null>(null);
  const [personB, setPersonB] = useState<User | null>(null);
  const [result, setResult] = useState<ReturnType<typeof findAllRelationshipPaths> | null>(null);
  const [finding, setFinding] = useState(false);
  const [activePathIdx, setActivePathIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState<'A' | 'B' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllUsersForPublic(1, 5000)
      .then(({ users: u }) => setUsers(u))
      .catch(() => setError('Could not load community data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleFind = () => {
    if (!personA || !personB) return;
    setFinding(true);
    setError(null);
    try {
      const res = findAllRelationshipPaths(personA, personB, users);
      setResult(res);
      setActivePathIdx(0);
      if (!res.found) setError('No connection found within 8 steps between these two people.');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setFinding(false);
    }
  };

  const handleSwap = () => {
    setPersonA(personB);
    setPersonB(personA);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Selector card */}
      <Card className="bg-card/30 backdrop-blur-lg border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Select Two People</CardTitle>
          <p className="text-sm text-muted-foreground">{users.length} community members loaded</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <PersonCard
              user={personA}
              label="Person A"
              onClear={() => { setPersonA(null); setResult(null); }}
              onSelect={() => setModalOpen('A')}
            />
            <button
              onClick={handleSwap}
              disabled={!personA && !personB}
              className="p-2 rounded-full border border-white/20 hover:bg-primary/10 disabled:opacity-40 transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <PersonCard
              user={personB}
              label="Person B"
              onClear={() => { setPersonB(null); setResult(null); }}
              onSelect={() => setModalOpen('B')}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
          )}

          <Button
            onClick={handleFind}
            disabled={!personA || !personB || finding}
            className="w-full py-5 text-base font-semibold bg-gradient-to-r from-primary to-violet-500 hover:opacity-90"
            size="lg"
          >
            {finding ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
            Find Relationship
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result?.found && result.paths.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {result.paths.length === 1 ? '1 Connection Found' : `${result.paths.length} Connections Found`}
            </h2>
            <p className="text-sm text-muted-foreground">
              Closest: <span className="font-semibold text-primary">{result.paths[0].labels.gujarati}</span>
            </p>
          </div>
          <div className="space-y-3">
            {result.paths.map((path, i) => (
              <PathVisualization
                key={i}
                path={path}
                index={i}
                isActive={activePathIdx === i}
                onClick={() => setActivePathIdx(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <PersonSelectorModal
        open={modalOpen === 'A'}
        onClose={() => setModalOpen(null)}
        onSelect={u => { setPersonA(u); setResult(null); }}
        users={users}
        title="Select Person A"
        exclude={personB}
      />
      <PersonSelectorModal
        open={modalOpen === 'B'}
        onClose={() => setModalOpen(null)}
        onSelect={u => { setPersonB(u); setResult(null); }}
        users={users}
        title="Select Person B"
        exclude={personA}
      />
    </div>
  );
}
