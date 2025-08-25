class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("audioPlayer")
    this.playPauseBtn = document.getElementById("playPauseBtn")
    this.prevBtn = document.getElementById("prevBtn")
    this.nextBtn = document.getElementById("nextBtn")
    this.shuffleBtn = document.getElementById("shuffleBtn")
    this.repeatBtn = document.getElementById("repeatBtn")
    this.playlistBtn = document.getElementById("playlistBtn")

    this.songTitle = document.getElementById("songTitle")
    this.artistName = document.getElementById("artistName")
    this.albumCover = document.getElementById("albumCover")
    this.currentTime = document.getElementById("currentTime")
    this.duration = document.getElementById("duration")

    this.progressBar = document.querySelector(".progress-bar")
    this.progress = document.getElementById("progress")
    this.progressHandle = document.getElementById("progressHandle")

    this.volumeBar = document.querySelector(".volume-bar")
    this.volumeProgress = document.getElementById("volumeProgress")
    this.volumeHandle = document.getElementById("volumeHandle")

    this.playlist = document.getElementById("playlist")
    this.playlistItems = document.getElementById("playlistItems")
    this.albumArt = document.querySelector(".album-art")

    this.currentSongIndex = 0
    this.isPlaying = false
    this.isShuffled = false
    this.repeatMode = 0 // 0: no repeat, 1: repeat all, 2: repeat one
    this.volume = 0.7

    this.songs = [
      {
        title: "Pak Sar Zameen",
        artist: "Pakistani Patriotic Song",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pak%20Sar%20Zameen-EXZgwtdrRw72K15De3cY958VpVDkoE.mp3",
        cover: "/placeholder.svg?height=300&width=300",
      },
      {
        title: "Dil Dil Pakistan",
        artist: "Vital Signs",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dil%20Dil%20Pakistan%20Official%20Video%20_%20Vital%20Signs%20_%20Shoaib%20Mansoor-AUZB7YGCNpKlvq0cx5GSkJQwi8pQSt.mp3",
        cover: "/placeholder.svg?height=300&width=300",
      },
      {
        title: "Aye Rah-e-Haq Ke Shaheedo",
        artist: "Military March",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aye%20Rah-e-Haq%20Ke%20Shaheedo-XGxlGdv9LQp5vwA3ps3993s58fm6lj.mp3",
        cover: "/placeholder.svg?height=300&width=300",
      },
      {
        title: "Hum Zinda Qaum Hain",
        artist: "Tehseen Amjad & Fatima Benjamin Sisters",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hum%20Zinda%20Qaum%20Hain%20_%20HQ%20_%20Tehseen%20Amjad%20Fatima%20%20Benjamin%20Sisters%20_%20Original%20_%201985%20_%20PTV-GWgm1grjJq0YpTIBAF6NGotHL8qivj.mp3",
        cover: "/placeholder.svg?height=300&width=300",
      },
      {
        title: "Laba aati hai dua banke Tamanna meri",
        artist: "Gagol Arabic",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Laba%20aati%20hai%20dua%20banke%20Tamanna%20meri%20Gagol%20Arabic%20-x84JZaJDyIYfopxbfuUAtVgADPOaMv.mp3",
        cover: "/placeholder.svg?height=300&width=300",
      },
    ]

    this.init()
  }

  init() {
    this.loadSong(this.currentSongIndex)
    this.createPlaylist()
    this.bindEvents()
    this.audio.volume = this.volume
    this.updateVolumeDisplay()
  }

  bindEvents() {
    // Play/Pause button
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause())

    // Previous/Next buttons
    this.prevBtn.addEventListener("click", () => this.previousSong())
    this.nextBtn.addEventListener("click", () => this.nextSong())

    // Shuffle and repeat buttons
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle())
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat())

    // Playlist toggle
    this.playlistBtn.addEventListener("click", () => this.togglePlaylist())

    // Audio events
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration())
    this.audio.addEventListener("timeupdate", () => this.updateProgress())
    this.audio.addEventListener("ended", () => this.handleSongEnd())

    // Progress bar events
    this.progressBar.addEventListener("click", (e) => this.setProgress(e))
    this.progressHandle.addEventListener("mousedown", (e) => this.startProgressDrag(e))

    // Volume bar events
    this.volumeBar.addEventListener("click", (e) => this.setVolume(e))
    this.volumeHandle.addEventListener("mousedown", (e) => this.startVolumeDrag(e))

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))
  }

  loadSong(index) {
    const song = this.songs[index]
    this.songTitle.textContent = song.title
    this.artistName.textContent = song.artist
    this.albumCover.src = song.cover
    this.audio.src = song.src

    // Update playlist active item
    this.updatePlaylistActive()
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play() {
    this.audio.play()
    this.isPlaying = true
    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
    this.albumArt.classList.add("playing")
  }

  pause() {
    this.audio.pause()
    this.isPlaying = false
    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
    this.albumArt.classList.remove("playing")
  }

  previousSong() {
    if (this.isShuffled) {
      this.currentSongIndex = Math.floor(Math.random() * this.songs.length)
    } else {
      this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.songs.length - 1
    }
    this.loadSong(this.currentSongIndex)
    if (this.isPlaying) {
      this.play()
    }
  }

  nextSong() {
    if (this.isShuffled) {
      this.currentSongIndex = Math.floor(Math.random() * this.songs.length)
    } else {
      this.currentSongIndex = this.currentSongIndex < this.songs.length - 1 ? this.currentSongIndex + 1 : 0
    }
    this.loadSong(this.currentSongIndex)
    if (this.isPlaying) {
      this.play()
    }
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled
    this.shuffleBtn.classList.toggle("active", this.isShuffled)
  }

  toggleRepeat() {
    this.repeatMode = (this.repeatMode + 1) % 3
    this.repeatBtn.classList.toggle("active", this.repeatMode > 0)

    const icons = ["fa-redo", "fa-redo", "fa-redo-alt"]
    this.repeatBtn.innerHTML = `<i class="fas ${icons[this.repeatMode]}"></i>`
  }

  handleSongEnd() {
    if (this.repeatMode === 2) {
      // Repeat current song
      this.audio.currentTime = 0
      this.play()
    } else if (this.repeatMode === 1 || this.currentSongIndex < this.songs.length - 1) {
      // Repeat all or not last song
      this.nextSong()
    } else {
      // End of playlist
      this.pause()
    }
  }

  updateProgress() {
    const progressPercent = (this.audio.currentTime / this.audio.duration) * 100
    this.progress.style.width = `${progressPercent}%`
    this.progressHandle.style.left = `${progressPercent}%`

    this.currentTime.textContent = this.formatTime(this.audio.currentTime)
  }

  updateDuration() {
    this.duration.textContent = this.formatTime(this.audio.duration)
  }

  setProgress(e) {
    const rect = this.progressBar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    this.audio.currentTime = percent * this.audio.duration
  }

  setVolume(e) {
    const rect = this.volumeBar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    this.volume = Math.max(0, Math.min(1, percent))
    this.audio.volume = this.volume
    this.updateVolumeDisplay()
  }

  updateVolumeDisplay() {
    const volumePercent = this.volume * 100
    this.volumeProgress.style.width = `${volumePercent}%`
    this.volumeHandle.style.left = `${volumePercent}%`
  }

  startProgressDrag(e) {
    e.preventDefault()
    const handleDrag = (e) => this.setProgress(e)
    const stopDrag = () => {
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", stopDrag)
    }

    document.addEventListener("mousemove", handleDrag)
    document.addEventListener("mouseup", stopDrag)
  }

  startVolumeDrag(e) {
    e.preventDefault()
    const handleDrag = (e) => this.setVolume(e)
    const stopDrag = () => {
      document.removeEventListener("mousemove", handleDrag)
      document.removeEventListener("mouseup", stopDrag)
    }

    document.addEventListener("mousemove", handleDrag)
    document.addEventListener("mouseup", stopDrag)
  }

  togglePlaylist() {
    this.playlist.classList.toggle("show")
  }

  createPlaylist() {
    this.playlistItems.innerHTML = ""
    this.songs.forEach((song, index) => {
      const li = document.createElement("li")
      li.innerHTML = `
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            `
      li.addEventListener("click", () => {
        this.currentSongIndex = index
        this.loadSong(index)
        if (this.isPlaying) {
          this.play()
        }
      })
      this.playlistItems.appendChild(li)
    })
  }

  updatePlaylistActive() {
    const items = this.playlistItems.querySelectorAll("li")
    items.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentSongIndex)
    })
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  handleKeyboard(e) {
    switch (e.code) {
      case "Space":
        e.preventDefault()
        this.togglePlayPause()
        break
      case "ArrowLeft":
        this.previousSong()
        break
      case "ArrowRight":
        this.nextSong()
        break
      case "ArrowUp":
        e.preventDefault()
        this.volume = Math.min(1, this.volume + 0.1)
        this.audio.volume = this.volume
        this.updateVolumeDisplay()
        break
      case "ArrowDown":
        e.preventDefault()
        this.volume = Math.max(0, this.volume - 0.1)
        this.audio.volume = this.volume
        this.updateVolumeDisplay()
        break
    }
  }
}

// Initialize the music player when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayer()
})
