
'use client';

import * as React from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { findUserById } from '@/lib/user-utils';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';


const getFirstName = (fullName?: string) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
};

const getParentDisplay = (user: User, allUsers: User[]) => {
    const father = findUserById(user.fatherId, allUsers);
    const mother = findUserById(user.motherId, allUsers);
    const fatherName = father ? father.name : getFirstName(user.fatherName);
    const motherName = mother ? mother.name : getFirstName(user.motherName);
    const relation = user.gender === 'male' ? 's/o' : 'd/o';

    if (!fatherName && !motherName) return null;
    
    let text = `${relation} ${fatherName}`;
    if (motherName) {
        text += ` & ${motherName}`;
    }
    return text;
}

const getSpouseDisplay = (user: User, allUsers: User[]) => {
    const spouse = findUserById(user.spouseId, allUsers);
    const spouseName = spouse ? spouse.name : getFirstName(user.spouseName);
    const relation = user.gender === 'male' ? 'h/o' : 'w/o';
    if (user.maritalStatus === 'married' && spouseName) {
        return `${relation} ${spouseName}`;
    }
    return null;
}


const ProfileCard = ({ user, allUsers, priority }: { user: User; allUsers: User[], priority?: boolean }) => {
  if (!user) return null;
  const parentText = getParentDisplay(user, allUsers);
  const spouseText = getSpouseDisplay(user, allUsers);

  return (
    <Link href={`/profile/${user.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary/30 group-hover:-translate-y-1 bg-card/30 backdrop-blur-lg border-white/10 shadow-lg">
        <CardContent className="p-4 text-center flex flex-col items-center">
            <Image
                src={user.profilePictureUrl}
                alt={`Profile picture of ${user.name} ${user.surname}`}
                width={100}
                height={100}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
                data-ai-hint="profile avatar"
                className={cn("rounded-full mx-auto mb-4 border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-110", user.isDeceased && "border-4 border-amber-400 p-1")}
            />
            <div className="flex-grow flex flex-col justify-between w-full">
                <div>
                    <h3 className="font-semibold text-lg text-primary truncate">{user.name} {user.surname}</h3>
                    
                    <div className="text-sm text-muted-foreground mt-2 space-y-1 min-h-[40px]">
                        {parentText && <p className="text-balance">{parentText}</p>}
                        {spouseText && <p className="text-balance">{spouseText}</p>}
                    </div>
                </div>

                {user.family && (
                    <div className="mt-3">
                        <Badge variant="secondary" className="whitespace-nowrap bg-black/10 border-white/10 text-foreground/80">
                            {user.family}
                        </Badge>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </Link>
  );
};


export default function ProfileCarousel({ users, allUsers }: { users: User[]; allUsers: User[] }) {
  const [shuffledUsers, setShuffledUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    // Shuffle the users array only on the client side to prevent hydration mismatch.
    setShuffledUsers([...users].sort(() => 0.5 - Math.random()));
  }, [users]);
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  
  if (shuffledUsers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No featured profiles available.</div>;
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[autoplayPlugin.current]}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {shuffledUsers.map((user, index) => (
          <CarouselItem key={user.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="p-1 h-full">
              <ProfileCard user={user} allUsers={allUsers} priority={index < 3} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
