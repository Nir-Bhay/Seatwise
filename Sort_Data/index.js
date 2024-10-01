// Process the uploaded Excel file
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Check if the file is an Excel file
    if (!file || !file.name.endsWith('.xlsx')) {
        alert('Please upload a valid Excel file (.xlsx format only).');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        const sortedData = sortData(json);
        displayData(sortedData);
    };

    reader.readAsBinaryString(file);
}


function updateProgramBranch() {
    const branch = document.getElementById('branchName').value;
    const progBranchSelect = document.getElementById('progBranch');

    // Clear existing options
    progBranchSelect.innerHTML = '<option value="">Select Program</option>';

    // Populate new options based on the selected branch
    let programs = [];
    if (branch === "Engineering") {
        programs = ['B.Tech - Computer Science', 'B.Tech - AI & ML', 'B.Tech - Electronics'];
    } else if (branch === "Management") {
        programs = ['MBA - Finance', 'MBA - Marketing', 'MBA - HR'];
    } else if (branch === "Law") {
        programs = ['LLB - Corporate Law', 'LLB - Criminal Law'];
    }

    // Add new options to the program dropdown
    programs.forEach(program => {
        const option = document.createElement('option');
        option.value = program;
        option.textContent = program;
        progBranchSelect.appendChild(option);
    });
}



// Collect settings from the form inputs
function collectSettings() {
    return {
        branchName: document.getElementById('branchName').value.trim(),
        examTime: document.getElementById('examTime').value.trim(),
        examDate: document.getElementById('examDate').value.trim(),
        semester: document.getElementById('semester').value.trim(),
        progBranch: document.getElementById('progBranch').value.trim(),
        status: document.getElementById('status').value.trim(),
        numHeaders: parseInt(document.getElementById('numHeaders').value, 10),
        numCandidates: parseInt(document.getElementById('numCandidates').value, 10),
    };
}




// Sort data based on the numeric part and prefix of the student ID
function sortData(data) {
    return data.sort((a, b) => {
        const numA = getNumericPart(a['Student']);
        const numB = getNumericPart(b['Student']);

        if (numA === numB) {
            const prefixA = getPrefix(a['Student']);
            const prefixB = getPrefix(b['Student']);
            return prefixA.localeCompare(prefixB);  // Sort by prefix if numeric parts are the same
        } else {
            return numA - numB;  // Sort by numeric part
        }
    });
}

// Extract the prefix (letters before numbers) from the enrollment number
function getPrefix(enrollmentNumber) {
    if (typeof enrollmentNumber === 'string') {
        const match = enrollmentNumber.match(/^[^\d]+/);  // Extracts prefix (e.g., '21BBA3')
        return match ? match[0] : '';  // Return the match if found, otherwise return an empty string
    }
    return '';
}

// Extract the numeric part (last digit) from the enrollment number
function getNumericPart(enrollmentNumber) {
    if (typeof enrollmentNumber === 'string') {
        const match = enrollmentNumber.match(/\d+$/);
        return match ? parseInt(match[0].slice(-1), 10) : Infinity;  // Extracts the last digit of the number
    }
    return Infinity;
}

// Display the sorted data in the HTML table
function displayData(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = item['Student'] || 'N/A';
        row.appendChild(cell);
        tbody.appendChild(row);
    });

    // // Initialize DataTable
    // if ($.fn.DataTable.isDataTable('#dataTable')) {
    //     $('#dataTable').DataTable().destroy();
    // }

    $('#dataTable').DataTable();
}






