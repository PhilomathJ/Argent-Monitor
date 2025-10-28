// Clock Module
// Handles all clock display and management functionality

let clockInterval = null;

// Get current settings (imported from app.js settings object)
function getSettings() {
  // This will be called from app.js context where settings is available
  return window.argentMonitorSettings || { showClock: true, use24Hour: true };
}

// Update clock display
function updateClock() {
  const clockElement = document.getElementById('toolbarClock');
  if (!clockElement) return;

  const settings = getSettings();
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
function toggleClock(show, saveSettingsCallback) {
  const clockElement = document.getElementById('toolbarClock');
  if (!clockElement) return;

  if (show) {
    clockElement.classList.remove('hidden');
    startClock();
  } else {
    clockElement.classList.add('hidden');
    stopClock();
  }

  // Update settings through callback
  const settings = getSettings();
  settings.showClock = show;
  if (saveSettingsCallback) {
    saveSettingsCallback();
  }
}

// Toggle 24-hour format
function toggle24Hour(use24, saveSettingsCallback) {
  const settings = getSettings();
  settings.use24Hour = use24;
  if (saveSettingsCallback) {
    saveSettingsCallback();
  }
  updateClock();
}

// Initialize clock based on settings
function initializeClock(settings) {
  // Store settings reference globally for this module
  window.argentMonitorSettings = settings;

  if (settings.showClock) {
    startClock();
  } else {
    const clockElement = document.getElementById('toolbarClock');
    if (clockElement) {
      clockElement.classList.add('hidden');
    }
  }
}

// Export functions for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    initializeClock,
    startClock,
    stopClock,
    updateClock,
    toggleClock,
    toggle24Hour,
  };
}
