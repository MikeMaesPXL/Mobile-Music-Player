const songs = [
    {
        title: "Voulez Vous",
        artist: "ABBA",
        audioSrc: "audio/test7_song.mp3",
        coverSrc: "cover/test7_cover.jpg"
    },
    {
        title: "Mamma Mia",
        artist: "ABBA",
        audioSrc: "audio/test6_song.mp3",
        coverSrc: "cover/test6_cover.jpg"
    },
    {
        title: "We didn't start the fire",
        artist: "Billy Joel",
        audioSrc: "audio/test5_song.mp3",
        coverSrc: "cover/test5_cover.jpg"
    },
    {
        title: "Dance the night away",
        artist: "Dua Lipa",
        audioSrc: "audio/test1_song.mp3",
        coverSrc: "cover/test1_cover.png"
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        audioSrc: "audio/test2_song.mp3",
        coverSrc: "cover/test2_cover.jpg"
    }, 
    {
        title: "Let's get loud",
        artist: "Jennifer Lopez",
        audioSrc: "audio/test3_song.mp3",
        coverSrc: "cover/test3_cover.jpg"
    },
    {
        title: "My head my heart",
        artist: "Ava Max",
        audioSrc: "audio/test4_song.mp3",
        coverSrc: "cover/test4_cover.jpg"
    }
];

let currentSongIndex = 0;
const audio = new Audio(songs[currentSongIndex].audioSrc);
const playPauseButton = document.querySelectorAll('#playPauseButton');
const skipButton = document.getElementById('skipButton');
const backButton = document.getElementById('backButton');
const progressBar = document.getElementById('progressBar');
const progressBarFull = document.getElementById('progressBarFull');
const progressBall = document.getElementById('progressBall');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const volumeControl = document.getElementById('volumeControl');
const cover = document.querySelector('.cover');

playPauseButton.forEach(button => {
    button.addEventListener('click', togglePlayPause);
});

volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value;
    updateThumbGradient();
});

let isPlaying = false;

skipButton.addEventListener('click', skipForward);
backButton.addEventListener('click', goBack);
audio.addEventListener('timeupdate', updateProgressBar);
progressBar.addEventListener('click', seek);

updateTotalTime();


function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseButton.forEach(button => {
            button.innerHTML = '<i class="fas fa-play"></i>';
        });
    } else {
        audio.play();
        playPauseButton.forEach(button => {
            button.innerHTML = '<i class="fas fa-pause"></i>';
        });
    }
    isPlaying = !isPlaying;
}

function skipForward() {
    gsap.to(cover, { opacity: 0, duration: 0.5, onComplete: () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong();
        gsap.to(cover, { opacity: 1, duration: 0.5 });
    }});

    loadSong();
}

function goBack() {
    gsap.to(cover, { opacity: 0, duration: 0.5, onComplete: () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong();
        gsap.to(cover, { opacity: 1, duration: 0.5 });
    }});

    loadSong();
}

function loadSong() {
    audio.src = songs[currentSongIndex].audioSrc;
    cover.style.backgroundImage = `url('${songs[currentSongIndex].coverSrc}')`;
    document.getElementById('songTitle').innerText = songs[currentSongIndex].title;
    document.getElementById('songArtist').innerText = songs[currentSongIndex].artist;
    updateTotalTime();
    togglePlayPause();
    if (!isPlaying) {
        togglePlayPause();
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = songs[currentSongIndex].coverSrc;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;

        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        const pixelCount = data.length / 4;
        const avgR = Math.round(r / pixelCount);
        const avgG = Math.round(g / pixelCount);
        const avgB = Math.round(b / pixelCount);

        const rgbColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
        document.body.style.background = `linear-gradient(220deg, ${rgbColor}, #000000)`;
        progressBall.style.background = `${rgbColor}`;
        progressBarFull.style.background = `${rgbColor}`;
    };
    cover.style.backgroundImage = `url('${songs[currentSongIndex].coverSrc}')`;
}

function updateProgressBar() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
}

function updateTotalTime() {
    audio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    });
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function seek(e) {
    const seekTime = (e.offsetX / progressBar.offsetWidth) * audio.duration; 
    audio.currentTime = seekTime;
}

volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value;
    updateVolumeControlColor();
});

function updateVolumeControlColor() {
    const volume = volumeControl.value;
    const gradientValue = `linear-gradient(to right, green ${volume * 100}%, #ccc red ${volume * 100}%`;
    volumeControl.style.background = gradientValue;
}

loadSong();