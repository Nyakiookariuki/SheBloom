# SheBloom Data Storage

This directory contains exported data from the SheBloom app.

## Directory Structure

- `root/` - Contains complete backups with metadata and summaries
- `branches/` - Contains individual data types organized by category:
  - `moods/` - Mood tracking data
  - `journals/` - Journal entries
  - `period/` - Period cycle tracking data
  - `study/` - Study planner tasks
  - `budget/` - Budget transactions
  - `notes/` - Quick notes

## Usage

### Exporting Data
1. Go to the Data Management page in SheBloom
2. Click "Export All Data" for a complete backup
3. Click "Export as Branches" for a structured backup with root and branches
4. Or export individual data types as needed

### Importing Data
1. Go to the Data Management page
2. Click "Choose File to Import"
3. Select your previously exported JSON file
4. Confirm the import

## File Format

All data files are in JSON format and can be opened with any text editor.

### Complete Backup Structure
```json
{
  "root": {
    "metadata": {
      "exportDate": "2026-02-01T10:00:00.000Z",
      "version": "1.0",
      "app": "SheBloom"
    },
    "summary": {
      "totalMoods": 10,
      "totalJournals": 5,
      ...
    }
  },
  "branches": {
    "moods": [...],
    "journals": [...],
    ...
  }
}
```

## Notes

- All data is stored locally in your browser's localStorage
- Exporting creates downloadable JSON files for backup
- You can import these files on any device to restore your data
- Data files can be stored in this directory for reference
