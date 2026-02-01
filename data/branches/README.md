# Branches Directory

This directory contains individual data type exports organized by category.

Each subdirectory can contain JSON files for specific data types:

- **moods/** - Mood tracker entries
- **journals/** - Journal entries
- **period/** - Period cycle data
- **study/** - Study planner tasks
- **budget/** - Budget transactions
- **notes/** - Quick notes

## Individual Export Format

Each file contains an array or object specific to that data type:

### Moods Example
```json
[
  {
    "mood": "happy",
    "note": "Great day!",
    "date": "1/15/2026, 10:30:00 AM",
    "timestamp": 1737800400000
  }
]
```

### Journals Example
```json
[
  {
    "title": "My Day",
    "content": "Today was amazing...",
    "date": "1/15/2026, 10:30:00 AM",
    "timestamp": 1737800400000
  }
]
```

You can store exported files here for organization and reference.
