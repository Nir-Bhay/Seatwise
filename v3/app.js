document.getElementById('file1').addEventListener('change', handleFile);
document.getElementById('file2').addEventListener('change', handleFile);
document.getElementById('file3').addEventListener('change', handleFile);
document.getElementById('file4').addEventListener('change', handleFile);

let data1 = [];
let data2 = [];
let data3 = [];
let data4 = [];
let doc; // Global variable to store the PDF document

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

            if (event.target.id === 'file1') {
                data1 = json.flat();
            } else if (event.target.id === 'file2') {
                data2 = json.flat();
            } else if (event.target.id === 'file3') {
                data3 = json.flat();
            } else if (event.target.id === 'file4') {
                data4 = json.flat();
            }
        } catch (error) {
            alert("Error processing file: " + error.message);
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



let pageDetailsArray = []; // Store data for each page

// Function to add a new page detail and prompt user for inputs
function addPageDetail() {
    const pageDetailsContainer = document.getElementById('pageDetailsContainer');
    const pageCount = document.getElementsByClassName('page-detail').length + 1;

    // Prompt the user for the details of the new page
    const roomNumber = prompt(`Enter Room Number for Page ${pageCount}`);
    const numCandidates = prompt(`Enter Number of Candidates for Page ${pageCount}`);
    const numColumns = prompt(`Enter Number of Columns for Page ${pageCount}`);

    if (!roomNumber || !numCandidates || !numColumns) {
        alert("Please fill in all details.");
        return;
    }

    // Save the details in the pageDetailsArray
    pageDetailsArray.push({
        roomNumber: roomNumber,
        numCandidates: parseInt(numCandidates),  // Ensure it's a number
        numColumns: parseInt(numColumns)         // Ensure it's a number
    });

    // Dynamically add the page details to the container for user reference
    const pageDetailHTML = `
        <div class="page-detail">
            <h4>Page ${pageCount}</h4>
            <div class="form-group">
                <label>Room Number: ${roomNumber}</label>
            </div>
            <div class="form-group">
                <label>Number of Candidates: ${numCandidates}</label>
            </div>
            <div class="form-group">
                <label>Number of Columns: ${numColumns}</label>
            </div>
        </div>
    `;
    pageDetailsContainer.insertAdjacentHTML('beforeend', pageDetailHTML);
}



function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const branchName = document.getElementById('CollageName').value || '';
    const programBranch = document.getElementById('programBranch').value || '';
    const examTime = document.getElementById('examTime').value || '';
    const examDate = document.getElementById('examDate').value || '';
    const semester = document.getElementById('semester').value || '';
    const status = document.getElementById('status').value || '';

    const combinedData = [];
    const maxLength = Math.max(data1.length, data2.length, data3.length, data4.length);
    for (let i = 0; i < maxLength; i++) {
        if (data1[i]) combinedData.push(data1[i]);
        if (data2[i]) combinedData.push(data2[i]);
        if (data3[i]) combinedData.push(data3[i]);
        if (data4[i]) combinedData.push(data4[i]);
    }

    let dataIndex = 0; // Initialize dataIndex to track the data flow


    // Loop through each page and generate the respective details in the PDF
    pageDetailsArray.forEach((pageDetail, index) => {
        const { roomNumber, numCandidates, numColumns } = pageDetail;

        // Add header and footer to the current page
        addHeaderFooter(doc, roomNumber, numCandidates, branchName, programBranch, examTime, examDate, semester, status);

        // Add data columns to the page
        dataIndex = addDataColumns(doc, combinedData, numColumns, numCandidates, dataIndex);

        // If there are more pages, add a new one
        if (index < pageDetailsArray.length - 1 && dataIndex < combinedData.length) {
            doc.addPage();
        }
    });

    // Handle any remaining data that spills over to the last page
    if (dataIndex < combinedData.length) {
        const lastPageDetail = pageDetailsArray[pageDetailsArray.length - 1]; // Use the last page's details
        const { roomNumber, numCandidates, numColumns } = lastPageDetail;
        doc.addPage();
        addHeaderFooter(doc, roomNumber, numCandidates, branchName, programBranch, examTime, examDate, semester, status);
        addDataColumns(doc, combinedData, numColumns, numCandidates, dataIndex);
    }


    // Display the PDF in the preview area
    const pdfPreview = document.getElementById('pdfPreview');
    pdfPreview.innerHTML = `<iframe src="${doc.output('datauristring')}" width="100%" height="800px"></iframe>`;
    // doc.save('exam_seating_arrangement.pdf');
}

