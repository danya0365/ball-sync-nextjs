/**
 * String Similarity Utilities
 * Helps identify if two team names are similar enough to be considered the same entity.
 */

/**
 * Normalizes a team name for comparison by removing common suffixes/prefixes
 * and making it lowercase alphanumeric.
 */
export function normalizeTeamName(name: string): string {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/\bfc\b|\bafc\b|\butd\b|\bunited\b|\bcity\b|\bcf\b|\bclub\b|\bde\b/gi, '') // remove common football words
    .replace(/[^a-z0-9]/g, ''); // remove spaces and special characters
}

/**
 * Calculates the Jaro-Winkler like similarity or simple character overlap
 * This is a lightweight Sorensen-Dice coefficient implementation.
 * Returns a value between 0.0 (no match) and 1.0 (perfect match).
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeTeamName(str1);
  const s2 = normalizeTeamName(str2);

  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;

  // Create bigrams
  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const bg1 = getBigrams(s1);
  const bg2 = getBigrams(s2);

  let intersection = 0;
  bg1.forEach(bigram => {
    if (bg2.has(bigram)) {
      intersection++;
    }
  });

  // Sorensen-Dice Coefficient
  // (2 * intersection) / (set1_size + set2_size)
  return (2.0 * intersection) / (bg1.size + bg2.size);
}
