# Seatwise - Project Working & Logic Documentation

**Document Version:** 1.0
**Date:** February 2026

---

## 1. Application Purpose

Seatwise is an **Exam Hall Seating Arrangement Generator** that automates the tedious process of organizing students across examination rooms.

### Problems Solved

| Problem | Solution |
|---------|----------|
| Manual seat allocation is time-consuming | Automated distribution algorithms |
| Paper-based seating charts are error-prone | Professional PDF generation |
| Managing multiple rooms is complex | Multi-room configuration system |
| Student data in Excel needs conversion | Direct Excel file parsing |
| Arrangements need to prevent cheating | Vertical/horizontal distribution patterns |

---

## 2. User Journey Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Landing    │────▶│   Auth      │────▶│  Main App   │
│   Page      │     │   Page      │     │  Dashboard  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
             ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
             │  Upload     │          │  Configure  │          │  Generate   │
             │  Excel      │          │  Rooms      │          │  PDF        │
             └─────────────┘          └─────────────┘          └─────────────┘
                    │                         │                         │
                    └─────────────────────────┴─────────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │  Preview &      │
                                    │  Download PDF   │
                                    └─────────────────┘
```

---

## 3. Core Modules Explained

### Module 1: Landing Page (index.html + script.js)

**Purpose:** Marketing/introduction page with navigation to main features

**Key Features:**
- Animated hero section with typing effect
- Feature showcase with cards
- Statistics counter animation
- Smooth scroll navigation
- Mobile-responsive hamburger menu
- Parallax scrolling effects
- Two main CTAs: "Merge Excel" and "Start Allocation"

**Logic Flow:**
```
Page Load → Initialize Animations → Setup Event Listeners → User Interaction
```

### Module 2: Authentication (auth.html)

**Purpose:** User authentication gateway (currently demo/placeholder)

**Current Implementation:**
- UI-only authentication
- No actual validation
- Redirects to main app on any input

**Note:** This is a placeholder for future real authentication

### Module 3: Main Application (app.js)

**Purpose:** Core seating arrangement logic

**Sub-modules:**

#### 3.1 File Handler
```javascript
handleFile(event) {
  1. Read file using FileReader API
  2. Parse Excel using XLSX library
  3. Convert to JSON array
  4. Store in global variable (data1, data2, data3, data4)
  5. Update UI to show file loaded
}
```

#### 3.2 Form Manager
```javascript
Dynamic dropdowns:
- College selection → Shows/hides custom input
- Branch selection → Populates program dropdown
- Exam time selection → Shows/hides custom time
- Data entry type → Shows/hides extra file inputs
```

#### 3.3 Room Configuration
```javascript
pageDetailsArray = [
  {
    roomNumber: "101",
    numCandidates: 60,
    numColumns: 6,
    rows: 10,
    blankRowAfter: 5,
    customHeaders: ["Roll No", "Name", "Subject"]
  },
  // ... more rooms
]
```

#### 3.4 PDF Generator
```javascript
generatePDF() {
  1. Create jsPDF document
  2. Loop through each room in pageDetailsArray
  3. Add header with institution details
  4. Call layout algorithm (horizontal/vertical)
  5. Add footer with page numbers
  6. Generate blob and show preview
}
```

### Module 4: Excel Merge Tool (marge/)

**Purpose:** Combine multiple Excel files into one

**Logic:**
```
Multiple Excel Files → Parse Each → Merge Arrays → Download Combined Excel
```

---

## 4. Seating Arrangement Algorithms

### Algorithm 1: Horizontal Arrangement

**Use Case:** Standard row-by-row seating

**Visual Representation:**
```
┌────┬────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │  ← Row 1
├────┼────┼────┼────┼────┼────┤
│ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │  ← Row 2
├────┼────┼────┼────┼────┼────┤
│ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │  ← Row 3
└────┴────┴────┴────┴────┴────┘
```

**Algorithm Logic:**
```
totalRows = ceil(numCandidates / numColumns)

for each row (0 to totalRows):
  for each column (0 to numColumns):
    index = row * numColumns + column
    if index < totalStudents:
      place student[index] at (row, column)
```

**Code Reference:** `addDataColumnsHorizontal()` in app.js

### Algorithm 2: Vertical Arrangement

**Use Case:** Column-by-column seating (better for mixing subjects)

**Visual Representation:**
```
┌────┬────┬────┬────┬────┬────┐
│ 1  │ 11 │ 21 │ 31 │ 41 │ 51 │  ← Column-first
├────┼────┼────┼────┼────┼────┤
│ 2  │ 12 │ 22 │ 32 │ 42 │ 52 │
├────┼────┼────┼────┼────┼────┤
│ 3  │ 13 │ 23 │ 33 │ 43 │ 53 │
└────┴────┴────┴────┴────┴────┘
```

**Algorithm Logic:**
```
totalRows = ceil(numCandidates / numColumns)

for each column (0 to numColumns):
  for each row (0 to totalRows):
    index = column * totalRows + row
    if index < totalStudents:
      place student[index] at (row, column)
```

**Code Reference:** `addDataColumnsVertical()` in app.js

### Algorithm 3: Blank Row Insertion

**Use Case:** Visual separation for better readability

**Logic:**
```
blankRowAfter = 5  // Insert blank after every 5 rows

