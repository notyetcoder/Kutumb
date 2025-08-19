
'use client';
import { useState, useMemo, useEffect, useCallback, startTransition } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getAllUsersForPublic } from '@/actions/users';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { findUserById } from '@/lib/user-utils';
import Fuse from 'fuse.js';

interface UserSearchProps {
    initialUsers: User[];
    initialTotal: number;
    pageSize: number;
}

const getFirstName = (fullName?: string | null) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
};

const getParentDisplay = (user: User, allUsers: User[]) => {
    const father = findUserById(user.fatherId, allUsers);
    const mother = findUserById(user.motherId, allUsers);
    
    const fatherName = father ? father.name : getFirstName(user.fatherName);
    const motherName = mother ? mother.name : getFirstName(user.motherName);
    
    if (!fatherName && !motherName) return null;

    const relation = user.gender === 'male' ? 's/o' : 'd/o';

    if (fatherName && motherName) {
        return `${relation} ${fatherName} & ${motherName}`;
    }
    
    return `${relation} ${fatherName || motherName}`;
};

const getSpouseDisplay = (user: User, allUsers: User[]) => {
    if (user.maritalStatus !== 'married') return null;
    
    const spouse = findUserById(user.spouseId, allUsers);
    const spouseName = spouse ? spouse.name : getFirstName(user.spouseName);

    if (spouseName) {
        const relation = user.gender === 'male' ? 'h/o' : 'w/o';
        return `${relation} ${spouseName}`;
    }
    return null;
};

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function UserSearch({ initialUsers, initialTotal, pageSize }: UserSearchProps) {
    const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [surnameFilter, setSurnameFilter] = useState('all');
    const [familyFilter, setFamilyFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [maritalStatusFilter, setMaritalStatusFilter] = useState('all');

    const [fuse, setFuse] = useState<Fuse<User> | null>(null);
    const { toast } = useToast();

    // Effect to handle the initial and background fetching of users
    useEffect(() => {
        // Set the initial small batch of users for display, shuffled.
        setDisplayedUsers(shuffleArray([...initialUsers]));

        // Fetch all users in the background to power the search and fill in details.
        const fetchAll = async () => {
            try {
                const { users } = await getAllUsersForPublic(1, 10000); // Fetch all
                setAllUsers(users);
                setFuse(new Fuse(users, {
                    keys: ['name', 'surname', 'family', 'description', 'id'],
                    includeScore: true,
                    minMatchCharLength: 2,
                    threshold: 0.3,
                }));
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load all users for search.' });
            }
        };

        fetchAll();
    }, [initialUsers, toast]);

    const uniqueSurnames = useMemo(() => {
        const source = allUsers.length > 0 ? allUsers : initialUsers;
        const surnames = new Set<string>();
        source.forEach(user => {
            if (user.surname) surnames.add(user.surname);
        });
        return Array.from(surnames).sort();
    }, [initialUsers, allUsers]);

    const uniqueFamilies = useMemo(() => {
        const source = allUsers.length > 0 ? allUsers : initialUsers;
        const families = new Set<string>();
        source.forEach(user => {
            if (user.family) families.add(user.family);
        });
        return Array.from(families).sort();
    }, [initialUsers, allUsers]);

    const hasActiveFilters = surnameFilter !== 'all' || familyFilter !== 'all' || genderFilter !== 'all' || maritalStatusFilter !== 'all';

    const searchResults = useMemo(() => {
        if (searchTerm && fuse) {
            return fuse.search(searchTerm, { limit: 50 }).map(result => result.item);
        }
        return null;
    }, [searchTerm, fuse]);

    const filteredAndSortedUsers = useMemo(() => {
        const source = hasActiveFilters ? allUsers : displayedUsers;

        if (hasActiveFilters) {
             return allUsers.filter(user => {
                const surnameMatch = surnameFilter === 'all' || user.surname === surnameFilter;
                const familyMatch = familyFilter === 'all' || user.family === familyFilter;
                const genderMatch = genderFilter === 'all' || user.gender === genderFilter;
                const maritalMatch = maritalStatusFilter === 'all' || user.maritalStatus === maritalStatusFilter;
                return surnameMatch && familyMatch && genderMatch && maritalMatch;
            });
        }
        
        return source;

    }, [allUsers, displayedUsers, surnameFilter, familyFilter, genderFilter, maritalStatusFilter, hasActiveFilters]);
    
    const finalUsersToShow = searchResults ?? filteredAndSortedUsers;
    const lookupUsers = allUsers.length > 0 ? allUsers : initialUsers;
    
    return (
        <div className="space-y-8">
            <Card className="p-4 sm:p-6 bg-card/30 backdrop-blur-lg border-white/10 shadow-lg">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder='Search by name, surname, family, or description...'
                            className="w-full pl-10 h-11 bg-background/50 border-white/20 focus:bg-background"
                            value={searchTerm}
                            onChange={(e) => startTransition(() => setSearchTerm(e.target.value))}
                            disabled={!fuse}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Select value={surnameFilter} onValueChange={setSurnameFilter}>
                            <SelectTrigger className="bg-background/50 border-white/20"><SelectValue placeholder="All Surnames" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Surnames</SelectItem>
                                {uniqueSurnames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={familyFilter} onValueChange={setFamilyFilter}>
                            <SelectTrigger className="bg-background/50 border-white/20"><SelectValue placeholder="All Families" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Families</SelectItem>
                                {uniqueFamilies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={genderFilter} onValueChange={setGenderFilter}>
                            <SelectTrigger className="bg-background/50 border-white/20"><SelectValue placeholder="All Genders" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={maritalStatusFilter} onValueChange={setMaritalStatusFilter}>
                            <SelectTrigger className="bg-background/50 border-white/20"><SelectValue placeholder="All Marital Statuses" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Marital Statuses</SelectItem>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {finalUsersToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {finalUsersToShow.map((user) => {
                        const parentDisplay = getParentDisplay(user, lookupUsers);
                        const spouseDisplay = getSpouseDisplay(user, lookupUsers);

                        let secondaryInfo;
                         if (user.maritalStatus === 'married' && spouseDisplay) {
                            secondaryInfo = spouseDisplay;
                        } else if (user.isDeceased) {
                             secondaryInfo = <>&nbsp;</>;
                        } else if (user.maritalStatus === 'single') {
                            secondaryInfo = <>&nbsp;</>;
                        } else {
                            secondaryInfo = user.description || <>&nbsp;</>;
                        }

                        return (
                            <Link key={user.id} href={`/profile/${user.id}`} className="group block">
                                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-white/20 group-hover:-translate-y-1 bg-card/30 backdrop-blur-lg border-white/10 shadow-lg">
                                    <CardContent className="p-4 text-center flex flex-col h-full">
                                        <Image
                                            src={user.profilePictureUrl}
                                            alt={user.name}
                                            width={100}
                                            height={100}
                                            loading="lazy"
                                            data-ai-hint="profile avatar"
                                            className={cn("rounded-full mx-auto mb-4 border-4 border-background shadow-md", user.isDeceased && "border-4 border-amber-400 p-1")}
                                        />
                                        <div className="flex-grow flex flex-col justify-center">
                                          <h3 className="font-semibold text-lg text-primary truncate">
                                            {user.name} {user.surname}
                                          </h3>
                                          <div className="text-sm text-muted-foreground mt-2 space-y-1 min-h-[40px]">
                                              <p className="truncate">{parentDisplay || <>&nbsp;</>}</p>
                                              <p className="truncate">{secondaryInfo}</p>
                                          </div>
                                        </div>

                                        <div className="mt-auto pt-3">
                                          {user.isDeceased ? (
                                              <Badge variant="secondary" className="whitespace-nowrap bg-black/10 border-amber-400/50 text-foreground/80">
                                                  स्वर्गस्थ
                                              </Badge>
                                          ) : user.family ? (
                                              <Badge variant="secondary" className="whitespace-nowrap bg-black/10 border-white/10 text-foreground/80">
                                                  {user.family}
                                              </Badge>
                                          ) : null}
                                        </div>
                                     </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">
                        No matching profiles found.
                    </p>
                </div>
            )}
        </div>
    );
}
