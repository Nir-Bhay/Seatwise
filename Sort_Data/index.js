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

function sortData(data) {
    return data.sort((a, b) => {
        const prefixA = getPrefix(a['Student']);
        const prefixB = getPrefix(b['Student']);
        const numA = getNumericPart(a['Student']);
        const numB = getNumericPart(b['Student']);

        if (prefixA === prefixB) {
            return numA - numB;  // Sort by numeric part if prefixes are the same
        } else {
            return prefixA.localeCompare(prefixB);  // Sort by prefix if they are different
        }
    });
}

function getPrefix(enrollmentNumber) {
    if (typeof enrollmentNumber === 'string') {
        const match = enrollmentNumber.match(/^[^\d]+/);  // Extracts prefix (e.g., '22BTE3CSE')
        return match ? match[0] : '';  // Return the match if found, otherwise return an empty string
    }
    return '';
}

function getNumericPart(enrollmentNumber) {
    if (typeof enrollmentNumber === 'string') {
        const match = enrollmentNumber.match(/\d+$/);
        return match ? parseInt(match[0], 10) : Infinity;
    }
    return Infinity;
}

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

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.getElementById('dataTable');
    const rows = table.getElementsByTagName('tr');
    
    let y = 10;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const text = row.innerText.split('\t').join(' ');
        doc.text(text, 10, y);
        y += 10;
    }

    doc.save('sorted_data.pdf');
}
