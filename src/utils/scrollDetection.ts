// Scroll Detection Utility
// Adds "scrolling" class to body during scroll to prevent accidental interactions

let isScrolling = false;
let scrollTimeout: number;

function handleScroll() {
  // Add scrolling class immediately
  if (!isScrolling) {
    document.body.classList.add('scrolling');
    isScrolling = true;
  }
  
  // Clear existing timeout
  window.clearTimeout(scrollTimeout);
  
  // Remove scrolling class after scroll stops
  scrollTimeout = window.setTimeout(() => {
    document.body.classList.remove('scrolling');
    isScrolling = false;
  }, 150);
}

// Initialize scroll detection
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchmove', handleScroll, { passive: true });
  
  // Also detect scrolling in scrollable containers
  document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
}

export { isScrolling };
