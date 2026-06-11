//  Race data
const races = [
  {
    name: "Race Highlights | 2025 Emilia-Romagna Grand Prix",
    location: " Autodromo Enzo e Dino Ferrari, Italy",
    date: "2023-05-28T14:00:00",
    image: "https://i.ytimg.com/vi/xkRXnrvFCY0/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAxEHXegVvYH2Ya3w3TYSV_Kls3DQ"
  },
  {
    name: "Race Highlights | 2025 Monaco Grand Prix",
    location: "Circuit de Monaco, Monaco",
    date: "2023-06-04T14:00:00",
    image: "https://i.ytimg.com/vi/ajzQj7bjSWE/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBm5lAatpqkuu8WvceJPJ23gasKSw"
  },
  {
    name: "Race Highlights | 2025 Spanish Grand Prix",
    location: "Circuit de Barcelona-Catalunya, Spain",
    date: "2023-06-18T14:00:00",
    image: "https://i.ytimg.com/vi/ATlMK7ln5Dc/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCWc_4ihTlTen-trAJ9V1AX7G5Fpw"
  },
  {
    name: "Race Highlights | 2025 Canadian Grand Prix",
    location: "Circuit Gilles Villeneuve, canada",
    date: "2023-07-02T14:00:00",
    image: "https://i.ytimg.com/vi/93ZnZF_zWds/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAEcyxWC-j8dAWGc_xGaam3XU8t3A"
  }
];


const adSelectors = ['[id^="ad"]','[class*="ad-"]','[class*="ads"]','.ads','.adsbox','iframe[src*="ads"]','iframe[src*="doubleclick"]','iframe[src*="googlesyndication"]','script[src*="ads"]','ins.adsbygoogle'];

