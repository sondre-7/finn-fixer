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

// Apply CSS custom properties for settings
async function applySettings() {
  const settings = await loadSettings();
  
  // Set CSS custom properties on document root
  document.documentElement.style.setProperty('--finn-fixer-max-width', `${settings.maxWidth}px`);
  document.documentElement.style.setProperty('--finn-fixer-medium-columns', settings.mediumColumns);
  
  // Also apply grid columns directly to result list
  const resultList = document.querySelector('.sf-result-list');
  if (resultList) {
    // Apply medium columns
    resultList.style.setProperty('--finn-fixer-medium-columns', settings.mediumColumns);
  }
}

// Wait for DOM to be ready and apply modifications
async function applyLayoutFixes() {
  // Apply settings first
  await applySettings();
  // Fix 1: Make filters section collapsible (hidden by default)
  const filtersSection = document.querySelector('section[aria-labelledby="filters-heading"]');
  
  if (filtersSection) {
    // Check if already processed to avoid duplicate processing
    if (filtersSection.hasAttribute('data-finn-fixer-processed')) {
      return;
    }
    
    // Mark as processed
    filtersSection.setAttribute('data-finn-fixer-processed', 'true');
    
    // Hide the section content initially
    filtersSection.classList.add('finn-fixer-collapsed');
    
    // Create a custom header to toggle the filters
    const filterHeader = document.createElement('div');
    filterHeader.className = 'finn-fixer-filter-header';
    filterHeader.setAttribute('role', 'button');
    filterHeader.setAttribute('aria-expanded', 'false');
    filterHeader.setAttribute('tabindex', '0');
    
    // Add expand/collapse indicator
    const indicator = document.createElement('span');
    indicator.className = 'finn-fixer-indicator';
    indicator.textContent = '▶';
    
    // Add "Filters" text
    const filterText = document.createElement('span');
    filterText.textContent = 'Filters';
    
    filterHeader.appendChild(indicator);
    filterHeader.appendChild(filterText);
    
    // Insert the header before the filters section
    filtersSection.parentNode.insertBefore(filterHeader, filtersSection);
    
    // Toggle on click
    const toggleFilters = () => {
      const isCollapsed = filtersSection.classList.contains('finn-fixer-collapsed');
      
      if (isCollapsed) {
        filtersSection.classList.remove('finn-fixer-collapsed');
        filtersSection.classList.add('finn-fixer-expanded');
        filterHeader.setAttribute('aria-expanded', 'true');
        indicator.textContent = '▼';
      } else {
        filtersSection.classList.add('finn-fixer-collapsed');
        filtersSection.classList.remove('finn-fixer-expanded');
        filterHeader.setAttribute('aria-expanded', 'false');
        indicator.textContent = '▶';
      }
    };
    
    filterHeader.addEventListener('click', toggleFilters);
    filterHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFilters();
      }
    });
  }
  
  // Fix 2: Change second container's col-span from 2 to 3
  if (filtersSection && filtersSection.parentElement) {
    const parent = filtersSection.parentElement;
    const children = Array.from(parent.children);
    
    // Find the second container (after the filters section)
    const filtersIndex = children.indexOf(filtersSection);
    if (filtersIndex >= 0 && filtersIndex + 1 < children.length) {
      const secondContainer = children[filtersIndex + 1];
      
      // Replace col-span-2 with col-span-3
      if (secondContainer.classList.contains('col-span-2')) {
        secondContainer.classList.remove('col-span-2');
        secondContainer.classList.add('col-span-3');
      }
    }
  }
  
  // Fix 3: Change sf-result-list from md:grid-cols-3 to md:grid-cols-2
  const resultList = document.querySelector('.sf-result-list');
  
  if (resultList) {
    // Remove md:grid-cols-3 and add md:grid-cols-2
    resultList.classList.remove('md:grid-cols-3');
    resultList.classList.add('md:grid-cols-2');
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyLayoutFixes);
} else {
  applyLayoutFixes();
}

// Listen for settings updates from popup
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateSettings') {
    applySettings();
    sendResponse({ success: true });
  }
  return true;
});

// Also observe for dynamic content changes (in case finn.no uses SPA routing)
const observer = new MutationObserver((mutations) => {
  // Check if filters section appeared and hasn't been processed yet
  const filtersSection = document.querySelector('section[aria-labelledby="filters-heading"]');
  if (filtersSection && !filtersSection.hasAttribute('data-finn-fixer-processed')) {
    applyLayoutFixes();
  }
  
  // Also re-apply settings if result list appears
  const resultList = document.querySelector('.sf-result-list');
  if (resultList) {
    applySettings();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

