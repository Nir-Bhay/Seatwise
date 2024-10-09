// File upload handlers
document.getElementById('file1').addEventListener('change', handleFile);
document.getElementById('file2').addEventListener('change', handleFile);
document.getElementById('file3').addEventListener('change', handleFile);
document.getElementById('file4').addEventListener('change', handleFile);

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
        } catch (error) {
            alert("Error processing file: " + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
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

    if (!roomNumber || !numCandidates || !numColumns) {
        alert("Please fill in all details.");
        return;
    }

    pageDetailsArray.push({
        roomNumber: roomNumber,
        numCandidates: parseInt(numCandidates),
        numColumns: parseInt(numColumns)
    });

    // Append page detail to the UI
    const pageDetailsContainer = document.getElementById('pageDetailsContainer');
    const div = document.createElement('div');
    div.classList.add('page-detail');
    div.innerHTML = `
        <strong>Page ${pageCount}</strong><br>
        Room: ${roomNumber}, Candidates: ${numCandidates}, Columns: ${numColumns}
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



// function generatePDF() {
//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF({
//         orientation: 'landscape',
//         unit: 'pt',
//         format: 'a3'
//     });

// custome size of the PDF

function generatePDF() {
    const { jsPDF } = window.jspdf;
    
    // Custom size: same width as A4, but with increased height (e.g., 1000pt)
    const customHeight = 1000;  // Set your desired height here
    const pdf = new jsPDF({
        orientation: 'landscape', // You can change to 'portrait' if needed
        unit: 'pt',
        format: [750.28, customHeight] // A4 width (595.28 pt), custom height
    });

    const collageName = document.getElementById('CollageName')?.value || '';
    const programBranch = document.getElementById('programBranch')?.value || '';
    const examTime = document.getElementById('examTime')?.value || '';
    const examDate = document.getElementById('examDate')?.value || '';
    const semester = document.getElementById('semester')?.value || '';
    const status = document.getElementById('status')?.value || '';
   



    // Collect page details from inputs directly
    // const pageDetailsArray = pageDetailsArray.map((pageDetail, index) => ({
    //     roomNumber: document.getElementById(`roomNumber${index + 1}`).value,
    //     numCandidates: parseInt(document.getElementById(`numCandidates${index + 1}`).value),
    //     numColumns: parseInt(document.getElementById(`numColumns${index + 1}`).value)
    // }));


    // Apply theme settings if enabled
    // if (applyTheme) {
    //     const fontFamily = document.getElementById('fontFamily')?.value || 'helvetica';
    //     const fontSize = parseInt(document.getElementById('fontSize')?.value) || 14;
    //     const fontWeight = document.getElementById('fontWeight')?.value || 'normal';
    //     const textColor = document.getElementById('textColor')?.value || '#000000';

    //     pdf.setFont(fontFamily);
    //     pdf.setFontSize(fontSize);
    //     pdf.setFontType(fontWeight);
    //     pdf.setTextColor(textColor);
    // }


    const arrangementType = document.getElementById('arrangementType')?.value || '';

    let previousDataCount = 0;

    pageDetailsArray.forEach((pageDetail, index) => {
        if (index > 0) pdf.addPage();
 
        addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);

        if (arrangementType === 'horizontal') {
            previousDataCount = addDataColumnsHorizontal(pdf, pageDetail, previousDataCount);
        } else {
            previousDataCount = addDataColumnsVertical(pdf, pageDetail, previousDataCount);
        }
    });

    // Ensure the PDF can be downloaded
    // pdf.save('seating-arrangement.pdf'); 
    // / Preview the PDF
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const iframe = `<iframe src="${url}" width="100%" height="600px" style="border: none;"></iframe>`;
    document.getElementById('pdfPreview').innerHTML = iframe;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;

    // Custom size: same width as A4, but with increased height (e.g., 1000pt)
    const customHeight = 1000;  // Set your desired height here
    const pdf = new jsPDF({
        orientation: 'landscape', // You can change to 'portrait' if needed
        unit: 'pt',
        format: [750.28, customHeight] // A4 width (595.28 pt), custom height
    });

    const collageName = document.getElementById('CollageName')?.value || '';
    const programBranch = document.getElementById('programBranch')?.value || '';
    const examTime = document.getElementById('examTime')?.value || '';
    const examDate = document.getElementById('examDate')?.value || '';
    const semester = document.getElementById('semester')?.value || '';
    const status = document.getElementById('status')?.value || '';
    const selectedFont = document.getElementById('fontSelection').value;



  

    // // Collect page details from inputs directly
    // const pageDetailsArray = pageDetailsArray.map((pageDetail, index) => ({
    //     roomNumber: document.getElementById(`roomNumber${index + 1}`).value,
    //     numCandidates: parseInt(document.getElementById(`numCandidates${index + 1}`).value),
    //     numColumns: parseInt(document.getElementById(`numColumns${index + 1}`).value)
    // }));

    
    // Apply theme settings if enabled
    // if (applyTheme) {
    //     const fontFamily = document.getElementById('fontFamily')?.value || 'helvetica';
    //     const fontSize = parseInt(document.getElementById('fontSize')?.value) || 14;
    //     const fontWeight = document.getElementById('fontWeight')?.value || 'normal';
    //     const textColor = document.getElementById('textColor')?.value || '#000000';

    //     pdf.setFont(fontFamily);
    //     pdf.setFontSize(fontSize);
    //     pdf.setFontType(fontWeight);
    //     pdf.setTextColor(textColor);
    // }



    const arrangementType = document.getElementById('arrangementType')?.value || '';

    let previousDataCount = 0;

    pageDetailsArray.forEach((pageDetail, index) => {
        if (index > 0) pdf.addPage();
        pdf.setFont(selectedFont);
    

        addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, pageDetail.roomNumber, pageDetail.numCandidates);

        if (arrangementType === 'horizontal') {
            previousDataCount = addDataColumnsHorizontal(pdf, pageDetail, previousDataCount);
        } else {
            previousDataCount = addDataColumnsVertical(pdf, pageDetail, previousDataCount);
        }
    });

    // Ensure the PDF can be downloaded
    pdf.save('seating-arrangement.pdf'); 
}


// Add Headers and Footers
function addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, roomNumber, numCandidates) {
    const margin = 40;
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(14);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(collageName.toUpperCase(), width / 2, margin, { align: "center" });

    pdf.setFontSize(20);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`SAGE University,Bhopal`, width / 2, margin + 20, { align: "center" });

    pdf.setFontSize(15);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Room No - ${roomNumber}`, width / 2, margin + 50, { align: "center" });
    pdf.text(`Time: ${examTime}`, width - margin, margin + 60, { align: "right" });
    pdf.text(`Date: ${examDate}`, width - margin, margin + 75, { align: "right" });
    pdf.text(`Sem.: ${semester}`, width / 2, margin + 80, { align: "center" });
    // pdf.text(` `, width / 2, margin + 85, { align: "center" });
    // pdf.text(` `, width / 2, margin + 110, { align: "center" });

    // Footer
    pdf.setFontSize(13);
    pdf.setFont("Times New Roman", "bold");
    pdf.text(`Program/Branch: ${programBranch}`, margin, height - 120);
    pdf.text(`Semester: ${semester}`, margin + 200, height - 120);
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



function getRomanNumeral(number) {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[number];
}


// Add Data Columns Horizontally
function addDataColumnsHorizontal(pdf, pageDetail, previousDataCount) {
    const margin = 40;
    const colWidth = (pdf.internal.pageSize.getWidth() - margin * 2) / pageDetail.numColumns;
    const rowHeight = 20;

    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0);
    const totalData = data.flat();

    let xPos = margin;
    let yPos = 240; // Adjusted start position to avoid merging with headers
    // Adjust font size based on the number of columns
    let fontSize;
    if (pageDetail.numColumns <= 3) {
        fontSize = 14;
    } else if (pageDetail.numColumns <= 5) {
        fontSize = 11;
    } else {
        fontSize = 9;
    }

    pdf.setFontSize(fontSize);
    pdf.setFont("Times New Roman", "bold");

    // Adding column headers in Roman numerals
    for (let col = 0; col < pageDetail.numColumns; col++) {
        pdf.setFontSize(14);
        pdf.setFont("Times New Roman", "bold");
        pdf.text(`ROW ${getRomanNumeral(col)}`, xPos + col * colWidth, yPos);
    }


    yPos += rowHeight;

    pdf.setFontSize(fontSize);
    pdf.setFont("Times New Roman", "bold"); // Set font to normal for data content

    for (let i = 0; i < pageDetail.numCandidates; i++) {
        const dataIndex = previousDataCount + i;
        if (dataIndex >= totalData.length) break;

        const value = totalData[dataIndex];
        if (typeof value === 'string' && value.trim() !== '') {
            if (i % pageDetail.numColumns === 0 && i !== 0) {
                xPos = margin;
                yPos += rowHeight;
            }
            if (yPos + rowHeight > pdf.internal.pageSize.getHeight() - margin) break;

            pdf.text(value, xPos + (i % pageDetail.numColumns) * colWidth, yPos);
        }
    }

    return previousDataCount + pageDetail.numCandidates;
}



