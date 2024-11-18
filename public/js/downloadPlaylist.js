const form = document.getElementById('playlistForm');
const formatsTableBody = document.getElementById('formatsTableBody');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinnerOverlay = document.getElementById('loadingSpinnerOverlay');

function showSpinner() {
    loadingSpinnerOverlay.style.display = 'flex'; // Show overlay
    document.body.style.pointerEvents = 'none'; // Disable interactions
}

function hideSpinner() {
    loadingSpinnerOverlay.style.display = 'none'; // Hide overlay
    document.body.style.pointerEvents = 'auto'; // Enable interactions
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const playlistUrl = document.getElementById('playlistUrl').value;
    formatsTableBody.innerHTML = ''; // Clear previous data
    showSpinner(); // Show spinner

    const response = await fetch('http://127.0.0.1:3000/youtube/playlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: playlistUrl })
    });

    hideSpinner(); // Hide spinner

    if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
    }

    const data = await response.json();
    const videoMap = {};

    // Group formats by video ID
    data.forEach(video => {
        const videoId = video.videoId;
        if (!videoMap[videoId]) {
            videoMap[videoId] = {
                video: [],
                audio: []
            };
        }
        video.formats.forEach(format => {
            if (format.resolution && format.resolution.toLowerCase() === 'audio only') {
                videoMap[videoId].audio.push(format);
            } else {
                videoMap[videoId].video.push(format);
            }
        });
    });

    // Populate the table
    Object.keys(videoMap).forEach(videoId => {
        const { video, audio } = videoMap[videoId];
        const videoRow = createRow(videoId, video, audio);
        formatsTableBody.appendChild(videoRow);
    });
});

function createRow(videoId, videoFormats, audioFormats) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${videoId}</td>
        <td>
            <select name="video-${videoId}">
                <option value="">Select Video Format</option>
                ${videoFormats.map(format => `<option value="${format.format_id}">${format.quality} (${format.resolution || 'N/A'}) - ${format.video_ext || 'N/A'}</option>`).join('')}
            </select>
        </td>
        <td>Select Video</td>
        <td>
            <select name="audio-${videoId}">
                <option value="">Select Audio Format</option>
                ${audioFormats.map(format => `<option value="${format.format_id}">${format.quality} - ${format.audio_ext || 'N/A'}</option>`).join('')}
            </select>
        </td>
        <td>Select Audio</td>
    `;
    return row;
}

document.getElementById('submitFormats').addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Clear previous error messages
    const selectedFormats = [];
    let errorOccurred = false;

    const rows = formatsTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const videoId = row.cells[0].textContent;
        const selectedVideoFormat = row.querySelector(`select[name="video-${videoId}"]`).value;
        const selectedAudioFormat = row.querySelector(`select[name="audio-${videoId}"]`).value;

        // Validate selections
        if (selectedVideoFormat && !selectedAudioFormat) {
            errorMessage.textContent = `Please select an audio format for video ID ${videoId}.`;
            errorMessage.style.display = 'block';
            errorOccurred = true;
        }

        // Collect selected formats
        if (selectedVideoFormat) {
            selectedFormats.push({ type: 'video', format_id: selectedVideoFormat, videoId });
        }
        if (selectedAudioFormat) {
            selectedFormats.push({ type: 'audio', format_id: selectedAudioFormat, videoId });
        }
    });

    if (errorOccurred) return; // Stop submission if validation fails

    showSpinner(); // Show spinner for submission

    // Submit selected formats to the server
    fetch('http://127.0.0.1:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formats: selectedFormats })
    })
    .then(response => response.json())
    .then(data => {
        alert('Formats submitted successfully!');
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Error submitting formats:', error);
        alert('Error submitting formats: ' + error.message);
    })
    .finally(() => hideSpinner()); // Ensure spinner is hidden after submission
});