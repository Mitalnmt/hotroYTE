// Zalo Button Scroll Effect
(function() {
    'use strict';
    
    let scrollTimer = null;
    let isScrolling = false;
    let lastScrollY = 0;
    
    function initZaloScrollEffect() {
        const zaloBtn = document.querySelector('.zalo-floating-btn');
        if (!zaloBtn) return;
        
        // Add initial class
        zaloBtn.classList.add('stopped');
        
        // Ensure button is positioned correctly on mobile
        function ensureCorrectPosition() {
            if (window.innerWidth <= 768) {
                zaloBtn.style.right = '20px';
                zaloBtn.style.bottom = '20px';
                zaloBtn.style.left = 'auto';
                // For search page, adjust bottom position
                if (document.body.classList.contains('search-page')) {
                    zaloBtn.style.bottom = '90px';
                }
            } else {
                zaloBtn.style.right = '30px';
                zaloBtn.style.bottom = '30px';
                zaloBtn.style.left = 'auto';
                // For search page, adjust bottom position
                if (document.body.classList.contains('search-page')) {
                    zaloBtn.style.bottom = '100px';
                }
            }
        }
        
        // Initial positioning
        ensureCorrectPosition();
        
        // Update position on resize
        window.addEventListener('resize', ensureCorrectPosition);
        
        // Scroll event listener
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;
            
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
        
        // Touch events for mobile - improved
        let touchStartY = 0;
        let touchEndY = 0;
        let touchStartTime = 0;
        let touchEndTime = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            touchEndTime = Date.now();
            handleTouchScroll();
        }, { passive: true });
        
        function handleTouchScroll() {
            const scrollDistance = Math.abs(touchEndY - touchStartY);
            const scrollDuration = touchEndTime - touchStartTime;
            
            // Only trigger if significant scroll movement and reasonable duration
            if (scrollDistance > 5 && scrollDuration > 50 && scrollDuration < 1000) {
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
