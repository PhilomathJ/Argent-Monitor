// Argent Monitor - Multi-view Video Dashboard with GridStack

// Default videos from the markdown file
const DEFAULT_VIDEOS = [
  {
    id: 'video-1',
    name: 'Rover 2 Cam',
    url: 'https://www.youtube.com/watch?v=tS2PHJmvJzo',
    enabled: true,
  },
  {
    id: 'video-2',
    name: 'NSF Live',
    url: 'https://www.youtube.com/watch?v=mhJRzQsLZGg',
    enabled: true,
  },
  {
    id: 'video-3',
    name: 'Rover Cam',
    url: 'https://www.youtube.com/watch?v=inCQ49QGmqQ',
    enabled: true,
  },
  {
    id: 'video-4',
    name: 'Lab Cam',
    url: 'https://www.youtube.com/watch?v=1_XLpEKtW8Y',
    enabled: true,
  },
  {
    id: 'video-5',
    name: 'Multiplex Cam',
    url: 'https://www.youtube.com/watch?v=bK-ToXIW7Uw',
    enabled: true,
  },
  {
    id: 'video-6',
    name: 'Sentinel Cam',
    url: 'https://www.youtube.com/watch?v=IQV0DlS1Ew0',
    enabled: true,
  },
  {
    id: 'video-7',
    name: 'Nerdle Cam',
    url: 'https://www.youtube.com/watch?v=oOj_x6H74mA',
    enabled: true,
  },
  {
    id: 'video-8',
    name: 'Gator Cam',
    url: 'https://www.youtube.com/watch?v=KIi0IbNO6J4',
    enabled: false,
  },
  {
    id: 'video-9',
    name: 'Cape Cam',
    url: 'https://www.youtube.com/watch?v=HGa8H75Zm-4',
    enabled: false,
  },
  {
    id: 'video-10',
    name: 'Rocket Ranch Cam',
    url: 'https://www.youtube.com/watch?v=qw3uaLRrYNY',
    enabled: false,
  },
  {
    id: 'video-11',
    name: 'Sapphire Cam',
    url: 'https://www.youtube.com/watch?v=Dr3g-1r9BbI',
    enabled: false,
  },
];

let grid = null;
let videos = [];
let presets = [];
let clockInterval = null;

// Default settings
let settings = {
  showClock: true,
  use24Hour: true,
};

// Extract YouTube video ID from URL
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Load videos from localStorage or use defaults
function loadVideos() {
  const saved = localStorage.getItem('argent-videos');
  if (saved) {
    videos = JSON.parse(saved);
    console.log(`✅ Loaded ${videos.length} video(s) from localStorage`);
  } else {
    videos = [...DEFAULT_VIDEOS];
    saveVideos();
    console.log('📦 Initialized with default videos');
  }
}

// Save videos to localStorage
function saveVideos() {
  localStorage.setItem('argent-videos', JSON.stringify(videos));
  console.log(`💾 Saved ${videos.length} video(s) to localStorage`);
}

// Load presets from localStorage
function loadPresets() {
  const saved = localStorage.getItem('argent-presets');
  if (saved) {
    presets = JSON.parse(saved);
    console.log(`✅ Loaded ${presets.length} preset(s) from localStorage`);
  } else {
    presets = [];
    console.log('📦 No presets found, starting fresh');
  }
}

// Save presets to localStorage
function savePresets() {
  localStorage.setItem('argent-presets', JSON.stringify(presets));
  console.log(`💾 Saved ${presets.length} preset(s) to localStorage`);
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('argent-settings');
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
    console.log('✅ Loaded settings from localStorage');
  } else {
    console.log('📦 Using default settings');
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('argent-settings', JSON.stringify(settings));
  console.log('💾 Saved settings to localStorage');
}

// Update clock display
function updateClock() {
  const clockElement = document.getElementById('toolbarClock');
  if (!clockElement) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  let timeString;
  if (settings.use24Hour) {
    // 24-hour format
    timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  } else {
    // 12-hour format with AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )} ${ampm}`;
  }

  clockElement.textContent = timeString;
}

