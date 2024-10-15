
document.getElementById('file1').addEventListener('change', handleFile);

let data1 = [], data2 = [], data3 = [], data4 = [];
let pageDetailsArray = [];

// File handling function
function handleFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
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

            checkDataPresence(); // Check data presence to proceed
        } catch (error) {
            alert("Error processing file: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Function to add more file inputs dynamically
function addFileInput() {
    const fileInputsContainer = document.getElementById('fileInputsContainer');
    const currentCount = fileInputsContainer.children.length;
    if (currentCount >= 4) return; // Limit to 4 file inputs

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
        // Proceed with other operations
    } else {
        alert("No data loaded from files.");
    }
}


// Show Popup
function showPopup() {
    document.getElementById('popupForm').style.display = 'block';
}

// Close Popup
function closePopup() {
    document.getElementById('popupForm').style.display = 'none';
}

// Adding page details dynamically with HTML form inputs


function addPageDetail() {
    const pageCount = pageDetailsArray.length + 1;
    const roomNumber = document.getElementById('popupRoomNumber').value;
    const numCandidates = document.getElementById('popupNumCandidates').value;
    const numColumns = document.getElementById('popupNumColumns').value;
    const rows = document.getElementById('rows').value; // New row input

    if (!roomNumber || !numColumns) {
        alert("Please fill in all details.");
        return;
    }

    pageDetailsArray.push({
        roomNumber: roomNumber,
        numCandidates: parseInt(numCandidates),
        numColumns: parseInt(numColumns),
        rows: rows ? parseInt(rows) : null // Store row value
    });

    // Append page detail to the UI
    const pageDetailsContainer = document.getElementById('pageDetailsContainer');
    const div = document.createElement('div');
    div.classList.add('page-detail');
    div.innerHTML = `
        <strong>Page ${pageCount}</strong><br>
        Room: ${roomNumber}, Candidates: ${numCandidates}, Columns: ${numColumns}, Rows: ${rows || 'N/A'} 
        <button type="button" class="btn btn-danger btn-sm" onclick="removePageDetail(${pageCount - 1})">Remove</button>
    `;
    pageDetailsContainer.appendChild(div);
    closePopup();
}





// Remove page detail
function removePageDetail(index) {
    pageDetailsArray.splice(index, 1);
    const pageDetailsContainer = document.getElementById('pageDetailsContainer');
    pageDetailsContainer.innerHTML = '';
    pageDetailsArray.forEach((pageDetail, i) => {
        const div = document.createElement('div');
        div.classList.add('page-detail');
        div.innerHTML = `
            <strong>Page ${i + 1}</strong><br>
            Room: ${pageDetail.roomNumber}, Candidates: ${pageDetail.numCandidates}, Columns: ${pageDetail.numColumns}
            <button type="button" class="btn btn-danger btn-sm" onclick="removePageDetail(${i})">Remove</button>
        `;
        pageDetailsContainer.appendChild(div);
    });
}



document.getElementById('CollegeName').addEventListener('change', function () {
    const collegeName = this.value;
    const customCollegeInput = document.getElementById('customCollege');

    if (collegeName === 'Custom') {
        customCollegeInput.style.display = 'block';
    } else {
        customCollegeInput.style.display = 'none';
    }

});



document.getElementById('branch').addEventListener('change', function () {
    const branch = this.value;
    const customBranchInput = document.getElementById('customBranch');
    const programSelect = document.getElementById('program');
    programSelect.innerHTML = ''; // Clear previous options

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
    const customStartTimeInput = document.getElementById('customStartTime');
    const customEndTimeInput = document.getElementById('customEndTime');

    if (examTime === 'Custom') {
        customStartTimeInput.type = 'text';
        customEndTimeInput.type = 'text';

        customStartTimeInput.setAttribute('placeholder', 'Start Time (hh:mm AM/PM)');
        customEndTimeInput.setAttribute('placeholder', 'End Time (hh:mm AM/PM)');

        customStartTimeInput.style.display = 'block';
        customEndTimeInput.style.display = 'block';
    } else {
        customStartTimeInput.style.display = 'none';
        customEndTimeInput.style.display = 'none';
    }
});



function addOptions(selectElement, optionsArray) {
    optionsArray.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option;
        newOption.text = option;
        selectElement.appendChild(newOption);
    });
}





