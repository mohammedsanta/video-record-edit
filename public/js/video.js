        
        // start exporting section

        const getExportExit = document.getElementById('exporting-exit');
        const exportingSection = document.getElementById('exportingSection');
        getExportExit.addEventListener('click',() => {
            toggleExportSection()
        })

        function toggleExportSection() {
            exportingSection.style.display = exportingSection.style.display === 'block' ? 'none' : 'block';
        }

        function exportVideo() {
            const format = document.getElementById('videoFormat').value;
            console.log(`Exporting video in ${format} format.`);
        }

        function updateEncodingOptions() {
            const format = document.getElementById('videoFormat').value;
            const codecSelect = document.getElementById('videoCodec');

            // Clear existing options
            codecSelect.innerHTML = '';

            // Determine the appropriate codec based on the selected format
            let defaultCodec;

            if (format === 'mp4' || format === 'mov') {
                codecSelect.innerHTML += '<option value="H.264">H.264</option>';
                codecSelect.innerHTML += '<option value="H.265">H.265</option>';
                defaultCodec = 'H.264'; // Default to H.264 for MP4 and MOV
            } else if (format === 'webm') {
                codecSelect.innerHTML += '<option value="VP8">VP8</option>';
                codecSelect.innerHTML += '<option value="VP9">VP9</option>';
                defaultCodec = 'VP8'; // Default to VP8 for WEBM
            } else {
                codecSelect.innerHTML += '<option value="H.264">H.264</option>';
                codecSelect.innerHTML += '<option value="H.265">H.265</option>';
                defaultCodec = 'H.264'; // Default for AVI and MKV
            }
            
            // Add AV1 codec
            codecSelect.innerHTML += '<option value="AV1">AV1</option>';

            // Set the selected codec to the default one
            codecSelect.value = defaultCodec;
        }

        function displayFormatInfo() {
            const format = document.getElementById('videoFormat').value;
            const formatInfo = document.getElementById('formatInfo');

            let infoText = '';
            
            switch (format) {
                case 'mp4':
                    infoText = '<span class="info-title">MP4 (MPEG-4 Part 14):</span> Widely used for streaming and storage. Supports a range of codecs, including H.264 and H.265.';
                    break;
                case 'avi':
                    infoText = '<span class="info-title">AVI (Audio Video Interleave):</span> An older format that supports multiple streaming audio and video. Larger file sizes compared to MP4 due to less compression.';
                    break;
                case 'mov':
                    infoText = '<span class="info-title">MOV:</span> Developed by Apple, commonly used in professional video editing. Supports high-quality video but can result in larger file sizes.';
                    break;
                case 'wmv':
                    infoText = '<span class="info-title">WMV (Windows Media Video):</span> Developed by Microsoft, optimized for streaming on Windows platforms. Less commonly used for web video due to compatibility issues.';
                    break;
                case 'webm':
                    infoText = '<span class="info-title">WEBM:</span> Designed for the web, often used for HTML5 video. Supports VP8 and VP9 codecs, optimized for high-quality video at lower bitrates.';
                    break;
                case 'mkv':
                    infoText = '<span class="info-title">MKV (Matroska Video):</span> Flexible container format that can hold various codecs and subtitle tracks. Often used for high-definition online video.';
                    break;
                default:
                    infoText = 'Select a format to see more information.';
                    break;
            }

            formatInfo.innerHTML = infoText;
        }

        function displayCodecInfo() {
            const codec = document.getElementById('videoCodec').value;
            const codecInfo = document.getElementById('codecInfo');

            let infoText = '';

            switch (codec) {
                case 'H.264':
                    infoText = '<span class="info-title">H.264:</span> The most common video codec for high-definition video. Balances good quality with compression efficiency, widely supported.';
                    break;
                case 'H.265':
                    infoText = '<span class="info-title">H.265 (HEVC):</span> Improved compression over H.264, allowing for higher quality at lower bitrates. Increasingly used for 4K and higher resolutions, but requires more processing power.';
                    break;
                case 'VP8':
                    infoText = '<span class="info-title">VP8:</span> Developed by Google, commonly used in WebM format. Offers decent quality at lower bitrates.';
                    break;
                case 'VP9':
                    infoText = '<span class="info-title">VP9:</span> Offers better compression efficiency compared to H.264, ideal for streaming.';
                    break;
                case 'AV1':
                    infoText = '<span class="info-title">AV1:</span> A newer codec designed for high compression efficiency, especially for streaming. Offers excellent quality at lower bitrates, but is still gaining adoption.';
                    break;
                default:
                    infoText = '';
                    break;
            }

            codecInfo.innerHTML = infoText;
        }


        // end export section

        let resize;

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case ' ':
                    // Space bar for play/pause
                    event.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    break;
                case 'ArrowLeft':
                    // Left arrow key for rewind
                    video.currentTime = Math.max(video.currentTime - 0.050, 0);
                    break;
                case 'ArrowRight':
                    // Right arrow key for fast forward
                    video.currentTime = Math.min(video.currentTime + 0.050, video.duration);
                    break;
                case 'ArrowUp':
                    // Up arrow key for volume up
                    video.volume = Math.min(video.volume + 0.050, 1);
                    break;
                case 'ArrowDown':
                    // Down arrow key for volume down
                    video.volume = Math.max(video.volume - 0.050, 0);
                    break;
                case 'm':
                    // 'm' key for mute/unmute
                    video.muted = !video.muted;
                    break;
                case 'f':
                    // 'f' key for fullscreen
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.mozRequestFullScreen) { // Firefox
                        video.mozRequestFullScreen();
                    } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
                        video.webkitRequestFullscreen();
                    } else if (video.msRequestFullscreen) { // IE/Edge
                        video.msRequestFullscreen();
                    }
                    break;
                default:
                    break;
            }
        });

        const video = document.getElementById('videoPlayer');
        const videoSrc = document.getElementById('videoSrc');
        const urlParams = new URLSearchParams(window.location.search);
        const form = document.getElementById('uploadForm');
        const timeDisplay = document.getElementById('timeDisplay');

        const pVideo = urlParams.get('video');
        if (pVideo) {
            form.action += `?video=${pVideo}`;
            videoSrc.src = `http://127.0.0.1:3000/video?path=D:\\Coding\\JS\\nodejs\\videoedit\\uploads\\${pVideo}`;
        }

        let videoCurrentTime = 0;
        video.addEventListener('pause', () => {
            videoCurrentTime = Math.floor(video.currentTime);
            updateTimeDisplay();
        });

        video.addEventListener('timeupdate', () => {
            // Get the current time of the video
            const currentTime = video.currentTime;
            
            // Format the time to two decimal places
            const formattedTime = currentTime.toFixed(3);

            videoCurrentTime = formattedTime;
            updateTimeDisplay()

            // Log the formatted time
            console.log('Current Time: ', formattedTime);
        });

        // const getVolumeSlider = document.getElementById('volumeSlider');
        // let videoVolume;
        // getVolumeSlider.addEventListener('change',() => {
            
        //     let volumeValue = parseFloat(getVolumeSlider.value);
        //     getVolumeSlider.value = volumeValue;
        //     volumeValue = Math.round(volumeValue * 10) / 10; // Round to one decimal place


        //     video.volume = Math.min(getVolumeSlider.value, 1);
        //     console.log('volume',volumeValue)
        // })

        // moving

        const forward = document.getElementById('forward');
        forward.addEventListener('click',(e) => {

            video.currentTime += 0.050;

        })

        const backward = document.getElementById('backward');
        backward.addEventListener('click',(e) => {

            video.currentTime -= 0.050;

        })

        // end moving

        function formatTimeForFFmpeg(timeInSeconds) {
            const hours = Math.floor(timeInSeconds / 3600);
            const minutes = Math.floor((timeInSeconds % 3600) / 60);
            const seconds = Math.floor(timeInSeconds % 60);
            
            // Format time with leading zeros
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            
            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }

        function updateTimeDisplay() {
            const minutes = Math.floor(videoCurrentTime / 60);
            const seconds = videoCurrentTime % 60;
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            timeDisplay.textContent = `${formattedTime}`;
        }

        let trimSelected = 0;
        const getStartEnd = document.getElementById('StartEnd');
        getStartEnd.textContent = 'Start';

        function changeOption() {
            trimSelected = document.getElementById('selectTrim').value - 1;
        }

        function changeStartEnd() {
            getStartEnd.textContent = (getStartEnd.textContent === 'Start') ? 'End' : 'Start';
        }

        function setTrimF() {
            const selectedDiv = document.getElementsByClassName('containerOfTrim')[trimSelected];
            if (!selectedDiv) return;

            const [startInput, endInput] = selectedDiv.getElementsByTagName('input');
            const startOrEnd = (getStartEnd.textContent === 'Start') ? 0 : 1;

            if (startOrEnd === 0) {
                startInput.value = videoCurrentTime;
            } else {
                endInput.value = videoCurrentTime;
            }
        }

        let trimNumber = 0;
        function addTrim() {
            trimNumber++;
            const trimContainer = document.getElementById('trims');

            const createStartEndDiv = document.createElement('div');
            createStartEndDiv.className = 'containerOfTrim';
            const createLabelNumberOfTrim = document.createElement('label');
            createLabelNumberOfTrim.textContent = `Trim Number ${trimNumber}`;
            createStartEndDiv.appendChild(createLabelNumberOfTrim);

            const createStartLabel = document.createElement('label');
            createStartLabel.textContent = 'Start (seconds)';
            const createStart = document.createElement('input');
            createStart.name = 'start';
            createStart.type = 'text';

            const createEndLabel = document.createElement('label');
            createEndLabel.textContent = 'End (seconds)';
            const createEnd = document.createElement('input');
            createEnd.name = 'end';
            createEnd.type = 'text';

            const createSoundLabel = document.createElement('label');
            createSoundLabel.textContent = 'Sound Volume';
            const createSoundVolume = document.createElement('input');
            createSoundVolume.type = 'range';
            createSoundVolume.step = 0.1;
            createSoundVolume.max = 3;
            createSoundVolume.value = 1;
            createSoundVolume.name = 'volume';

            createStartEndDiv.append(createStartLabel, createStart, createEndLabel, createEnd,createSoundLabel,createSoundVolume);
            trimContainer.appendChild(createStartEndDiv);

            const getSelect = document.getElementById('selectTrim');
            const createOption = document.createElement('option');
            createOption.textContent = `${trimNumber}`;
            getSelect.appendChild(createOption);
        }

        // const cropButton = document.getElementById('butCrop');


        function toggleCrop() {
            // const cropField = document.getElementById('addCrop');

            // if (cropButton.textContent === 'Add Crop') {
            //     cropButton.textContent = 'Remove Crop';
            //     cropField.value = 'true';
            // } else {
            //     cropButton.textContent = 'Add Crop';
            //     cropField.value = '';
            // }

            showCroping()

            
        }

        const getCroping = document.getElementById('croping');
        function showCroping() {
            getCroping.style.display = 'flex';
        }

        function hideCroping() {
            getCroping.style.display = 'none';
        }

        

        const screenshot = () => {

            const video = urlParams.get('video');

            window.location.replace(`http://127.0.0.1:3000/video/screenshot/?video=${video}&time=${videoCurrentTime}`)

        }


        const getGifForm = document.getElementById('gifForm')
        getGifForm.addEventListener('submit',(e) => {

            // e.preventDefault()

            const video = urlParams.get('video');
            const inputGif = document.getElementById('videoForgif');
            inputGif.value = video;
            const getInputStart = document.getElementById('startForgif');
            getInputStart.value = videoCurrentTime;


            console.log(video)

            getGifForm.action = `http://127.0.0.1:3000/video/gif/?video=${video}&start=${videoCurrentTime}&duration=`;

        })

    // <!-- resize -->


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

            const getResizeInput = document.getElementById('resize')

            resize = [ getWidth.value,getHeight.value,getX.value,getY.value ];
            console.log(resize)

            getResizeInput.value = resize;

            return { getWidth, getHeight, getX, getY };
        };

        const getForm = document.getElementById('videoForm')
        getForm.addEventListener('click',async (e) => {
            e.preventDefault();
            const { getWidth, getHeight, getX, getY } = getFFmpegCropParameters();
            console.log(resize)
            hideCroping()
        })

        cropButton.addEventListener('click', async () => {
            const { width, height, x, y } = getFFmpegCropParameters();
        });