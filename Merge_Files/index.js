document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const files = document.getElementById('fileInput').files;
    
    if (files.length < 3) {
        alert('Please upload at least 3 files.');
        return;
    }

    // Read and process files
    Promise.all(Array.from(files).map(file => readFile(file)))
        .then(results => {
            const mergedData = mergeData(results);
            const sortedData = sortDataByLastDigit(mergedData);
            const blob = generateExcelBlob(sortedData);
            
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'merged_file.xlsx';
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download Merged File';
        })
        .catch(error => console.error('Error:', error));
});

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            resolve(json);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
}

function mergeData(datasets) {
    return datasets.flat();
}

function sortDataByLastDigit(data) {
    return data.sort((a, b) => {
        const lastDigitA = extractLastDigit(a['Enrollment Number']);
        const lastDigitB = extractLastDigit(b['Enrollment Number']);

        return lastDigitA - lastDigitB;
    });
}

function extractLastDigit(enrollmentNumber) {
    if (typeof enrollmentNumber !== 'string') {
        console.warn('Invalid Enrollment Number:', enrollmentNumber);
        return 0; // Default value if not valid
    }

    // Extract the last numeric part from the string
    const match = enrollmentNumber.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
}

function generateExcelBlob(dat  a) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merged Data');
    const workbookBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    return new Blob([s2ab(workbookBlob)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}