const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes && m.addedNodes.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      for (const sel of adSelectors) {
        try {
          if (node.matches && node.matches(sel)) {
            node.remove();
            return;
          }
        } catch (e) {}
        if (node.querySelector && node.querySelector(sel)) {
          node.querySelectorAll(sel).forEach(el => el.remove());
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

function removeAdElements() {
  try {
    const nodes = document.querySelectorAll(adSelectors.join(','));
    nodes.forEach(n => n.remove());
  } catch (e) {
    // ignore selector errors in older browsers
  }
}

function detectAdBlocker(timeout = 150) {
  return new Promise(resolve => {
    try {
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-banner adunit';
      bait.style.width = '1px';
      bait.style.height = '1px';
      bait.style.position = 'absolute';
      bait.style.left = '-9999px';
      document.body.appendChild(bait);

      setTimeout(() => {
        let blocked = false;
        try {
          const style = window.getComputedStyle ? getComputedStyle(bait) : null;
          blocked = (style && style.getPropertyValue('display') === 'none') || (bait.offsetParent === null) || (bait.offsetHeight === 0);
        } catch (e) {
          // if reading properties throws, assume blocked
          blocked = true;
        }
        bait.remove();
        resolve(blocked);
      }, timeout);
    } catch (e) {
      resolve(false);
    }
  });
}

function showAdblockNotice() {
  if (document.getElementById('adblock-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'adblock-banner';
  banner.className = 'adblock-banner';
  banner.innerHTML = '<span>Ad blocker detected — some content may be blocked.</span><button id="adblock-dismiss">Dismiss</button>';
  document.body.appendChild(banner);
  document.getElementById('adblock-dismiss').addEventListener('click', () => banner.remove());
}


// Client-side routing
function handleRouting() {
  const hash = window.location.hash.substring(1) || 'f1';
  const navLinks = document.querySelectorAll('.nav-links li');
  const pages = document.querySelectorAll('.page');
  
  // Deactivate all pages and nav links
  pages.forEach(page => page.classList.remove('active'));
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Activate current page and nav link
  document.getElementById(`${hash}-page`)?.classList.add('active');
  document.querySelector(`.nav-links li[data-page="${hash}"]`)?.classList.add('active');
}

// Initialize navigation
function initNavigation() {
  // Handle hash change
  window.addEventListener('hashchange', handleRouting);
  
  // Handle initial load
  handleRouting();
  
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Populate race schedule
function populateRaceSchedule() {
  const raceSchedule = document.getElementById('race-schedule');
  
  races.forEach(race => {
    const raceDate = new Date(race.date);
    const now = new Date();
    const diffTime = raceDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const raceCard = document.createElement('div');
    raceCard.classList.add('race-card');
    raceCard.innerHTML = `
      <div class="race-image">
        <img src="${race.image}" alt="${race.name}">
      </div>
      <div class="race-details">
        <h3>${race.name}</h3>
        <p>${race.location}</p>
        <p class="countdown">${diffDays > 0 ? `${diffDays} days remaining` : ''}</p>
      </div>
    `;
    
    raceSchedule.appendChild(raceCard);
  });
}

// Video player functionality
function initVideoPlayer() {
  const video = document.getElementById('main-video');
  const playPauseBtn = document.getElementById('play-pause');
  const playIcon = playPauseBtn.querySelector('.play-icon');
  const pauseIcon = playPauseBtn.querySelector('.pause-icon');
  const muteUnmuteBtn = document.getElementById('mute-unmute');
  const volumeIcon = muteUnmuteBtn.querySelector('.volume-icon');
  const muteIcon = muteUnmuteBtn.querySelector('.mute-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const fullscreenBtn = document.getElementById('fullscreen');
  const progressBar = document.querySelector('.progress');
  const progressContainer = document.querySelector('.progress-bar');
  const timeDisplay = document.querySelector('.time-display');
  
  // Play/Pause
  playPauseBtn.addEventListener('click', togglePlayPause);
  video.addEventListener('click', togglePlayPause);
  
  function togglePlayPause() {
    if (video.paused) {
      video.play();
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    } else {
      video.pause();
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
    }
  }
  
  // Mute/Unmute
  muteUnmuteBtn.addEventListener('click', toggleMute);
  
  function toggleMute() {
    video.muted = !video.muted;
    
    if (video.muted) {
      volumeIcon.classList.add('hidden');
      muteIcon.classList.remove('hidden');
      volumeSlider.value = 0;
    } else {
      volumeIcon.classList.remove('hidden');
      muteIcon.classList.add('hidden');
      volumeSlider.value = video.volume * 100;
    }
  }
  
  // Volume slider
  volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value / 100;
    video.volume = volume;
    
    if (volume === 0) {
      volumeIcon.classList.add('hidden');
      muteIcon.classList.remove('hidden');
      video.muted = true;
    } else {
      volumeIcon.classList.remove('hidden');
      muteIcon.classList.add('hidden');
      video.muted = false;
    }
  });
  
  // Fullscreen
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  
  // Progress bar
  video.addEventListener('timeupdate', updateProgress);
  
  function updateProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
    
    // Update time display
    const currentMinutes = Math.floor(video.currentTime / 60);
    const currentSeconds = Math.floor(video.currentTime % 60);
    const durationMinutes = Math.floor(video.duration / 60) || 0;
    const durationSeconds = Math.floor(video.duration % 60) || 0;
    
    timeDisplay.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
  }
  
  // Click on progress bar to seek
  progressContainer.addEventListener('click', seek);
  
  function seek(e) {
    const percent = (e.offsetX / progressContainer.offsetWidth);
    video.currentTime = percent * video.duration;
  }
  
  // Reset UI when video ends
  video.addEventListener('ended', () => {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    progressBar.style.width = '0%';
  });
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !message) {
      showFormMessage('Please fill all fields', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate form submission (would be an API call in a real app)
    setTimeout(() => {
      showFormMessage('Message sent successfully! We will get back to you soon.', 'success');
      contactForm.reset();
    }, 1000);
  });
  
  function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = type; // 'success' or 'error'
    formMessage.classList.remove('hidden');
    
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
}

// Player controls for floating UI (PiP and Fullscreen)
function initPlayerControls() {
  // Get all video containers with floating controls
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
    const pipBtn = container.querySelector('.pip-btn');
    const fsBtn = container.querySelector('.fs-btn');
    const iframe = container.querySelector('iframe');
    const mainVideoDiv = container.querySelector('#main-video');
    const spinner = container.querySelector('.spinner');
    
    // Hide spinner after a short delay (video loaded)
    if (spinner) {
      setTimeout(() => spinner.classList.add('hidden'), 500);
      // Also hide spinner on iframe load if available
      if (iframe) {
        iframe.addEventListener('load', () => spinner.classList.add('hidden'));
      }
    }
    
    // Picture in Picture
    if (pipBtn) {
      pipBtn.addEventListener('click', async () => {
        try {
          if (mainVideoDiv && mainVideoDiv !== document.pictureInPictureElement) {
            await mainVideoDiv.requestPictureInPicture();
          } else if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          }
        } catch (error) {
          console.log('PiP not supported or error:', error);
        }
      });
    }
    
    // Fullscreen
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        try {
          if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
              console.log('Fullscreen error:', err);
            });
          } else {
            document.exitFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      });
    }
  });
}

// Run initialization functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  populateRaceSchedule();
  initVideoPlayer();
  initPlayerControls();
  initContactForm();

  // Detect adblock and remove ad-like elements
  detectAdBlocker().then(blocked => {
    if (blocked) {
      showAdblockNotice();
    }
    removeAdElements();
  });
});
  
