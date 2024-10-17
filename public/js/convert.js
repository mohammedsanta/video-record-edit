document.addEventListener('DOMContentLoaded', function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadSection = document.getElementById('uploadSection');
    const conversionTypeSection = document.getElementById('conversionTypeSection');
    const videoOptions = document.getElementById('videoOptions');
    const audioOptions = document.getElementById('audioOptions');
    const uploadNextButton = document.getElementById('uploadNextButton');
    const convertButton = document.getElementById('convertButton');
    const convertButtonAudio = document.getElementById('convertButtonAudio');
    const prevButton = document.getElementById('prevButton');
    const prevButtonAudio = document.getElementById('prevButtonAudio');
    const loadingSection = document.getElementById('loadingSection');
    const downloadSection = document.getElementById('downloadSection');
    const downloadLink = document.getElementById('downloadLink');
    const errorMessage = document.getElementById('errorMessage');
    const videoButton = document.getElementById('videoButton');
    const audioButton = document.getElementById('audioButton');

    let file;

    // Handle drag-and-drop file upload
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;
        handleFile();
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        file = fileInput.files[0];
        handleFile();
    });

    function handleFile() {
        if (file) {
            uploadSection.classList.add('hidden');
            conversionTypeSection.classList.remove('hidden');
        } else {
            errorMessage.textContent = "No file selected. Please select a file.";
        }
    }

    uploadNextButton.addEventListener('click', () => {
        if (file) {
            uploadSection.classList.add('hidden');
            conversionTypeSection.classList.remove('hidden');
        } else {
            errorMessage.textContent = "Please upload a file first.";
        }
    });

    videoButton.addEventListener('click', () => {
        conversionTypeSection.classList.add('hidden');
        videoOptions.classList.remove('hidden');
        convertButton.classList.remove('hidden');
        convertButtonAudio.classList.add('hidden');
    });

    audioButton.addEventListener('click', () => {
        conversionTypeSection.classList.add('hidden');
        audioOptions.classList.remove('hidden');
        convertButtonAudio.classList.remove('hidden');
        convertButton.classList.add('hidden');
    });

    prevButton.addEventListener('click', () => {
        videoOptions.classList.add('hidden');
        conversionTypeSection.classList.remove('hidden');
        convertButton.classList.add('hidden');
    });

    prevButtonAudio.addEventListener('click', () => {
        audioOptions.classList.add('hidden');
        conversionTypeSection.classList.remove('hidden');
        convertButtonAudio.classList.add('hidden');
    });

    function resetForm() {
        uploadSection.classList.remove('hidden');
        conversionTypeSection.classList.add('hidden');
        videoOptions.classList.add('hidden');
        audioOptions.classList.add('hidden');
        convertButton.classList.add('hidden');
        convertButtonAudio.classList.add('hidden');
        loadingSection.classList.add('hidden');
        downloadSection.classList.add('hidden');
        fileInput.value = ''; // Reset file input
        file = null; // Clear file
    }

    function updateCodecOptions() {
        const selectedFormat = document.querySelector('input[name="videoFormat"]:checked').value;
        const codecOptions = document.querySelectorAll('.codec-option');

        codecOptions.forEach(option => {
            if (option.getAttribute('data-format') === selectedFormat) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('input[name="videoFormat"]').forEach(radio => {
        radio.addEventListener('change', updateCodecOptions);
    });

    async function convertFile(formData) {
        try {
            const response = await fetch('http://127.0.0.1:3000/convert/to', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            const fileName = contentDisposition ? 
                contentDisposition.split('filename=')[1].replace(/"/g, '') : 
                'converted-file';

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = `${Date.now()}-${fileName}`;
            downloadLink.click()
            downloadSection.classList.remove('hidden');
            loadingSection.classList.add('hidden');
            
            resetForm(); // Call your form reset function if needed
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = `Failed to process the file: ${error.message}`;
            loadingSection.classList.add('hidden');
        }
    }

    convertButton.addEventListener('click', () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('format', document.querySelector('input[name="videoFormat"]:checked').value);
            formData.append('resolution', document.querySelector('input[name="videoResolution"]:checked').value);
            formData.append('for', 'video');
            formData.append('codec', document.querySelector('input[name="videoCodec"]:checked').value);
            
            loadingSection.classList.remove('hidden');
            convertFile(formData);
        } else {
            errorMessage.textContent = "Please upload a file first.";
        }
    });

    convertButtonAudio.addEventListener('click', () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('for', 'audio');
            formData.append('format', document.querySelector('input[name="audioFormat"]:checked').value);
            formData.append('quality', document.querySelector('input[name="audioQuality"]:checked').value);
            
            loadingSection.classList.remove('hidden');
            convertFile(formData);
        } else {
            errorMessage.textContent = "Please upload a file first.";
        }
    });
});