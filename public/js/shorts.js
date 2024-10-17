const dropZone = document.getElementById('dropZone');
const videoInput = document.getElementById('videoInput');
const preview = document.getElementById('preview');
const processButton = document.getElementById('processButton');
const uploadForm = document.getElementById('uploadForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const buttonText = document.querySelector('.button-text');

dropZone.addEventListener('click', () => videoInput.click());

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    if (file) {
        handleFile(file);
    }
});

videoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
});

function handleFile(file) {
    if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.style.display = 'block'; // Show video
        processButton.classList.add('enabled');
    } else {
        alert('Please upload a valid video file.');
    }
}

uploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedOption = document.querySelector('input[name="editOption"]:checked');
    const errorP = document.getElementById('error')
    if (!selectedOption) {
        console.log(errorP)
        // errorP.classList.remove = 'error';
        errorP.style.display = 'block'
        // alert('Please select an editing option.');
        return;
    }

    // Show loading spinner and hide button text
    loadingSpinner.style.display = 'inline-block';
    buttonText.style.display = 'none';
    processButton.classList.add('disabled');

    const formData = new FormData(uploadForm);
    fetch('http://127.0.0.1:3000/shorts', { // Replace with your server endpoint URL
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.blob(); // Get the response as a blob
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed-video.mp4'; // Set a default file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up URL object
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to process the video: ' + error.message);
    })
    .finally(() => {
        // Hide loading spinner and show button text
        loadingSpinner.style.display = 'none';
        buttonText.style.display = 'inline';
        processButton.classList.remove('disabled');
    });
});