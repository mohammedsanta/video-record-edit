
const downloadedVideos = [];


window.addEventListener('load', async () => {
    await loadVideos();
});

// Function to load all videos
async function loadVideos() {
    try {
        const response = await fetch('http://127.0.0.1:3000/videos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        downloadedVideos.push(...data.videos);

        const videoList = document.getElementById('video-list');
        videoList.innerHTML = ''; // Clear existing content

        data.videos.forEach((video) => {
            videoList.innerHTML += createVideoListItem(video);
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        // Optionally display an error message to the user
        alert('Failed to load videos. Please try again later.');
    }
}

function createVideoListItem(video) {
    return `
        <li class="video-item" data-video-id="${video._id}">
            <span>
                <span class="video-title" onclick="playVideo('${video._id}')" style="cursor: pointer;">${video.title}</span>
                <input type="text" class="video-input" style="display: none;" value="${video.title}">
            </span>
            <div>
                <button class="delete-button" onclick="handleDelete('${video._id}')" aria-label="Delete video titled ${video.title}">Delete</button>
                <button class="edit-button" onclick="handleEdit('${video._id}')" aria-label="Edit video titled ${video.title}">Edit</button>
                <button class="save-button" style="display: none;" onclick="saveVideo('${video._id}')" aria-label="Save changes for video titled ${video.title}">Save</button>
            </div>
        </li>
    `;
}

// Function to handle starting edit mode
function handleEdit(videoId) {
    const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
    const titleElement = videoItem.querySelector('.video-title');
    const inputElement = videoItem.querySelector('.video-input');
    const saveButton = videoItem.querySelector('.save-button');
    const editButton = videoItem.querySelector('button[onclick*="handleEdit"]'); // Select the edit button

    // Start editing: show the input and hide the title
    titleElement.style.display = 'none';
    inputElement.style.display = 'inline';
    saveButton.style.display = 'inline';
    editButton.style.display = 'none'; // Hide the edit button
}

// Function to save the edited video title
async function saveVideo(videoId) {
    const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
    if (!videoItem) {
        console.error(`Video item with ID ${videoId} not found.`);
        return; // Exit if the video item is not found
    }
    
    const inputElement = videoItem.querySelector('.video-input');
    const newTitle = inputElement.value.trim(); // Get the new title and trim whitespace

    if (newTitle === '') {
        alert('Title cannot be empty.'); // Basic validation
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:3000/video/${videoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Update the displayed title
        videoItem.querySelector('.video-title').innerText = newTitle;
        videoItem.querySelector('.video-title').style.display = 'inline';
        videoItem.querySelector('.video-input').style.display = 'none';
        videoItem.querySelector('.save-button').style.display = 'none';
        videoItem.querySelector('.edit-button').style.display = 'inline';
        
        // Show the edit button again
        const editButton = videoItem.querySelector('button[onclick*="handleEdit"]');
        editButton.style.display = 'inline';
    } catch (error) {
        console.error('Error saving video title:', error);
    }
}

// Function to reset edit mode
function resetEditMode(videoId) {
    const videoItem = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
    videoItem.querySelector('.video-title').style.display = 'inline';
    videoItem.querySelector('.video-input').style.display = 'none';
    videoItem.querySelector('.save-button').style.display = 'none';
}

// Function to handle deletion confirmation
async function handleDelete(videoId) {
    if (confirm('Are you sure you want to delete this video?')) {
        try {
            const response = await fetch(`/video/delete/${videoId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await loadVideos(); // Reload the video list after deletion
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    }
}

// Display Video


const span = document.getElementsByClassName("close")[0];
const video = document.getElementById("video");

let currentVideoId = null; // Store the current video ID

function openVideoModal(videoId) {
    const video = downloadedVideos.find(v => v._id === videoId);
    if (video) {
        const videoSource = document.getElementById('videoSource');
        videoSource.src = video.url; // Set the video URL
        currentVideoId = videoId; // Store the current video ID
        const modal = document.getElementById('videoModal');
        modal.style.display = 'flex'; // Show modal
        const videoElement = document.getElementById('video');
        videoElement.load(); // Load the new video
        videoElement.play(); // Play the video automatically
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none'; // Hide modal
}

function deleteVideo() {
    const videoElement = document.getElementById('video');

    if (videoElement) {
        // Remove the video element from the modal
        videoElement.parentElement.removeChild(videoElement);
    }

    // Close the modal
    closeVideoModal();

    // Reset the current video ID
    currentVideoId = null;
}


function playVideo(videoId) {
    const video = downloadedVideos.find(v => v._id === videoId);
    if (video) {
        console.log(video)
        // Create a video element
        const videoElement = document.createElement('video');
        videoElement.src = `/video/${video._id}`; // Assuming video.url holds the video path
        videoElement.controls = true;
        videoElement.classList.add('play-video');
        videoElement.style.width = '100%'; // Set width as needed
        videoElement.style.maxWidth = '600px'; // Max width
        videoElement.style.maxHeight = '600px'; // Max width
        videoElement.style.minHeight = '100px'; // Max width

        // Create a container to hold the video
        const modalVideo = document.createElement('div');
        const modalVideoContent = document.createElement('div');
        modalVideo.appendChild(modalVideoContent)
        modalVideo.classList.add('modal-video');
        modalVideoContent.classList.add('modal-video-content');
        
        // Create a close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.onclick = function() {
            document.body.removeChild(modalVideo); // Remove the container when closed
            videoElement.pause(); // Pause video
            videoElement.currentTime = 0; // Reset video to start
        };

        // Append video and close button to the container
        modalVideoContent.appendChild(videoElement);
        modalVideoContent.appendChild(closeButton);
        
        // Append the container to the body
        document.body.appendChild(modalVideo);
        
        videoElement.play(); // Play the video
    }
}


function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none'; // Hide modal
    const videoElement = document.getElementById('video');
    videoElement.pause(); // Pause video
    videoElement.currentTime = 0; // Reset video to start
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideoModal();
    }
}

// Close the modal
// span.onclick = function() {
//     modal.style.display = "none";
//     video.pause(); // Pause the video when the modal is closed
//     video.currentTime = 0; // Reset video to start
// }

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
        video.pause();
        video.currentTime = 0;
    }
}



function showSection(sectionId) {
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'downloadedVideos') {
        // displayVideos(); // Display videos when entering this section
    }
}

function showModal() {
    document.getElementById('videoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('videoModal').style.display = 'none';
}

// Start Session

// Load Session

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://127.0.0.1:3000/sessions';
    const sessionContainer = document.querySelector(".session-boxes");

    // Fetch sessions when the page loads
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sessionContainer.innerHTML = '';

            // Loop through the retrieved sessions and create session boxes
            data.sessions.forEach(session => {
                const sessionBoxHTML = `
                    <div class="session-box">
                        <h2 id="title-${session._id}">${session.title}</h2>
                        <input type="text" id="input-${session._id}" class="edit-input" style="display:none;">
                        <div class="session-btn-container">
                            <button class="button show-details" onclick="fetchVideos('${session._id}')" data-session-id="${session._id}">Show Details</button>
                            <button class="button edit-button" data-session-id="${session._id}">Edit Title</button>
                            <button class="button save-btn" style="display:none;" data-session-id="${session._id}">Save</button>
                            <button class="button delete-button" data-session-id="${session._id}">Delete</button>
                            <button class="button join-button" onclick="butJoinSession('${session._id}')" data-session-id="${session._id}">Join</button>
                        </div>
                    </div>
                `;
                sessionContainer.innerHTML += sessionBoxHTML;
            });
        })
        .catch(error => {
            console.error("Error fetching sessions:", error);
            alert("Failed to load sessions: " + error.message);
        });

    // Event delegation for button clicks
    sessionContainer.addEventListener('click', function(event) {
        const target = event.target;
        const sessionId = target.dataset.sessionId;

        if (target.classList.contains('edit-button')) {
            editTitle(sessionId);
        } else if (target.classList.contains('save-btn')) {
            saveTitle(sessionId);
        }
    });
});

async function fetchVideos(sessionId) {
        const response = await fetch(`/session/videos/${sessionId}`); // Adjust the URL as needed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        populateVideoList(data.videos); // Assuming the API returns an object with a 'videos' property

        const addVideo = document.getElementById('add-video-session')

        const selectVidSession = document.getElementById('select-vid-session');
        selectVidSession.innerHTML = '';
        const createSelect = document.createElement('select');
        selectVidSession.appendChild(createSelect);
        createSelect.setAttribute('id','add-video-session');
        createSelect.setAttribute('session-id',sessionId);

        downloadedVideos.forEach((v,index) => {
            console.log(index)
            selectVidSession.appendChild(createSelect)
            const createOption = document.createElement('option');
            createOption.innerHTML = v.title;
            createOption.value = v._id;
            createSelect.appendChild(createOption)
        })

}

function populateVideoList(videos) {
    const videoList = document.getElementById('video-session-list');

    
    videoList.innerHTML = ''; // Clear any existing items

    if (videos.length === 0) {
        videoList.innerHTML = '<li>No videos available.</li>';
        return;
    }

    videos.forEach(video => {


        // Assuming video has an _id property
        const matchingVideos = downloadedVideos.filter(v => v._id === video);
        
        if(matchingVideos) {
            const createLiDiv = document.createElement('div')
            videoList.appendChild(createLiDiv)

            
            const listItem = document.createElement('li');
            // createDelete.innerHTML = '<button class="">✖</button>';
            listItem.textContent = matchingVideos[0].title; // Assuming each video object has a title property
            listItem.onclick = () => playVideo(video); // Pass a function reference
            console.log(listItem)
            createLiDiv.appendChild(listItem);
        }
    });
}

function editTitle(sessionId) {
    const titleElement = document.getElementById(`title-${sessionId}`);
    const inputElement = document.getElementById(`input-${sessionId}`);
    const saveButton = document.querySelector(`.save-btn[data-session-id="${sessionId}"]`);
    const editButton = document.querySelector(`.edit-button[data-session-id="${sessionId}"]`);

    // Set input value to current title
    inputElement.value = titleElement.textContent; 
    titleElement.style.display = 'none'; // Hide title
    inputElement.style.display = 'block'; // Show input
    saveButton.style.display = 'inline'; // Show save button
    editButton.style.display = 'none'; // Hide edit button
}

function saveTitle(sessionId) {
    const titleElement = document.getElementById(`title-${sessionId}`);
    const inputElement = document.getElementById(`input-${sessionId}`);
    const saveButton = document.querySelector(`.save-btn[data-session-id="${sessionId}"]`);
    const editButton = document.querySelector(`.edit-button[data-session-id="${sessionId}"]`);

    const updatedTitle = inputElement.value;

    // Update the title element with the new value
    titleElement.textContent = updatedTitle;
    titleElement.style.display = 'block'; // Show title
    inputElement.style.display = 'none'; // Hide input
    saveButton.style.display = 'none'; // Hide save button
    editButton.style.display = 'inline'; // Show edit button

    // Send the updated title to the server
    const apiUrl = `http://127.0.0.1:3000/session/${sessionId}`;
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: updatedTitle })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Session updated:", data);
        // Optionally handle any additional UI updates based on the response
    })
    .catch(error => {
        console.error("Error updating session:", error);
        alert("Failed to update session: " + error.message);
    });
}

// Add this function to handle the delete action
function deleteSession(sessionId) {
    const apiUrl = `http://127.0.0.1:3000/session/${sessionId}`;
    
    fetch(apiUrl, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the session box from the UI
            const sessionBox = document.querySelector(`.session-box:has(button[data-session-id="${sessionId}"])`);
            if (sessionBox) {
                sessionBox.remove(); // Remove the session box from the DOM
            }
            console.log(`Session ${sessionId} deleted successfully.`);
        } else {
            throw new Error('Failed to delete session');
        }
    })
    .catch(error => {
        console.error("Error deleting session:", error);
        alert("Failed to delete session: " + error.message);
    });
}

document.getElementById('sessions').addEventListener('click', function(event) {
    const target = event.target;
    const sessionId = target.dataset.sessionId;
        
    if (target.classList.contains('show-details')) {
        const titleSession = document.getElementById(`title-${sessionId}`).textContent
        showDetails(titleSession,sessionId);
    } else if (target.classList.contains('edit-button')) {
        editTitle(sessionId);
    } else if (target.classList.contains('save-btn')) {
        saveTitle(sessionId);
    } else if (target.classList.contains('delete-button')) {
        deleteSession(sessionId);
    }
});

function showDetails(sessionTitle, sessionId) {
    document.getElementById('modal-title').textContent = sessionTitle;
    const videoList = document.getElementById('video-session-list');
    // videoList.innerHTML = ''; // Clear previous video titles

    // videoTitles.forEach(video => {
    //     console.log(videoTitles)
    //     console.log('user videos',downloadedVideos)
    //     const li = document.createElement('li');
    //     li.textContent = video;
    //     videoList.appendChild(li);
    // });

    document.getElementById('modal').style.display = 'flex'; // Show modal
}

function closeModal() {
    document.getElementById('modal').style.display = 'none'; // Hide modal
}


// Create Session

document.getElementById("addSessionBtn").onclick = function() {
    document.getElementById("addSessionModal").style.display = "block";
}

function closeSessionModal() {
    document.getElementById("addSessionModal").style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("addSessionModal");
    if (event.target === modal) {
        closeModal();
    }
}

document.getElementById("createSessionBtn").onclick = function() {
    const title = document.getElementById("newSessionTitle").value;
    if (title) {
        // Count the existing session boxes to generate a new ID
        const sessionBoxes = document.querySelectorAll(".session-box");
        // const newId = sessionBoxes.length + 1; // Generate a new ID based on the count

        // Example API endpoint
        const apiUrl = 'http://127.0.0.1:3000/session/create';

        // Make a POST request to create a new session
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("New session created:", data);
            // Append the new session box using the generated ID
            const sessionContainer = document.getElementById("session-boxes");
            const newSessionBox = document.createElement("div");
            newSessionBox.className = "session-box";
            const newId = data.newSession._id
            newSessionBox.innerHTML = `
                <h2 id="title-${newId}">${title}</h2>
                <input type="text" id="input-${newId}" class="edit-input" style="display:none;">
                <div class="session-btn-container">
                    <button class="button show-details" onclick="fetchVideos('${newId}')" data-session-id="${newId}">Show Details</button>
                    <button class="button edit-button" data-session-id="${newId}">Edit Title</button>
                    <button class="button save-btn" id="save-${newId}" style="display:none;" data-session-id="${newId}">Save</button>
                    <button class="button delete-button" data-session-id="${newId}">Delete</button>
                    <button class="button join-button" onclick="butJoinSession('${newId}')" data-session-id="${newId}">Join</button>
                </div>
            `;
            sessionContainer.appendChild(newSessionBox);
            closeSessionModal(); // Close the modal
        })
        .catch(error => {
            console.error("Error creating session:", error);
            alert("Failed to create session: " + error.message);
        });
    } else {
        alert("Please enter a session title.");
    }
}

