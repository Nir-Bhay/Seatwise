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

// Adding page details dynamically
function addPageDetail() {
    const pageCount = pageDetailsArray.length + 1;
    const roomNumber = prompt(`Enter Room Number for Page ${pageCount}`);
    const numCandidates = prompt(`Enter Number of Candidates for Page ${pageCount}`);
    const numColumns = prompt(`Enter Number of Columns for Page ${pageCount}`);

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
    `;
    pageDetailsContainer.appendChild(div);
}

// PDF Generation Logic
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'landscape',
        // unit: 'mm',
        unit: 'pt',
        format: 'a4'
    });

    const collageName = document.getElementById('CollageName').value;
    const programBranch = document.getElementById('programBranch').value;
    const examTime = document.getElementById('examTime').value;
    const examDate = document.getElementById('examDate').value;
    const semester = document.getElementById('semester').value;
    const status = document.getElementById('status').value;



   



    // Iterate over each page detail to generate pages
    pageDetailsArray.forEach((pageDetail, index) => {
        if (index > 0) pdf.addPage();

        // Add headers and footers
        addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, pageDetail.roomNumber);

        // Add data columns
        addDataColumns(pdf, pageDetail, index);
    });

    // Preview PDF
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const iframe = `<iframe src="${url}" width="100%" height="600px" style="border: none;"></iframe>`;
    document.getElementById('pdfPreview').innerHTML = iframe;

}




// Add Headers and Footers
// Add Headers and Footers
function addHeaderFooter(pdf, collageName, programBranch, examTime, examDate, semester, status, roomNumber, numCandidates) {
    const margin = 40;
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Header
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(collageName.toUpperCase(), width / 2, margin + 5, { align: "center" });

    pdf.setFontSize(15);
    pdf.setFont("helvetica", "normal");
    pdf.text(`ESE Spring 2023-24`, width / 2, margin + 25, { align: "center" });
    pdf.text(`Room No - ${roomNumber}`, width / 2, margin + 45, { align: "center" });
    pdf.text(`Time: ${examTime}`, width - margin, margin + 45, { align: "right" });
    pdf.text(`Date: ${examDate}`, margin, margin + 45);
    pdf.text(`Sem.: ${semester}`, width / 2, margin + 65, { align: "center" });

    // Footer
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Program/Branch: ${programBranch}`, margin, height - 105);
    pdf.text(`Semester: ${semester}`, margin + 80, height - 105);
    pdf.text(`Status: ${status}`, margin + 170, height - 105);
    pdf.text(`No. of Candidates: ${numCandidates}`, margin, height - 85);
    pdf.text("PRESENT: ", margin + 80, height - 85);
    pdf.text("ABSENT: ", margin + 160, height - 85);
    pdf.text(`Total: ${numCandidates}`, margin + 240, height - 85);
    pdf.text("DESIGN.", margin, height - 65);
    pdf.text("BRANCH", margin + 80, height - 65);
    pdf.text("SIGNATURE WITH DATE", margin + 160, height - 65); 

    // Page Number at the bottom
    pdf.setFontSize(10);
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, width - margin - 40, height - margin);
}



// Add Data Columns to PDF
function addDataColumns(pdf, pageDetail, pageIndex) {
    const margin = 40;
    const colWidth = (pdf.internal.pageSize.getWidth() - margin * 2) / pageDetail.numColumns;
    const rowHeight = 20;
    const maxRows = Math.floor((pdf.internal.pageSize.getHeight() - margin * 3) / rowHeight);

    const data = [data1, data2, data3, data4].filter(arr => arr.length > 0); // Get non-empty data arrays
    const totalData = data.flat(); // Flatten into a single array

    
    let xPos = margin;
    let yPos = 120;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    
    for (let i = 0; i < pageDetail.numCandidates; i++) {
        const dataIndex = pageIndex * pageDetail.numCandidates + i;

        // Ensure the dataIndex is within bounds and the value is valid
        if (dataIndex >= totalData.length) break;

        const value = totalData[dataIndex];

        // Only add valid strings to the PDF
        if (typeof value === 'string' && value.trim() !== '') {
            if (i % pageDetail.numColumns === 0 && i !== 0) {
                xPos = margin; // Reset X position after reaching column count
                yPos += rowHeight; // Move to the next row
            }
            if (yPos + rowHeight > pdf.internal.pageSize.getHeight() - margin) break; // Stop if reaching page end

            // Draw text in PDF
            pdf.text(value, xPos, yPos);

            // Update X position for next text
            xPos += colWidth;
        } else {
            console.warn(`Skipped invalid data at index ${dataIndex}:`, value);
        }
    }
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });

    // Add logic to build the PDF for download similar to preview
    generatePDF(); // Call generate function to build PDF content

    // Trigger download after PDF is built
    pdf.save('exam_seating_arrangement.pdf');
}