function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'A4'
    });
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
    let previousDataCount = 0;

    pageDetailsArray.forEach((pageDetail, index) => {
        if (index > 0) pdf.addPage();
        const displayCollegeName = collegeName === 'Custom' ? customCollege : collegeName;
        const displayBranch = branch === 'Custom' ? customBranch : branch;
        const displayProgram = program === 'Custom' ? customProgram : program;
        const displayExamTime = examTime === 'Custom' ? `${customStartTime} - ${customEndTime}` : examTime;
        addHeaderFooter(pdf, displayCollegeName, `${displayBranch} - ${displayProgram}`, displayExamTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);
        if (arrangementType === 'horizontal') {
            previousDataCount = addDataColumnsHorizontal(pdf, pageDetail, previousDataCount);
        } else {
            previousDataCount = addDataColumnsVertical(pdf, pageDetail, previousDataCount);
        }
    });

    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const iframe = `<iframe src="${url}" width="100%" height="600px" style="border: none;"></iframe>`;
    document.getElementById('pdfPreview').innerHTML = iframe;

    document.getElementById('downloadButton').addEventListener('click', function () {
        pdf.save('seating-arrangement.pdf');
    });
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'A4'
    });
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
    let previousDataCount = 0;

    pageDetailsArray.forEach((pageDetail, index) => {
        if (index > 0) pdf.addPage();
        const displayCollegeName = collegeName === 'Custom' ? customCollege : collegeName;
        const displayBranch = branch === 'Custom' ? customBranch : branch;
        const displayProgram = program === 'Custom' ? customProgram : program;
        const displayExamTime = examTime === 'Custom' ? `${customStartTime} - ${customEndTime}` : examTime;
        addHeaderFooter(pdf, displayCollegeName, `${displayBranch} - ${displayProgram}`, displayExamTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);
        if (arrangementType === 'horizontal') {
            previousDataCount = addDataColumnsHorizontal(pdf, pageDetail, previousDataCount);
        } else {
            previousDataCount = addDataColumnsVertical(pdf, pageDetail, previousDataCount);
        }
    });

    pdf.save('seating-arrangement.pdf');
}




// Add Headers and Footers
function addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, roomNumber, numCandidates) {
    const margin = 40;
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Header
    // pdf.setFontSize(14);
    // pdf.setFont("Times New Roman", "bold");
    // pdf.text(collageName.toUpperCase(), width / 2, margin, { align: "center" });

    pdf.setFontSize(20);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(collageName.toUpperCase(), width / 2, margin, { align: "center" });

    pdf.setFontSize(15);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Room No - ${roomNumber}`, width / 2, margin + 50, { align: "center" });
    pdf.text(`Time: ${examTime}`, width - margin, margin + 60, { align: "right" });
    pdf.text(`Date: ${examDate}`, width - margin, margin + 75, { align: "right" });
    // pdf.text(`Sem.: ${semester}`, width / 2, margin + 80, { align: "center" });
    // pdf.text(` `, width / 2, margin + 85, { align: "center" });
    // pdf.text(` `, width / 2, margin + 110, { align: "center" });

    // Footer
    pdf.setFontSize(13);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Program/Branch: ${programBranch}`, margin, height - 120);
    pdf.text(`Semester: ${semester}`, margin + 300, height - 120);
    pdf.text(`Status: ${status}`, margin + 380, height - 120);
    pdf.text(`No. of Candidates: ${numCandidates * 2}`, margin, height - 90);
    pdf.text(`PRESENT: `, margin + 200, height - 90);
    pdf.text(`ABSENT: `, margin + 400, height - 90);

    pdf.text(`Total: ${numCandidates * 2}`, margin + 600, height - 90);

    pdf.text(`DESIGN.`, margin, height - 60);
    pdf.text(`BRANCH`, margin + 200, height - 60);
    pdf.text(`SIGNATURE WITH DATE`, margin + 400, height - 60);

    // Page Number at the bottom
    pdf.setFontSize(10);
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, width - margin - 40, height - margin);
}