for each row:
  if (row > 0 && row % blankRowAfter == 0):
    insert blank row
  continue with data rows
```

### Algorithm 4: Double Data Entry

**Use Case:** Alternating students from different subjects

**Logic:**
```
totalData = interleave(data1, data2)
// Results: [student1_file1, student1_file2, student2_file1, student2_file2, ...]
```

---

## 5. Data Structures

### Student Data Structure
```javascript
// After Excel parsing
studentData = [
  { "Roll No": "2024001", "Name": "John Doe", "Subject": "Mathematics" },
  { "Roll No": "2024002", "Name": "Jane Smith", "Subject": "Physics" },
  // ...
]
```

### Room Configuration Structure
```javascript
pageDetail = {
  roomNumber: "101",           // Room identifier
  numCandidates: 60,           // Total students in room
  numColumns: 6,               // Columns in seating layout
  rows: 10,                    // Calculated rows
  blankRowAfter: 5,            // Insert blank after N rows
  customHeaders: ["Roll", "Name", "Sign"],  // Table headers
  arrangementType: "horizontal" // or "vertical"
}
```

### Form Data Structure (LocalStorage)
```javascript
formData = {
  collegeName: "SAGE University",
  programBranch: "B.Tech",
  programName: "Computer Science",
  semester: "V",
  examDate: "2026-02-15",
  examTime: "10:00 AM - 1:00 PM",
  status: "Regular",
  pageDetails: [/* room configs */]
}
```

---

## 6. PDF Generation Process

### Step-by-Step Flow

```
1. INITIALIZATION
   └─ Create jsPDF document (A4 size)

2. HEADER GENERATION
   ├─ Add institution logo (if any)
   ├─ Add institution name
   ├─ Add exam details (date, time, semester)
   └─ Add room number

3. TABLE GENERATION
   ├─ Calculate column widths
   ├─ Draw header row
   └─ For each student:
       ├─ Calculate position (using selected algorithm)
       ├─ Draw cell borders
       └─ Add student data

4. FOOTER GENERATION
   ├─ Add page number
   ├─ Add "Seat-Wise" branding
   └─ Add signature fields

5. PAGINATION
   ├─ If room exceeds page, add new page
   └─ Continue with next room

6. OUTPUT
   ├─ Generate blob URL
   ├─ Show in preview iframe
   └─ Enable download button
```

### PDF Layout Calculations

```javascript
// Page dimensions (A4)
pageWidth = 210  // mm
pageHeight = 297 // mm
margin = 15      // mm

// Table calculations
availableWidth = pageWidth - (2 * margin)  // 180mm
columnWidth = availableWidth / numColumns
rowHeight = 8  // mm (adjustable)

// Position calculations
xPos = margin + (columnIndex * columnWidth)
yPos = headerHeight + (rowIndex * rowHeight)
```

---

## 7. State Management Flow

### Current State Flow

```
┌─────────────────┐
│  User Action    │
│  (Input/Click)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Handler  │
│  (JavaScript)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update Global  │
│  Variable       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────────┐
│ Update │ │ Save to    │
│ DOM    │ │ LocalStorage│
└────────┘ └────────────┘
```

### Auto-Save Mechanism

```javascript
// Event listeners for auto-save
window.addEventListener('input', saveFormData)
window.addEventListener('change', saveFormData)

function saveFormData() {
  const formData = {
    // Collect all form values
  }
  localStorage.setItem('seatwiseFormData', JSON.stringify(formData))
}

// Load on page refresh
window.addEventListener('load', loadFormData)

function loadFormData() {
  const saved = localStorage.getItem('seatwiseFormData')
  if (saved) {
    const formData = JSON.parse(saved)
    // Restore all form values
  }
}
```

---

## 8. Error Handling (Current State)

### Implemented Error Handling

| Scenario | Handling | User Feedback |
|----------|----------|---------------|
| File too large | Blocks upload | Alert message |
| Invalid file type | Blocks upload | Alert message |
| No data uploaded | Blocks PDF generation | Alert message |
| Empty room config | Skips room | No feedback |

### Missing Error Handling

| Scenario | Current Behavior | Recommended |
|----------|------------------|-------------|
| Corrupt Excel file | Crashes | Show error toast |
| Network failure (CDN) | Blank page | Fallback message |
| LocalStorage full | Silent fail | Warning message |
| Invalid data format | Unexpected output | Validation error |

---

## 9. Browser Compatibility

### Tested Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | Fully Supported |
| Firefox | 88+ | Fully Supported |
| Edge | 90+ | Fully Supported |
| Safari | 14+ | Mostly Supported |
| IE 11 | - | Not Supported |

### Required Browser Features

- FileReader API
- LocalStorage API
- ES6+ JavaScript
- CSS Grid & Flexbox
- Blob URLs

---

## 10. Performance Characteristics

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Excel Parsing | O(n) | n = number of rows |
| Horizontal Layout | O(n) | n = number of students |
| Vertical Layout | O(n) | n = number of students |
| PDF Generation | O(n*m) | n = students, m = rooms |

### Space Complexity

| Data Structure | Memory Usage |
|----------------|--------------|
| Student Data (1000 students) | ~100 KB |
| Room Configs (10 rooms) | ~5 KB |
| PDF Document | ~500 KB - 2 MB |
| LocalStorage | ~10 KB |

---

*Documentation Generated: February 2026*
