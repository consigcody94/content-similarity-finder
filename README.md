<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16&height=200&section=header&text=🔍%20SIMILARITY%20FINDER&fontSize=60&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Advanced%20Fuzzy%20Matching%20%26%20Duplicate%20Detection&descAlignY=55&descSize=18"/>

<br/>

<!-- Badges Row 1 -->
<p>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/></a>
<a href="#"><img src="https://img.shields.io/badge/Data-Cleaning-00d4aa?style=for-the-badge" alt="Data Cleaning"/></a>
<a href="#"><img src="https://img.shields.io/badge/Deduplication-Tool-3178c6?style=for-the-badge" alt="Deduplication"/></a>
</p>

<!-- Badges Row 2 -->
<p>
<img src="https://img.shields.io/badge/Cosine-✓-9b59b6?style=flat-square" alt="Cosine"/>
<img src="https://img.shields.io/badge/Levenshtein-✓-F7931E?style=flat-square" alt="Levenshtein"/>
<img src="https://img.shields.io/badge/Fuzzy-✓-e74c3c?style=flat-square" alt="Fuzzy"/>
<img src="https://img.shields.io/badge/Jaccard-✓-00d4aa?style=flat-square" alt="Jaccard"/>
</p>

<br/>

<!-- Tagline Box -->
<table>
<tr>
<td>

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🔍  SIMILARITY FINDER: Find duplicates before they find you               ║
║                                                                              ║
║       📊  Multiple algorithms - Cosine, Levenshtein, Fuzzy, Jaccard         ║
║       ⚙️  Configurable threshold - Set your similarity tolerance             ║
║       📦  Smart grouping - Cluster similar items automatically               ║
║       ⚡  Fast processing - Optimized for large datasets                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

</td>
</tr>
</table>

<br/>

<!-- Quick Links -->
[**🚀 Quick Start**](#-quick-start) · [**📊 Algorithms**](#-algorithms) · [**🛠 Use Cases**](#-use-cases) · [**📤 Output**](#-output)

<br/>

</div>

---

<br/>

## 🎯 The Problem vs Solution

<table>
<tr>
<td width="50%">

### ❌ The Problem
```
Messy data everywhere:
├── "John Smith" vs "john smith"
├── "Quick brown fox" vs "A quick brown fox"
├── Duplicate entries everywhere
├── Hours of manual review
└── Inconsistent data quality
```

</td>
<td width="50%">

### ✅ The Solution
```json
{
  "similarity": 0.89,
  "algorithm": "cosine",
  "group": ["item_1", "item_2"],
  "action": "merge_recommended"
}

✅ Automated duplicate detection
✅ Multiple algorithm comparison
✅ Grouped for easy review
```

</td>
</tr>
</table>

<br/>

---

<br/>

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

<br/>

---

<br/>

## 📊 Algorithms

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIMILARITY ALGORITHMS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📐  COSINE SIMILARITY                                          │
│      Best for: Semantic similarity (TF-IDF based)              │
│      Use when: Comparing document meaning                       │
│                                                                 │
│  ✏️  LEVENSHTEIN DISTANCE                                       │
│      Best for: Typos and minor edits                           │
│      Use when: Detecting spelling variations                    │
│                                                                 │
│  🔀  FUZZY MATCHING                                             │
│      Best for: Approximate string matching                      │
│      Use when: Human-entered data with errors                   │
│                                                                 │
│  🔗  JACCARD SIMILARITY                                         │
│      Best for: Word overlap comparison                          │
│      Use when: Comparing keyword sets                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

<br/>

---

<br/>

## 📥 Input Options

<div align="center">

| Parameter | Description | Default |
|:----------|:------------|:--------|
| `content` | Array of items with `id` and `text` | Required |
| `similarityThreshold` | 0-1 (0.8 = 80% minimum) | 0.8 |
| `algorithms` | Enable cosine, levenshtein, fuzzy, jaccard | All true |
| `caseSensitive` | Treat case as significant | false |
| `ignoreWhitespace` | Normalize whitespace | true |
| `minLength` | Skip texts shorter than this | 0 |
| `groupByDuplicate` | Cluster similar items | true |

</div>

<br/>

---

<br/>

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

### Duplicate Groups

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

<br/>

---

<br/>

## 🛠 Use Cases

<div align="center">

| Use Case | Description |
|:---------|:------------|
| **Data Deduplication** | Remove duplicate entries from databases |
| **Plagiarism Detection** | Find copied content |
| **Content Moderation** | Detect spam or repeated messages |
| **SEO Analysis** | Find duplicate website content |
| **Data Cleaning** | Merge similar records |
| **CRM Cleanup** | Deduplicate customer records |

</div>

<br/>

---

<br/>

## 📄 License

<div align="center">

**MIT License** © Content Similarity Finder

</div>

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16&height=100&section=footer"/>

<br/>

**🔍 Content Similarity Finder** — *Clean data, better insights*

<br/>

*"Find duplicates before they find you."*

<br/>

[⬆ Back to Top](#-similarity-finder)

</div>