// Start clock
function startClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
  }
  updateClock(); // Update immediately
  clockInterval = setInterval(updateClock, 60000); // Update every minute
}

// Stop clock
function stopClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

// Toggle clock visibility
function toggleClock(show) {
  const clockElement = document.getElementById('toolbarClock');
  if (!clockElement) return;

  if (show) {
    clockElement.classList.remove('hidden');
    startClock();
  } else {
    clockElement.classList.add('hidden');
    stopClock();
  }
  settings.showClock = show;
  saveSettings();
}

// Toggle 24-hour format
function toggle24Hour(use24) {
  settings.use24Hour = use24;
  saveSettings();
  updateClock();
}

// Save current layout as a preset
function saveLayoutPreset(name) {
  if (!grid) {
    console.error('Grid not initialized');
    return false;
  }

  // Get current grid items and their layout data
  const items = grid.getGridItems();
  const layout = Array.from(items).map((item) => {
    // GridStack stores node data in the element itself
    const gsX = parseInt(item.getAttribute('gs-x')) || 0;
    const gsY = parseInt(item.getAttribute('gs-y')) || 0;
    const gsW = parseInt(item.getAttribute('gs-w')) || 4;
    const gsH = parseInt(item.getAttribute('gs-h')) || 1;

    return {
      videoId: item.getAttribute('data-video-id'),
      x: gsX,
      y: gsY,
      w: gsW,
      h: gsH,
    };
  });

  const preset = {
    id: 'preset-' + Date.now(),
    name: name,
    layout: layout,
    enabledVideos: videos.filter((v) => v.enabled).map((v) => v.id),
    timestamp: new Date().toISOString(),
  };

  presets.push(preset);
  savePresets();
  console.log(`Saved layout preset: "${name}"`);
  return true;
}

// Load a preset layout
function loadLayoutPreset(presetId) {
  const preset = presets.find((p) => p.id === presetId);
  if (!preset || !grid) {
    console.error('Preset not found or grid not initialized');
    return false;
  }

  console.log(`Loading layout preset: "${preset.name}"`);

  try {
    // First, update which videos are enabled
    videos.forEach((video) => {
      video.enabled = preset.enabledVideos.includes(video.id);
    });
    saveVideos();
    renderVideoList();

    // Clear the grid
    grid.removeAll();

    // Add videos in the saved positions
    preset.layout.forEach((layoutItem) => {
      const video = videos.find((v) => v.id === layoutItem.videoId);
      if (video && video.enabled) {
        const videoHTML = createVideoItem(video);
        if (videoHTML) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = videoHTML.trim();
          const newItem = tempDiv.firstChild;

          // Add with specific position and size
          grid.addWidget(newItem, {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          });
        }
      }
    });

    console.log('✅ Preset loaded successfully:', preset.name);

    // Auto-close the video manager
    const manager = document.getElementById('videoManager');
    if (manager) {
      manager.classList.remove('open');
    }

    return true;
  } catch (error) {
    console.error('Error loading preset:', error);
    alert('Error loading preset: ' + error.message);
    return false;
  }
}

// Delete a preset
function deletePreset(presetId) {
  if (confirm('Are you sure you want to delete this preset?')) {
    presets = presets.filter((p) => p.id !== presetId);
    savePresets();
    renderPresetList();
  }
}

