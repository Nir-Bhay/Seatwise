# Seatwise - System Design Audit Report

**Document Version:** 1.0
**Audit Date:** February 2026
**Project:** Seatwise - Exam Hall Seating Arrangement System

---

## Executive Summary

Seatwise is a client-side web application designed to solve the complex problem of organizing students across multiple examination rooms. The system allows educational institutions to upload student data, configure room layouts, and generate professional PDF seating charts.

**Overall Assessment:** The application is functional but requires architectural improvements for scalability, maintainability, and production readiness.

---

## 1. Architecture Overview

### Current Architecture Type
- **Type:** Single Page Application (SPA)
- **Deployment Model:** Client-side only (No backend)
- **Data Storage:** Browser LocalStorage
- **State Management:** Global variables + DOM manipulation

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│ Landing     │ Auth        │ Main App    │ Merge Tool          │
│ (index.html)│ (auth.html) │ (app.js)    │ (marge/marge.html)  │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PROCESSING LAYER                           │
├─────────────────┬───────────────────┬─────────────────────────┤
│ File Parser     │ Layout Engine     │ PDF Generator           │
│ (SheetJS/XLSX)  │ (Custom Algorithms)│ (jsPDF Library)        │
└─────────────────┴───────────────────┴─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────┬───────────────────┬─────────────────────────┤
│ LocalStorage    │ Global Variables  │ Excel Files (Input)     │
│ (Persistence)   │ (Runtime State)   │ (User Data)             │
└─────────────────┴───────────────────┴─────────────────────────┘
```

---

## 2. Technology Stack Assessment

| Component | Technology | Version | Assessment |
|-----------|------------|---------|------------|
| Markup | HTML5 | - | Adequate |
| Styling | CSS3 | - | Good - Uses modern features |
| Logic | Vanilla JavaScript | ES6+ | Functional but needs modularization |
| PDF Generation | jsPDF | CDN | Good choice for client-side PDF |
| Excel Parsing | SheetJS (XLSX) | CDN | Industry standard, appropriate |
| Icons | Remix Icons | CDN | Good, lightweight |
| Fonts | Google Fonts (Inter) | CDN | Good choice |

### CDN Dependencies (Risk Assessment)

| Library | CDN Source | Risk Level | Recommendation |
|---------|------------|------------|----------------|
| jsPDF | CDN | Medium | Bundle locally for production |
| SheetJS | CDN | Medium | Bundle locally for production |
| Remix Icons | CDN | Low | Acceptable |
| Google Fonts | Google | Low | Consider self-hosting for privacy |

---

## 3. Data Flow Analysis

### Input Flow
```
Excel File → FileReader API → XLSX.parse() → JSON Array → Global Variable (data1-4)
```

### Processing Flow
```
User Config + Student Data → Layout Algorithm → Table Structure → PDF Renderer
```

### Output Flow
```
jsPDF Document → Blob URL → Browser Preview/Download
```

### Persistence Flow
```
Form Data → JSON.stringify() → localStorage.setItem() → Persisted
Page Load → localStorage.getItem() → JSON.parse() → Form Restoration
```

---

## 4. Security Assessment

### Current Security Posture: LOW

| Vulnerability | Severity | Status | Details |
|---------------|----------|--------|---------|
| Input Validation | Medium | Missing | No sanitization of Excel data |
| XSS Prevention | Medium | Partial | Some user inputs rendered without escaping |
| File Type Validation | Low | Basic | Only checks file extension |
| File Size Limit | Low | Implemented | 10MB limit enforced |
| Authentication | High | Fake/Demo | No real authentication system |
| Data Encryption | Medium | Missing | LocalStorage data is unencrypted |

### Recommendations
1. Implement proper input sanitization for all user data
2. Add Content Security Policy (CSP) headers
3. Validate file MIME types, not just extensions
4. Implement real authentication if user data is sensitive
5. Consider encrypting localStorage data

---

## 5. Performance Analysis

### Current Performance Metrics

| Metric | Current State | Target | Status |
|--------|---------------|--------|--------|
| Initial Load | ~2-3 seconds | <2 seconds | Needs optimization |
| PDF Generation | ~1-2 seconds | <1 second | Acceptable |
| File Parsing | Variable | <500ms | Depends on file size |
| Memory Usage | Unoptimized | - | Needs monitoring |

### Performance Issues Identified

1. **Large CSS File (24.7KB)**: Should be minified and split
2. **No Code Splitting**: All JS loaded upfront
3. **No Lazy Loading**: Images loaded eagerly
4. **No Caching Strategy**: Static assets not cached
5. **Debouncing Implemented**: Good - scroll events optimized

---

## 6. Scalability Assessment

### Current Limitations

| Constraint | Current Limit | Impact |
|------------|---------------|--------|
| Max Files | 4 Excel files | Limited batch processing |
| File Size | 10MB each | Reasonable for Excel |
| Rooms | Unlimited | Good |
| Students per Room | ~200 (practical) | PDF page limits |
| Concurrent Users | 1 (client-side) | Single user only |
| Data Persistence | ~5-10MB | LocalStorage limit |

### Scalability Score: 3/10

The application is designed for single-user, single-session use. Not suitable for enterprise deployment without significant architectural changes.

---

## 7. Maintainability Assessment

### Code Quality Metrics

| Metric | Score | Details |
|--------|-------|---------|
| Modularity | 2/10 | Monolithic files, no separation of concerns |
| Documentation | 6/10 | Good README, but no inline docs |
| Naming Conventions | 5/10 | Inconsistent variable naming |
| Error Handling | 3/10 | Minimal try-catch blocks |
| Code Duplication | 4/10 | Multiple backup files, version folders |
| Test Coverage | 0/10 | No automated tests |

### Technical Debt

1. **5 Version Folders**: Old code not cleaned up
2. **3 Backup Files**: Manual versioning instead of git
3. **Duplicate Merge Features**: marge/ and Merge_Files/ folders
4. **Hard-coded Values**: College names, programs embedded in code
5. **Global State**: All data in global variables

---

## 8. Critical Findings

### High Priority Issues

1. **No Real Authentication**: Current auth is just UI, no validation
2. **No Data Backup**: If localStorage cleared, all data lost
3. **No Error Recovery**: Application crashes on unexpected input
4. **No Input Validation**: Potential for data corruption

### Medium Priority Issues

1. **No Offline Indicator**: Users don't know if data is saved
2. **No Export/Import**: Can't transfer settings between devices
3. **No Undo/Redo**: Destructive actions are permanent
4. **No Accessibility**: Screen reader support missing

### Low Priority Issues

1. **No Dark Mode**: User preference not respected
2. **No Keyboard Navigation**: Mouse-dependent UI
3. **No Multi-language**: English only

---

## 9. Compliance Checklist

| Standard | Status | Notes |
|----------|--------|-------|
| WCAG 2.1 Accessibility | Not Compliant | Missing ARIA labels, keyboard nav |
| GDPR (if applicable) | Partial | Data stored locally, no sharing |
| Browser Support | Good | Modern browsers supported |
| Mobile Responsive | Good | Responsive design implemented |
| PWA Ready | Partial | No service worker, no manifest |

---

## 10. Recommendations Summary

### Immediate Actions (Week 1-2)
1. Remove backup files and version folders
2. Add basic error handling
3. Implement input validation
4. Add loading indicators

### Short-term Actions (Month 1)
1. Modularize JavaScript code
2. Add unit tests for core algorithms
3. Implement proper state management
4. Add export/import functionality

### Long-term Actions (Quarter 1)
1. Consider React/Vue migration for better maintainability
2. Add backend for multi-user support
3. Implement real authentication
4. Add database for data persistence

---

## Appendix: File Size Analysis

| File | Size | Purpose | Keep? |
|------|------|---------|-------|
| style.css | 24.7 KB | Main styles | Yes - Optimize |
| app.js | 17.9 KB | Core logic | Yes - Refactor |
| script.js | 12.9 KB | Landing page | Yes |
| README.md | 20.9 KB | Documentation | Yes |
| auth.html | 23.7 KB | Auth page | Yes |
| index.html | ~10 KB | Landing | Yes |

**Total Essential Size:** ~110 KB (before optimization)

---

*Report Generated: February 2026*
*Auditor: System Design Audit Bot*
