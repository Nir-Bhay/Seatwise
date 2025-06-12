document.getElementById('file1').addEventListener('change', handleFile);
document.getElementById('file2').addEventListener('change', handleFile);

let data1 = [], data2 = [], data3 = [], data4 = [];
let pageDetailsArray = [];

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

            let previousDataCount = 0;

            pageDetailsArray.forEach((pageDetail, index) => {
                if (index > 0) pdf.addPage();
                const displayCollegeName = collegeName === 'Custom' ? customCollege : collegeName;
                const displayBranch = branch === 'Custom' ? customBranch : branch;
                const displayProgram = program === 'Custom' ? customProgram : program;
                const displayExamTime = examTime === 'Custom' ? `${customStartTime} - ${customEndTime}` : examTime;

                addHeaderFooter(pdf, displayCollegeName, `${displayBranch} - ${displayProgram}`, displayExamTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);

                if (arrangementType === 'horizontal') {
                    previousDataCount = addDataColumnsHorizontal(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType);
                } else {
                    previousDataCount = addDataColumnsVertical(pdf, pageDetail, previousDataCount, blankRows, doubleDataColumns, customHeaders, fontSize, cellBorders, rowHeight, dataEntryType);
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
    loadAutoSavedData();
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