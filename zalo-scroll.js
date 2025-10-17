// Zalo Button Scroll Effect
(function() {
    'use strict';
    
    let scrollTimer = null;
    let isScrolling = false;
    
    function initZaloScrollEffect() {
        const zaloBtn = document.querySelector('.zalo-floating-btn');
        if (!zaloBtn) return;
        
        // Add initial class
        zaloBtn.classList.add('stopped');
        
        // Scroll event listener
        window.addEventListener('scroll', function() {
            // Clear existing timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            
            // If not already scrolling, add scrolling class
            if (!isScrolling) {
                isScrolling = true;
                zaloBtn.classList.remove('stopped');
                zaloBtn.classList.add('scrolling');
            }
            
            // Set timer to detect when scrolling stops
            scrollTimer = setTimeout(function() {
                isScrolling = false;
                zaloBtn.classList.remove('scrolling');
                zaloBtn.classList.add('stopped');
            }, 150); // 150ms delay after scroll stops
        });
        
        // Touch events for mobile
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            handleTouchScroll();
        });
        
        function handleTouchScroll() {
            if (Math.abs(touchEndY - touchStartY) > 10) { // Minimum scroll distance
                if (!isScrolling) {
                    isScrolling = true;
                    zaloBtn.classList.remove('stopped');
                    zaloBtn.classList.add('scrolling');
                }
                
                // Clear existing timer
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                
                // Set timer to detect when touch scrolling stops
                scrollTimer = setTimeout(function() {
                    isScrolling = false;
                    zaloBtn.classList.remove('scrolling');
                    zaloBtn.classList.add('stopped');
                }, 200); // Slightly longer delay for touch
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initZaloScrollEffect);
    } else {
        initZaloScrollEffect();
    }
})();
