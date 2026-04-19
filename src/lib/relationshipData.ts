/**
 * Relationship Data & Translations
 * 
 * This file contains all 44 relationships with translations in:
 * - Gujarati (primary/default)
 * - Hindi (secondary)
 * - English (fallback)
 * 
 * Source of truth for all relationship terminology across the entire application.
 * Update here to change relationship names everywhere.
 * 
 * !! DO NOT MODIFY RELATIONSHIP NAMES WITHOUT APPROVAL !!
 */

export type Language = 'gujarati' | 'hindi' | 'english';

export interface RelationshipTranslation {
  gujarati: string;
  hindi: string;
  english: string;
  category: 'basic' | 'grandparent' | 'grandchild' | 'uncle-aunt' | 'cousin' | 'in-laws';
}

export const RELATIONSHIP_DATA: Record<string, RelationshipTranslation> = {
  // =============== BASIC RELATIONSHIPS ===============
  father: {
    gujarati: 'પિતા',
    hindi: 'पिता',
    english: 'Father',
    category: 'basic'
  },
  mother: {
    gujarati: 'માતા',
    hindi: 'माता',
    english: 'Mother',
    category: 'basic'
  },
  son: {
    gujarati: 'દીકરો',
    hindi: 'बेटा',
    english: 'Son',
    category: 'basic'
  },
  daughter: {
    gujarati: 'દીકરી',
    hindi: 'बेटी',
    english: 'Daughter',
    category: 'basic'
  },
  brother: {
    gujarati: 'ભાઈ',
    hindi: 'भाई',
    english: 'Brother',
    category: 'basic'
  },
  sister: {
    gujarati: 'બહેન',
    hindi: 'बहन',
    english: 'Sister',
    category: 'basic'
  },

  // =============== GRANDPARENT RELATIONSHIPS ===============
  paternal_grandfather: {
    gujarati: 'દાદા',
    hindi: 'दादा',
    english: 'Grandfather (Father\'s side)',
    category: 'grandparent'
  },
  paternal_grandmother: {
    gujarati: 'દાદી',
    hindi: 'दादी',
    english: 'Grandmother (Father\'s side)',
    category: 'grandparent'
  },
  maternal_grandfather: {
    gujarati: 'નાના',
    hindi: 'नाना',
    english: 'Grandfather (Mother\'s side)',
    category: 'grandparent'
  },
  maternal_grandmother: {
    gujarati: 'નાની',
    hindi: 'नानी',
    english: 'Grandmother (Mother\'s side)',
    category: 'grandparent'
  },

  // =============== GRANDCHILD RELATIONSHIPS ===============
  grandson_from_son: {
    gujarati: 'પૌત્ર',
    hindi: 'पोता',
    english: 'Grandson (Son\'s son)',
    category: 'grandchild'
  },
  granddaughter_from_son: {
    gujarati: 'પૌત્રી',
    hindi: 'पोती',
    english: 'Granddaughter (Son\'s daughter)',
    category: 'grandchild'
  },
  grandson_from_daughter: {
    gujarati: 'દોહિત્ર',
    hindi: 'नाती',
    english: 'Grandson (Daughter\'s son)',
    category: 'grandchild'
  },
  granddaughter_from_daughter: {
    gujarati: 'દોહિત્રી',
    hindi: 'नातिन',
    english: 'Granddaughter (Daughter\'s daughter)',
    category: 'grandchild'
  },

  // =============== UNCLE/AUNT RELATIONSHIPS ===============
  paternal_uncle: {
    gujarati: 'કાકા',
    hindi: 'चाचा',
    english: 'Father\'s brother',
    category: 'uncle-aunt'
  },
  paternal_aunt_wife_of_uncle: {
    gujarati: 'કાકી',
    hindi: 'चाची',
    english: 'Wife of Kaka',
    category: 'uncle-aunt'
  },
  elder_paternal_uncle: {
    gujarati: 'મોટા કાકા',
    hindi: 'बड़े चाचा',
    english: 'Elder father\'s brother',
    category: 'uncle-aunt'
  },
  elder_paternal_aunt: {
    gujarati: 'મોટી કાકી',
    hindi: 'बड़ी चाची',
    english: 'Elder uncle\'s wife',
    category: 'uncle-aunt'
  },
  maternal_uncle: {
    gujarati: 'મામા',
    hindi: 'मामा',
    english: 'Mother\'s brother',
    category: 'uncle-aunt'
  },
  maternal_aunt_wife_of_uncle: {
    gujarati: 'મામી',
    hindi: 'मामी',
    english: 'Wife of Mama',
    category: 'uncle-aunt'
  },
  paternal_aunt: {
    gujarati: 'ફોઈ',
    hindi: 'बुआ',
    english: 'Father\'s sister',
    category: 'uncle-aunt'
  },
  husband_of_paternal_aunt: {
    gujarati: 'ફૂફા',
    hindi: 'फूफा',
    english: 'Husband of father\'s sister',
    category: 'uncle-aunt'
  },
  maternal_aunt: {
    gujarati: 'માસી',
    hindi: 'मौसी',
    english: 'Mother\'s sister',
    category: 'uncle-aunt'
  },
  husband_of_maternal_aunt: {
    gujarati: 'માસા',
    hindi: 'मौसा',
    english: 'Husband of Masi',
    category: 'uncle-aunt'
  },

  // =============== COUSIN RELATIONSHIPS ===============
  paternal_male_cousin: {
    gujarati: 'કાકાનો દીકરો',
    hindi: 'चाचा का बेटा',
    english: 'Cousin (Paternal male)',
    category: 'cousin'
  },
  paternal_female_cousin: {
    gujarati: 'કાકાની દીકરી',
    hindi: 'चाचा की बेटी',
    english: 'Cousin (Paternal female)',
    category: 'cousin'
  },
  maternal_male_cousin: {
    gujarati: 'મામાનો દીકરો',
    hindi: 'मामा का बेटा',
    english: 'Cousin (Maternal male)',
    category: 'cousin'
  },
  maternal_female_cousin: {
    gujarati: 'મામાની દીકરી',
    hindi: 'मामा की बेटी',
    english: 'Cousin (Maternal female)',
    category: 'cousin'
  },
  maternal_aunt_male_cousin: {
    gujarati: 'માસીનો દીકરો',
    hindi: 'मौसी का बेटा',
    english: 'Cousin',
    category: 'cousin'
  },
  maternal_aunt_female_cousin: {
    gujarati: 'માસીની દીકરી',
    hindi: 'मौसी की बेटी',
    english: 'Cousin',
    category: 'cousin'
  },

  // =============== IN-LAW RELATIONSHIPS ===============
  husband: {
    gujarati: 'પતિ',
    hindi: 'पति',
    english: 'Husband',
    category: 'in-laws'
  },
  wife: {
    gujarati: 'પત્ની',
    hindi: 'पत्नी',
    english: 'Wife',
    category: 'in-laws'
  },
  son_in_law: {
    gujarati: 'જમાઈ',
    hindi: 'दामाद',
    english: 'Son-in-law',
    category: 'in-laws'
  },
  daughter_in_law: {
    gujarati: 'પુત્રવધૂ',
    hindi: 'बहू',
    english: 'Daughter-in-law',
    category: 'in-laws'
  },
  father_in_law: {
    gujarati: 'સસરા',
    hindi: 'ससुर',
    english: 'Father-in-law',
    category: 'in-laws'
  },
  mother_in_law: {
    gujarati: 'સાસુ',
    hindi: 'सास',
    english: 'Mother-in-law',
    category: 'in-laws'
  },
  wife_brother: {
    gujarati: 'સાળો',
    hindi: 'साला',
    english: 'Wife\'s brother',
    category: 'in-laws'
  },
  wife_sister: {
    gujarati: 'સાળી',
    hindi: 'साली',
    english: 'Wife\'s sister',
    category: 'in-laws'
  },
  sister_husband: {
    gujarati: 'જીજાજી',
    hindi: 'जीजा',
    english: 'Sister\'s husband',
    category: 'in-laws'
  },
  husband_younger_brother: {
    gujarati: 'દિયર',
    hindi: 'देवर',
    english: 'Husband\'s younger brother',
    category: 'in-laws'
  },
  husband_elder_brother: {
    gujarati: 'જેઠ',
    hindi: 'जेठ',
    english: 'Husband\'s elder brother',
    category: 'in-laws'
  },
  husband_elder_brother_wife: {
    gujarati: 'જેઠાણી',
    hindi: 'जेठानी',
    english: 'Elder brother\'s wife',
    category: 'in-laws'
  },
  husband_younger_brother_wife: {
    gujarati: 'દેરાણી',
    hindi: 'देवरानी',
    english: 'Younger brother\'s wife',
    category: 'in-laws'
  },
  husband_sister: {
    gujarati: 'નણંદ',
    hindi: 'ननद',
    english: 'Husband\'s sister',
    category: 'in-laws'
  },
  brother_wife: {
    gujarati: 'ભાભી',
    hindi: 'भाभी',
    english: 'Brother\'s wife',
    category: 'in-laws'
  }
};

/**
 * Get all relationships as an array
 */
export function getAllRelationships(): Array<{ key: string; data: RelationshipTranslation }> {
  return Object.entries(RELATIONSHIP_DATA).map(([key, data]) => ({
    key,
    data
  }));
}

/**
 * Get relationships by category
 */
export function getRelationshipsByCategory(
  category: RelationshipTranslation['category']
): Array<{ key: string; data: RelationshipTranslation }> {
  return Object.entries(RELATIONSHIP_DATA)
    .filter(([, data]) => data.category === category)
    .map(([key, data]) => ({ key, data }));
}

/**
 * Get all categories
 */
export const RELATIONSHIP_CATEGORIES = [
  'basic',
  'grandparent',
  'grandchild',
  'uncle-aunt',
  'cousin',
  'in-laws'
] as const;
