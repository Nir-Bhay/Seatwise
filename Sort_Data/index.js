// Process the uploaded file
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a file.');
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

    $('#dataTable').DataTable();
}

// Function to add header and footer to each page of the PDF
function addHeaderAndFooter(doc, pageNum, totalPages) {
    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SAGE UNIVERSITY, BHOPAL", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("ESE Spring 2023-24", 105, 22, { align: "center" });
    doc.text("Room No - ______", 105, 29, { align: "center" });
    doc.text("Time: 10:30 AM - 01:30 PM", 200, 50, { align: "right" });
    doc.text("Date: 07.06.2024", 15, 50);
    doc.text("Sem.: VI", 105, 50, { align: "center" });

    // Footer
    doc.setFontSize(10);
    doc.text("Prepared By: Exam Cell", 15, 285);
    doc.text(`Page ${pageNum} of ${totalPages}`, 105, 285, { align: "center" });
    doc.text("SAGE University, Bhopal", 165, 285, { align: "right" });
}

// Generate and display the PDF
function generatePDF(isPreview = true) {
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

    // Handle multiple pages if the number of seats exceeds 30
    const seatsPerPage = 28;
    let pageData = [];
    for (let i = 0; i < tableData.length; i += seatsPerPage) {
        pageData.push(tableData.slice(i, i + seatsPerPage));
    }

    const totalPages = pageData.length;
    pageData.forEach((data, pageIndex) => {
        if (pageIndex > 0) {
            doc.addPage();
        }

        addHeaderAndFooter(doc, pageIndex + 1, totalPages);

        // Draw the table header
        const header = ["ROW-I", "ROW-II", "ROW-III", "ROW-IV"];
        let startX = 10;
        let startY = 60;
        const rowHeight = 10;
        const colWidth = 45; // Adjust column width based on the content

        header.forEach((col, i) => {
            doc.text(col, startX + i * colWidth, startY);
        });

        const formattedData = [];
        for (let i = 0; i < data.length; i += 4) {
            formattedData.push(data.slice(i, i + 4));
        }

        // Draw table content
        startY += rowHeight;
        formattedData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                doc.text(cell, startX + cellIndex * colWidth, startY + (rowIndex + 1) * rowHeight);
            });
        });

        // Add additional footer details
        startY += (formattedData.length + 2) * rowHeight;
        doc.text("Prog./Branch: BBA - 601", 10, startY);
        doc.text("Sem.: VI", 70, startY);
        doc.text("Status: REGULAR/ATKT", 105, startY);
        doc.text("No. of Candidate: 28", 165, startY);

        startY += rowHeight;
        doc.text("PRESENT: ", 10, startY);
        doc.text("ABSENT: ", 70, startY);
        doc.text("Total: 28", 165, startY);

        startY += rowHeight * 2;
        doc.text("DESIGN.", 10, startY);
        doc.text("BRANCH", 70, startY);
        doc.text("SIGNATURE WITH DATE", 165, startY);
    });

    // Display the PDF in the iframe if preview is requested
    if (isPreview) {
        const pdfData = doc.output('datauristring');
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.src = pdfData;
        pdfViewer.hidden = false;

        // Enable download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.disabled = false;
    } else {
        doc.save('Exam_Seating_Arrangement.pdf');
    }
}

// Function to download the PDF
function downloadPDF() {
    generatePDF(false);
}
