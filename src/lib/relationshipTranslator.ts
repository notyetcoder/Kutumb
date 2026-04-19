/**
 * Relationship Translator
 * 
 * Converts relationship types to human-readable labels in the selected language.
 * Always returns a translation - falls back to English if translation not found.
 * 
 * Usage:
 * getRelationshipLabel('father', 'gujarati') → 'પિતા'
 * getRelationshipLabel('father', 'hindi') → 'पिता'
 * getRelationshipLabel('father', 'english') → 'Father'
 */

import { RELATIONSHIP_DATA, Language } from '@/lib/relationshipData';

/**
 * Get the translated label for a relationship
 * 
 * @param relationshipKey - The relationship key from relationship-finder.ts
 * @param language - The language to translate to ('gujarati', 'hindi', 'english')
 * @returns The translated relationship label
 * 
 * Examples:
 * - getRelationshipLabel('spouse', 'gujarati') → 'પત્ની' or 'પતિ'
 * - getRelationshipLabel('child', 'hindi') → 'बेटा' or 'बेटी'
 * - getRelationshipLabel('parent', 'english') → 'Mother' or 'Father'
 */
export function getRelationshipLabel(
  relationshipKey: string | undefined,
  language: Language = 'gujarati'
): string {
  if (!relationshipKey) {
    return 'Unknown Relationship';
  }

  // Try to find exact match in relationship data
  const normalizedKey = relationshipKey.toLowerCase().replace(/\s+/g, '_');
  
  if (RELATIONSHIP_DATA[normalizedKey]) {
    return RELATIONSHIP_DATA[normalizedKey][language];
  }

  // Fallback: Try to find partial matches for compound relationships
  // For example: "First Cousin" → try "cousin"
  const simplifiedKey = normalizedKey
    .replace(/_/g, ' ')
    .split(' ')
    .find(word => RELATIONSHIP_DATA[word]);

  if (simplifiedKey && RELATIONSHIP_DATA[simplifiedKey]) {
    return RELATIONSHIP_DATA[simplifiedKey][language];
  }

  // Ultimate fallback: Return English version or original key
  console.warn(`Translation not found for relationship: ${relationshipKey}`);
  return relationshipKey.charAt(0).toUpperCase() + relationshipKey.slice(1);
}

/**
 * Get all translations for a relationship
 * 
 * @param relationshipKey - The relationship key
 * @returns Object with gujarati, hindi, english translations
 */
export function getRelationshipTranslations(relationshipKey: string | undefined) {
  if (!relationshipKey) {
    return {
      gujarati: 'Unknown',
      hindi: 'Unknown',
      english: 'Unknown Relationship'
    };
  }

  const normalizedKey = relationshipKey.toLowerCase().replace(/\s+/g, '_');
  const data = RELATIONSHIP_DATA[normalizedKey];

  if (data) {
    return {
      gujarati: data.gujarati,
      hindi: data.hindi,
      english: data.english
    };
  }

  // Fallback
  return {
    gujarati: relationshipKey,
    hindi: relationshipKey,
    english: relationshipKey
  };
}

/**
 * Get relationship description/explanation in selected language
 * 
 * Provides context about the relationship
 */
export function getRelationshipDescription(
  relationshipKey: string | undefined,
  language: Language = 'gujarati'
): string {
  if (!relationshipKey) {
    return '';
  }

  // Map of relationship descriptions by language
  const descriptions: Record<string, Record<Language, string>> = {
    father: {
      gujarati: 'તમારો પિતા - તમારી જીવનમાં સૌથી મહત્વપૂર્ણ વ્યક્તિ',
      hindi: 'आपका पिता - आपके जीवन का सबसे महत्वपूर्ण व्यक्ति',
      english: 'Your father - the most important person in your life'
    },
    mother: {
      gujarati: 'તમારી માતા - તમારું જીવન આપણને ભેટ આપી છે',
      hindi: 'आपकी माता - जिन्होंने आपको जीवन दिया है',
      english: 'Your mother - the one who gave you life'
    },
    spouse: {
      gujarati: 'તમારો જીવનનો સાથી',
      hindi: 'आपके जीवन का साथी',
      english: 'Your life partner'
    },
    sibling: {
      gujarati: 'તમારો ભાઈ/બહેન - સંગ્રામમાં તમારો સાથી',
      hindi: 'आपका भाई/बहन - संघर्ष में आपका साथी',
      english: 'Your sibling - friend in need'
    }
  };

  const key = relationshipKey.toLowerCase().replace(/\s+/g, '_');
  return descriptions[key]?.[language] || '';
}
