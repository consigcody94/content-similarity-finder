# Content Similarity & Duplicate Finder

> **Find duplicate and similar content with advanced fuzzy matching algorithms. Perfect for data cleaning and deduplication.**

## 🎯 What It Does

Content Similarity Finder detects duplicate and near-duplicate content using multiple similarity algorithms: cosine similarity, Levenshtein distance, fuzzy matching, and Jaccard similarity.

## ✨ Key Features

- **Multiple Algorithms**: Cosine, Levenshtein, Fuzzy, Jaccard
- **Configurable Threshold**: Set minimum similarity (0-100%)
- **Smart Normalization**: Case-insensitive, whitespace handling
- **Duplicate Grouping**: Cluster similar items together
- **Fast Processing**: Optimized for large datasets

## 🚀 Quick Start

```json
{
  "content": [
    {"id": "1", "text": "The quick brown fox jumps"},
    {"id": "2", "text": "A quick brown fox jumps"},
    {"id": "3", "text": "Completely different text"}
  ],
  "similarityThreshold": 0.8,
  "algorithms": {
    "cosine": true,
    "levenshtein": true,
    "fuzzy": true,
    "jaccard": true
  }
}
```

## 📥 Input

- **content**: Array of items with `id` and `text` fields
- **similarityThreshold**: 0-1 (0.8 = 80% similar minimum)
- **algorithms**: Enable/disable cosine, levenshtein, fuzzy, jaccard
- **caseSensitive**: Treat case as significant (default: false)
- **ignoreWhitespace**: Normalize whitespace (default: true)
- **minLength**: Skip texts shorter than this
- **groupByDuplicate**: Cluster similar items (default: true)

## 📤 Output

### Similarity Matches
```json
{
  "item1": "1",
  "item2": "2",
  "text1": "The quick brown fox",
  "text2": "A quick brown fox",
  "similarity": 0.89,
  "algorithm": "cosine"
}
```

### Duplicate Groups (if groupByDuplicate: true)
```json
{
  "totalGroups": 1,
  "groups": [
    {
      "groupId": "group_1",
      "members": ["1", "2"],
      "size": 2
    }
  ]
}
```

## 🛠 Use Cases

- **Data Deduplication**: Remove duplicate entries from databases
- **Plagiarism Detection**: Find copied content
- **Content Moderation**: Detect spam or repeated messages
- **SEO Analysis**: Find duplicate website content
- **Data Cleaning**: Merge similar records

## 📊 Algorithms

- **Cosine Similarity**: Best for semantic similarity (TF-IDF based)
- **Levenshtein Distance**: Best for typos, minor edits
- **Fuzzy Matching**: Best for approximate string matching
- **Jaccard Similarity**: Best for word overlap comparison

## 📄 License

MIT License

---

**Clean data, better insights** 🔍
