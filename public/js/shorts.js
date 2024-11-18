const dropZone = document.getElementById('dropZone');
const videoInput = document.getElementById('videoInput');
const preview = document.getElementById('preview');
const processButton = document.getElementById('processButton');
const uploadForm = document.getElementById('uploadForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const buttonText = document.querySelector('.button-text');
const errorP = document.getElementById('error');
const uploadSection = document.getElementById('uploadSection');
const existingVideosSection = document.getElementById('existingVideosSection');
const videoList = document.getElementById('videoList');
// const backToUploadBtn = document.getElementById('backToUploadBtn');
const chooseExistingOptionBtn = document.getElementById('chooseExistingOptionBtn');
const uploadOptionBtn = document.getElementById('uploadOptionBtn');

const videos = [];

// start load videos

window.addEventListener('load',async () => {

    try {
        const response = await fetch('/videos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        videos.push(...data.videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Optionally display an error message to the user
        alert('Failed to load videos. Please try again later.');
    }

})

// end load videos

// Event listener to show the existing video selection section
chooseExistingOptionBtn.addEventListener('click', () => {
    uploadSection.style.display = 'none'; // Hide the upload section
    existingVideosSection.style.display = 'block'; // Show the existing videos section
    loadExistingVideos(); // Load the list of existing videos
});

// Event listener to go back to the upload section
// backToUploadBtn.addEventListener('click', () => {
//     existingVideosSection.style.display = 'none'; // Hide the existing videos section
//     uploadSection.style.display = 'block'; // Show the upload section
// });

// Event listener for the "Upload New Video" button
uploadOptionBtn.addEventListener('click', () => {
    existingVideosSection.style.display = 'none'; // Hide the existing videos section
    uploadSection.style.display = 'block'; // Show the upload section
});

// Handle file selection and drag/drop for video upload
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

// Load the user's existing videos (For now, this is a mock function)
async function loadExistingVideos() {

    // Example: Mock existing videos


    videoList.innerHTML = ''; // Clear any existing list
    videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.innerHTML = `
            <button class="video-select-btn" onclick="selectVideo('${video._id}')" data-url="${video._id}">${video.title}</button>
        `;
        videoList.appendChild(videoItem);
    });

    // Add event listeners for selecting a video
    const videoButtons = document.querySelectorAll('.video-select-btn');
    videoButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const videoUrl = event.target.getAttribute('data-url');
            preview.src = `/video/${videoUrl}`;
            preview.style.display = 'block';
        });
    });
}

// Process Video Form Submission
uploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedOption = document.querySelector('input[name="editOption"]:checked');
    if (!selectedOption) {
        errorP.style.display = 'block';
        return;
    }

    loadingSpinner.style.display = 'inline-block';
    buttonText.style.display = 'none';
    processButton.classList.add('disabled');

    const formData = new FormData(uploadForm);
    fetch('/shorts', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed-video.mp4';
        link.click();
        URL.revokeObjectURL(url);
    })
    .catch(error => {
        alert('Failed to process the video: ' + error.message);
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
        buttonText.style.display = 'inline';
        processButton.classList.remove('disabled');
    });
});

function selectVideo(id) {

    const selectVideo = document.getElementById('video-select');
    selectVideo.value = id;

}