// add video to session

const butAddVidSession = document.getElementById('but-add-video-session');
butAddVidSession.addEventListener('click', (e) => {

    // Select the element by its ID
    const selectElement = document.getElementById('add-video-session');
    // Get the value of the session-id attribute
    const sessionId = selectElement.getAttribute('session-id');

    console.log(sessionId)
    e.preventDefault();

    const video = document.getElementById('add-video-session').value;

    console.log(video)

    // Replace with your actual API endpoint
    const apiUrl = 'http://127.0.0.1:3000/session/add/video';

    // Fetch request
    fetch(apiUrl, {
        method: 'POST', // or 'GET', depending on your API
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId,video })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the data returned from the API
        fetchVideos(sessionId)
        // const videoSessionContainer = document.getElementById('video-session-container');
        // const newSession = document.createElement('div');
        // newSession.className = 'video-session';
        // newSession.innerHTML = `<h3>${data.title}</h3><p>Date: ${new Date(data.date).toLocaleString()}</p>`;
        
        // // Append the new session to the container
        // videoSessionContainer.appendChild(newSession);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

const butDeleteVidSession = document.getElementById('but-remove-video-session');
butDeleteVidSession.addEventListener('click', (e) => {

    // Select the element by its ID
    const selectElement = document.getElementById('add-video-session');
    // Get the value of the session-id attribute
    const sessionId = selectElement.getAttribute('session-id');

    console.log(sessionId)
    e.preventDefault();

    const video = document.getElementById('add-video-session').value;

    console.log(video)

    // Replace with your actual API endpoint
    const apiUrl = 'http://127.0.0.1:3000/session/add/video';

    // Fetch request
    fetch(apiUrl, {
        method: 'delete', // or 'GET', depending on your API
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId,video })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the data returned from the API
        fetchVideos(sessionId)
        // const videoSessionContainer = document.getElementById('video-session-container');
        // const newSession = document.createElement('div');
        // newSession.className = 'video-session';
        // newSession.innerHTML = `<h3>${data.title}</h3><p>Date: ${new Date(data.date).toLocaleString()}</p>`;
        
        // // Append the new session to the container
        // videoSessionContainer.appendChild(newSession);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

// join to session

const butJoinSession = (session) => {

    console.log(session)

    // redirect
    window.location = `/editing/${session}`

}


// End Session

const addvidbut = () => {

    const ele = document.getElementById('formModal');
    ele.style.display = 'block';
}

const closeFormModal = () => {
    const ele = document.getElementById('formModal');
    ele.style.display = 'none';
}


// 

document.getElementById('openModal').onclick = function() {
    document.getElementById('modalsettings').style.display = 'flex';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('modalsettings').style.display = 'none';
}

document.getElementById('editButton').onclick = function() {
    // Show the form and hide the user data display
    document.getElementById('user-data').classList.add('hidden');
    document.getElementById('settings-form').classList.remove('hidden');

    // Set input values to current text
    document.getElementById('username').value = document.getElementById('username-text').innerText;
    document.getElementById('email').value = document.getElementById('email-text').innerText;
}

// Handle form submission
document.getElementById('settings-form').onsubmit = function(event) {
    event.preventDefault(); // Prevent the default form submission

    const updatedUsername = document.getElementById('username').value;
    const updatedEmail = document.getElementById('email').value;

    // Use fetch to send updated data to the server
    fetch('/api/updateUserSettings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: updatedUsername, email: updatedEmail }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Update displayed text with the new values
        document.getElementById('username-text').innerText = updatedUsername;
        document.getElementById('email-text').innerText = updatedEmail;
        // Hide the form and show the user data display
        document.getElementById('user-data').classList.remove('hidden');
        document.getElementById('settings-form').classList.add('hidden');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Cancel button functionality
document.getElementById('cancel-button').onclick = function() {
    // Hide the form and show the user data display
    document.getElementById('user-data').classList.remove('hidden');
    document.getElementById('settings-form').classList.add('hidden');
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('modalsettings');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
