// Zalo Button Scroll Effect
(function() {
    'use strict';
    
    let scrollTimer = null;
    let isScrolling = false;
    let lastScrollY = 0;
    // Announcement modal state
    let modalShownThisSession = false;
    const MODAL_DISMISS_KEY = 'yt_global_announce_dismissed';
    
    function initZaloScrollEffect() {
        const zaloBtn = document.querySelector('.zalo-floating-btn');
        if (!zaloBtn) {
            // Still show modal even if button missing
            initGlobalAnnouncementModal();
            return;
        }
        
        // Notification removed; no positioning needed
        
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
        initGlobalAnnouncementModal();
        
        // Update position on resize
        window.addEventListener('resize', () => {
            ensureCorrectPosition();
        });
        
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
            
            // Set timer to detect when scrolling stops - longer delay for complete stillness
            scrollTimer = setTimeout(function() {
                isScrolling = false;
                zaloBtn.classList.remove('scrolling');
                zaloBtn.classList.add('stopped');
                
                // No notification to show
                setTimeout(() => {}, 0);
            }, 500); // 500ms delay after scroll stops to ensure complete stillness
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
                }, 600); // 600ms delay for touch to ensure complete stillness
            }
        }

        // Notification fully removed
    }

    // ===== Global Announcement Modal =====
    function initGlobalAnnouncementModal() {
        try {
            // Do not show on drug detail page
            if (/(^|\/)drug\.html(\?|#|$)/i.test(location.pathname) || /(^|\/)drug\.html(\?|#|$)/i.test(location.href)) {
                return;
            }
            // Skip if user dismissed earlier in this browser session
            if (sessionStorage.getItem(MODAL_DISMISS_KEY) === '1') {
                modalShownThisSession = true;
                return;
            }
            if (modalShownThisSession) return;
            // Build backdrop and modal
            const backdrop = document.createElement('div');
            backdrop.className = 'global-modal-backdrop';

            const modal = document.createElement('div');
            modal.className = 'global-modal';
            modal.innerHTML = `
                <div class="global-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="globalModalTitle">
                    <div class="global-modal-header">
                        <div id="globalModalTitle" class="global-modal-title">THÔNG BÁO!!!!!</div>
                        <button type="button" class="global-modal-close" aria-label="Đóng">✕</button>
                    </div>
                    <div class="global-modal-body">
                        <p>NẾU CÓ BẤT KỲ THẮC MẮC HOẶC VẤN ĐỀ NÀO CẦN ĐƯỢC HỖ TRỢ, VUI LÒNG LIÊN HỆ VỚI <strong>DƯỢC SĨ</strong> HOẶC <strong>QUẢN TRỊ VIÊN</strong> TẠI <a href="https://zalo.me/0982166897" target="_blank" rel="noopener noreferrer">đây</a> ĐỂ ĐƯỢC GIẢI ĐÁP</p>
                    </div>
                    <div class="global-modal-footer">
                        <div class="global-modal-actions">
                            <button type="button" class="btn-ghost" data-modal-action="later">Ẩn cho tới lần truy cập tới</button>
                            <a class="btn-primary" href="https://zalo.me/0982166897" target="_blank" rel="noopener noreferrer">Liên hệ ngay</a>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(backdrop);
            document.body.appendChild(modal);

            // Show with small delay to ensure styles are parsed
            setTimeout(() => {
                backdrop.classList.add('show');
                modal.classList.add('show');
            }, 50);

            const closeButtons = modal.querySelectorAll('.global-modal-close, [data-modal-action="later"]');
            const close = () => {
                backdrop.classList.remove('show');
                modal.classList.remove('show');
                setTimeout(() => {
                    backdrop.remove();
                    modal.remove();
                }, 200);
                modalShownThisSession = true;
                // Persist dismissal for rest of session (won't reappear until tab/window closed)
                try { sessionStorage.setItem(MODAL_DISMISS_KEY, '1'); } catch (_) {}
            };
            closeButtons.forEach(btn => btn.addEventListener('click', close));
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') close();
            }, { once: true });
        } catch (e) {
            // Fail-safe: ignore modal errors
            console.error(e);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initZaloScrollEffect);
    } else {
        initZaloScrollEffect();
    }
})();
