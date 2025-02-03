// Sample music data with mixed audio and YouTube content
const arr = [
    { songName: "Jale 2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", type: "audio" },
    { songName: "Pehle Bhi Main", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", type: "audio" },
    { songName: "Ram Siya Ram", url: "https://www.youtube.com/embed/XO8wew38VM8", type: "youtube" },
    { songName: "Arjan Valley", url: "https://www.youtube.com/embed/XYZ123456", type: "youtube" }
  ];
  
  // DOM Elements
  const audio = new Audio();
  audio.preload = "auto";
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const songTitle = document.querySelector('.song-title');
  const artistName = document.querySelector('.artist-name');
  const progress = document.querySelector('.progress');
  const progressBar = document.querySelector('.progress-bar');
  const currentTimeEl = document.querySelector('.current-time');
  const durationEl = document.querySelector('.duration');
  const volumeControl = document.getElementById('volume');
  const searchInput = document.getElementById('search');
  const songsList = document.getElementById('songsList');
  const albumArt = document.querySelector('.album-art');
  
  let currentSongIndex = 0;
  let isPlaying = false;
  
  // Preload audio function
  function preloadAudio(url) {
    return new Promise((resolve) => {
      audio.src = url;
      audio.load();
      audio.oncanplaythrough = () => resolve();
    });
  }
  
  // Initialize player
  async function initPlayer() {
    await loadSong(arr[currentSongIndex]);
    renderPlaylist();
    updatePlaylistActiveItem();
  }
  
  // Load song
  async function loadSong(song) {
    songTitle.textContent = song.songName;
    artistName.textContent = ""; // Since we don't have artist in the array
  
    if (song.type === "audio") {
      // Show album art for audio
      albumArt.innerHTML = `<img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60" alt="Album art">`;
      await preloadAudio(song.url);
      
      // Show audio controls
      progressBar.style.display = 'block';
      volumeControl.parentElement.style.display = 'flex';
      
      if (isPlaying) {
        audio.play();
      }
    } else if (song.type === "youtube") {
      // Stop audio if playing
      audio.pause();
      isPlaying = false;
      updatePlayButton();
      
      // Show YouTube embed
      albumArt.innerHTML = `<iframe width="100%" height="100%" src="${song.url}" frameborder="0" allowfullscreen></iframe>`;
      
      // Hide audio controls
      progressBar.style.display = 'none';
      volumeControl.parentElement.style.display = 'none';
    }
  
    updatePlaylistActiveItem();
  }
  
  // Play/Pause
  function togglePlay() {
    const currentSong = arr[currentSongIndex];
    if (currentSong.type === "audio") {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    }
  }
  
  function playSong() {
    isPlaying = true;
    updatePlayButton();
    audio.play();
  }
  
  function pauseSong() {
    isPlaying = false;
    updatePlayButton();
    audio.pause();
  }
  
  function updatePlayButton() {
    playBtn.innerHTML = isPlaying 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  }
  
  // Previous song
  async function prevSong() {
    if (currentSongIndex > 0) {
      currentSongIndex--;
      await loadSong(arr[currentSongIndex]);
      if (arr[currentSongIndex].type === "audio" && isPlaying) {
        playSong();
      }
    }
  }
  
  // Next song
  async function nextSong() {
    if (currentSongIndex < arr.length - 1) {
      currentSongIndex++;
      await loadSong(arr[currentSongIndex]);
      if (arr[currentSongIndex].type === "audio" && isPlaying) {
        playSong();
      }
    }
  }
  
  // Update progress bar
  function updateProgress(e) {
    if (arr[currentSongIndex].type === "audio") {
      const { duration, currentTime } = e.srcElement;
      const progressPercent = (currentTime / duration) * 100;
      progress.style.width = `${progressPercent}%`;
      
      // Update time displays
      currentTimeEl.textContent = formatTime(currentTime);
      if (duration) {
        durationEl.textContent = formatTime(duration);
      }
    }
  }
  
  // Set progress bar
  function setProgress(e) {
    if (arr[currentSongIndex].type === "audio") {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    }
  }
  
  // Format time
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  // Render playlist
  function renderPlaylist() {
    songsList.innerHTML = '';
    const filteredSongs = arr.filter(song => 
      song.songName.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  
    filteredSongs.forEach((song, index) => {
      const div = document.createElement('div');
      div.className = `song-item ${index === currentSongIndex ? 'active' : ''}`;
      div.innerHTML = `
        <div class="song-info">
          <div class="song-details">
            <h3>${song.songName}</h3>
          </div>
          <span class="song-duration">
            ${song.type === 'youtube' ? 'YouTube' : '3:56'}
          </span>
        </div>
      `;
      div.addEventListener('click', async () => {
        if (index !== currentSongIndex) {
          currentSongIndex = index;
          await loadSong(arr[currentSongIndex]);
          if (arr[currentSongIndex].type === "audio") {
            playSong();
          }
        }
      });
      songsList.appendChild(div);
    });
  }
  
  // Update active song in playlist
  function updatePlaylistActiveItem() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => item.classList.remove('active'));
    songItems[currentSongIndex]?.classList.add('active');
  }
  
  // Event listeners
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevSong);
  nextBtn.addEventListener('click', nextSong);
  audio.addEventListener('timeupdate', updateProgress);
  progressBar.addEventListener('click', setProgress);
  volumeControl.addEventListener('input', (e) => audio.volume = e.target.value);
  searchInput.addEventListener('input', renderPlaylist);
  audio.addEventListener('ended', nextSong);
  
  // Initialize the player
  initPlayer();