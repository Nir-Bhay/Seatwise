document.getElementById('file1').addEventListener('change', handleFile);
document.getElementById('file2').addEventListener('change', handleFile);
document.getElementById('file3').addEventListener('change', handleFile);
document.getElementById('file4').addEventListener('change', handleFile);

let data1 = [];
let data2 = [];
let data3 = [];
let data4 = [] ;
let doc; // Global variable to store the PDF document

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (event.target.id === 'file1') {
            data1 = json.flat();
        } else if (event.target.id === 'file2') {
            data2 = json.flat();
        } else if (event.target.id === 'file3') {
            data3 = json.flat();
        } else if (event.target.id === 'file4') {
            data4 = json.flat();
        }
    };
    reader.readAsArrayBuffer(file);
}

function updateProgramOptions() {
    const branch = document.getElementById('CollageName').value;
    const programBranch = document.getElementById('programBranch');
    programBranch.innerHTML = ''; // Clear existing options

    if (branch === 'BTECH') {
        programBranch.innerHTML = `
            <option value="CSE">CSE</option>
            <option value="AI">AI</option>
            <option value="Cyber Security">Cyber Security</option>
            <!-- Add more options as needed -->
        `;
    } else if (branch === 'MBBA') {
        programBranch.innerHTML = `
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <!-- Add more options as needed -->
        `;
    }
    // Add more branches and their respective programs as needed
}

function generatePDF() {
    const branchName = document.getElementById('CollageName').value;
    const programBranch = document.getElementById('programBranch').value;
    const examTime = document.getElementById('examTime').value;
    const examDate = document.getElementById('examDate').value;
    const semester = document.getElementById('semester').value;
    const status = document.getElementById('status').value;
    const numRows = document.getElementById('numRows').value;
    const numColumns = document.getElementById('numColumns').value;
    const numCandidates = document.getElementById('numCandidates').value;
    const arrangementType = document.getElementById('arrangementType').value;

    const { jsPDF } = window.jspdf;
    doc = new jsPDF();
    const maxPerPage = 28;
    let page = 1;
    let row = 0;
    let col = 0;
    let count = 0;

    

    const combinedData = [];
    const maxLength = Math.max(data1.length, data2.length, data3.length, data4.length);
    for (let i = 0; i < maxLength; i++) {
        if (data1[i]) combinedData.push(data1[i]);
        if (data2[i]) combinedData.push(data2[i]);
        if (data3[i]) combinedData.push(data3[i]);
        if (data4[i]) combinedData.push(data4[i]);
    }
    function addHeaderFooter(doc, pageNum, totalPages) {
        // Custom inputs
        const branchName = "SAGE UNIVERSITY, BHOPAL";
        const examTime = "10:30 AM - 01:30 PM";
        const examDate = "07.06.2024";
        const semester = "VI";
        const programBranch = "BBA - 601";
        const status = "REGULAR / ATKT";
        const numCandidates = "28";

        // Header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(branchName.toUpperCase(), 105, 15, { align: "center" });

        doc.setFontSize(15);
        doc.setFont("helvetica", "normal");
        doc.text(`ESE Spring 2023-24`, 105, 22, { align: "center" });
        doc.text(`Room No - 113`, 105, 29, { align: "center" });
        doc.text(`Time: ${examTime}`, 200, 50, { align: "right" });
        doc.text(`Date: ${examDate}`, 15, 50);
        doc.text(`Sem.: ${semester}`, 105, 50, { align: "center" });

        // Footer
        doc.setFontSize(13);
        doc.text(`Prog./Branch: ${programBranch} `, 15, 250);
        doc.text(`Sem.: ${semester}`, 90, 250);
        doc.text(`Status: ${status}`, 150, 250);
        doc.text(`No. of Candidates: ${numCandidates}`, 15, 265);
        doc.text("PRESENT: ", 70, 265);
        doc.text("ABSENT: ", 130, 265);
        doc.text(`Total: ${numCandidates}`, 180, 265);
        doc.text("DESIGN.", 15, 285);
        doc.text("BRANCH", 70, 285);
        doc.text("SIGNATURE WITH DATE", 125, 285);
    }

    const totalPages = Math.ceil(combinedData.length / maxPerPage);

    function addColumnHeaders() {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        for (let i = 0; i < numColumns; i++) {
            doc.text(`Header ${i + 1}`, 10 + i * 50, 80);
        }
    }

    function addDataVertically() {
        for (let i = 0; i < combinedData.length; i++) {
            if (count % maxPerPage === 0 && count !== 0) {
                addHeaderFooter(doc, page, totalPages);
                doc.addPage();
                page++;
                row = 0;
                col = 0;
            }
            if (count % maxPerPage === 0) {
                addColumnHeaders();
            }
            doc.text(combinedData[i], 10 + col * 50, 90 + row * 10);
            col++;
            if (col === parseInt(numColumns)) {
                col = 0;
                row++;
            }
            count++;
        }
    }

    function addDataHorizontally() {
        for (let i = 0; i < combinedData.length; i++) {
            if (count % maxPerPage === 0 && count !== 0) {
                addHeaderFooter(doc, page, totalPages);
                doc.addPage();
                page++;
                row = 0;
                col = 0;
            }
            if (count % maxPerPage === 0) {
                addColumnHeaders();
            }
            doc.text(combinedData[i], 10 + col * 50, 90 + row * 10);
            row++;
            if (row === parseInt(numRows)) {
                row = 0;
                col++;
            }
            count++;
        }
    }

    if (arrangementType === 'vertical') {
        addDataVertically();
    } else if (arrangementType === 'horizontal') {
        addDataHorizontally();
    }

    // Add header and footer to the last page
    addHeaderFooter(doc, page, totalPages);

    // Display PDF preview
    const pdfPreview = document.getElementById('pdfPreview');
    pdfPreview.innerHTML = `<iframe src="${doc.output('datauristring')}" width="100%" height="600px"></iframe>`;
}

function downloadPDF() {
    if (doc) {
        doc.save('formatted_numbers.pdf');
    } else {
        alert("Please generate the PDF first.");
    }
}