// Create video grid item HTML
function createVideoItem(video) {
  const videoId = getYouTubeId(video.url);
  if (!videoId) return null;

  return `
    <div class="grid-stack-item" data-video-id="${video.id}" gs-w="4" gs-h="2">
      <div class="grid-stack-item-content">
        <div class="video-wrapper">
          <div class="video-title">
            <span class="video-title-text">${video.name}</span>
            <button class="video-close-btn" onclick="closeVideo('${video.id}', event)" title="Close video">×</button>
          </div>
          <div class="video-embed">
            <iframe
              src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize or refresh the grid
function initializeGrid() {
  const gridContainer = document.querySelector('.grid-stack');
  const emptyState = document.getElementById('emptyState');

  // Add enabled videos to grid
  const enabledVideos = videos.filter((v) => v.enabled);

  // Show/hide empty state
  if (enabledVideos.length === 0) {
    emptyState.classList.add('show');
    if (grid) {
      grid.removeAll();
    }
    console.log('No videos selected - showing empty state');
    return;
  } else {
    emptyState.classList.remove('show');
  }

  // Initialize GridStack if not already initialized
  if (!grid) {
    const gridHTML = enabledVideos
      .map(createVideoItem)
      .filter(Boolean)
      .join('');
    gridContainer.innerHTML = gridHTML;

    grid = GridStack.init({
      cellHeight: 150,
      margin: 0,
      column: 12,
      float: false,
      animate: true,
      disableOneColumnMode: true,
      resizable: {
        handles: 'e, se, s, sw, w',
      },
      draggable: {
        handle: '.video-title',
        appendTo: 'body',
        scroll: false,
      },
    });

    // No need for 24-column class
    gridContainer.classList.remove('grid-stack-24');
  } else {
    // Grid already exists, update items
    // Get current items in the grid
    const currentItems = grid.getGridItems();
    const currentVideoIds = Array.from(currentItems).map((item) =>
      item.getAttribute('data-video-id'),
    );

    const enabledVideoIds = enabledVideos.map((v) => v.id);

    // Remove items that should no longer be visible
    currentItems.forEach((item) => {
      const videoId = item.getAttribute('data-video-id');
      if (!enabledVideoIds.includes(videoId)) {
        grid.removeWidget(item);
      }
    });

    // Add new items that should be visible
    enabledVideos.forEach((video) => {
      if (!currentVideoIds.includes(video.id)) {
        const videoHTML = createVideoItem(video);
        if (videoHTML) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = videoHTML.trim();
          const newItem = tempDiv.firstChild;
          grid.addWidget(newItem);
        }
      }
    });
  }

  console.log('GridStack initialized with', enabledVideos.length, 'videos');
}

// Render preset list in manager
function renderPresetList() {
  const presetList = document.getElementById('presetList');
  if (!presetList) {
    console.error('presetList element not found!');
    return;
  }

  if (presets.length === 0) {
    presetList.innerHTML =
      '<p style="color: #666; font-size: 12px; text-align: center; margin: 10px 0;">No saved presets yet</p>';
    return;
  }

  presetList.innerHTML = presets
    .map((preset) => {
      const date = new Date(preset.timestamp).toLocaleString();
      return `
      <div class="preset-item">
        <div class="preset-info">
          <div class="preset-name">${preset.name}</div>
          <div class="preset-date">${date}</div>
        </div>
        <div class="preset-actions">
          <button class="load-btn" onclick="loadLayoutPreset('${preset.id}')">Load</button>
          <button class="delete-btn" onclick="deletePreset('${preset.id}')">Delete</button>
        </div>
      </div>
    `;
    })
    .join('');
}

// Render video list in manager
function renderVideoList() {
  const videoList = document.getElementById('videoList');
  videoList.innerHTML = videos
    .map(
      (video) => `
    <div class="video-item">
      <input type="checkbox" id="${video.id}" ${video.enabled ? 'checked' : ''}
             onchange="toggleVideo('${video.id}')">
      <label for="${video.id}">${video.name}</label>
      ${
        !DEFAULT_VIDEOS.find((v) => v.id === video.id)
          ? `<button class="delete-btn" onclick="deleteVideo('${video.id}')">Delete</button>`
          : ''
      }
    </div>
  `,
    )
    .join('');
}

// Toggle video enabled/disabled
function toggleVideo(videoId) {
  const video = videos.find((v) => v.id === videoId);
  if (video) {
    video.enabled = !video.enabled;
    saveVideos();
    initializeGrid();
  }
}

// Close video from the X button
function closeVideo(videoId, event) {
  if (event) {
    event.stopPropagation(); // Prevent drag from triggering
  }
  const video = videos.find((v) => v.id === videoId);
  if (video) {
    video.enabled = false;
    saveVideos();
    renderVideoList(); // Update checkboxes in manager
    initializeGrid(); // Remove from grid
  }
}

// Delete custom video
function deleteVideo(videoId) {
  videos = videos.filter((v) => v.id !== videoId);
  saveVideos();
  renderVideoList();
  initializeGrid();
}

// Add new video
function addVideo(name, url) {
  const videoId = getYouTubeId(url);
  if (!videoId) {
    console.error('Invalid YouTube URL:', url);
    return false;
  }

  const newVideo = {
    id: 'custom-' + Date.now(),
    name: name,
    url: url,
    enabled: true,
  };

  videos.push(newVideo);
  saveVideos();
  renderVideoList();
  initializeGrid();
  return true;
}

// Make functions globally available
window.toggleVideo = toggleVideo;
window.closeVideo = closeVideo;
window.deleteVideo = deleteVideo;
window.loadLayoutPreset = loadLayoutPreset;
window.deletePreset = deletePreset;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 Argent Monitor initializing...');
  console.log('📍 Current URL:', window.location.href);

  loadVideos();
  loadPresets();
  loadSettings();
  initializeGrid();
  renderVideoList();
  renderPresetList();

  // Initialize clock
  const showClockCheckbox = document.getElementById('showClock');
  const use24HourCheckbox = document.getElementById('use24Hour');

  if (showClockCheckbox) {
    showClockCheckbox.checked = settings.showClock;
  }
  if (use24HourCheckbox) {
    use24HourCheckbox.checked = settings.use24Hour;
  }

  // Start clock if enabled
  if (settings.showClock) {
    startClock();
  } else {
    const clockElement = document.getElementById('toolbarClock');
    if (clockElement) {
      clockElement.classList.add('hidden');
    }
  }

  console.log('✨ Initialization complete');
  console.log('💡 Tip: Your videos and presets are saved to localStorage');
  console.log('💡 They will persist across normal refreshes (F5)');
  console.log(
    '⚠️  Hard refresh (Ctrl+Shift+R) may clear localStorage in some browsers',
  );

  // Toggle manager visibility
  const toggleBtn = document.getElementById('toggleManager');
  const manager = document.getElementById('videoManager');
  const closeBtn = document.getElementById('closeManager');

  toggleBtn.addEventListener('click', () => {
    manager.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    manager.classList.remove('open');
  });

  // Add video form
  const addForm = document.getElementById('addVideoForm');
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('videoName').value.trim();
    const url = document.getElementById('videoUrl').value.trim();

    if (addVideo(name, url)) {
      addForm.reset();
    }
  });

  // Save layout preset form
  const savePresetForm = document.getElementById('savePresetForm');
  if (savePresetForm) {
    savePresetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('presetName').value.trim();

      if (name && saveLayoutPreset(name)) {
        renderPresetList();
        savePresetForm.reset();
      }
    });
  }

  // Settings event listeners
  if (showClockCheckbox) {
    showClockCheckbox.addEventListener('change', (e) => {
      toggleClock(e.target.checked);
    });
  }

  if (use24HourCheckbox) {
    use24HourCheckbox.addEventListener('change', (e) => {
      toggle24Hour(e.target.checked);
    });
  }

  // Click clock to toggle format
  const clockElement = document.getElementById('toolbarClock');
  if (clockElement) {
    clockElement.addEventListener('click', () => {
      toggle24Hour(!settings.use24Hour);
      // Update checkbox to match
      if (use24HourCheckbox) {
        use24HourCheckbox.checked = settings.use24Hour;
      }
    });
  }

  // Close manager when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !manager.contains(e.target) &&
      !toggleBtn.contains(e.target) &&
      manager.classList.contains('open')
    ) {
      manager.classList.remove('open');
    }
  });

  // Close manager when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && manager.classList.contains('open')) {
      manager.classList.remove('open');
    }
  });
});
