// Process the uploaded file
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
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

// Generate and download the PDF in the specified format
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title and headers
    doc.setFontSize(12);
    doc.text("SAGE UNIVERSITY, BHOPAL", 105, 15, { align: "center" });
    doc.text("ESE Spring 2023-24", 105, 22, { align: "center" });
    doc.text("Room No - 113", 105, 29, { align: "center" });
    
    // Add time, date, and other details
    doc.setFontSize(10);
    doc.text("TIME: 10:30 AM - 01:30 PM", 10, 35);
    doc.text("DATE: 07.06.2024", 165, 35);
    
    // Add table header
    doc.setFontSize(10);
    const header = ["ROW-I", "ROW-II", "ROW-III", "ROW-IV"];
    let startX = 10;
    let startY = 45;
    const rowHeight = 10;
    const colWidth = 45; // Adjust column width based on the content

    header.forEach((col, i) => {
        doc.text(col, startX + i * colWidth, startY);
    });

    // Collect data from the table
    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tr');

    // Prepare data for rows and columns similar to the image
    let tableData = [];
    for (let i = 1; i < rows.length; i++) { // start from 1 to skip header
        const cells = rows[i].getElementsByTagName('td');
        tableData.push(cells[0].innerText.trim());
    }

    // Assuming the data is grouped into 4 columns, and the rest can be adjusted as needed
    const formattedData = [];
    for (let i = 0; i < tableData.length; i += 4) {
        formattedData.push(tableData.slice(i, i + 4));
    }

    // Draw table content
    startY += rowHeight;
    formattedData.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            doc.text(cell, startX + cellIndex * colWidth, startY + rowIndex * rowHeight);
        });
    });

    // Add footer details
    startY += (formattedData.length + 2) * rowHeight;
    doc.text("Prog./Branch: BBA - 601", 10, startY);
    doc.text("Sem.: VI", 70, startY);
    doc.text("Status: REGULAR/ATKT", 105, startY);
    doc.text("No. of Candidate: 30", 165, startY);

    startY += rowHeight;
    doc.text("PRESENT: ", 10, startY);
    doc.text("ABSENT: ", 70, startY);
    doc.text("Total: 30", 165, startY);

    startY += rowHeight * 2;
    doc.text("DESIGN.", 10, startY);
    doc.text("BRANCH", 70, startY);
    doc.text("SIGNATURE WITH DATE", 165, startY);

    // Save the PDF
    doc.save('Exam_Seeting.pdf');
}
