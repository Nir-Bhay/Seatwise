document.getElementById('file1').addEventListener('change', handleFileUpload);
document.getElementById('file2').addEventListener('change', handleFileUpload);
document.getElementById('previewBtn').addEventListener('click', previewMergedData);
document.getElementById('downloadBtn').addEventListener('click', downloadExcel);

let dataSheet1 = [];
let dataSheet2 = [];
let columns1 = [];
let columns2 = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonSheet = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (event.target.id === 'file1') {
            dataSheet1 = jsonSheet;
            columns1 = dataSheet1[0]; // First row is the header
            populateColumnDropdown('sheet1Column', columns1);
        } else {
            dataSheet2 = jsonSheet;
            columns2 = dataSheet2[0]; // First row is the header
            populateColumnDropdown('sheet2Column', columns2);
        }

        // Show the column and delimiter selection once both sheets are loaded
        if (dataSheet1.length && dataSheet2.length) {
            document.getElementById('columnSelection').style.display = 'block';
            document.getElementById('delimiterSelection').style.display = 'block';
            document.getElementById('previewBtn').style.display = 'block';
        }
    };

    reader.readAsArrayBuffer(file);
}

function populateColumnDropdown(selectId, columns) {
    const select = document.getElementById(selectId);
    select.innerHTML = ''; // Clear previous options
    columns.forEach((column, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = column;
        select.appendChild(option);
    });
}

function previewMergedData() {
    const sheet1ColumnIndex = document.getElementById('sheet1Column').value;
    const sheet2ColumnIndex = document.getElementById('sheet2Column').value;
    const delimiter = document.getElementById('delimiter').value || ' '; // Default to space if empty

    const mergedData = [];

    const maxLength = Math.max(dataSheet1.length, dataSheet2.length);

    for (let i = 1; i < maxLength; i++) {
        const row1 = dataSheet1[i] ? dataSheet1[i][sheet1ColumnIndex] || '' : '';
        const row2 = dataSheet2[i] ? dataSheet2[i][sheet2ColumnIndex] || '' : '';
        mergedData.push(row1 + delimiter + row2);
    }

    // Show merged data in the textarea for preview
    document.getElementById('mergedDataPreview').value = mergedData.join('\n');
    document.getElementById('previewSection').style.display = 'block';
}

function downloadExcel() {
    const mergedData = document.getElementById('mergedDataPreview').value.split('\n');
    const worksheet = XLSX.utils.aoa_to_sheet(mergedData.map(row => [row]));

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Merged Data');
    XLSX.writeFile(newWorkbook, 'merged_roll_numbers.xlsx');
}
