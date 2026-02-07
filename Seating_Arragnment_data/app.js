document.getElementById('file1').addEventListener('change', handleFile);
document.getElementById('file2').addEventListener('change', handleFile);

let data1 = [], data2 = [], data3 = [], data4 = [];
let pageDetailsArray = [];
let savedTemplates = JSON.parse(localStorage.getItem('seatWiseTemplates')) || [];
let isDarkMode = localStorage.getItem('seatWiseDarkMode') === 'true';

// ============================================
// NEW FEATURE: Dark Mode Toggle
// ============================================
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('seatWiseDarkMode', isDarkMode);
    applyDarkMode();
}

function applyDarkMode() {
    const root = document.documentElement;
    const darkModeBtn = document.getElementById('darkModeBtn');

    if (isDarkMode) {
        // Dark mode is already the default in the new design
        root.style.setProperty('--color-bg-dark', '#0a0f1c');
        root.style.setProperty('--color-bg-card', 'rgba(17, 25, 40, 0.75)');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#94a3b8');
        document.body.style.background = '';
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="ri-sun-line"></i>';
    } else {
        // Light mode
        root.style.setProperty('--color-bg-dark', '#f1f5f9');
        root.style.setProperty('--color-bg-card', 'rgba(255, 255, 255, 0.9)');
        root.style.setProperty('--color-bg-input', 'rgba(241, 245, 249, 0.9)');
        root.style.setProperty('--color-surface', 'rgba(226, 232, 240, 0.8)');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--text-muted', '#94a3b8');
        root.style.setProperty('--border-glass', 'rgba(0, 0, 0, 0.1)');
        document.body.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="ri-moon-line"></i>';
    }
}

// ============================================
// NEW FEATURE: Statistics Dashboard
// ============================================
function updateStatsDashboard() {
    const totalStudents = data1.length + data2.length + data3.length + data4.length;
    const totalRooms = pageDetailsArray.length;
    const totalCapacity = pageDetailsArray.reduce((sum, room) => sum + (room.numCandidates || 0), 0);
    const filesLoaded = [data1, data2, data3, data4].filter(arr => arr.length > 0).length;

    // Update individual stat elements if they exist (new dashboard layout)
    const statStudents = document.getElementById('statStudents');
    const statRooms = document.getElementById('statRooms');
    const statCapacity = document.getElementById('statCapacity');
    const statFiles = document.getElementById('statFiles');

    if (statStudents) statStudents.textContent = totalStudents;
    if (statRooms) statRooms.textContent = totalRooms;
    if (statCapacity) statCapacity.textContent = totalCapacity;
    if (statFiles) statFiles.textContent = filesLoaded;

    // Check capacity warning
    if (totalStudents > totalCapacity && totalCapacity > 0) {
        showToast(`Warning: ${totalStudents - totalCapacity} students exceed room capacity!`, 'error');
    }
}

// ============================================
// NEW FEATURE: Quick Actions & Shortcuts
// ============================================
function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="ri-keyboard-line"></i> Keyboard Shortcuts</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Generate PDF</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + G</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Download PDF</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + D</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Reset Form</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + R</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Add Room</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + N</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Toggle Dark Mode</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Ctrl + M</kbd>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px;">
                        <span>Close Modal</span>
                        <kbd style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">Escape</kbd>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl + G to generate PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        generatePDF();
    }
    // Ctrl + D to download PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (window.currentPDF) downloadPDF();
    }
    // Ctrl + R to reset (but not browser refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
        e.preventDefault();
        resetForm();
    }
    // Ctrl + N to add new room
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showPopup();
    }
    // Ctrl + M to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleDarkMode();
    }
    // Escape to close modal
    if (e.key === 'Escape') {
        closePopup();
        document.querySelectorAll('.modal').forEach(m => {
            if (m.id !== 'popupForm') m.remove();
        });
    }
    // ? to show shortcuts
    if (e.key === '?' && !e.target.matches('input, textarea, select')) {
        showKeyboardShortcuts();
    }
});

// ============================================
// NEW FEATURE: Auto Room Distribution
// ============================================
function autoDistributeRooms() {
    const totalStudents = data1.length + data2.length + data3.length + data4.length;

    if (totalStudents === 0) {
        showToast('Please upload student data first', 'error');
        return;
    }

    const studentsPerRoom = parseInt(prompt('How many students per room? (default: 30)', '30')) || 30;
    const columnsPerRoom = parseInt(prompt('How many columns per room? (default: 6)', '6')) || 6;

    const numRooms = Math.ceil(totalStudents / studentsPerRoom);

    // Clear existing rooms
    pageDetailsArray = [];

    let remainingStudents = totalStudents;
    for (let i = 1; i <= numRooms; i++) {
        const studentsInThisRoom = Math.min(studentsPerRoom, remainingStudents);
        pageDetailsArray.push({
            roomNumber: `${100 + i}`,
            numCandidates: studentsInThisRoom,
            numColumns: columnsPerRoom,
            rows: Math.ceil(studentsInThisRoom / columnsPerRoom)
        });
        remainingStudents -= studentsInThisRoom;
    }

    updateRoomDisplay();
    updateStatsDashboard();
    showToast(`Created ${numRooms} rooms for ${totalStudents} students`, 'success');
}

// ============================================
// NEW FEATURE: Print Preview
// ============================================
function printPDF() {
    const iframe = document.querySelector('#pdfPreview iframe');
    if (iframe) {
        iframe.contentWindow.print();
    } else {
        showToast('Please generate a PDF first', 'error');
    }
}

