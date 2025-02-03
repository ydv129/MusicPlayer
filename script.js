var arr = [
    { songName: "Jale 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", type: "audio" },
    { songName: "Pehle Bhi Main", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", type: "audio" },
    { songName: "Ram Siya Ram", url: "https://www.youtube.com/embed/XO8wew38VM8", type: "youtube" },
    { songName: "Arjan Valley", url: "https://www.youtube.com/embed/XYZ123456", type: "youtube" }
];

var allSongs = document.querySelector("#all-songs");
var poster = document.querySelector("#left");
var play = document.querySelector("#play");
var backward = document.querySelector("#backward");
var forward = document.querySelector("#forward");

var audio = new Audio();
audio.preload = "auto"; // Preload audio
var selectedSong = 0;
var flag = 0;

function preloadAudio(url) {
    return new Promise((resolve) => {
        audio.src = url;
        audio.load();
        audio.oncanplaythrough = () => resolve();
    });
}

async function mainFunction() {
    var clutter = "";

    arr.forEach(function (elem, index) {
        clutter += `<div class="song-card" id=${index}>
            <div class="part1">
                <h2>${elem.songName}</h2>
            </div>
            <h6>3:56</h6>
        </div>`;
    });

    allSongs.innerHTML = clutter;

    if (arr[selectedSong].type === "audio") {
        poster.innerHTML = `<p>Loading: ${arr[selectedSong].songName}...</p>`;
        await preloadAudio(arr[selectedSong].url);
        poster.innerHTML = `<p>Now Playing: ${arr[selectedSong].songName}</p>`;
    } else if (arr[selectedSong].type === "youtube") {
        poster.innerHTML = `<iframe width="100%" height="300px" src="${arr[selectedSong].url}" frameborder="0" allowfullscreen></iframe>`;
    }
}

mainFunction();

allSongs.addEventListener("click", async function (dets) {
    selectedSong = dets.target.id;
    await mainFunction();

    if (arr[selectedSong].type === "audio") {
        play.innerHTML = `<i class="ri-pause-mini-fill"></i>`;
        flag = 1;
        audio.play();
    }
});

play.addEventListener("click", function () {
    if (arr[selectedSong].type === "audio") {
        if (flag === 0) {
            play.innerHTML = `<i class="ri-pause-mini-fill"></i>`;
            audio.play();
            flag = 1;
        } else {
            play.innerHTML = `<i class="ri-play-mini-fill"></i>`;
            audio.pause();
            flag = 0;
        }
    }
});

forward.addEventListener("click", async function () {
    if (selectedSong < arr.length - 1) {
        selectedSong++;
        await mainFunction();
        if (arr[selectedSong].type === "audio") audio.play();
    } else {
        forward.style.opacity = 0.4;
    }
});

backward.addEventListener("click", async function () {
    if (selectedSong > 0) {
        selectedSong--;
        await mainFunction();
        if (arr[selectedSong].type === "audio") audio.play();
    } else {
        backward.style.opacity = 0.4;
    }
});
