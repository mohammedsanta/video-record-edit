const videoInput = document.getElementById('videoInput');
const videoPlayer = document.getElementById('videoPlayer');
const cropButton = document.getElementById('cropButton');
const resetCropButton = document.getElementById('resetCropButton');
const cropArea = document.getElementById('cropArea');
const videoContainer = document.getElementById('videoContainer');

// videoInput.addEventListener('change', (event) => {
//     const file = event.target.files[0];
//     const url = URL.createObjectURL(file);
//     videoPlayer.src = url;

//     videoPlayer.onloadedmetadata = () => {
//         const videoWidth = videoPlayer.videoWidth;
//         const videoHeight = videoPlayer.videoHeight;

//         cropArea.style.left = `${(videoWidth - cropArea.offsetWidth) / 2}px`;
//         cropArea.style.top = `${(videoHeight - cropArea.offsetHeight) / 2}px`;
//     };
// });

const resizeCropArea = (handle) => {
    const rect = cropArea.getBoundingClientRect();
    const videoRect = videoContainer.getBoundingClientRect();

    let startWidth = rect.width;
    let startHeight = rect.height;
    let startX = rect.left - videoRect.left;
    let startY = rect.top - videoRect.top;

    const onMouseMove = (e) => {
        const mouseX = e.clientX - videoRect.left;
        const mouseY = e.clientY - videoRect.top;

        if (handle.classList.contains('se')) {
            startWidth = Math.max(mouseX - startX, 20);
            startHeight = Math.max(mouseY - startY, 20);
        } else if (handle.classList.contains('sw')) {
            startWidth = Math.max(startX + startWidth - mouseX, 20);
            startHeight = Math.max(mouseY - startY, 20);
            startX = mouseX;
        } else if (handle.classList.contains('ne')) {
            startWidth = Math.max(mouseX - startX, 20);
            startHeight = Math.max(startY + startHeight - mouseY, 20);
            startY = mouseY;
        } else if (handle.classList.contains('nw')) {
            startWidth = Math.max(startX + startWidth - mouseX, 20);
            startHeight = Math.max(startY + startHeight - mouseY, 20);
            startX = mouseX;
            startY = mouseY;
        } else if (handle.classList.contains('n')) {
            startHeight = Math.max(startY + startHeight - mouseY, 20);
            startY = mouseY;
        } else if (handle.classList.contains('s')) {
            startHeight = Math.max(mouseY - startY, 20);
        } else if (handle.classList.contains('e')) {
            startWidth = Math.max(mouseX - startX, 20);
        } else if (handle.classList.contains('w')) {
            startWidth = Math.max(startX + startWidth - mouseX, 20);
            startX = mouseX;
        }

        cropArea.style.width = `${startWidth}px`;
        cropArea.style.height = `${startHeight}px`;
        cropArea.style.left = `${startX + (startWidth / 2)}px`;
        cropArea.style.top = `${startY + (startHeight / 2)}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};

document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        resizeCropArea(handle);
    });
});

resetCropButton.addEventListener('click', () => {
    cropArea.style.width = '960px';
    cropArea.style.height = '540px';
    cropArea.style.left = '50%';
    cropArea.style.top = '50%';
    cropArea.style.transform = 'translate(-50%, -50%)';
});

const getFFmpegCropParameters = () => {
    const rect = cropArea.getBoundingClientRect();
    const videoRect = videoContainer.getBoundingClientRect();

    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const x = Math.round(rect.left - videoRect.left);
    const y = Math.round(rect.top - videoRect.top);

    const getWidth = document.getElementById('width')
    getWidth.value = width * 2;
    const getHeight = document.getElementById('height')
    getHeight.value = height * 2;
    const getX = document.getElementById('x')
    getX.value = x * 2;
    const getY = document.getElementById('y')
    getY.value = y * 2;

    return { getWidth, getHeight, getX, getY };
};

const getForm = document.getElementById('videoForm')
getForm.addEventListener('click',async () => {
    const { getWidth, getHeight, getX, getY } = getFFmpegCropParameters();
})

cropButton.addEventListener('click', async () => {
    const { width, height, x, y } = getFFmpegCropParameters();
});