// ============================================
// NEW FEATURE: Quick Fill From Last Session
// ============================================
function quickFillLastSession() {
    const lastSession = localStorage.getItem('seatWiseFormData');
    if (lastSession) {
        loadAutoSavedData();
        showToast('Last session restored', 'success');
    } else {
        showToast('No previous session found', 'info');
    }
}

// ============================================
// NEW FEATURE: Fisher-Yates Shuffle Algorithm
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Seeded shuffle for reproducible results
function seededShuffle(array, seed) {
    const shuffled = [...array];
    let currentSeed = seed;

    function seededRandom() {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    }

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// NEW FEATURE: Duplicate Detection
// ============================================
function detectDuplicates(dataArrays) {
    const allData = dataArrays.flat();
    const seen = new Map();
    const duplicates = [];

    allData.forEach((item, index) => {
        const key = String(item).trim().toLowerCase();
        if (seen.has(key)) {
            duplicates.push({
                value: item,
                firstIndex: seen.get(key),
                duplicateIndex: index
            });
        } else {
            seen.set(key, index);
        }
    });

    return duplicates;
}

function showDuplicateWarning(duplicates) {
    if (duplicates.length === 0) return true;

    const message = `Warning: ${duplicates.length} duplicate entries found!\n\n` +
        duplicates.slice(0, 5).map(d => `• "${d.value}"`).join('\n') +
        (duplicates.length > 5 ? `\n... and ${duplicates.length - 5} more` : '') +
        '\n\nDo you want to continue anyway?';

    return confirm(message);
}

// ============================================
// NEW FEATURE: Checkerboard Pattern Algorithm
// ============================================
function applyCheckerboardPattern(data1Array, data2Array, numColumns, numRows) {
    const result = [];
    let idx1 = 0, idx2 = 0;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
            // Alternate based on row + column
            if ((row + col) % 2 === 0) {
                result.push(data1Array[idx1] || '');
                idx1++;
            } else {
                result.push(data2Array[idx2] || '');
                idx2++;
            }
        }
    }
    return result;
}

// ============================================
// NEW FEATURE: Template System
// ============================================
function saveTemplate() {
    const templateName = prompt('Enter a name for this template:');
    if (!templateName) return;

    const template = {
        id: Date.now(),
        name: templateName,
        createdAt: new Date().toISOString(),
        pageDetails: [...pageDetailsArray],
        settings: {
            blankRows: document.getElementById('blankRows').value,
            doubleDataColumns: document.getElementById('doubleDataColumns').value,
            customHeaders: document.getElementById('customHeaders').value,
            fontSize: document.getElementById('fontSize').value,
            cellBorders: document.getElementById('cellBorders').value,
            rowHeight: document.getElementById('rowHeight').value,
            arrangementType: document.getElementById('arrangementType').value
        }
    };

    savedTemplates.push(template);
    localStorage.setItem('seatWiseTemplates', JSON.stringify(savedTemplates));
    updateTemplateDropdown();
    showToast(`Template "${templateName}" saved!`, 'success');
}

function loadTemplate(templateId) {
    const template = savedTemplates.find(t => t.id === parseInt(templateId));
    if (!template) return;

    pageDetailsArray = [...template.pageDetails];
    updateRoomDisplay();

    // Restore settings
    if (template.settings) {
        document.getElementById('blankRows').value = template.settings.blankRows || '';
        document.getElementById('doubleDataColumns').value = template.settings.doubleDataColumns || '';
        document.getElementById('customHeaders').value = template.settings.customHeaders || '';
        document.getElementById('fontSize').value = template.settings.fontSize || 12;
        document.getElementById('cellBorders').value = template.settings.cellBorders || 'yes';
        document.getElementById('rowHeight').value = template.settings.rowHeight || 20;
        document.getElementById('arrangementType').value = template.settings.arrangementType || 'vertical';
    }

    showToast(`Template "${template.name}" loaded!`, 'success');
}

function deleteTemplate(templateId) {
    if (!confirm('Are you sure you want to delete this template?')) return;

    savedTemplates = savedTemplates.filter(t => t.id !== parseInt(templateId));
    localStorage.setItem('seatWiseTemplates', JSON.stringify(savedTemplates));
    updateTemplateDropdown();
    showToast('Template deleted', 'info');
}