// Helper function to add headers/footers to the PDF
function addHeaderFooter(doc, roomNumber, numCandidates, branchName, programBranch, examTime, examDate, semester, status) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(branchName.toUpperCase(), 148, 15, { align: "center" });

    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    doc.text(`ESE Spring 2023-24`, 148, 22, { align: "center" });
    doc.text(`Room No - ${roomNumber}`, 148, 29, { align: "center" });
    doc.text(`Time: ${examTime}`, 287, 50, { align: "right" });
    doc.text(`Date: ${examDate}`, 10, 50);
    doc.text(`Sem.: ${semester}`, 148, 50, { align: "center" });

    doc.setFontSize(13);
    doc.text(`Prog./Branch: ${programBranch} `, 10, 190);
    doc.text(`Sem.: ${semester}`, 90, 190);
    doc.text(`Status: ${status}`, 180, 190);
    doc.text(`No. of Candidates: ${numCandidates}`, 10, 205);
    doc.text("PRESENT: ", 70, 205);
    doc.text("ABSENT: ", 130, 205);
    doc.text(`Total: ${numCandidates}`, 260, 205);
    doc.text("DESIGN.", 10, 225);
    doc.text("BRANCH", 70, 225);
    doc.text("SIGNATURE WITH DATE", 125, 225);
}




// Helper function to add data columns to the PDF and track the data index
function addDataColumns(doc, combinedData, numColumns, numCandidates, dataIndex) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    const colWidth = (doc.internal.pageSize.getWidth() - 20) / numColumns;
    const rowHeight = 10;
    let row = 0;
    let col = 0;

    // Loop through the data and place it in columns/rows, respecting the numCandidates per page
    for (let i = dataIndex; i < combinedData.length; i++) {
        doc.text(combinedData[i], 10 + col * colWidth, 90 + row * rowHeight);
        col++;
        if (col >= numColumns) {
            col = 0;
            row++;
        }
        candidatesAdded++;

        // Stop if we have reached the number of candidates allowed on this page
        if (candidatesAdded >= numCandidates) {
            return i + 1; // Return the next index to start from in the next page
        }
    }
    return combinedData.length; // Return the final index after filling all data
}










// if (arrangementType === 'vertical') {
//     addDataVertically();
// } else if (arrangementType === 'horizontal') {
//     addDataHorizontally();
// }


// function addDataVertically() {
//     doc.setFontSize(10); // Adjusted font size for data
//     const colWidth = (doc.internal.pageSize.getWidth() - 20) / numColumns;
//     for (let i = 0; i < combinedData.length; i++) {
//         if (count % maxPerPage === 0 && count !== 0) {
//             addHeaderFooter(doc, page, totalPages);
//             doc.addPage();
//             page++;
//             row = 0;
//             col = 0;
//         }
//         if (count % maxPerPage === 0) {
//             addColumnHeaders();
//         }
//         doc.text(combinedData[i], 10 + col * colWidth, 90 + row * 10); // Adjusted spacing
//         col++;
//         if (col === parseInt(numColumns)) {
//             col = 0;
//             row++;
//         }
//         count++;
//     }
// }



// function addDataHorizontally() {
//     doc.setFontSize(10); // Adjusted font size for data
//     const colWidth = (doc.internal.pageSize.getWidth() - 20) / numColumns;
//     for (let i = 0; i < combinedData.length; i++) {
//         if (count % maxPerPage === 0 && count !== 0) {
//             addHeaderFooter(doc, page, totalPages);
//             doc.addPage();
//             page++;
//             row = 0;
//             col = 0;
//         }
//         if (count % maxPerPage === 0) {
//             addColumnHeaders();
//         }
//         doc.text(combinedData[i], 10 + col * colWidth, 90 + row * 10); // Adjusted spacing
//         row++;
//         if (row === parseInt(numRows)) {
//             row = 0;
//             col++;
//         }
//         count++;
//     }
// }




// function downloadPDF() {
//     if (doc) {
//         doc.save('formatted_numbers.pdf');
//     } else {
//         alert("Please generate the PDF first.");
//     }
// }