function getRomanNumeral(number) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[number];
}


// Add Data Columns Horizontally
function addDataColumnsHorizontal(pdf, pageDetail, previousDataCount) {
    const margin = 15; // Reduced margin
    const pageWidth = pdf.internal.pageSize.getWidth();
    const colSpacing = 10; // Add some space between columns
    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns); // Use rows value if provided
    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0);
    const totalData = data.flat();

    let xPos = margin;
    let yPos = 160;

    let rowHeight;
    if (totalRows > 8) {
        rowHeight = 20 - (totalRows - 8);
        rowHeight = Math.max(rowHeight, 10);
    } else {
        rowHeight = 20;
    }

    const context = document.createElement('canvas').getContext('2d');
    context.font = '14px Times New Roman'; // Initial font size for measurement
    const sampleText = totalData[0] || '';
    const maxCharWidth = 150; // Example max width in pixels, adjust as needed
    const textWidth = context.measureText(sampleText).width;
    let fontSize;

    switch (pageDetail.numColumns) {
        case 3:
            fontSize = textWidth > maxCharWidth ? Math.max(10, 14 * maxCharWidth / textWidth) : 14;
            break;
        case 4:
            fontSize = textWidth > maxCharWidth ? Math.max(9, 13 * maxCharWidth / textWidth) : 13;
            break;
        case 5:

            fontSize = textWidth > maxCharWidth ? Math.max(8, 12 * maxCharWidth / textWidth) : 12;
            break;
        case 6:
            fontSize = textWidth > maxCharWidth ? Math.max(7, 10 * maxCharWidth / textWidth) : 10;

            fontSize = textWidth > maxCharWidth ? Math.max(7, 10 * maxCharWidth / textWidth) : 11;
            break;
        case 6:
            fontSize = textWidth > maxCharWidth ? Math.max(7, 10 * maxCharWidth / textWidth) : 11;
            fontWeight = 'bold';

            break;
        default:
            fontSize = textWidth > maxCharWidth ? Math.max(5, 8 * maxCharWidth / textWidth) : 8;
    }

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");
    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        pdf.setFontSize(fontSize + 2); // Slightly bigger font for headers
        pdf.text(`ROW ${getRomanNumeral(col)}`, headerXPos, yPos, { align: 'center' });
    }
    yPos += rowHeight;
    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "normal");

    const numCandidates = pageDetail.numCandidates || totalRows * pageDetail.numColumns; // Default to rows * columns if not provided

    for (let i = 0; i < numCandidates; i++) {
        const dataIndex = previousDataCount + i;
        if (dataIndex >= totalData.length) break;
        const value = totalData[dataIndex];
        if (typeof value === 'string' && value.trim() !== '') {
            if (i % pageDetail.numColumns === 0 && i !== 0) {
                xPos = margin;
                yPos += rowHeight;
            }
            if (yPos + rowHeight > pdf.internal.pageSize.getHeight() - margin) break;
            pdf.text(value, xPos + (i % pageDetail.numColumns) * (colWidth + colSpacing) + colWidth / 2, yPos, { align: 'center' });
        }
    }

    return previousDataCount + numCandidates;
}