function updateTemplateDropdown() {
    const container = document.getElementById('templateContainer');
    if (!container) return;

    if (savedTemplates.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No saved templates</p>';
        return;
    }

    container.innerHTML = savedTemplates.map(t => `
        <div class="template-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 0.5rem;">
            <span style="font-weight: 500;">${t.name}</span>
            <div>
                <button type="button" onclick="loadTemplate(${t.id})" style="padding: 0.25rem 0.5rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.25rem;">Load</button>
                <button type="button" onclick="deleteTemplate(${t.id})" style="padding: 0.25rem 0.5rem; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer;">×</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// NEW FEATURE: Save Excel Data to LocalStorage
// ============================================
function saveExcelDataToStorage() {
    const excelData = {
        data1: data1,
        data2: data2,
        data3: data3,
        data4: data4
    };
    localStorage.setItem('seatWiseExcelData', JSON.stringify(excelData));
}

function loadExcelDataFromStorage() {
    const savedData = localStorage.getItem('seatWiseExcelData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            data1 = parsed.data1 || [];
            data2 = parsed.data2 || [];
            data3 = parsed.data3 || [];
            data4 = parsed.data4 || [];

            // Update UI to show files are loaded
            if (data1.length > 0) updateFileStatus('file1', `${data1.length} entries loaded`);
            if (data2.length > 0) updateFileStatus('file2', `${data2.length} entries loaded`);
            if (data3.length > 0) updateFileStatus('file3', `${data3.length} entries loaded`);
            if (data4.length > 0) updateFileStatus('file4', `${data4.length} entries loaded`);

            checkDataPresence();
            return true;
        } catch (e) {
            console.error('Error loading Excel data:', e);
        }
    }
    return false;
}

function updateFileStatus(fileId, text) {
    const card = document.querySelector(`#${fileId}`)?.closest('.file-upload-card');
    if (card) {
        const nameSpan = card.querySelector('.file-name');
        if (nameSpan) {
            nameSpan.textContent = text;
            nameSpan.classList.add('file-selected');
        }
    }
}

function clearExcelData() {
    if (!confirm('Clear all uploaded Excel data?')) return;
    data1 = []; data2 = []; data3 = []; data4 = [];
    localStorage.removeItem('seatWiseExcelData');
    document.querySelectorAll('.file-name').forEach(span => {
        span.textContent = 'No file chosen';
        span.classList.remove('file-selected');
    });
    showToast('Excel data cleared', 'info');
}

// ============================================
// NEW FEATURE: Customizable Configuration
// ============================================
let customConfig = JSON.parse(localStorage.getItem('seatWiseConfig')) || {
    colleges: [
        'SAGE University, Bhopal',
        'LNCT University',
        'VIT Bhopal',
        'MANIT Bhopal',
        'RGPV Bhopal'
    ],
    branches: {
        'B.Tech': ['CSE', 'AI', 'Cyber Security', 'IT', 'ECE', 'ME', 'Civil'],
        'BCA': ['Regular BCA', 'Cloud Computing', 'Data Science'],
        'B.Sc': ['Agriculture', 'Physics', 'Chemistry', 'Mathematics'],
        'B.A': ['English', 'Hindi', 'Economics', 'Political Science'],
        'B.Com': ['Regular B.Com', 'Honors', 'Taxation'],
        'M.Tech': ['CSE', 'AI', 'Data Science'],
        'MCA': ['Regular MCA', 'AI & ML'],
        'M.A': ['English', 'Hindi', 'Economics'],
        'M.Com': ['Regular M.Com', 'Finance']
    },
    examTimes: [
        '10:30 AM - 01:30 PM',
        '2:00 PM - 05:00 PM',
        '9:00 AM - 12:00 PM'
    ]
};

function saveCustomConfig() {
    localStorage.setItem('seatWiseConfig', JSON.stringify(customConfig));
}

function addCustomCollege() {
    const name = prompt('Enter new college/university name:');
    if (!name || name.trim() === '') return;

    if (!customConfig.colleges.includes(name.trim())) {
        customConfig.colleges.push(name.trim());
        saveCustomConfig();
        updateCollegeDropdown();
        showToast(`"${name}" added to colleges`, 'success');
    } else {
        showToast('College already exists', 'error');
    }
}

function addCustomBranch() {
    const name = prompt('Enter new branch name (e.g., B.Pharm):');
    if (!name || name.trim() === '') return;

    if (!customConfig.branches[name.trim()]) {
        customConfig.branches[name.trim()] = ['General'];
        saveCustomConfig();
        updateBranchDropdown();
        showToast(`"${name}" added to branches`, 'success');
    } else {
        showToast('Branch already exists', 'error');
    }
}

function addCustomProgram() {
    const branch = document.getElementById('branch').value;
    if (!branch || branch === 'Select Branch' || branch === 'Custom') {
        showToast('Please select a branch first', 'error');
        return;
    }

    const name = prompt(`Enter new program for ${branch}:`);
    if (!name || name.trim() === '') return;

    if (customConfig.branches[branch] && !customConfig.branches[branch].includes(name.trim())) {
        customConfig.branches[branch].push(name.trim());
        saveCustomConfig();
        // Trigger branch change to refresh programs
        document.getElementById('branch').dispatchEvent(new Event('change'));
        showToast(`"${name}" added to ${branch}`, 'success');
    } else {
        showToast('Program already exists', 'error');
    }
}

function updateCollegeDropdown() {
    const select = document.getElementById('CollegeName');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Choose College/University</option>';

    customConfig.colleges.forEach(college => {
        const option = document.createElement('option');
        option.value = college;
        option.textContent = college;
        select.appendChild(option);
    });

    // Add Custom option
    const customOption = document.createElement('option');
    customOption.value = 'Custom';
    customOption.textContent = 'Custom';
    select.appendChild(customOption);

    // Restore previous value if exists
    if (currentValue) select.value = currentValue;
}

function updateBranchDropdown() {
    const select = document.getElementById('branch');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="Select Branch">Select Branch</option>';

    Object.keys(customConfig.branches).forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        select.appendChild(option);
    });

    // Add Custom option
    const customOption = document.createElement('option');
    customOption.value = 'Custom';
    customOption.textContent = 'Custom';
    select.appendChild(customOption);

    // Restore previous value if exists
    if (currentValue) select.value = currentValue;
}

// ============================================
// NEW FEATURE: Export/Import All Settings
// ============================================
function exportAllSettings() {
    const exportData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        config: customConfig,
        templates: savedTemplates,
        formData: JSON.parse(localStorage.getItem('seatWiseFormData') || '{}'),
        excelData: {
            data1: data1,
            data2: data2,
            data3: data3,
            data4: data4
        }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seatwise-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Settings exported successfully!', 'success');
}

function importAllSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importData = JSON.parse(event.target.result);

                if (!importData.version) {
                    throw new Error('Invalid backup file');
                }

                // Restore config
                if (importData.config) {
                    customConfig = importData.config;
                    saveCustomConfig();
                    updateCollegeDropdown();
                    updateBranchDropdown();
                }

                // Restore templates
                if (importData.templates) {
                    savedTemplates = importData.templates;
                    localStorage.setItem('seatWiseTemplates', JSON.stringify(savedTemplates));
                    updateTemplateDropdown();
                }

                // Restore form data
                if (importData.formData) {
                    localStorage.setItem('seatWiseFormData', JSON.stringify(importData.formData));
                    loadAutoSavedData();
                }

                // Restore Excel data
                if (importData.excelData) {
                    data1 = importData.excelData.data1 || [];
                    data2 = importData.excelData.data2 || [];
                    data3 = importData.excelData.data3 || [];
                    data4 = importData.excelData.data4 || [];
                    saveExcelDataToStorage();

                    if (data1.length > 0) updateFileStatus('file1', `${data1.length} entries loaded`);
                    if (data2.length > 0) updateFileStatus('file2', `${data2.length} entries loaded`);
                }

                showToast('Settings imported successfully!', 'success');

            } catch (error) {
                showToast('Error importing settings: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// File handling function
function handleFile(event) {
    const file = event.target.files[0];
    if (!file) {
        showToast('No file selected', 'error');
        return;
    }

    if (!file.name.endsWith('.xlsx')) {
        showToast('Please upload an Excel file (.xlsx)', 'error');
        event.target.value = '';
        return;
    }

    // Show file size
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    if (fileSize > 10) {
        showToast('File size should be less than 10MB', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (event.target.id === 'file1') data1 = json.flat();
            else if (event.target.id === 'file2') data2 = json.flat();
            else if (event.target.id === 'file3') data3 = json.flat();
            else if (event.target.id === 'file4') data4 = json.flat();

            // NEW: Save Excel data to localStorage
            saveExcelDataToStorage();

            // NEW: Update statistics dashboard
            updateStatsDashboard();

            checkDataPresence();
            showToast('File uploaded successfully', 'success');
        } catch (error) {
            showToast("Error processing file: " + error.message, 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Function to add more file inputs dynamically
function addFileInput() {
    const fileInputsContainer = document.getElementById('fileInputsContainer');
    const currentCount = fileInputsContainer.children.length;
    if (currentCount >= 4) return;

    const fileIndex = currentCount + 1;
    const newFileInput = document.createElement('div');
    newFileInput.classList.add('form-group');
    newFileInput.innerHTML = `
        <label for="file${fileIndex}">Upload Excel File ${fileIndex}:</label>
        <input type="file" id="file${fileIndex}" class="form-control" accept=".xlsx">
    `;
    fileInputsContainer.appendChild(newFileInput);

    document.getElementById(`file${fileIndex}`).addEventListener('change', handleFile);
}

function checkDataPresence() {
    if (data1.length > 0 || data2.length > 0 || data3.length > 0 || data4.length > 0) {
        console.log("At least one file is loaded, proceeding with further operations.");
    } else {
        console.log("No data loaded from files.");
    }
}

// Show Popup
function showPopup() {
    document.getElementById('popupForm').style.display = 'block';
    setTimeout(() => {
        document.getElementById('popupRoomNumber').focus();
    }, 100);
}

// Close Popup
function closePopup() {
    document.getElementById('popupForm').style.display = 'none';
}

// Adding page details
function addPageDetail() {
    const roomNumber = document.getElementById('popupRoomNumber').value;
    const numCandidates = document.getElementById('popupNumCandidates').value;
    const numColumns = document.getElementById('popupNumColumns').value;
    const rows = document.getElementById('rows').value;

    if (!roomNumber || !numCandidates || !numColumns) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    pageDetailsArray.push({
        roomNumber: roomNumber,
        numCandidates: parseInt(numCandidates),
        numColumns: parseInt(numColumns),
        rows: rows ? parseInt(rows) : null
    });

    updateRoomDisplay();
    closePopup();
    showToast('Room added successfully', 'success');

    // Clear form
    document.getElementById('popupRoomNumber').value = '';
    document.getElementById('popupNumCandidates').value = '';
    document.getElementById('popupNumColumns').value = '';
    document.getElementById('rows').value = '';
}

// Remove page detail
function removePageDetail(index) {
    if (confirm('Are you sure you want to remove this room?')) {
        pageDetailsArray.splice(index, 1);
        updateRoomDisplay();
        showToast('Room removed successfully', 'info');
    }
}

// Update room display
function updateRoomDisplay() {
    const container = document.getElementById('pageDetailsContainer');
    container.innerHTML = '';

    pageDetailsArray.forEach((room, index) => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <div class="room-card-header">
                <div class="room-card-title">
                    <i class="ri-door-open-line"></i>
                    Room ${room.roomNumber}
                </div>
                <button class="remove-room-btn" onclick="removePageDetail(${index})">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            <div class="room-card-details">
                <div class="room-detail">
                    <i class="ri-group-line"></i>
                    <span>${room.numCandidates} Candidates</span>
                </div>
                <div class="room-detail">
                    <i class="ri-layout-column-line"></i>
                    <span>${room.numColumns} Columns</span>
                </div>
                ${room.rows ? `
                    <div class="room-detail">
                        <i class="ri-layout-row-line"></i>
                        <span>${room.rows} Rows</span>
                    </div>
                ` : ''}
            </div>
        `;
        container.appendChild(roomCard);
    });
}

// College name change handler
document.getElementById('CollegeName').addEventListener('change', function () {
    const collegeName = this.value;
    const customCollegeInput = document.getElementById('customCollege');

    if (collegeName === 'Custom') {
        customCollegeInput.style.display = 'block';
    } else {
        customCollegeInput.style.display = 'none';
    }
});

// Branch change handler
document.getElementById('branch').addEventListener('change', function () {
    const branch = this.value;
    const customBranchInput = document.getElementById('customBranch');
    const programSelect = document.getElementById('program');
    programSelect.innerHTML = '';

    if (branch === 'Custom') {
        customBranchInput.style.display = 'block';
        programSelect.style.display = 'none';
    } else {
        customBranchInput.style.display = 'none';
        programSelect.style.display = 'block';

        let programs = [];
        switch (branch) {
            case 'B.Tech':
                programs = ['CSE', 'AI', 'Cyber Security'];
                break;
            case 'BCA':
                programs = ['Regular BCA'];
                break;
            case 'B.Sc':
                programs = ['Agriculture'];
                break;
            case 'B.A':
                programs = ['Various Specializations'];
                break;
            case 'B.Com':
                programs = ['Regular B.Com'];
                break;
            case 'M.Tech':
                programs = ['CSE', 'AI'];
                break;
            case 'MCA':
                programs = ['Regular MCA'];
                break;
            case 'M.A':
                programs = ['Various Specializations'];
                break;
            case 'M.Com':
                programs = ['Regular M.Com'];
                break;
            default:
                programs = ['Select Program'];
        }

        programs.forEach(program => {
            const newOption = document.createElement('option');
            newOption.value = program;
            newOption.text = program;
            programSelect.appendChild(newOption);
        });

        const customProgramOption = document.createElement('option');
        customProgramOption.value = 'Custom';
        customProgramOption.text = 'Custom';
        programSelect.appendChild(customProgramOption);
    }
});

document.getElementById('program').addEventListener('change', function () {
    const program = this.value;
    const customProgramInput = document.getElementById('customProgram');

    if (program === 'Custom') {
        customProgramInput.style.display = 'block';
    } else {
        customProgramInput.style.display = 'none';
    }
});

document.getElementById('examTime').addEventListener('change', function () {
    const examTime = this.value;
    const customTimeInputs = document.querySelector('.custom-time-inputs');

    if (examTime === 'Custom') {
        customTimeInputs.style.display = 'grid';
        const customStartTimeInput = document.getElementById('customStartTime');
        const customEndTimeInput = document.getElementById('customEndTime');
        customStartTimeInput.type = 'text';
        customEndTimeInput.type = 'text';
        customStartTimeInput.setAttribute('placeholder', 'Start Time (hh:mm AM/PM)');
        customEndTimeInput.setAttribute('placeholder', 'End Time (hh:mm AM/PM)');
    } else {
        customTimeInputs.style.display = 'none';
    }
});

document.getElementById('dataEntryType').addEventListener('change', function () {
    const dataEntryType = this.value;
    const file2Container = document.getElementById('file2Container');

    if (dataEntryType === 'double') {
        file2Container.style.display = 'block';
    } else {
        file2Container.style.display = 'none';
    }
});

// Form validation
function validateForm() {
    const requiredFields = [
        { id: 'CollegeName', name: 'College/University' },
        { id: 'branch', name: 'Branch' },
        { id: 'examDate', name: 'Exam Date' },
        { id: 'semester', name: 'Semester' },
        { id: 'status', name: 'Student Status' }
    ];

    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value || element.value === 'Select Branch' || element.value === 'Select Program') {
            showToast(`Please select ${field.name}`, 'error');
            element.focus();
            return false;
        }
    }

    if (pageDetailsArray.length === 0) {
        showToast('Please add at least one room', 'error');
        document.querySelector('.add-room-btn').focus();
        return false;
    }

    const hasFiles = data1.length > 0 || data2.length > 0 || data3.length > 0 || data4.length > 0;
    if (!hasFiles) {
        showToast('Please upload at least one Excel file', 'error');
        return false;
    }

    return true;
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Main PDF generation function
function generatePDF() {
    if (!validateForm()) {
        return;
    }

    // NEW: Check for duplicates
    const duplicates = detectDuplicates([data1, data2, data3, data4].filter(arr => arr.length > 0));
    if (duplicates.length > 0 && !showDuplicateWarning(duplicates)) {
        return;
    }

    showLoading();

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'A4'
            });

            // Get form values
            const blankRows = parseInt(document.getElementById('blankRows').value) || 0;
            const doubleDataColumns = document.getElementById('doubleDataColumns').value.split(',').map(Number).filter(n => !isNaN(n));
            const customHeaders = document.getElementById('customHeaders').value.split(',').filter(h => h.trim());
            const fontSize = parseInt(document.getElementById('fontSize').value) || 12;
            const cellBorders = document.getElementById('cellBorders').value === 'yes';
            const rowHeight = parseInt(document.getElementById('rowHeight').value) || 20;

            const collegeName = document.getElementById('CollegeName')?.value || '';
            const customCollege = document.getElementById('customCollege')?.value || '';
            const branch = document.getElementById('branch')?.value || '';
            const customBranch = document.getElementById('customBranch')?.value || '';
            const program = document.getElementById('program')?.value || '';
            const customProgram = document.getElementById('customProgram')?.value || '';
            const examTime = document.getElementById('examTime')?.value || '';
            const customStartTime = document.getElementById('customStartTime')?.value || '';
            const customEndTime = document.getElementById('customEndTime')?.value || '';
            const examDate = document.getElementById('examDate')?.value || '';
            const semester = document.getElementById('semester')?.value || '';
            const status = document.getElementById('status')?.value || '';
            const arrangementType = document.getElementById('arrangementType')?.value || '';
            const dataEntryType = document.getElementById('dataEntryType')?.value || 'single';

            // NEW: Get shuffle and checkerboard options
            const enableShuffle = document.getElementById('enableShuffle')?.checked || false;
            const enableCheckerboard = document.getElementById('enableCheckerboard')?.checked || false;
            const shuffleSeed = document.getElementById('shuffleSeed')?.value || '';

            let previousDataCount = 0;

            // NEW: Prepare data with optional shuffle
            let processedData = [data1, data2, data3, data4].filter(arr => arr.length > 0);
            let totalData = processedData.flat();

            if (enableShuffle) {
                if (shuffleSeed) {
                    totalData = seededShuffle(totalData, parseInt(shuffleSeed) || Date.now());
                } else {
                    totalData = shuffleArray(totalData);
                }
                showToast('Data shuffled for anti-cheating', 'info');
            }

            pageDetailsArray.forEach((pageDetail, index) => {
                if (index > 0) pdf.addPage();
                const displayCollegeName = collegeName === 'Custom' ? customCollege : collegeName;
                const displayBranch = branch === 'Custom' ? customBranch : branch;
                const displayProgram = program === 'Custom' ? customProgram : program;
                const displayExamTime = examTime === 'Custom' ? `${customStartTime} - ${customEndTime}` : examTime;

                addHeaderFooter(pdf, displayCollegeName, `${displayBranch} - ${displayProgram}`, displayExamTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);

                // NEW: Pass shuffled/processed data to layout functions
                if (enableCheckerboard && data1.length > 0 && data2.length > 0) {
                    // Checkerboard pattern - alternate between two data sources
                    const numRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);
                    const checkerboardData = applyCheckerboardPattern(data1, data2, pageDetail.numColumns, numRows);
                    previousDataCount = addDataColumnsWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, checkerboardData, arrangementType);
                } else if (arrangementType === 'horizontal') {
                    previousDataCount = addDataColumnsHorizontalWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, totalData);
                } else {
                    previousDataCount = addDataColumnsVerticalWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, totalData);
                }
            });

            // Create PDF preview
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            const iframe = `<iframe src="${url}" width="100%" height="600px" style="border: none;"></iframe>`;
            document.getElementById('pdfPreview').innerHTML = iframe;

            // Show preview section
            document.getElementById('pdfPreviewSection').style.display = 'block';

            // Store PDF for download
            window.currentPDF = pdf;

            hideLoading();
            showToast('PDF generated successfully!', 'success');
            scrollToPdfPreview();

        } catch (error) {
            console.error('Error generating PDF:', error);
            hideLoading();
            showToast('Error generating PDF: ' + error.message, 'error');
        }
    }, 100);
}

// Download PDF function
function downloadPDF() {
    if (window.currentPDF) {
        window.currentPDF.save('seating-arrangement.pdf');
        showSuccessAnimation();
        showToast('PDF downloaded successfully!', 'success');
    } else {
        showToast('Please generate a PDF first', 'error');
    }
}

// Add Headers and Footers
function addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, roomNumber, numCandidates) {
    const margin = 40;
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(20);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(collageName.toUpperCase(), width / 2, margin, { align: "center" });

    pdf.setFontSize(15);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Room No - ${roomNumber}`, width / 2, margin + 50, { align: "center" });
    pdf.text(`Time: ${examTime}`, width - margin, margin + 60, { align: "right" });
    pdf.text(`Date: ${examDate}`, width - margin, margin + 75, { align: "right" });

    // Footer
    pdf.setFontSize(13);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Program/Branch: ${programBranch}`, margin, height - 120);
    pdf.text(`Semester: ${semester}`, margin + 300, height - 120);
    pdf.text(`Status: ${status}`, margin + 380, height - 120);
    pdf.text(`No. of Candidates: ${numCandidates}`, margin, height - 90);
    pdf.text(`PRESENT: `, margin + 200, height - 90);
    pdf.text(`ABSENT: `, margin + 400, height - 90);
    pdf.text(`Total: ${numCandidates}`, margin + 600, height - 90);
    pdf.text(`DESIGN.`, margin, height - 60);
    pdf.text(`BRANCH`, margin + 200, height - 60);
    pdf.text(`SIGNATURE WITH DATE`, margin + 400, height - 60);

    // Page Number at the bottom
    pdf.setFontSize(10);
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, width - margin - 40, height - margin);
}

function getRomanNumeral(num) {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    return roman[num] || (num + 1).toString();
}

function addDataColumnsHorizontal(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType) {
    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const colSpacing = 0;
    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);
    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0);
    const totalData = data.flat();

    let xPos = margin;
    let yPos = 160;

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        const headerText = customHeaders[col] || `ROW ${getRomanNumeral(col)}`;
        pdf.text(headerText, headerXPos, yPos, { align: 'center' });
    }
    yPos += rowHeight;
    pdf.setFont("Helvetica", "normal");

    const numCandidates = pageDetail.numCandidates || totalRows * pageDetail.numColumns;

    for (let row = 0; row < totalRows; row++) {
        if (blankRows > 0 && (row + 1) % blankRows === 0) {
            yPos += rowHeight;
        }
        for (let col = 0; col < pageDetail.numColumns; col++) {
            const index = previousDataCount + row * pageDetail.numColumns + col;
            if (index < totalData.length) {
                let cellData = totalData[index].toString();
                if (dataEntryType === 'double' && doubleDataColumns.includes(col + 1)) {
                    cellData += `\n${totalData[index + 1] || ''}`;
                }
                const cellXPos = xPos + col * (colWidth + colSpacing);
                const cellYPos = yPos + row * rowHeight;

                if (cellBorders) {
                    pdf.rect(cellXPos, cellYPos - rowHeight + 5, colWidth, rowHeight);
                }

                pdf.text(cellData, cellXPos + colWidth / 2, cellYPos - rowHeight / 2 + 5, { align: 'center', baseline: 'middle' });
            }
        }
    }
    return previousDataCount + numCandidates;
}

function addDataColumnsVertical(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType) {
    const margin = 15;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);
    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0).flat();
    const totalData = data.slice(previousDataCount, previousDataCount + totalRows * pageDetail.numColumns);

    let xPos = margin;
    let yPos = 160;
    let colSpacing = 0;

    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        const headerText = customHeaders[col] || `COLUMN ${getRomanNumeral(col)}`;
        pdf.text(headerText, headerXPos, yPos, { align: 'center' });
    }

    yPos += rowHeight;
    pdf.setFont("Helvetica", "normal");

    for (let i = 0; i < totalData.length; i++) {
        if (blankRows > 0 && (i + 1) % blankRows === 0) {
            yPos += rowHeight;
        }
        const value = totalData[i];
        if (i % totalRows === 0 && i !== 0) {
            xPos += colWidth + colSpacing;
            yPos = 160 + rowHeight;
        }
        if (yPos + rowHeight > pageHeight - margin) break;

        const cellXPos = xPos;
        const cellYPos = yPos + (i % totalRows) * (rowHeight + colSpacing);

        if (cellBorders) {
            pdf.rect(cellXPos, cellYPos - rowHeight + 5, colWidth, rowHeight);
        }

        pdf.text(value.toString(), cellXPos + colWidth / 2, cellYPos - rowHeight / 2 + 5, { align: 'center', baseline: 'middle' });
    }

    return previousDataCount + totalData.length;
}

// NEW: Layout functions that accept pre-processed data
function addDataColumnsHorizontalWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, totalData) {
    const margin = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const colSpacing = 0;
    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);

    let xPos = margin;
    let yPos = 160;

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        const headerText = customHeaders[col] || `ROW ${getRomanNumeral(col)}`;
        pdf.text(headerText, headerXPos, yPos, { align: 'center' });
    }
    yPos += rowHeight;
    pdf.setFont("Helvetica", "normal");

    const numCandidates = pageDetail.numCandidates || totalRows * pageDetail.numColumns;

    for (let row = 0; row < totalRows; row++) {
        if (blankRows > 0 && (row + 1) % blankRows === 0) {
            yPos += rowHeight;
        }
        for (let col = 0; col < pageDetail.numColumns; col++) {
            const index = previousDataCount + row * pageDetail.numColumns + col;
            if (index < totalData.length) {
                let cellData = totalData[index].toString();
                if (dataEntryType === 'double' && doubleDataColumns.includes(col + 1)) {
                    cellData += `\n${totalData[index + 1] || ''}`;
                }
                const cellXPos = xPos + col * (colWidth + colSpacing);
                const cellYPos = yPos + row * rowHeight;

                if (cellBorders) {
                    pdf.rect(cellXPos, cellYPos - rowHeight + 5, colWidth, rowHeight);
                }

                pdf.text(cellData, cellXPos + colWidth / 2, cellYPos - rowHeight / 2 + 5, { align: 'center', baseline: 'middle' });
            }
        }
    }
    return previousDataCount + numCandidates;
}

function addDataColumnsVerticalWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, totalData) {
    const margin = 15;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);
    const slicedData = totalData.slice(previousDataCount, previousDataCount + totalRows * pageDetail.numColumns);

    let xPos = margin;
    let yPos = 160;
    let colSpacing = 0;

    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        const headerText = customHeaders[col] || `COLUMN ${getRomanNumeral(col)}`;
        pdf.text(headerText, headerXPos, yPos, { align: 'center' });
    }

    yPos += rowHeight;
    pdf.setFont("Helvetica", "normal");

    for (let i = 0; i < slicedData.length; i++) {
        if (blankRows > 0 && (i + 1) % blankRows === 0) {
            yPos += rowHeight;
        }
        const value = slicedData[i];
        if (i % totalRows === 0 && i !== 0) {
            xPos += colWidth + colSpacing;
            yPos = 160 + rowHeight;
        }
        if (yPos + rowHeight > pageHeight - margin) break;

        const cellXPos = xPos;
        const cellYPos = yPos + (i % totalRows) * (rowHeight + colSpacing);

        if (cellBorders) {
            pdf.rect(cellXPos, cellYPos - rowHeight + 5, colWidth, rowHeight);
        }

        pdf.text(value.toString(), cellXPos + colWidth / 2, cellYPos - rowHeight / 2 + 5, { align: 'center', baseline: 'middle' });
    }

    return previousDataCount + slicedData.length;
}

function addDataColumnsWithData(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, checkerboardData, arrangementType) {
    // Use checkerboard data with the appropriate layout
    if (arrangementType === 'horizontal') {
        return addDataColumnsHorizontalWithData(pdf, pageDetail, 0, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, checkerboardData);
    } else {
        return addDataColumnsVerticalWithData(pdf, pageDetail, 0, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType, checkerboardData);
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Auto-save form data
function autoSaveForm() {
    const formData = {
        collegeName: document.getElementById('CollegeName').value,
        customCollege: document.getElementById('customCollege').value,
        branch: document.getElementById('branch').value,
        customBranch: document.getElementById('customBranch').value,
        program: document.getElementById('program').value,
        customProgram: document.getElementById('customProgram').value,
        examTime: document.getElementById('examTime').value,
        examDate: document.getElementById('examDate').value,
        semester: document.getElementById('semester').value,
        status: document.getElementById('status').value,
        arrangementType: document.getElementById('arrangementType').value,
        dataEntryType: document.getElementById('dataEntryType').value,
        pageDetails: pageDetailsArray
    };

    localStorage.setItem('seatWiseFormData', JSON.stringify(formData));
}

// Load auto-saved data
function loadAutoSavedData() {
    const savedData = localStorage.getItem('seatWiseFormData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            // Restore form values
            document.getElementById('CollegeName').value = data.collegeName || '';
            document.getElementById('customCollege').value = data.customCollege || '';
            document.getElementById('branch').value = data.branch || '';
            document.getElementById('customBranch').value = data.customBranch || '';
            document.getElementById('program').value = data.program || '';
            document.getElementById('customProgram').value = data.customProgram || '';
            document.getElementById('examTime').value = data.examTime || '';
            document.getElementById('examDate').value = data.examDate || '';
            document.getElementById('semester').value = data.semester || '';
            document.getElementById('status').value = data.status || '';
            document.getElementById('arrangementType').value = data.arrangementType || 'vertical';
            document.getElementById('dataEntryType').value = data.dataEntryType || 'single';

            // Restore page details
            if (data.pageDetails && data.pageDetails.length > 0) {
                pageDetailsArray = data.pageDetails;
                updateRoomDisplay();
            }

            showToast('Previous session restored', 'info');
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Scroll to PDF preview
function scrollToPdfPreview() {
    const pdfSection = document.getElementById('pdfPreviewSection');
    pdfSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Success animation
function showSuccessAnimation() {
    const successOverlay = document.createElement('div');
    successOverlay.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            text-align: center;
            z-index: 3000;
        ">
            <i class="ri-check-line" style="
                font-size: 4rem;
                color: #28a745;
                display: block;
                margin-bottom: 1rem;
            "></i>
            <h3 style="color: #333; margin: 0;">Success!</h3>
        </div>
    `;
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 2999;
    `;

    document.body.appendChild(successOverlay);

    setTimeout(() => {
        successOverlay.style.opacity = '0';
        successOverlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(successOverlay);
        }, 300);
    }, 1500);
}

// Add auto-save listeners
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', autoSaveForm);
});

// Load saved data on page load
window.addEventListener('DOMContentLoaded', function () {
    // Initialize custom dropdowns from saved config
    updateCollegeDropdown();
    updateBranchDropdown();

    // Apply dark mode if saved
    applyDarkMode();

    loadAutoSavedData();
    loadExcelDataFromStorage();
    updateTemplateDropdown();
    updateStatsDashboard();
    updateProgress();
});

// Update progress
function updateProgress() {
    const form = document.getElementById('examForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    const filled = Array.from(inputs).filter(input => input.value).length;
    const progress = (filled / inputs.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Add animation to form sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.form-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + G to generate PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        generatePDF();
    }

    // Ctrl/Cmd + D to download PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (window.currentPDF) {
            downloadPDF();
        }
    }

    // Ctrl/Cmd + R to reset form
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetForm();
    }

    // Escape to close modal
    if (e.key === 'Escape') {
        closePopup();
    }
});

// Add enter key support for modal
document.getElementById('popupForm').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addPageDetail();
    }
});

// Reset form function
function resetForm() {
    if (confirm('Are you sure you want to reset all form data?')) {
        document.getElementById('examForm').reset();
        pageDetailsArray = [];
        document.getElementById('pageDetailsContainer').innerHTML = '';
        data1 = [];
        data2 = [];
        data3 = [];
        data4 = [];
        document.querySelectorAll('.file-name').forEach(span => {
            span.textContent = 'No file chosen';
            span.classList.remove('file-selected');
        });
        window.currentPDF = null;
        document.getElementById('pdfPreviewSection').style.display = 'none';
        localStorage.removeItem('seatWiseFormData');
        showToast('Form reset successfully', 'success');
        updateProgress();
    }
}

// Print helper function
function printPDF() {
    const iframe = document.querySelector('#pdfPreview iframe');
    if (iframe) {
        iframe.contentWindow.print();
    }
}

// Add tooltips
function addTooltip(element, text) {
    if (!element) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
    `;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    element.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });

    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
}

// Add helpful tooltips - check if elements exist before adding tooltips
const blankRowsLabel = document.querySelector('[for="blankRows"]');
if (blankRowsLabel && blankRowsLabel.parentElement) {
    addTooltip(blankRowsLabel.parentElement, 'Leave rows blank for spacing between students');
}

const doubleDataColumnsLabel = document.querySelector('[for="doubleDataColumns"]');
if (doubleDataColumnsLabel && doubleDataColumnsLabel.parentElement) {
    addTooltip(doubleDataColumnsLabel.parentElement, 'Specify columns that should have two students');
}

const arrangementTypeLabel = document.querySelector('[for="arrangementType"]');
if (arrangementTypeLabel && arrangementTypeLabel.parentElement) {
    addTooltip(arrangementTypeLabel.parentElement, 'Choose how students are arranged in the room');
}

// Update file name display - moved to DOMContentLoaded to ensure elements exist
window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.file-input').forEach(input => {
        input.addEventListener('change', function () {
            const fileName = this.files[0]?.name || 'No file chosen';
            const fileNameSpan = this.closest('.file-upload-card').querySelector('.file-name');
            if (fileNameSpan) {
                fileNameSpan.textContent = fileName;
                fileNameSpan.classList.add('file-selected');
            }
        });
    });
});

// Add event listeners for progress update
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', updateProgress);
    element.addEventListener('input', updateProgress);
});

console.log('Seat-Wise Enhanced UI loaded successfully!');