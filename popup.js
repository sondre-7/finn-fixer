// Browser API polyfill for Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Default settings
const DEFAULT_SETTINGS = {
  maxWidth: 1800,
  mediumColumns: 2
};

// Load settings from storage
async function loadSettings() {
  try {
    const result = await browserAPI.storage.local.get(['maxWidth', 'mediumColumns']);
    return {
      maxWidth: result.maxWidth || DEFAULT_SETTINGS.maxWidth,
      mediumColumns: result.mediumColumns || DEFAULT_SETTINGS.mediumColumns
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Save settings to storage
async function saveSettings(settings) {
  try {
    await browserAPI.storage.local.set(settings);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// Show status message
function showStatus(message, isError = false) {
  const statusEl = document.getElementById('status-message');
  statusEl.textContent = message;
  statusEl.className = `status-message ${isError ? 'error' : 'success'}`;
  statusEl.style.display = 'block';
  
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// Initialize popup
async function init() {
  // Load and display current settings
  const settings = await loadSettings();
  document.getElementById('max-width').value = settings.maxWidth;
  document.getElementById('medium-columns').value = settings.mediumColumns;

  // Save button handler
  document.getElementById('save-btn').addEventListener('click', async () => {
    const maxWidth = parseInt(document.getElementById('max-width').value);
    const mediumColumns = parseInt(document.getElementById('medium-columns').value);

    // Validation
    if (isNaN(maxWidth) || maxWidth < 800 || maxWidth > 3000) {
      showStatus('Max width must be between 800 and 3000', true);
      return;
    }
    if (isNaN(mediumColumns) || mediumColumns < 1) {
      showStatus('Medium columns must be at least 1', true);
      return;
    }

    const success = await saveSettings({
      maxWidth,
      mediumColumns
    });

    if (success) {
      showStatus('Settings saved! Refresh the page to apply changes.');
      
      // Notify content script to update
      try {
        const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
          browserAPI.tabs.sendMessage(tabs[0].id, { action: 'updateSettings' });
        }
      } catch (error) {
        // Content script might not be loaded, that's okay
        console.log('Could not notify content script:', error);
      }
    } else {
      showStatus('Error saving settings', true);
    }
  });

  // Reset button handler
  document.getElementById('reset-btn').addEventListener('click', async () => {
    document.getElementById('max-width').value = DEFAULT_SETTINGS.maxWidth;
    document.getElementById('medium-columns').value = DEFAULT_SETTINGS.mediumColumns;
    
    const success = await saveSettings(DEFAULT_SETTINGS);
    if (success) {
      showStatus('Settings reset to defaults! Refresh the page to apply changes.');
      
      // Notify content script to update
      try {
        const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
          browserAPI.tabs.sendMessage(tabs[0].id, { action: 'updateSettings' });
        }
      } catch (error) {
        console.log('Could not notify content script:', error);
      }
    } else {
      showStatus('Error resetting settings', true);
    }
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

