import { User } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PathStep {
  id: string;
  name: string;
  gender: 'male' | 'female';
  profilePictureUrl?: string;
  edgeLabel: string; // e.g. "Father", "Son", "Spouse"
}

export interface RelationshipResult {
  found: boolean;
  paths: FoundPath[];
}

export interface FoundPath {
  steps: PathStep[];          // includes start person
  relationshipKey: string;    // e.g. "maternal_uncle"
  labels: { gujarati: string; hindi: string; english: string };
  distance: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONSHIP LABELS — Gujarati / Hindi / English
// ─────────────────────────────────────────────────────────────────────────────

const LABELS: Record<string, { gujarati: string; hindi: string; english: string }> = {
  self:                        { gujarati: 'પોતે',          hindi: 'स्वयं',        english: 'Self' },
  father:                      { gujarati: 'પિતા (બાપ)',    hindi: 'पिता',         english: 'Father' },
  mother:                      { gujarati: 'માતા (બા)',     hindi: 'माता',         english: 'Mother' },
  son:                         { gujarati: 'દીકરો',         hindi: 'बेटा',         english: 'Son' },
  daughter:                    { gujarati: 'દીકરી',         hindi: 'बेटी',         english: 'Daughter' },
  husband:                     { gujarati: 'પતિ',           hindi: 'पति',          english: 'Husband' },
  wife:                        { gujarati: 'પત્ની',         hindi: 'पत्नी',        english: 'Wife' },
  brother:                     { gujarati: 'ભાઈ',           hindi: 'भाई',          english: 'Brother' },
  sister:                      { gujarati: 'બહેન',          hindi: 'बहन',          english: 'Sister' },
  paternal_grandfather:        { gujarati: 'દાદા',          hindi: 'दादा',         english: 'Paternal Grandfather (Dada)' },
  paternal_grandmother:        { gujarati: 'દાદી',          hindi: 'दादी',         english: 'Paternal Grandmother (Dadi)' },
  maternal_grandfather:        { gujarati: 'નાના',          hindi: 'नाना',         english: 'Maternal Grandfather (Nana)' },
  maternal_grandmother:        { gujarati: 'નાની',          hindi: 'नानी',         english: 'Maternal Grandmother (Nani)' },
  paternal_great_grandfather:  { gujarati: 'પરદાદા',        hindi: 'परदादा',       english: 'Paternal Great-Grandfather' },
  paternal_great_grandmother:  { gujarati: 'પરદાદી',        hindi: 'परदादी',       english: 'Paternal Great-Grandmother' },
  maternal_great_grandfather:  { gujarati: 'પરનાના',        hindi: 'परनाना',       english: 'Maternal Great-Grandfather' },
  maternal_great_grandmother:  { gujarati: 'પરનાની',        hindi: 'परनानी',       english: 'Maternal Great-Grandmother' },
  grandson_son:                { gujarati: 'પૌત્ર',         hindi: 'पोता',         english: "Grandson (Son's Son)" },
  granddaughter_son:           { gujarati: 'પૌત્રી',        hindi: 'पोती',         english: "Granddaughter (Son's Daughter)" },
  grandson_daughter:           { gujarati: 'દોહિત્ર',       hindi: 'नाती',         english: "Grandson (Daughter's Son)" },
  granddaughter_daughter:      { gujarati: 'દોહિત્રી',      hindi: 'नातिन',        english: "Granddaughter (Daughter's Daughter)" },
  paternal_uncle:              { gujarati: 'કાકા',          hindi: 'चाचा',         english: 'Paternal Uncle (Kaka)' },
  paternal_uncle_wife:         { gujarati: 'કાકી',          hindi: 'चाची',         english: "Paternal Uncle's Wife (Kaki)" },
  paternal_aunt:               { gujarati: 'ફોઈ',           hindi: 'बुआ',          english: 'Paternal Aunt (Foi)' },
  paternal_aunt_husband:       { gujarati: 'ફૂફા',          hindi: 'फूफा',         english: "Paternal Aunt's Husband (Fufa)" },
  maternal_uncle:              { gujarati: 'મામા',          hindi: 'मामा',         english: 'Maternal Uncle (Mama)' },
  maternal_uncle_wife:         { gujarati: 'મામી',          hindi: 'मामी',         english: "Maternal Uncle's Wife (Mami)" },
  maternal_aunt:               { gujarati: 'માસી',          hindi: 'मौसी',         english: 'Maternal Aunt (Masi)' },
  maternal_aunt_husband:       { gujarati: 'માસા',          hindi: 'मौसा',         english: "Maternal Aunt's Husband (Masa)" },
  father_in_law:               { gujarati: 'સસરા',          hindi: 'ससुर',         english: 'Father-in-Law (Sasra)' },
  mother_in_law:               { gujarati: 'સાસુ',          hindi: 'सास',          english: 'Mother-in-Law (Sasu)' },
  son_in_law:                  { gujarati: 'જમાઈ',          hindi: 'दामाद',        english: 'Son-in-Law (Jamai)' },
  daughter_in_law:             { gujarati: 'પુત્રવધૂ',      hindi: 'बहू',          english: 'Daughter-in-Law (Vahu)' },
  wife_brother:                { gujarati: 'સાળો',          hindi: 'साला',         english: "Wife's Brother (Salo)" },
  wife_sister:                 { gujarati: 'સાળી',          hindi: 'साली',         english: "Wife's Sister (Sali)" },
  husband_elder_brother:       { gujarati: 'જેઠ',           hindi: 'जेठ',          english: "Husband's Elder Brother (Jeth)" },
  husband_younger_brother:     { gujarati: 'દિયર',          hindi: 'देवर',         english: "Husband's Younger Brother (Diyar)" },
  husband_sister:              { gujarati: 'નણંદ',          hindi: 'ननद',          english: "Husband's Sister (Nanad)" },
  sister_husband:              { gujarati: 'જીજાજી',        hindi: 'जीजा',         english: "Sister's Husband (Jijaji)" },
  brother_wife:                { gujarati: 'ભાભી',          hindi: 'भाभी',         english: "Brother's Wife (Bhabi)" },
  paternal_male_cousin:        { gujarati: 'કાકાનો દીકરો',  hindi: 'चाचा का बेटा', english: 'Paternal Cousin (Male)' },
  paternal_female_cousin:      { gujarati: 'કાકાની દીકરી',  hindi: 'चाचा की बेटी', english: 'Paternal Cousin (Female)' },
  maternal_uncle_male_cousin:  { gujarati: 'મામાનો દીકરો',  hindi: 'मामा का बेटा', english: "Maternal Uncle's Son (Mama no dikro)" },
  maternal_uncle_female_cousin:{ gujarati: 'મામાની દીકરી',  hindi: 'मामा की बेटी', english: "Maternal Uncle's Daughter (Mama ni dikri)" },
  maternal_aunt_male_cousin:   { gujarati: 'માસીનો દીકરો',  hindi: 'मौसी का बेटा', english: "Maternal Aunt's Son (Masi no dikro)" },
  maternal_aunt_female_cousin: { gujarati: 'માસીની દીકરી',  hindi: 'मौसी की बेटी', english: "Maternal Aunt's Daughter (Masi ni dikri)" },
  paternal_aunt_male_cousin:   { gujarati: 'ફોઈનો દીકરો',   hindi: 'बुआ का बेटा',  english: "Paternal Aunt's Son (Foi no dikro)" },
  paternal_aunt_female_cousin: { gujarati: 'ફોઈની દીકરી',   hindi: 'बुआ की बेटी',  english: "Paternal Aunt's Daughter (Foi ni dikri)" },
  nephew_brother:              { gujarati: 'ભત્રીજો',        hindi: 'भतीजा',        english: "Brother's Son (Nephew)" },
  niece_brother:               { gujarati: 'ભત્રીજી',        hindi: 'भतीजी',        english: "Brother's Daughter (Niece)" },
  nephew_sister:               { gujarati: 'ભાણો',           hindi: 'भांजा',        english: "Sister's Son (Nephew)" },
  niece_sister:                { gujarati: 'ભાણી',           hindi: 'भांजी',        english: "Sister's Daughter (Niece)" },
  distant_relative:            { gujarati: 'સગો',            hindi: 'रिश्तेदार',    english: 'Distant Relative' },
};

function label(key: string) {
  return LABELS[key] ?? LABELS['distant_relative'];
}

// ─────────────────────────────────────────────────────────────────────────────
// BFS GRAPH SETUP
// ─────────────────────────────────────────────────────────────────────────────

interface BFSNode {
  userId: string;
  path: string[];  // ordered IDs from personA
  edgeLabels: string[];
}

const MAX_DEPTH = 8;
const MAX_PATHS = 5;

function buildChildrenMap(allUsers: User[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const u of allUsers) {
    if (u.fatherId) {
      if (!map.has(u.fatherId)) map.set(u.fatherId, []);
      map.get(u.fatherId)!.push(u.id);
    }
    if (u.motherId) {
      if (!map.has(u.motherId)) map.set(u.motherId, []);
      map.get(u.motherId)!.push(u.id);
    }
  }
  return map;
}

function getNeighbors(
  user: User,
  userMap: Map<string, User>,
  childrenMap: Map<string, string[]>
): Array<{ id: string; edgeLabel: string }> {
  const neighbors: Array<{ id: string; edgeLabel: string }> = [];

  if (user.fatherId && userMap.has(user.fatherId))
    neighbors.push({ id: user.fatherId, edgeLabel: 'father' });
  if (user.motherId && userMap.has(user.motherId))
    neighbors.push({ id: user.motherId, edgeLabel: 'mother' });
  if (user.spouseId && userMap.has(user.spouseId))
    neighbors.push({ id: user.spouseId, edgeLabel: 'spouse' });

  const children = childrenMap.get(user.id) || [];
  for (const cid of children) {
    const child = userMap.get(cid);
    if (child) neighbors.push({ id: cid, edgeLabel: child.gender === 'male' ? 'son' : 'daughter' });
  }

  return neighbors;
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONSHIP LABELLER — analyses the path to determine the specific relation
// ─────────────────────────────────────────────────────────────────────────────

function labelRelationship(
  personA: User,
  personB: User,
  pathIds: string[],
  userMap: Map<string, User>
): { key: string; labels: { gujarati: string; hindi: string; english: string } } {

  const distance = pathIds.length - 1;
  const get = (id: string) => userMap.get(id);

  // ── distance 1 ──────────────────────────────────────────────────────────
  if (distance === 1) {
    if (personB.id === personA.fatherId) return { key: 'father', labels: label('father') };
    if (personB.id === personA.motherId) return { key: 'mother', labels: label('mother') };
    if (personB.id === personA.spouseId) {
      const key = personB.gender === 'male' ? 'husband' : 'wife';
      return { key, labels: label(key) };
    }
    // child
    const key = personB.gender === 'male' ? 'son' : 'daughter';
    return { key, labels: label(key) };
  }

  // ── distance 2 ──────────────────────────────────────────────────────────
  if (distance === 2) {
    const mid = get(pathIds[1]);
    if (!mid) return fallback(distance);

    // grandparents
    if (mid.id === personA.fatherId) {
      if (personB.id === mid.fatherId) return { key: 'paternal_grandfather', labels: label('paternal_grandfather') };
      if (personB.id === mid.motherId) return { key: 'paternal_grandmother', labels: label('paternal_grandmother') };
      if (personB.id === mid.spouseId) return { key: 'paternal_grandmother', labels: label('paternal_grandmother') };
    }
    if (mid.id === personA.motherId) {
      if (personB.id === mid.fatherId) return { key: 'maternal_grandfather', labels: label('maternal_grandfather') };
      if (personB.id === mid.motherId) return { key: 'maternal_grandmother', labels: label('maternal_grandmother') };
      if (personB.id === mid.spouseId) return { key: 'maternal_grandfather', labels: label('maternal_grandfather') };
    }

    // grandchildren
    if (personA.id === mid.fatherId || personA.id === mid.motherId) {
      // mid is A's child
      if (mid.gender === 'male') {
        const key = personB.gender === 'male' ? 'grandson_son' : 'granddaughter_son';
        return { key, labels: label(key) };
      } else {
        const key = personB.gender === 'male' ? 'grandson_daughter' : 'granddaughter_daughter';
        return { key, labels: label(key) };
      }
    }

    // siblings (via shared parent)
    if (
      (personA.fatherId && personA.fatherId === personB.fatherId) ||
      (personA.motherId && personA.motherId === personB.motherId)
    ) {
      const key = personB.gender === 'male' ? 'brother' : 'sister';
      return { key, labels: label(key) };
    }

    // in-laws via spouse
    if (mid.id === personA.spouseId) {
      if (personB.id === mid.fatherId) return { key: 'father_in_law', labels: label('father_in_law') };
      if (personB.id === mid.motherId) return { key: 'mother_in_law', labels: label('mother_in_law') };
    }
    // spouse's siblings → salo/sali or nanad/diyar/jeth
    if (personA.spouseId) {
      const spouse = get(personA.spouseId);
      if (spouse && (personB.fatherId === spouse.fatherId || personB.motherId === spouse.motherId)) {
        if (personA.gender === 'male') {
          const key = personB.gender === 'male' ? 'wife_brother' : 'wife_sister';
          return { key, labels: label(key) };
        } else {
          const key = personB.gender === 'male' ? 'husband_younger_brother' : 'husband_sister';
          return { key, labels: label(key) };
        }
      }
    }
    // son/daughter in law
    if (personA.id === mid.fatherId || personA.id === mid.motherId) {
      if (mid.spouseId === personB.id) {
        const key = mid.gender === 'male' ? 'daughter_in_law' : 'son_in_law';
        return { key, labels: label(key) };
      }
    }

    return fallback(distance);
  }

  // ── distance 3 ──────────────────────────────────────────────────────────
  if (distance === 3) {
    const mid1 = get(pathIds[1]);
    const mid2 = get(pathIds[2]);
    if (!mid1 || !mid2) return fallback(distance);

    // great grandparents
    if (mid1.id === personA.fatherId && mid2.id === mid1.fatherId) {
      const key = personB.gender === 'male' ? 'paternal_great_grandfather' : 'paternal_great_grandmother';
      return { key, labels: label(key) };
    }
    if (mid1.id === personA.motherId && mid2.id === mid1.motherId) {
      const key = personB.gender === 'male' ? 'maternal_great_grandfather' : 'maternal_great_grandmother';
      return { key, labels: label(key) };
    }

    // uncles/aunts — A's parent's sibling
    const aFather = get(personA.fatherId ?? '');
    const aMother = get(personA.motherId ?? '');

    if (aFather && mid1.id === aFather.id) {
      // B is child of A's paternal grandparent
      const sharedGrandfatherId = aFather.fatherId;
      const sharedGrandmotherId = aFather.motherId;
      if (
        (sharedGrandfatherId && personB.fatherId === sharedGrandfatherId) ||
        (sharedGrandmotherId && personB.motherId === sharedGrandmotherId)
      ) {
        if (personB.id !== aFather.id) {
          if (personB.gender === 'male') return { key: 'paternal_uncle', labels: label('paternal_uncle') };
          else return { key: 'paternal_aunt', labels: label('paternal_aunt') };
        }
      }
    }
    if (aMother && mid1.id === aMother.id) {
      const sharedGrandfatherId = aMother.fatherId;
      const sharedGrandmotherId = aMother.motherId;
      if (
        (sharedGrandfatherId && personB.fatherId === sharedGrandfatherId) ||
        (sharedGrandmotherId && personB.motherId === sharedGrandmotherId)
      ) {
        if (personB.id !== aMother.id) {
          if (personB.gender === 'male') return { key: 'maternal_uncle', labels: label('maternal_uncle') };
          else return { key: 'maternal_aunt', labels: label('maternal_aunt') };
        }
      }
    }

    // nephew/niece — sibling's child
    const sibling = mid1;
    if (
      (personA.fatherId && personA.fatherId === sibling.fatherId) ||
      (personA.motherId && personA.motherId === sibling.motherId)
    ) {
      if (sibling.id === mid2.fatherId || sibling.id === mid2.motherId) {
        // personB is child of sibling
        if (sibling.gender === 'male') {
          const key = personB.gender === 'male' ? 'nephew_brother' : 'niece_brother';
          return { key, labels: label(key) };
        } else {
          const key = personB.gender === 'male' ? 'nephew_sister' : 'niece_sister';
          return { key, labels: label(key) };
        }
      }
    }

    // Uncle/aunt's spouse
    // paternal uncle wife (kaki) or maternal uncle wife (mami)
    if (aFather) {
      if (
        mid1.id === aFather.fatherId || mid1.id === aFather.motherId
      ) {
        // mid2 is uncle/aunt, personB is their spouse
        if (mid2.spouseId === personB.id) {
          if (mid2.gender === 'male') {
            const key = mid1.id === aFather.fatherId ? 'paternal_uncle_wife' : 'maternal_uncle_wife';
            return { key, labels: label(key) };
          } else {
            const key = mid1.id === aFather.fatherId ? 'paternal_aunt_husband' : 'maternal_aunt_husband';
            return { key, labels: label(key) };
          }
        }
      }
    }

    return fallback(distance);
  }

  // ── distance 4 — cousins ─────────────────────────────────────────────────
  if (distance === 4) {
    const mid1 = get(pathIds[1]);
    const mid2 = get(pathIds[2]);
    const mid3 = get(pathIds[3]);
    if (!mid1 || !mid2 || !mid3) return fallback(distance);

    const aFather = get(personA.fatherId ?? '');
    const aMother = get(personA.motherId ?? '');

    // Paternal uncle/aunt's child = paternal cousin
    if (aFather) {
      // path: A → father → paternal_uncle → uncle's child = B
      if (mid1.id === aFather.id) {
        if (mid2.gender === 'male') {
          const key = personB.gender === 'male' ? 'paternal_male_cousin' : 'paternal_female_cousin';
          return { key, labels: label(key) };
        } else {
          const key = personB.gender === 'male' ? 'paternal_aunt_male_cousin' : 'paternal_aunt_female_cousin';
          return { key, labels: label(key) };
        }
      }
    }
    if (aMother) {
      if (mid1.id === aMother.id) {
        if (mid2.gender === 'male') {
          const key = personB.gender === 'male' ? 'maternal_uncle_male_cousin' : 'maternal_uncle_female_cousin';
          return { key, labels: label(key) };
        } else {
          const key = personB.gender === 'male' ? 'maternal_aunt_male_cousin' : 'maternal_aunt_female_cousin';
          return { key, labels: label(key) };
        }
      }
    }

    return fallback(distance);
  }

  return fallback(distance);
}

function fallback(distance: number) {
  return {
    key: 'distant_relative',
    labels: {
      gujarati: `દૂરના સગા (${distance} પગલાં)`,
      hindi: `दूर के रिश्तेदार (${distance} कदम)`,
      english: `Distant Relative (${distance} steps)`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function findAllRelationshipPaths(
  personA: User,
  personB: User,
  allUsers: User[]
): RelationshipResult {
  if (!personA || !personB) return { found: false, paths: [] };
  if (personA.id === personB.id) {
    return {
      found: true,
      paths: [{
        steps: [{ id: personA.id, name: personA.name, gender: personA.gender, profilePictureUrl: personA.profilePictureUrl, edgeLabel: '' }],
        relationshipKey: 'self',
        labels: label('self'),
        distance: 0,
      }],
    };
  }

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const childrenMap = buildChildrenMap(allUsers);

  const foundPaths: FoundPath[] = [];
  const seenPathSigs = new Set<string>();

  // BFS — we continue past the first hit to collect multiple paths
  const queue: BFSNode[] = [{ userId: personA.id, path: [personA.id], edgeLabels: [] }];
  const visitedAtDepth = new Map<string, number>(); // id → min depth found
  visitedAtDepth.set(personA.id, 0);

  while (queue.length > 0 && foundPaths.length < MAX_PATHS) {
    const current = queue.shift()!;
    const { userId, path, edgeLabels } = current;
    const depth = path.length - 1;

    if (userId === personB.id) {
      const sig = path.join('>');
      if (!seenPathSigs.has(sig)) {
        seenPathSigs.add(sig);
        const { key, labels } = labelRelationship(personA, personB, path, userMap);
        const steps: PathStep[] = path.map((id, i) => {
          const u = userMap.get(id)!;
          return {
            id,
            name: u.name,
            gender: u.gender,
            profilePictureUrl: u.profilePictureUrl,
            edgeLabel: i === 0 ? '' : edgeLabels[i - 1],
          };
        });
        foundPaths.push({ steps, relationshipKey: key, labels, distance: depth });
      }
      continue;
    }

    if (depth >= MAX_DEPTH) continue;

    const user = userMap.get(userId);
    if (!user) continue;

    for (const { id, edgeLabel } of getNeighbors(user, userMap, childrenMap)) {
      const existingDepth = visitedAtDepth.get(id);
      // Allow revisit if we find a different path (up to depth+1 of current best)
      if (existingDepth !== undefined && existingDepth < depth) continue;
      visitedAtDepth.set(id, depth + 1);
      queue.push({ userId: id, path: [...path, id], edgeLabels: [...edgeLabels, edgeLabel] });
    }
  }

  if (foundPaths.length === 0) return { found: false, paths: [] };

  // Sort by distance (shortest first)
  foundPaths.sort((a, b) => a.distance - b.distance);
  return { found: true, paths: foundPaths };
}
