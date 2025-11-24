import { Actor } from 'apify';
import { log } from 'crawlee';
import FuzzySet from 'fuzzyset';
import { compareTwoStrings } from 'string-similarity';
import { distance as levenshteinDistance } from 'fastest-levenshtein';
import natural from 'natural';

const TfIdf = natural.TfIdf;

interface ContentItem {
    id: string;
    text: string;
}

interface Input {
    content: ContentItem[];
    similarityThreshold: number;
    algorithms: {
        cosine: boolean;
        levenshtein: boolean;
        fuzzy: boolean;
        jaccard: boolean;
    };
    caseSensitive: boolean;
    ignoreWhitespace: boolean;
    minLength: number;
    groupByDuplicate: boolean;
}

interface SimilarityMatch {
    item1: string;
    item2: string;
    text1: string;
    text2: string;
    similarity: number;
    algorithm: string;
}

function normalizeText(text: string, caseSensitive: boolean, ignoreWhitespace: boolean): string {
    let normalized = text;

    if (!caseSensitive) {
        normalized = normalized.toLowerCase();
    }

    if (ignoreWhitespace) {
        normalized = normalized.replace(/\s+/g, ' ').trim();
    }

    return normalized;
}

function cosineSimilarity(text1: string, text2: string): number {
    const tfidf = new TfIdf();
    tfidf.addDocument(text1);
    tfidf.addDocument(text2);

    const terms1 = tfidf.listTerms(0);
    const terms2 = tfidf.listTerms(1);

    const vector1: Record<string, number> = {};
    const vector2: Record<string, number> = {};

    terms1.forEach((term) => {
        vector1[term.term] = term.tfidf;
    });

    terms2.forEach((term) => {
        vector2[term.term] = term.tfidf;
    });

    const allTerms = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    allTerms.forEach((term) => {
        const val1 = vector1[term] || 0;
        const val2 = vector2[term] || 0;

        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
    });

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

function jaccardSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

function levenshteinSimilarity(text1: string, text2: string): number {
    const maxLength = Math.max(text1.length, text2.length);
    if (maxLength === 0) return 1;

    const dist = levenshteinDistance(text1, text2);
    return 1 - dist / maxLength;
}

async function findSimilarContent(input: Input): Promise<SimilarityMatch[]> {
    const matches: SimilarityMatch[] = [];

    // Filter content by minimum length
    const filteredContent = input.content.filter((item) => item.text.length >= input.minLength);

    log.info('Finding similar content', {
        totalItems: input.content.length,
        filteredItems: filteredContent.length,
        threshold: input.similarityThreshold,
    });

    // Normalize all texts
    const normalizedContent = filteredContent.map((item) => ({
        ...item,
        normalizedText: normalizeText(item.text, input.caseSensitive, input.ignoreWhitespace),
    }));

    // Fuzzy matching setup
    let fuzzySet: any;
    if (input.algorithms.fuzzy) {
        const texts = normalizedContent.map((item) => item.normalizedText);
        fuzzySet = FuzzySet(texts);
    }

    // Compare each pair
    for (let i = 0; i < normalizedContent.length; i++) {
        for (let j = i + 1; j < normalizedContent.length; j++) {
            const item1 = normalizedContent[i];
            const item2 = normalizedContent[j];

            const similarities: { algorithm: string; score: number }[] = [];

            // Cosine similarity
            if (input.algorithms.cosine) {
                const cosineSim = cosineSimilarity(item1.normalizedText, item2.normalizedText);
                similarities.push({ algorithm: 'cosine', score: cosineSim });
            }

            // Levenshtein similarity
            if (input.algorithms.levenshtein) {
                const levSim = levenshteinSimilarity(item1.normalizedText, item2.normalizedText);
                similarities.push({ algorithm: 'levenshtein', score: levSim });
            }

            // Fuzzy matching (using string-similarity for pairwise)
            if (input.algorithms.fuzzy) {
                const fuzzySim = compareTwoStrings(item1.normalizedText, item2.normalizedText);
                similarities.push({ algorithm: 'fuzzy', score: fuzzySim });
            }

            // Jaccard similarity
            if (input.algorithms.jaccard) {
                const jaccardSim = jaccardSimilarity(item1.normalizedText, item2.normalizedText);
                similarities.push({ algorithm: 'jaccard', score: jaccardSim });
            }

            // Find the best similarity score
            const bestMatch = similarities.reduce((max, current) =>
                current.score > max.score ? current : max
            );

            if (bestMatch.score >= input.similarityThreshold) {
                matches.push({
                    item1: item1.id,
                    item2: item2.id,
                    text1: item1.text,
                    text2: item2.text,
                    similarity: Math.round(bestMatch.score * 10000) / 10000,
                    algorithm: bestMatch.algorithm,
                });
            }
        }
    }

    return matches;
}

function groupDuplicates(matches: SimilarityMatch[]): any[] {
    const groups: Map<string, Set<string>> = new Map();

    for (const match of matches) {
        let foundGroup = false;

        for (const [groupId, members] of groups.entries()) {
            if (members.has(match.item1) || members.has(match.item2)) {
                members.add(match.item1);
                members.add(match.item2);
                foundGroup = true;
                break;
            }
        }

        if (!foundGroup) {
            const newGroup = new Set<string>([match.item1, match.item2]);
            groups.set(match.item1, newGroup);
        }
    }

    return Array.from(groups.values()).map((members, index) => ({
        groupId: `group_${index + 1}`,
        members: Array.from(members),
        size: members.size,
    }));
}

async function main() {
    await Actor.init();

    try {
        const input = await Actor.getInput<Input>();

        if (!input?.content || input.content.length === 0) {
            throw new Error('No content provided');
        }

        log.info('Starting Content Similarity Finder', {
            itemCount: input.content.length,
            threshold: input.similarityThreshold,
            algorithms: input.algorithms,
        });

        const matches = await findSimilarContent(input);

        log.info(`Found ${matches.length} similar pairs`);

        // Store individual matches
        for (const match of matches) {
            await Actor.pushData(match);
        }

        // Group duplicates if requested
        if (input.groupByDuplicate && matches.length > 0) {
            const groups = groupDuplicates(matches);

            await Actor.setValue('duplicate_groups', {
                totalGroups: groups.length,
                groups,
                timestamp: new Date().toISOString(),
            });

            log.info('✅ Content similarity analysis complete', {
                matches: matches.length,
                duplicateGroups: groups.length,
            });
        } else {
            log.info('✅ Content similarity analysis complete', {
                matches: matches.length,
            });
        }

        // Summary stats
        const algorithmCounts = matches.reduce((acc, match) => {
            acc[match.algorithm] = (acc[match.algorithm] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        await Actor.setValue('similarity_stats', {
            totalMatches: matches.length,
            avgSimilarity:
                matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length || 0,
            algorithmCounts,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        log.error('Actor failed with error', { error });
        throw error;
    }

    await Actor.exit();
}

main();
