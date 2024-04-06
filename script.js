
function isAutoDownloadable(fileType) {
    const autoDownloadableExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'apk', 'msi', 'app'];
    const extension = fileType.toLowerCase();
    return autoDownloadableExtensions.includes(extension);
}

function isAutoExecutable(fileType) {
    const autoExecutableExtensions = ['exe', 'bat', 'cmd', 'js', 'vbs', 'ps1', 'hta', 'scr', 'jar', 'wsf'];
    const extension = fileType.toLowerCase();
    return autoExecutableExtensions.includes(extension);
}

function getFileType(url) {
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
        case 'exe':
            return 'Executable';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return 'Archive';
        case 'pdf':
            return 'PDF Document';
        case 'doc':
        case 'docx':
            return 'Microsoft Word Document';
        case 'xls':
        case 'xlsx':
            return 'Microsoft Excel Spreadsheet';
        case 'ppt':
        case 'pptx':
            return 'Microsoft PowerPoint Presentation';
        case 'js':
            return 'JavaScript File';
        case 'html':
        case 'htm':
            return 'HTML File';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return 'Image File';
        case 'mp3':
        case 'wav':
            return 'Audio File';
        case 'mp4':
        case 'mov':
        case 'avi':
            return 'Video File';
        default:
            return 'Unknown File Type';
    }
}

function checkFileType(fileUrl) {
    const fileType = getFileType(fileUrl);
    const autoDownloadable = isAutoDownloadable(fileType);
    const autoExecutable = isAutoExecutable(fileType);

    return {
        fileType: fileType,
        autoDownloadable: autoDownloadable,
        autoExecutable: autoExecutable
    };
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function selectImage() {
    const fileInput = document.getElementById('fileInput');
    const dropArea = document.getElementById('dropArea');
    const resultElement = document.getElementById('result');
    const copiedText = document.getElementById('copiedText');

    resultElement.innerText = '';
    copiedText.textContent = '';

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        dropArea.innerText = file.name;
        decodeQRCode(file);
    } else {
        dropArea.innerText = 'Drag & Drop QR Code Image Here';
    }
}

function copyResult() {
    const resultText = document.getElementById('result').innerText;
    const copiedText = document.getElementById('copiedText');
    if (resultText) {
        copyToClipboard(resultText);
        copiedText.textContent = 'Result copied to clipboard! ✅';
    } else {
        copiedText.textContent = 'No result to copy!';
    }
}

function decodeQRCode(file) {
    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                const resultElement = document.getElementById('result');
                resultElement.innerText = code.data;

                const fileProperties = checkFileType(code.data);
                console.log('File Type:', fileProperties.fileType);
                console.log('Auto Downloadable:', fileProperties.autoDownloadable);
                console.log('Auto Executable:', fileProperties.autoExecutable);

                if (fileProperties.autoDownloadable || fileProperties.autoExecutable) {
                    alert('This file may be harmful. Downloading or executing has been prevented.');
                }
                document.getElementById('copyButton').style.display = 'block';
            } else {
                const resultElement = document.getElementById('result');
                resultElement.innerText = "Nothing found here.";
                document.getElementById('copyButton').style.display = 'none';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function dragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
}

function dragOver(event) {
    event.preventDefault();
    event.stopPropagation();
}

function dragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
}

function dropImage(event) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    selectImageFromFile(file);
}

function selectImageFromFile(file) {
    const dropArea = document.getElementById('dropArea');
    dropArea.innerText = file.name;
    decodeQRCode(file);
}