// Add Data Columns Vertically
function addDataColumnsVertical(pdf, pageDetail, previousDataCount) {
    const margin = 40;
    const colWidth = (pdf.internal.pageSize.getWidth() - margin * 2) / pageDetail.numColumns;
    const rowHeight = 20;
    const totalRows = Math.ceil(pageDetail.numCandidates / pageDetail.numColumns);

    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0);
    const totalData = data.flat();

    let xPos = margin;
    let yPos = 210; // Adjusted start position to avoid merging with headers
    // Adjust font size based on the number of columns
    let fontSize;
    if (pageDetail.numColumns <= 3) {
        fontSize = 14;
    } else if (pageDetail.numColumns <= 5) {
        fontSize = 11;
    } else {
        fontSize = 9;
    }

    pdf.setFontSize(fontSize);
    pdf.setFont("Times New Roman", "bold");

    // Adding column headers in Roman numerals
    for (let col = 0; col < pageDetail.numColumns; col++) {
        pdf.setFontSize(14);
        pdf.setFont("Times New Roman", "bold");
        pdf.text(`ROW ${getRomanNumeral(col)}`, xPos + col * colWidth, yPos);
    }

    yPos += rowHeight;


    pdf.setFontSize(fontSize);
    pdf.setFont("Times New Roman", "bold"); // Set font to normal for data content

    
    for (let i = 0; i < pageDetail.numCandidates; i++) {
        const dataIndex = previousDataCount + i;
        if (dataIndex >= totalData.length) break;

        const value = totalData[dataIndex];
        if (typeof value === 'string' && value.trim() !== '') {
            if (i % totalRows === 0 && i !== 0) {
                yPos = 260; // Reset Y position after reaching row count
                xPos += colWidth; // Move to the next column
            }
            if (xPos + colWidth > pdf.internal.pageSize.getWidth() - margin) break; // Stop if reaching page end

            pdf.text(value, xPos, yPos + ((i % totalRows) + 1) * rowHeight); // +1 to avoid merging with headers
        }
    }

    return previousDataCount + pageDetail.numCandidates;
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
