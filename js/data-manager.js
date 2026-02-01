// Data Manager - Centralized data persistence utility
// Handles export/import of all SheBloom data

class DataManager {
    constructor() {
        this.dataKeys = {
            moods: 'shebloom_moods',
            journals: 'shebloom_journals',
            period: 'shebloom_period',
            study: 'shebloom_study',
            budget: 'shebloom_budget',
            notes: 'shebloom_notes'
        };
    }

    // Get all data from localStorage
    getAllData() {
        const allData = {};
        for (const [key, storageKey] of Object.entries(this.dataKeys)) {
            const data = localStorage.getItem(storageKey);
            allData[key] = data ? JSON.parse(data) : null;
        }
        return allData;
    }

    // Export data to JSON file
    exportData(dataType = 'all') {
        let dataToExport;
        let filename;

        if (dataType === 'all') {
            dataToExport = this.getAllData();
            filename = `shebloom-backup-${this.getDateString()}.json`;
        } else if (this.dataKeys[dataType]) {
            const data = localStorage.getItem(this.dataKeys[dataType]);
            dataToExport = { [dataType]: data ? JSON.parse(data) : null };
            filename = `shebloom-${dataType}-${this.getDateString()}.json`;
        } else {
            console.error('Invalid data type:', dataType);
            return;
        }

        // Create blob and download
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return filename;
    }

    // Import data from file
    importData(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate and import each data type
                for (const [key, data] of Object.entries(importedData)) {
                    if (this.dataKeys[key] && data !== null) {
                        localStorage.setItem(this.dataKeys[key], JSON.stringify(data));
                    }
                }

                if (callback) callback(true, 'Data imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                if (callback) callback(false, 'Failed to import data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    }

    // Clear all data
    clearAllData() {
        for (const storageKey of Object.values(this.dataKeys)) {
            localStorage.removeItem(storageKey);
        }
    }

    // Get formatted date string for filenames
    getDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // Save data to specific branch structure (for organization)
    // This creates a structured JSON that can be saved
    exportToBranches() {
        const allData = this.getAllData();
        const branchStructure = {
            root: {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '1.0',
                    app: 'SheBloom'
                },
                summary: {
                    totalMoods: Array.isArray(allData.moods) ? allData.moods.length : 0,
                    totalJournals: Array.isArray(allData.journals) ? allData.journals.length : 0,
                    totalCycles: allData.period?.cycles?.length || 0,
                    totalStudyTasks: Array.isArray(allData.study) ? allData.study.length : 0,
                    totalTransactions: Array.isArray(allData.budget) ? allData.budget.length : 0,
                    totalNotes: Array.isArray(allData.notes) ? allData.notes.length : 0
                }
            },
            branches: {
                moods: allData.moods || [],
                journals: allData.journals || [],
                period: allData.period || { cycles: [], currentPeriod: null, symptoms: [] },
                study: allData.study || [],
                budget: allData.budget || [],
                notes: allData.notes || []
            }
        };

        // Create and download the structured file
        const blob = new Blob([JSON.stringify(branchStructure, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shebloom-complete-backup-${this.getDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return branchStructure;
    }

    // Import from branch structure
    importFromBranches(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Check if it's a branch structure or simple data
                const branches = importedData.branches || importedData;
                
                // Import each branch
                for (const [key, data] of Object.entries(branches)) {
                    if (this.dataKeys[key] && data !== null && key !== 'metadata') {
                        localStorage.setItem(this.dataKeys[key], JSON.stringify(data));
                    }
                }

                if (callback) callback(true, 'Data imported successfully from branches!');
            } catch (error) {
                console.error('Import error:', error);
                if (callback) callback(false, 'Failed to import data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Create global instance
const dataManager = new DataManager();
