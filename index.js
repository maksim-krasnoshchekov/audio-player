const body = document.querySelector('body');
const playerLable = document.querySelector('.player__lable');
const controlButtonPlay = document.querySelector('.control__button-play');
const controlButtonPause = document.querySelector('.control__button-pause');
const playerSongSinger = document.querySelector('.player__song-singer');
const playerSongName = document.querySelector('.player__song-name');
const controlButtonPrevious = document.querySelector('.control__button-previous');
const controlButtonNext = document.querySelector('.control__button-next');
const songLength = document.querySelector('.song-length');
const timeLine = document.querySelector('.time-line');
const slider = document.querySelector('.slider');
const songTime = document.querySelector('.song-time');
const volumeBar = document.querySelector('.volume-bar');
const volumeSlider = document.querySelector('.volume-slider');
const playerVolume = document.querySelector('.player__volume');
const playerVolumeMute = document.querySelector('.player__volume-mute');
const barWrapper = document.querySelector('.bar-wrapper');

const audioSrc = [
    'audio/beyonce.mp3', 
    'audio/dontstartnow.mp3', 
    'audio/Pain - Shut Your Mouth.mp3',
    'audio/Accept - Amamos la vida.mp3',
    'audio/Metallica - Nothing Else Matters.mp3',
]
const audioSongSinger = [
    'Beyonce',
    'Dua Lipa',
    'Pain',
    'Accept',
    'Metallica',
]
const audioSongName = [
    'Don\'t Hurt Yourself',
    'Don\'t Start Now',
    'Shut Your Mouth',
    'Amamos La Vida',
    'Nothing Else Matters',
]
const audiobackgroundImage = [
    'image/lemonade.png',
    'image/dontstartnow.png',
    'image/pain.jpg',
    'image/accept.jpg',
    'image/metallica.jpg',
]
let count = 0;

const audio = new Audio(audioSrc[count])
body.style.backgroundImage.src = audiobackgroundImage[count];

let currentTime = 0;


function playAudio() {
    audio.currentTime = currentTime;
    audio.play();
    controlButtonPlay.classList.toggle('active');
    controlButtonPause.classList.toggle('active');
    playerLable.style.transform = 'scale(1.2)';
}
function pauseAudio() {
    currentTime = audio.currentTime;
    audio.pause();
    controlButtonPlay.classList.toggle('active');
    controlButtonPause.classList.toggle('active');
    playerLable.style.transform = 'scale(1)';
}
function audioPrev() {
    if (count <= 0) {
        count = 5;
    }
    count--;
    audio.src = audioSrc[count];
    currentTime = 0;
    audio.play();
    controlButtonPlay.classList.remove('active');
    controlButtonPause.classList.add('active');
    body.style.backgroundImage = `url(${audiobackgroundImage[count]})`;
    playerLable.src = audiobackgroundImage[count];
    playerLable.style.transform = 'scale(1.2)';
    playerSongSinger.innerHTML = `${audioSongSinger[count]}<span class="player__song-name">${audioSongName[count]}</span>`;
}
function audioNext() {
    if (count >= 4) {
        count = -1;
    }
    count++;
    audio.src = audioSrc[count];
    currentTime = 0;
    audio.play();
    controlButtonPlay.classList.remove('active');
    controlButtonPause.classList.add('active');
    body.style.backgroundImage = `url(${audiobackgroundImage[count]})`;
    playerLable.src = audiobackgroundImage[count];
    playerLable.style.transform = 'scale(1.2)';
    playerSongSinger.innerHTML = `${audioSongSinger[count]}<span class="player__song-name">${audioSongName[count]}</span>`;
}


controlButtonPrevious.addEventListener('click', audioPrev);
controlButtonNext.addEventListener('click', audioNext);

controlButtonPlay.addEventListener('click', playAudio);
controlButtonPause.addEventListener('click', pauseAudio);

audio.addEventListener(
    "loadeddata",
    () => {
        songLength.textContent = getTimeCodeFromNum(audio.duration);
    },
);

setInterval(() => {
    slider.style.left = audio.currentTime / audio.duration * 100 + "%";
    songTime.textContent = getTimeCodeFromNum(audio.currentTime);
    if (songTime.textContent == songLength.textContent) {
        audioNext();
    }
}, 500);



function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}



timeLine.addEventListener("mousedown", e => {
    const timeToSeek = e.offsetX / 213 * audio.duration;
    audio.currentTime = timeToSeek;
});

slider.onmousedown = function(event) {
    event.preventDefault();
    let shiftX = event.clientX - slider.getBoundingClientRect().left;


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - timeLine.getBoundingClientRect().left;
        if (newLeft < 0) {
            newLeft = 0;
        }
        let rightEdge = timeLine.offsetWidth - slider.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        slider.style.left = newLeft + 'px';
        
        audio.currentTime = audio.duration / 100 * (newLeft / 213 * 100);
    }

    function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
    }

};

slider.ondragstart = function() {
    return false;
};

let volumeSave = 0;

function volumeMute() {
    volumeSave = audio.volume;
    audio.volume = 0;
    playerVolume.classList.toggle('volume-active');
    playerVolumeMute.classList.toggle('volume-active');
    volumeSlider.style.left = '0px'
}
function volumeOn() {
    audio.volume = volumeSave;
    playerVolume.classList.toggle('volume-active');
    playerVolumeMute.classList.toggle('volume-active');
    volumeSlider.style.left = volumeSave * 45 + 'px'
}

volumeBar.addEventListener("mousedown", e => {
    const timeToSeek = e.offsetX / 45 * 1;
    audio.volume = timeToSeek;
    volumeSlider.style.left = e.offsetX + 'px';
});

volumeSlider.onmousedown = function(event) {
    event.preventDefault();
    let shiftX = event.clientX - volumeSlider.getBoundingClientRect().left;


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - volumeBar.getBoundingClientRect().left;
        if (newLeft < 0) {
            newLeft = 0;
        }
        let rightEdge = volumeBar.offsetWidth - volumeSlider.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        volumeSlider.style.left = newLeft + 'px';
        
        audio.volume = 1 / 100 * (newLeft / 45 * 100);
        console.log(1 / 100 * (newLeft / 45 * 100))

        //
    }

    function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
    }

};

volumeSlider.ondragstart = function() {
    return false;
};

function mouseOverVolume() {
    volumeBar.style.width = '50px';
    barWrapper.style.width = '53px';
    playerVolume.style.filter = 'invert(1)';
    playerVolumeMute.style.filter = 'invert(1)';
    if (volumeBar.style.width == '50px') {
        volumeSlider.style.display = 'block';
    }
}
function mouseOutVolume() {
    volumeBar.style.width = '0px';
    barWrapper.style.width = '0px';
    playerVolume.style.filter = 'invert(0)';
    playerVolumeMute.style.filter = 'invert(0)';
    volumeSlider.style.display = 'none';
}

playerVolume.addEventListener('click', volumeMute);
playerVolume.addEventListener('mouseover', mouseOverVolume);
playerVolume.addEventListener('mouseout', mouseOutVolume);
barWrapper.addEventListener('mouseout', mouseOutVolume);
playerVolumeMute.addEventListener('click', volumeOn);
playerVolumeMute.addEventListener('mouseover', mouseOverVolume);
playerVolumeMute.addEventListener('mouseout', mouseOutVolume);
barWrapper.addEventListener('mouseover', mouseOverVolume);