// Function to add header and footer to each page of the PDF
function addHeaderAndFooter(doc, pageNum, totalPages, settings) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(settings.branchName.toUpperCase(), 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ESE Spring 2023-24`, 105, 22, { align: "center" });
    doc.text(`Room No - ______`, 105, 29, { align: "center" });
    doc.text(`Time: ${settings.examTime}`, 200, 50, { align: "right" });
    doc.text(`Date: ${settings.examDate}`, 15, 50);
    doc.text(`Sem.: ${settings.semester}`, 105, 50, { align: "center" });

    // Footer
    doc.setFontSize(10);
    doc.text("Prepared By: Exam Cell", 15, 285);
    doc.text(`Page ${pageNum} of ${totalPages}`, 105, 285, { align: "center" });
    doc.text("SAGE University, Bhopal", 165, 285, { align: "right" });
}

// Generate and display the PDF
function generatePDF(isPreview = true) {
    // Collect user inputs
    if (!validateInputs()) return;

    const settings = collectSettings();


    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Collect data from the table
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tr');

    // Prepare data for rows and columns
    let tableData = [];
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        tableData.push(cells[0].innerText.trim());
    }

    // Handle multiple pages if the number of seats exceeds numCandidates
    const seatsPerPage = settings.numCandidates;
    let pageData = [];
    for (let i = 0; i < tableData.length; i += seatsPerPage) {
        pageData.push(tableData.slice(i, i + seatsPerPage));
    }

    const totalPages = pageData.length;
    pageData.forEach((data, pageIndex) => {
        if (pageIndex > 0) doc.addPage();

        addHeaderAndFooter(doc, pageIndex + 1, totalPages, settings);

        // // Draw the table headers
        // const headerSelect = document.getElementById('headerSelect').value;
        // const headers = [];
        // for (let i = 0; i < settings.numHeaders; i++) {
        //     headers.push(`ROW-${String.fromCharCode(73 + i)}`); // ROW-I, ROW-II, etc.
        // }

        // let startX = 10;
        // let startY = 60;
        const rowHeight = 10;
        // const colWidth = (190) / settings.numHeaders; // Adjust column width based on number of headers

        function toRoman(num) {
            const romanNumeralMap = [
                [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
                [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
                [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
            ];

            let result = '';
            for (const [value, numeral] of romanNumeralMap) {
                while (num >= value) {
                    result += numeral;
                    num -= value;
                }
            }
            return result;
        }



        const headers = Array.from({ length: settings.numHeaders }, (_, i) => `ROW-${toRoman(i + 1)}`);

        let startX = 10;
        let startY = 60;
        const colWidth = (190) / settings.numHeaders;


        // Draw header
        // headers.forEach((col, i) => {
        //     doc.setFont("helvetica", "bold");
        //     doc.text(col, startX + i * colWidth, startY);
        // });



        headers.forEach((col, i) => doc.text(col, startX + i * colWidth, startY));




        // Draw table content
        startY += 10;
        const formattedData = [];
        for (let i = 0; i < data.length; i += settings.numHeaders) {
            formattedData.push(data.slice(i, i + settings.numHeaders));
        }

        formattedData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                doc.setFont("helvetica", "normal");
                doc.text(cell, startX + cellIndex * colWidth, startY + (rowIndex + 1) * rowHeight);
            });
        });


        // startY += 10;
        // for (let rowIndex = 0; rowIndex < data.length; rowIndex += settings.numHeaders) {
        //     for (let colIndex = 0; colIndex < settings.numHeaders; colIndex++) {
        //         doc.text(data[rowIndex + colIndex] || '', startX + colIndex * colWidth, startY + (rowIndex / settings.numHeaders + 1) * 10);
        //     }
        // }




        // Add additional footer details

        // Add footer details to the PDF
        startY += (formattedData.length + 2) * rowHeight;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        // First row of footer: Program/Branch, Semester, Status, and No. of Candidates
        doc.text(`Prog./Branch: ${settings.progBranch}`, 8, startY);  // Left-aligned
        doc.text(`Sem.: ${settings.semester}`, 70, startY);            // Center-left
        doc.text(`Status: ${settings.status}`, 105, startY);           // Center
        doc.text(`No. of Candidates: ${settings.numCandidates}`, 165, startY); // Right-aligned

        // Second row of footer: Present, Absent, and Total Candidates
        startY += rowHeight;
        doc.text("PRESENT: ", 10, startY);         // Left-aligned
        doc.text("ABSENT: ", 70, startY);          // Center-left
        doc.text(`Total: ${settings.numCandidates}`, 165, startY); // Right-aligned

        // Third row of footer: Designation, Branch, Signature with Date
        startY += rowHeight * 2;
        doc.text("DESIGN.", 10, startY);           // Left-aligned
        doc.text("BRANCH", 70, startY);            // Center-left
        doc.text("SIGNATURE WITH DATE", 165, startY); // Right-aligned

        
    });

    // Display the PDF in the iframe if preview is requested
    if (isPreview) {
        const pdfData = doc.output('datauristring');
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.src = pdfData;
        pdfViewer.hidden = false;

        document.getElementById('downloadBtn').disabled = false;
    } else {
        doc.save('Exam_Seating_Arrangement.pdf');
    }
}




// Function to download the PDF
function downloadPDF() {
    generatePDF(false);
}


// Validate user input before generating PDF
function validateInputs() {
    const settings = collectSettings();
    if (!settings.branchName || !settings.examTime || !settings.examDate || !settings.semester || !settings.numHeaders || !settings.numCandidates) {
        alert('Please fill in all fields.');
        return false;
    }
    return true;
}



// Function to start a process with loading bar
function startProcess(action) {
    if (validateInputs()) {
        const loadingBar = document.getElementById('loadingBar');
        const loadingProgress = loadingBar.querySelector('.loading-bar-progress');

        loadingBar.hidden = false;
        loadingProgress.style.width = '0%';

        setTimeout(() => {
            loadingProgress.style.width = '100%';
        }, 100);

        setTimeout(() => {
            loadingBar.hidden = true;
            window[action]();
        }, 4000);
    }
}
