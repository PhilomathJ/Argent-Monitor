// SpaceX Live Cams Dashboard - GridStack Initialization with Video Manager

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

// Extract YouTube video ID from URL
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Load videos from localStorage or use defaults
function loadVideos() {
  const saved = localStorage.getItem('spacex-videos');
  if (saved) {
    videos = JSON.parse(saved);
  } else {
    videos = [...DEFAULT_VIDEOS];
    saveVideos();
  }
}

// Save videos to localStorage
function saveVideos() {
  localStorage.setItem('spacex-videos', JSON.stringify(videos));
}

// Create video grid item HTML
function createVideoItem(video) {
  const videoId = getYouTubeId(video.url);
  if (!videoId) return null;

  return `
    <div class="grid-stack-item" data-video-id="${video.id}" gs-w="4" gs-h="1">
      <div class="grid-stack-item-content">
        <div class="video-wrapper">
          <div class="video-title">${video.name}</div>
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
      cellHeight: 300,
      margin: 8,
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

// Delete custom video
function deleteVideo(videoId) {
  if (confirm('Are you sure you want to delete this video?')) {
    videos = videos.filter((v) => v.id !== videoId);
    saveVideos();
    renderVideoList();
    initializeGrid();
  }
}

// Add new video
function addVideo(name, url) {
  const videoId = getYouTubeId(url);
  if (!videoId) {
    alert('Invalid YouTube URL. Please use a valid YouTube video link.');
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
window.deleteVideo = deleteVideo;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  loadVideos();
  initializeGrid();
  renderVideoList();

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
      alert('Video added successfully!');
    }
  });

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
});
