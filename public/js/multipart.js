const videos = [
    { id: 1, src: 'video1.mp4', title: 'Video 1' },
    { id: 2, src: 'video2.mp4', title: 'Video 2' },
    { id: 3, src: 'video3.mp4', title: 'Video 3' },
];

function loadVideos() {
    const select = document.getElementById('video-select');
    videos.forEach(video => {
        const option = document.createElement('option');
        option.value = video.id;
        option.textContent = video.title;
        select.appendChild(option);
    });
}

function showVideo(videoId) {
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.style.display = item.id === `video-${videoId}` ? 'block' : 'none';
    });
}

document.getElementById('video-select').addEventListener('change', (event) => {
    const selectedVideoId = event.target.value;
    showVideo(selectedVideoId);
});

document.getElementById('video-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('add-trim')) {
        const videoId = event.target.getAttribute('data-video-id');
        const additionalTrimsContainer = document.querySelector(`#video-${videoId} .additional-trims`);
        const trimCount = additionalTrimsContainer.children.length + 2;

        const newTrimInput = document.createElement('div');
        newTrimInput.className = 'trim-input';
        newTrimInput.innerHTML = `
            <label>Trim ${trimCount}</label>
            <label for="start-${videoId}-new">Start Time (seconds):</label>
            <input type="number" id="start-${videoId}-new" min="0" placeholder="0">
            <label for="end-${videoId}-new">End Time (seconds):</label>
            <input type="number" id="end-${videoId}-new" min="0" placeholder="End time">
        `;
        additionalTrimsContainer.appendChild(newTrimInput);
        additionalTrimsContainer.style.display = 'block'; // Show the container
    } else if (event.target.classList.contains('save-trims')) {
        const videoId = event.target.getAttribute('data-video-id');
        const trimList = document.getElementById(`trim-list-${videoId}`);
        trimList.innerHTML = ''; // Clear existing trims

        // Collect main trim
        const mainStart = document.getElementById(`start-${videoId}`);
        const mainEnd = document.getElementById(`end-${videoId}`);

        if (mainStart.value && mainEnd.value) {
            const mainTrimDiv = document.createElement('div');
            mainTrimDiv.innerText = `Main Trim: Start: ${mainStart.value}, End: ${mainEnd.value}`;
            trimList.appendChild(mainTrimDiv);
        }

        // Collect additional trims
        const additionalTrims = document.querySelectorAll(`#video-${videoId} .additional-trims .trim-input`);
        additionalTrims.forEach((trim, index) => {
            const startInput = trim.querySelector('input[type="number"]:first-child');
            const endInput = trim.querySelector('input[type="number"]:nth-child(2)');
            if (startInput.value && endInput.value) {
                const trimDiv = document.createElement('div');
                trimDiv.innerText = `Trim ${index + 1}: Start: ${startInput.value}, End: ${endInput.value}`;
                trimList.appendChild(trimDiv);
            }
        });
    }
});

// Move video up or down based on selection
document.getElementById('move-up').addEventListener('click', () => {
    const selectedValue = document.getElementById('video-select').value;
    if (selectedValue) {
        moveVideo(parseInt(selectedValue), -1);
    }
});

document.getElementById('move-down').addEventListener('click', () => {
    const selectedValue = document.getElementById('video-select').value;
    if (selectedValue) {
        moveVideo(parseInt(selectedValue), 1);
    }
});

function moveVideo(videoId, direction) {
    const index = videos.findIndex(video => video.id === videoId);
    if (direction === -1 && index > 0) {
        [videos[index], videos[index - 1]] = [videos[index - 1], videos[index]];
    } else if (direction === 1 && index < videos.length - 1) {
        [videos[index], videos[index + 1]] = [videos[index + 1], videos[index]];
    }
    loadVideos();
}

document.getElementById('save-button').addEventListener('click', () => {
    const selections = videos.map(video => {
        const starts = [];
        const ends = [];
        
        // Get the main trim
        starts.push(document.getElementById(`start-${video.id}`).value);
        ends.push(document.getElementById(`end-${video.id}`).value);

        return { id: video.id, starts, ends };
    });
    console.log('Selections:', selections);
});

loadVideos();