document.getElementById('urlForm').onsubmit = async (e) => {
    const urlInput = document.getElementById('url');
    const url = urlInput.value.trim();
    const formatsBody = document.getElementById('formatsBody');
    const audioBody = document.getElementById('audioBody');
    const videoSelect = document.getElementById('videoSelect');
    const audioSelect = document.getElementById('audioSelect');
    const messageDiv = document.getElementById('message');
    const downloadButton = document.getElementById('downloadButton');
    const overlay = document.getElementById('overlay');
    e.preventDefault();


    // Clear previous results
    formatsBody.innerHTML = '';
    audioBody.innerHTML = '';
    messageDiv.classList.add('hidden');
    overlay.style.display = 'flex'; // Show overlay
    videoSelect.innerHTML = '';
    audioSelect.innerHTML = '';
    downloadButton.classList.add('hidden');
    document.getElementById('thumbnail').style.display = 'none';
    document.getElementById('formatsTable').style.display = 'none';
    document.getElementById('audioTable').style.display = 'none';

    try {
        const response = await fetch('/formats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ url })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch formats');
        }

        const { audioFormats, videoFormats, data } = await response.json();

        document.getElementById('title').textContent = `Title: ${data[0]}`;
        const imgThumbnail = document.getElementById('imgThumbnail');
        imgThumbnail.src = data[1];
        document.getElementById('thumbnail').style.display = 'block';

        // Hide loading spinner and overlay
        overlay.style.display = 'none';

        // Populate video formats
        if (videoFormats.length > 0) {
            videoFormats.forEach(format => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${format.format_code}</td>
                    <td>${format.extension}</td>
                    <td>${format.resolution || 'N/A'}</td>
                    <td>${format.size || 'N/A'}</td>
                    <td>${format.bitrate || 'N/A'}</td>
                `;
                formatsBody.appendChild(row);
                
                // Add to video select
                const option = document.createElement('option');
                option.value = format.format_code;
                option.textContent = `${format.extension} (${format.resolution || 'N/A'})`;
                videoSelect.appendChild(option);
            });
            document.getElementById('formatsTable').style.display = 'table';
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5">No video formats available.</td>`;
            formatsBody.appendChild(row);
            document.getElementById('formatsTable').style.display = 'table';
        }

        // Populate audio formats
        if (audioFormats.length > 0) {
            audioFormats.forEach(format => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${format.format_code}</td>
                    <td>${format.extension}</td>
                    <td>${format.resolution || 'N/A'}</td>
                    <td>${format.size || 'N/A'}</td>
                    <td>${format.bitrate || 'N/A'}</td>
                `;
                audioBody.appendChild(row);

                // Add to audio select
                const option = document.createElement('option');
                option.value = format.format_code;
                option.textContent = `${format.extension} (${format.bitrate || 'N/A'})`;
                audioSelect.appendChild(option);
            });
            document.getElementById('audioTable').style.display = 'table';
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5">No audio formats available.</td>`;
            audioBody.appendChild(row);
            document.getElementById('audioTable').style.display = 'table';
        }

        // Show download button
        downloadButton.classList.remove('hidden');

    } catch (error) {
        overlay.style.display = 'none'; // Hide overlay
        messageDiv.textContent = `Error: ${error.message}`;
        messageDiv.classList.remove('hidden');
    }
};

document.getElementById('downloadButton').onclick = async () => {
    const videoFormat = document.getElementById('videoSelect').value;
    const audioFormat = document.getElementById('audioSelect').value;
    const url = document.getElementById('url').value.trim();
    console.log(videoFormat,audioFormat,url)



    if (!videoFormat || !audioFormat || !url) {
        alert('Please select both a video and an audio format and enter a URL.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoFormat, audioFormat, url })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition ? 
            contentDisposition.split('filename=')[1].replace(/"/g, '') : 
            'converted-file';

        const blob = await response.blob();
        const urlD = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.href = urlD;
        downloadLink.download = `${Date.now()}-${fileName}`;
        downloadLink.click();

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};