function addDataColumnsVertical(pdf, pageDetail, previousDataCount) {
    const margin = 15;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let colSpacing;
    const totalRows = pageDetail.rows || Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);
    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0).flat();
    const totalData = data.slice(previousDataCount, previousDataCount + totalRows * pageDetail.numColumns);

    let xPos = margin;
    let yPos = 160;

    // Adjust rowHeight and colSpacing based on number of rows
    let rowHeight;
    if (totalRows > 8) {
        rowHeight = 20 - (totalRows - 8);
        rowHeight = Math.max(rowHeight, 10);
    } else {
        rowHeight = 20;
    }

    let fontSize;
    switch (pageDetail.numColumns) {
        case 3:
            colSpacing = 15;
            fontSize = 14;
            break;
        case 4:
            colSpacing = 12;
            fontSize = 13;
            break;
        case 5:
            colSpacing = 14;
            fontSize = 8;
            break;
        case 6:
            colSpacing = 13;
            fontSize = 7;
            break;
        default:
            colSpacing = 10;
            fontSize = 8;
    }

    const colWidth = (pageWidth - margin * 2 - colSpacing * (pageDetail.numColumns - 1)) / pageDetail.numColumns;

    const context = document.createElement('canvas').getContext('2d');
    context.font = `${fontSize}px Times New Roman`;
    const maxCharWidth = 150;
    
    const textWidth = context.measureText(totalData[0] || '').width;
    fontSize = Math.min(fontSize, (maxCharWidth / textWidth) * fontSize);

    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let col = 0; col < pageDetail.numColumns; col++) {
        const headerXPos = xPos + col * (colWidth + colSpacing) + colWidth / 2;
        pdf.setFontSize(fontSize + 2);
        pdf.text(`COLUMN ${getRomanNumeral(col)}`, headerXPos, yPos, { align: 'center' });
    }

    yPos += rowHeight;
    pdf.setFontSize(fontSize);
    pdf.setFont("Helvetica", "bold");

    for (let i = 0; i < totalData.length; i++) {
        const value = totalData[i]; // Get the current value from the array
    // Check if the value is a non-empty string
        if (typeof value === 'string' && value.trim() !== '') {
            // Check if it's time to move to the next column (every 'totalRows' items)
            if (i % totalRows === 0 && i !== 0) {
                xPos += colWidth + colSpacing; // Move to the next column
                yPos = 160 + rowHeight; // Reset the y position for the new column
            }
           if (yPos + rowHeight > pageHeight - margin) break;
            pdf.text(value, xPos + colWidth / 2, yPos + (i % totalRows) * (rowHeight + colSpacing), { align: 'center' });
        }
    }


    return previousDataCount + totalData.length;
}






function getRomanNumeral(num) {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    return roman[num] || num;
}











// Save form data to localStorage
function saveFormData() {
    const formData = {
        collageName: document.getElementById('CollageName').value,
        programBranch: document.getElementById('programBranch').value,
        examTime: document.getElementById('examTime').value,
        examDate: document.getElementById('examDate').value,
        semester: document.getElementById('semester').value,
        status: document.getElementById('status').value,
        pageDetails: pageDetailsArray.map((pageDetail, index) => ({
            roomNumber: document.getElementById(`roomNumber${index + 1}`).value,
            numCandidates: document.getElementById(`numCandidates${index + 1}`).value,
            numColumns: document.getElementById(`numColumns${index + 1}`).value
        }))
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Load form data from localStorage
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (!formData) return;

    document.getElementById('CollageName').value = formData.collageName;
    document.getElementById('programBranch').value = formData.programBranch;
    document.getElementById('examTime').value = formData.examTime;
    document.getElementById('examDate').value = formData.examDate;
    document.getElementById('semester').value = formData.semester;
    document.getElementById('status').value = formData.status;

    pageDetailsArray = formData.pageDetails || [];
    const pageDetailsContainer = document.getElementById('pageDetailsContainer');
    pageDetailsContainer.innerHTML = '';
    pageDetailsArray.forEach((pageDetail, i) => {
        const div = document.createElement('div');
        div.classList.add('page-detail');
        div.innerHTML = `
            <strong>Page ${i + 1}</strong><br>
            Room: ${pageDetail.roomNumber}, Candidates: ${pageDetail.numCandidates}, Columns: ${pageDetail.numColumns}
            <button type="button" class="btn btn-danger btn-sm" onclick="removePageDetail(${i})">Remove</button>
        `;
        pageDetailsContainer.appendChild(div);
    });
}

// Add event listeners to save form data on input change
window.addEventListener('input', saveFormData);

// Load form data when the page loads
window.addEventListener('load', loadFormData);
