let mediaRecorder;
let recordedChunks = [];
let screenStream;

const recordedVideo = document.getElementById('recordedVideo');
const previewVideo = document.getElementById('previewVideo');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const recordAgain = document.getElementById('recordAgain');


startBtn.onclick = async () => {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });

    // Set the preview video source to the screen stream
    previewVideo.srcObject = screenStream;
    previewVideo.style.display = 'block'; // Show preview

    mediaRecorder = new MediaRecorder(screenStream);
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        recordedVideo.src = URL.createObjectURL(blob);
        recordedVideo.style.display = 'block'; // Show recorded video
        recordedVideo.play();
        recordedChunks = [];
        
        // Stop all tracks of the stream
        screenStream.getTracks().forEach(track => track.stop());
        previewVideo.srcObject = null; // Clear preview
        previewVideo.style.display = 'none'; // Hide preview
    };

    mediaRecorder.start();
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'block';
  stopBtn.style.display = 'block';

};

pauseBtn.addEventListener('click',() => {
  mediaRecorder.pause();
  pauseBtn.style.display = 'none';
  resumeBtn.style.display = 'block';

})

resumeBtn.addEventListener('click',() => {
  mediaRecorder.resume();
  pauseBtn.style.display = 'block';
  resumeBtn.style.display = 'none';
})

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  pauseBtn.style.display = 'none';
  stopBtn.style.display = 'none';
  recordAgain.style.display = 'block';
});

recordAgain.addEventListener('click', () => {
  startBtn.style.display = 'block';
  recordAgain.style.display = 'none';
  recordedVideo.style.display = 'none'; // Show preview
});

