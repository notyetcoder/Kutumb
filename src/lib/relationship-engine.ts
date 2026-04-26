/**
 * relationship-engine.ts
 *
 * BFS-based relationship path finder.
 * Labelling uses PATTERN matching on the edge-type sequence,
 * NOT distance (depth) alone — so it scales correctly.
 *
 * Edge types in a path step:
 *   'father' | 'mother' | 'son' | 'daughter' | 'spouse'
 *
 * Pattern = the sequence of edge types from personA → personB.
 * Example: ['father', 'son'] = sibling (up to father, down to his other son)
 */

import { User } from './types';
import { isPerson1Older } from './user-utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PathStep {
  id: string;
  name: string;
  gender: 'male' | 'female';
  profilePictureUrl?: string | null;
  edgeLabel: string;
}

export interface RelationshipResult {
  found: boolean;
  paths: FoundPath[];
}

export interface FoundPath {
  steps: PathStep[];
  relationshipKey: string;
  labels: { gujarati: string; hindi: string; english: string };
  distance: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// LABELS
// ─────────────────────────────────────────────────────────────────────────────

const LABELS: Record<string, { gujarati: string; hindi: string; english: string }> = {
  self:                         { gujarati: 'પોતે',              hindi: 'स्वयं',          english: 'Self' },
  father:                       { gujarati: 'પિતા / બાપ',        hindi: 'पिता',           english: 'Father' },
  mother:                       { gujarati: 'માતા / બા',          hindi: 'माता',           english: 'Mother' },
  son:                          { gujarati: 'દીકરો',              hindi: 'बेटा',           english: 'Son' },
  daughter:                     { gujarati: 'દીકરી',              hindi: 'बेटी',           english: 'Daughter' },
  husband:                      { gujarati: 'પતિ',                hindi: 'पति',            english: 'Husband' },
  wife:                         { gujarati: 'પત્ની',              hindi: 'पत्नी',          english: 'Wife' },
  elder_brother:                { gujarati: 'મોટા ભાઈ',           hindi: 'बड़े भाई',        english: 'Elder Brother (Mota Bhai)' },
  younger_brother:              { gujarati: 'નાના ભાઈ',           hindi: 'छोटे भाई',        english: 'Younger Brother (Nana Bhai)' },
  brother:                      { gujarati: 'ભાઈ',                hindi: 'भाई',            english: 'Brother' },
  elder_sister:                 { gujarati: 'મોટી બહેન',          hindi: 'बड़ी बहन',        english: 'Elder Sister (Moti Ben)' },
  younger_sister:               { gujarati: 'નાની બહેન',          hindi: 'छोटी बहन',        english: 'Younger Sister (Nani Ben)' },
  sister:                       { gujarati: 'બહેન',               hindi: 'बहन',            english: 'Sister' },
  half_brother:                 { gujarati: 'સાવકા ભાઈ',          hindi: 'सौतेला भाई',     english: 'Half Brother' },
  half_sister:                  { gujarati: 'સાવકી બહેન',         hindi: 'सौतेली बहन',     english: 'Half Sister' },
  paternal_grandfather:         { gujarati: 'દાદા',               hindi: 'दादा',           english: 'Paternal Grandfather (Dada)' },
  paternal_grandmother:         { gujarati: 'દાદી',               hindi: 'दादी',           english: 'Paternal Grandmother (Dadi)' },
  maternal_grandfather:         { gujarati: 'નાના',               hindi: 'नाना',           english: 'Maternal Grandfather (Nana)' },
  maternal_grandmother:         { gujarati: 'નાની',               hindi: 'नानी',           english: 'Maternal Grandmother (Nani)' },
  paternal_great_grandfather:   { gujarati: 'પરદાદા',             hindi: 'परदादा',         english: 'Paternal Great-Grandfather (Par-dada)' },
  paternal_great_grandmother:   { gujarati: 'પરદાદી',             hindi: 'परदादी',         english: 'Paternal Great-Grandmother (Par-dadi)' },
  maternal_great_grandfather:   { gujarati: 'પરનાના',             hindi: 'परनाना',         english: 'Maternal Great-Grandfather' },
  maternal_great_grandmother:   { gujarati: 'પરનાની',             hindi: 'परनानी',         english: 'Maternal Great-Grandmother' },
  grandson_via_son:             { gujarati: 'પૌત્ર',              hindi: 'पोता',           english: "Grandson — Son's Son (Pota)" },
  granddaughter_via_son:        { gujarati: 'પૌત્રી',             hindi: 'पोती',           english: "Granddaughter — Son's Daughter (Poti)" },
  grandson_via_daughter:        { gujarati: 'દોહિત્ર',            hindi: 'नाती',           english: "Grandson — Daughter's Son (Nati)" },
  granddaughter_via_daughter:   { gujarati: 'દોહિત્રી',           hindi: 'नातिन',          english: "Granddaughter — Daughter's Daughter (Natini)" },
  paternal_uncle:               { gujarati: 'કાકા',               hindi: 'चाचा',           english: 'Paternal Uncle (Kaka)' },
  paternal_uncle_wife:          { gujarati: 'કાકી',               hindi: 'काकी',           english: "Paternal Uncle's Wife (Kaki)" },
  paternal_aunt:                { gujarati: 'ફોઈ',                hindi: 'बुआ',            english: 'Paternal Aunt (Foi)' },
  paternal_aunt_husband:        { gujarati: 'ફૂફા',               hindi: 'फूफा',           english: "Paternal Aunt's Husband (Fua)" },
  maternal_uncle:               { gujarati: 'મામા',               hindi: 'मामा',           english: 'Maternal Uncle (Mama)' },
  maternal_uncle_wife:          { gujarati: 'મામી',               hindi: 'मामी',           english: "Maternal Uncle's Wife (Mami)" },
  maternal_aunt:                { gujarati: 'માસી',               hindi: 'मौसी',           english: 'Maternal Aunt (Masi)' },
  maternal_aunt_husband:        { gujarati: 'માસા',               hindi: 'मौसा',           english: "Maternal Aunt's Husband (Masa)" },
  father_in_law:                { gujarati: 'સસરા',               hindi: 'ससुर',           english: 'Father-in-Law (Sasra)' },
  mother_in_law:                { gujarati: 'સાસુ',               hindi: 'सास',            english: 'Mother-in-Law (Sasu)' },
  son_in_law:                   { gujarati: 'જમાઈ',               hindi: 'दामाद',          english: 'Son-in-Law (Jamai)' },
  daughter_in_law:              { gujarati: 'પુત્રવધૂ',            hindi: 'बहू',            english: 'Daughter-in-Law (Vahu)' },
  wife_brother:                 { gujarati: 'સાળો',               hindi: 'साला',           english: "Wife's Brother (Salo)" },
  wife_sister:                  { gujarati: 'સાળી',               hindi: 'साली',           english: "Wife's Sister (Sali)" },
  husband_elder_brother:        { gujarati: 'જેઠ',                hindi: 'जेठ',            english: "Husband's Elder Brother (Jeth)" },
  husband_younger_brother:      { gujarati: 'દિયર',               hindi: 'देवर',           english: "Husband's Younger Brother (Devar)" },
  husband_sister:               { gujarati: 'નણંદ',               hindi: 'ननद',            english: "Husband's Sister (Nanad)" },
  sister_husband:               { gujarati: 'જીજાજી / બનેવી',     hindi: 'जीजा',           english: "Sister's Husband (Banevi/Jijaji)" },
  brother_wife:                 { gujarati: 'ભાભી',               hindi: 'भाभी',           english: "Brother's Wife (Bhabi)" },
  nanad_husband:                { gujarati: 'નંદોઈ',              hindi: 'नंदोई',          english: "Husband's Sister's Husband (Nandoi)" },
  cousin_male:                  { gujarati: 'ભાઈ (ફઈ/કાકા/મામા/માસીના)', hindi: 'भाई (चचेरे/ममेरे)', english: 'Cousin Brother (Bhai)' },
  cousin_female:                { gujarati: 'બહેન (ફઈ/કાકા/મામા/માસીની)', hindi: 'बहन (चचेरी/ममेरी)', english: 'Cousin Sister (Ben)' },
  nephew_brother_son:           { gujarati: 'ભત્રીજો',            hindi: 'भतीजा',          english: "Brother's Son (Bhatijo)" },
  niece_brother_daughter:       { gujarati: 'ભત્રીજી',            hindi: 'भतीजी',          english: "Brother's Daughter (Bhatiji)" },
  nephew_sister_son:            { gujarati: 'ભાણો',               hindi: 'भांजा',          english: "Sister's Son (Bhanja)" },
  niece_sister_daughter:        { gujarati: 'ભાણી',               hindi: 'भांजी',          english: "Sister's Daughter (Bhanji)" },
  distant_relative:             { gujarati: 'સગો/સગી',            hindi: 'रिश्तेदार',      english: 'Distant Relative' },
};

function lbl(key: string) {
  return LABELS[key] ?? LABELS['distant_relative'];
}

// ─────────────────────────────────────────────────────────────────────────────
// BFS GRAPH SETUP
// ─────────────────────────────────────────────────────────────────────────────

interface BFSNode {
  userId: string;
  path: string[];
  edgeTypes: string[];  // edge type leading INTO each node: 'father'|'mother'|'son'|'daughter'|'spouse'
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

interface Neighbor { id: string; edgeType: string }

function getNeighbors(
  user: User,
  userMap: Map<string, User>,
  childrenMap: Map<string, string[]>
): Neighbor[] {
  const out: Neighbor[] = [];
  if (user.fatherId && userMap.has(user.fatherId))
    out.push({ id: user.fatherId, edgeType: 'father' });
  if (user.motherId && userMap.has(user.motherId))
    out.push({ id: user.motherId, edgeType: 'mother' });
  if (user.spouseId && userMap.has(user.spouseId))
    out.push({ id: user.spouseId, edgeType: 'spouse' });
  for (const cid of childrenMap.get(user.id) ?? []) {
    const child = userMap.get(cid);
    if (child) out.push({ id: cid, edgeType: child.gender === 'male' ? 'son' : 'daughter' });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN-BASED LABELLER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the edge-type SEQUENCE (pattern) from A to B and maps it to a
 * relationship key. Gender of A, B, and intermediaries is used where needed.
 */
function labelByPattern(
  personA: User,
  personB: User,
  edgeTypes: string[],         // e.g. ['father', 'son']
  pathIds: string[],
  userMap: Map<string, User>
): { key: string; labels: { gujarati: string; hindi: string; english: string } } {

  const pattern = edgeTypes.join('/');
  const gB = personB.gender;
  const gA = personA.gender;

  // Helper: get user at path position i
  const at = (i: number) => userMap.get(pathIds[i]);

  // ── Distance 1 ──────────────────────────────────────────────────────────
  switch (pattern) {
    case 'father':   return { key: 'father',  labels: lbl('father')  };
    case 'mother':   return { key: 'mother',  labels: lbl('mother')  };
    case 'son':      return { key: 'son',     labels: lbl('son')     };
    case 'daughter': return { key: 'daughter',labels: lbl('daughter')};
    case 'spouse':
      return gB === 'male'
        ? { key: 'husband', labels: lbl('husband') }
        : { key: 'wife',    labels: lbl('wife')    };
  }

  // ── Distance 2 ──────────────────────────────────────────────────────────
  switch (pattern) {
    // Grandparents
    case 'father/father': return { key: 'paternal_grandfather', labels: lbl('paternal_grandfather') };
    case 'father/mother': return { key: 'paternal_grandmother', labels: lbl('paternal_grandmother') };
    case 'father/spouse': return gB === 'female'
      ? { key: 'paternal_grandmother', labels: lbl('paternal_grandmother') }
      : { key: 'paternal_grandfather', labels: lbl('paternal_grandfather') };
    case 'mother/father': return { key: 'maternal_grandfather',  labels: lbl('maternal_grandfather')  };
    case 'mother/mother': return { key: 'maternal_grandmother',  labels: lbl('maternal_grandmother')  };
    case 'mother/spouse': return gB === 'male'
      ? { key: 'maternal_grandfather', labels: lbl('maternal_grandfather') }
      : { key: 'maternal_grandmother', labels: lbl('maternal_grandmother') };

    // Grandchildren
    case 'son/son':       return { key: 'grandson_via_son',       labels: lbl('grandson_via_son')      };
    case 'son/daughter':  return { key: 'granddaughter_via_son',  labels: lbl('granddaughter_via_son') };
    case 'daughter/son':  return { key: 'grandson_via_daughter',  labels: lbl('grandson_via_daughter') };
    case 'daughter/daughter': return { key: 'granddaughter_via_daughter', labels: lbl('granddaughter_via_daughter') };

    // Siblings (via shared parent)
    case 'father/son':
    case 'father/daughter':
    case 'mother/son':
    case 'mother/daughter': {
      // Sibling — determine elder/younger using DOB
      const isAOlder = isPerson1Older(personA, personB);
      if (gB === 'male') {
        if (isAOlder === false) return { key: 'elder_brother',   labels: lbl('elder_brother')   };
        if (isAOlder === true)  return { key: 'younger_brother', labels: lbl('younger_brother') };
        return { key: 'brother', labels: lbl('brother') };
      } else {
        if (isAOlder === false) return { key: 'elder_sister',   labels: lbl('elder_sister')   };
        if (isAOlder === true)  return { key: 'younger_sister', labels: lbl('younger_sister') };
        return { key: 'sister', labels: lbl('sister') };
      }
    }

    // In-laws via spouse
    case 'spouse/father': return { key: 'father_in_law', labels: lbl('father_in_law') };
    case 'spouse/mother': return { key: 'mother_in_law', labels: lbl('mother_in_law') };

    // Spouse's siblings
    case 'spouse/son':
    case 'spouse/daughter': {
      if (gA === 'male') {
        return gB === 'male'
          ? { key: 'wife_brother', labels: lbl('wife_brother') }
          : { key: 'wife_sister',  labels: lbl('wife_sister')  };
      } else {
        // female user: husband's sibling
        const midUser = at(1)!;
        const husbandBirthYear = at(1) ? parseInt(at(1)!.birthYear ?? '0') : 0;
        const bBirthYear = parseInt(personB.birthYear ?? '0');
        if (gB === 'male') {
          const isHusbandOlder = isPerson1Older(at(1)!, personB);
          if (isHusbandOlder === true)  return { key: 'husband_younger_brother', labels: lbl('husband_younger_brother') };
          if (isHusbandOlder === false) return { key: 'husband_elder_brother',   labels: lbl('husband_elder_brother')   };
          return { key: 'husband_younger_brother', labels: lbl('husband_younger_brother') };
        } else {
          return { key: 'husband_sister', labels: lbl('husband_sister') };
        }
      }
    }

    // Child-in-law
    case 'son/spouse':
      return gB === 'female'
        ? { key: 'daughter_in_law', labels: lbl('daughter_in_law') }
        : { key: 'son_in_law',      labels: lbl('son_in_law')      };
    case 'daughter/spouse':
      return gB === 'male'
        ? { key: 'son_in_law',      labels: lbl('son_in_law')      }
        : { key: 'daughter_in_law', labels: lbl('daughter_in_law') };
  }

  // ── Distance 3 ──────────────────────────────────────────────────────────
  switch (pattern) {
    // Great grandparents
    case 'father/father/father': return { key: 'paternal_great_grandfather', labels: lbl('paternal_great_grandfather') };
    case 'father/father/mother': return { key: 'paternal_great_grandmother', labels: lbl('paternal_great_grandmother') };
    case 'mother/father/father': return { key: 'maternal_great_grandfather', labels: lbl('maternal_great_grandfather') };
    case 'mother/mother/mother': return { key: 'maternal_great_grandmother', labels: lbl('maternal_great_grandmother') };

    // Uncles & aunts (parent's sibling)
    case 'father/father/son':
    case 'father/father/daughter':
    case 'father/mother/son':
    case 'father/mother/daughter':
      return gB === 'male'
        ? { key: 'paternal_uncle', labels: lbl('paternal_uncle') }
        : { key: 'paternal_aunt',  labels: lbl('paternal_aunt')  };

    case 'mother/father/son':
    case 'mother/father/daughter':
    case 'mother/mother/son':
    case 'mother/mother/daughter':
      return gB === 'male'
        ? { key: 'maternal_uncle', labels: lbl('maternal_uncle') }
        : { key: 'maternal_aunt',  labels: lbl('maternal_aunt')  };

    // Uncle/Aunt spouses
    case 'father/father/son/spouse':
    case 'father/mother/son/spouse':
      return gB === 'female' ? { key: 'paternal_uncle_wife',   labels: lbl('paternal_uncle_wife')   }
                             : { key: 'paternal_aunt_husband', labels: lbl('paternal_aunt_husband') };
    case 'father/father/daughter/spouse':
    case 'father/mother/daughter/spouse':
      return gB === 'male'   ? { key: 'paternal_aunt_husband', labels: lbl('paternal_aunt_husband') }
                             : { key: 'paternal_uncle_wife',   labels: lbl('paternal_uncle_wife')   };
    case 'mother/father/son/spouse':
    case 'mother/mother/son/spouse':
      return gB === 'female' ? { key: 'maternal_uncle_wife',   labels: lbl('maternal_uncle_wife')   }
                             : { key: 'maternal_aunt_husband', labels: lbl('maternal_aunt_husband') };

    // Nephew / Niece (sibling's child)
    case 'father/son/son':
    case 'father/son/daughter':
    case 'mother/son/son':
    case 'mother/son/daughter': {
      // via brother
      return gB === 'male'
        ? { key: 'nephew_brother_son',      labels: lbl('nephew_brother_son')      }
        : { key: 'niece_brother_daughter',  labels: lbl('niece_brother_daughter')  };
    }
    case 'father/daughter/son':
    case 'father/daughter/daughter':
    case 'mother/daughter/son':
    case 'mother/daughter/daughter': {
      // via sister
      return gB === 'male'
        ? { key: 'nephew_sister_son',      labels: lbl('nephew_sister_son')      }
        : { key: 'niece_sister_daughter',  labels: lbl('niece_sister_daughter')  };
    }

    // Sister's husband / Brother's wife
    case 'father/daughter/spouse':
    case 'mother/daughter/spouse':
      return { key: 'sister_husband', labels: lbl('sister_husband') };
    case 'father/son/spouse':
    case 'mother/son/spouse':
      return { key: 'brother_wife', labels: lbl('brother_wife') };

    // Husband's sister's husband (Nandoi)
    case 'spouse/daughter/spouse':
    case 'spouse/son/spouse':
      return gA === 'female' && gB === 'male'
        ? { key: 'nanad_husband', labels: lbl('nanad_husband') }
        : { key: 'distant_relative', labels: lbl('distant_relative') };
  }

  // ── Distance 4 — Cousins ────────────────────────────────────────────────
  // Pattern: parent / grandparent-sibling / their-child
  // e.g. father/father/son/son = paternal uncle's son = cousin
  const cousinsPatterns = [
    'father/father/son/', 'father/father/daughter/',
    'father/mother/son/', 'father/mother/daughter/',
    'mother/father/son/', 'mother/father/daughter/',
    'mother/mother/son/', 'mother/mother/daughter/',
  ];
  for (const cp of cousinsPatterns) {
    if (pattern.startsWith(cp) && edgeTypes.length === 4) {
      return gB === 'male'
        ? { key: 'cousin_male',   labels: lbl('cousin_male')   }
        : { key: 'cousin_female', labels: lbl('cousin_female') };
    }
  }

  // Fallback
  return {
    key: 'distant_relative',
    labels: {
      gujarati: `દૂરના સગા (${edgeTypes.length} પગલાં)`,
      hindi:    `दूर के रिश्तेदार (${edgeTypes.length} कदम)`,
      english:  `Distant Relative (${edgeTypes.length} steps)`,
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
        labels: lbl('self'),
        distance: 0,
      }],
    };
  }

  const userMap     = new Map(allUsers.map(u => [u.id, u]));
  const childrenMap = buildChildrenMap(allUsers);

  const foundPaths: FoundPath[]      = [];
  const seenPathSigs = new Set<string>();

  const queue: BFSNode[] = [{ userId: personA.id, path: [personA.id], edgeTypes: [] }];
  // Allow the same node to be visited again if via a DIFFERENT path
  const visitedAtDepth = new Map<string, number>();
  visitedAtDepth.set(personA.id, 0);

  while (queue.length > 0 && foundPaths.length < MAX_PATHS) {
    const current = queue.shift()!;
    const { userId, path, edgeTypes } = current;
    const depth = path.length - 1;

    if (userId === personB.id) {
      const sig = path.join('>');
      if (!seenPathSigs.has(sig)) {
        seenPathSigs.add(sig);
        const { key, labels } = labelByPattern(personA, personB, edgeTypes, path, userMap);
        const steps: PathStep[] = path.map((id, i) => {
          const u = userMap.get(id)!;
          return {
            id,
            name: u.name,
            gender: u.gender,
            profilePictureUrl: u.profilePictureUrl,
            edgeLabel: i === 0 ? '' : edgeTypes[i - 1],
          };
        });
        foundPaths.push({ steps, relationshipKey: key, labels, distance: depth });
      }
      continue;
    }

    if (depth >= MAX_DEPTH) continue;

    const user = userMap.get(userId);
    if (!user) continue;

    for (const { id, edgeType } of getNeighbors(user, userMap, childrenMap)) {
      const existingDepth = visitedAtDepth.get(id);
      if (existingDepth !== undefined && existingDepth < depth) continue;
      visitedAtDepth.set(id, depth + 1);
      queue.push({
        userId: id,
        path: [...path, id],
        edgeTypes: [...edgeTypes, edgeType],
      });
    }
  }

  if (foundPaths.length === 0) return { found: false, paths: [] };

  foundPaths.sort((a, b) => a.distance - b.distance);
  return { found: true, paths: foundPaths };
}
