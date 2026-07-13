document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Seed mock tracking data in localStorage if not already present
    seedMockOrders();

    /* ----------------------------------------------------
       1. STICKY HEADER SCROLL EFFECT
    ---------------------------------------------------- */
    const header = document.getElementById('mainHeader');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    /* ----------------------------------------------------
       2. MOBILE MENU TOGGLE
    ---------------------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close menu when clicking navigation link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    /* ----------------------------------------------------
       3. HERO BANNER BACKGROUND SLIDER
    ---------------------------------------------------- */
    const slides = document.querySelectorAll('.hero-slide');
    const tabs = document.querySelectorAll('.hero-tab');
    let currentSlideIndex = 0;
    let slideInterval;

    const showSlide = (index) => {
        // Remove active class from all slides and tabs
        slides.forEach(slide => slide.classList.remove('active'));
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('tag-dark');
            tab.classList.add('tag-neutro');
        });

        // Add active to current
        slides[index].classList.add('active');
        tabs[index].classList.add('active');
        tabs[index].classList.remove('tag-neutro');
        tabs[index].classList.add('tag-dark');
        currentSlideIndex = index;
    };

    const nextSlide = () => {
        let nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    };

    const startSlideShow = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    };

    // Tab click listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const slideIndex = parseInt(tab.getAttribute('data-slide'), 10);
            showSlide(slideIndex);
            startSlideShow(); // Reset timer
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }

    /* ----------------------------------------------------
       4. STATISTICS COUNTER ANIMATION
    ---------------------------------------------------- */
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-num');
    let statsAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1500; // ms
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            let stepCount = 0;

            const counter = setInterval(() => {
                current += stepValue;
                stepCount++;
                if (stepCount >= steps) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, duration / steps);
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    /* ----------------------------------------------------
       5. POLICIES ACCORDION (CHÍNH SÁCH BÁN HÀNG)
    ---------------------------------------------------- */
    const accordionItems = document.querySelectorAll('.policies-accordion .accordion-item');

    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Collapse all other accordion items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                    }
                });

                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // Make the first policy open by default to invite interaction
    if (accordionItems.length > 0) {
        const firstItem = accordionItems[0];
        const firstContent = firstItem.querySelector('.accordion-content');
        firstItem.classList.add('active');
        if (firstContent) {
            // Delay slightly to ensure fonts/layout are calculated
            setTimeout(() => {
                firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
            }, 100);
        }
    }

    /* ----------------------------------------------------
       6. FAQ ACCORDION
    ---------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Toggle selected
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                } else {
                    // Option to close other FAQs
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    });
                    
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    /* ----------------------------------------------------
       7. MODAL HANDLING & TOAST
    ---------------------------------------------------- */
    const orderModal = document.getElementById('orderModal');
    const trackModal = document.getElementById('trackModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const closeTrackModal = document.getElementById('closeTrackModal');
    const orderTriggers = document.querySelectorAll('.order-btn-trigger');
    const trackTriggers = document.querySelectorAll('.track-btn-trigger');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        const toastMsg = toast.querySelector('.toast-message');
        if (toastMsg) toastMsg.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    };

    // Order Modal Triggers
    orderTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', () => {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Track Modal Triggers
    trackTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            trackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeTrackModal) {
        closeTrackModal.addEventListener('click', () => {
            trackModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (e.target === trackModal) {
            trackModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Form Submissions
    const orderForm = document.getElementById('orderForm');
    const prodImage = document.getElementById('prodImage');
    const fileNameIndicator = document.getElementById('fileNameIndicator');

    if (prodImage && fileNameIndicator) {
        prodImage.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                fileNameIndicator.textContent = e.target.files[0].name;
                fileNameIndicator.style.color = 'var(--color-verde-botanico)';
            } else {
                fileNameIndicator.textContent = 'Chưa chọn';
                fileNameIndicator.style.color = 'var(--color-cinza-texto)';
            }
        });
    }

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const custName = document.getElementById('custName').value;
            const prodLink = document.getElementById('prodLink').value.trim();
            const hasFile = prodImage && prodImage.files && prodImage.files.length > 0;

            // Validate that either a link is entered OR a file is uploaded
            if (!prodLink && !hasFile) {
                showToast("Vui lòng dán link sản phẩm hoặc chọn ảnh.");
                return;
            }
            
            // Simulate API Call
            setTimeout(() => {
                orderForm.reset();
                if (fileNameIndicator) {
                    fileNameIndicator.textContent = 'Chưa chọn';
                    fileNameIndicator.style.color = 'var(--color-cinza-texto)';
                }
                orderModal.classList.remove('active');
                document.body.style.overflow = '';
                showToast(`Cảm ơn ${custName}! Yêu cầu order đã được tiếp nhận.`);
            }, 800);
        });
    }

    /* ----------------------------------------------------
       8. MOCK ORDER TRACKING MECHANISM
    ---------------------------------------------------- */
    const searchTrackBtn = document.getElementById('searchTrackBtn');
    const trackCodeInput = document.getElementById('trackCodeInput');
    const trackResult = document.getElementById('trackResult');

    if (searchTrackBtn && trackCodeInput && trackResult) {
        const doSearch = () => {
            const code = trackCodeInput.value.trim().toUpperCase();
            if (!code) {
                trackResult.innerHTML = `
                    <div class="track-empty-state">
                        <i data-lucide="alert-circle" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--color-accent);"></i>
                        <p>Vui lòng nhập mã đơn hàng.</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            const mockOrders = JSON.parse(localStorage.getItem('tll_mock_orders') || '{}');
            const order = mockOrders[code];

            if (order) {
                let timelineHTML = '';
                order.timeline.forEach((node, i) => {
                    const isActive = i <= order.currentStep ? 'active' : '';
                    timelineHTML += `
                        <div class="timeline-node ${isActive}">
                            <div class="timeline-node-time">${node.time || '--:--'}</div>
                            <div class="timeline-node-title">${node.title}</div>
                            <div class="timeline-node-desc">${node.desc}</div>
                        </div>
                    `;
                });

                let statusText = 'Đang xử lý';
                let statusClass = '';
                if (order.status === 'DELIVERED') {
                    statusText = 'Đã giao hàng';
                    statusClass = 'delivered';
                } else if (order.status === 'IN_TRANSIT') {
                    statusText = 'Đang vận chuyển';
                    statusClass = 'in-transit';
                }

                trackResult.innerHTML = `
                    <div class="track-info-card">
                        <div class="track-info-header">
                            <span class="track-id">${code}</span>
                            <span class="track-status-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="track-detail-row">
                            <span>Sản phẩm:</span>
                            <span>${order.product}</span>
                        </div>
                        <div class="track-detail-row">
                            <span>Cọc thanh toán:</span>
                            <span>${order.payment}</span>
                        </div>
                        <div class="track-detail-row">
                            <span>Ngày đặt cọc:</span>
                            <span>${order.date}</span>
                        </div>
                    </div>
                    <h4 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 15px;">LỘ TRÌNH ĐƠN HÀNG</h4>
                    <div class="track-timeline">
                        ${timelineHTML}
                    </div>
                `;
            } else {
                trackResult.innerHTML = `
                    <div class="track-empty-state">
                        <i data-lucide="help-circle" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--color-grey-dark);"></i>
                        <p>Không tìm thấy thông tin cho mã đơn hàng <strong>${code}</strong>. Thử tra cứu các mã mẫu: TLL-202601, TLL-202602, hoặc TLL-202603.</p>
                    </div>
                `;
            }
            lucide.createIcons();
        };

        searchTrackBtn.addEventListener('click', doSearch);
        trackCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                doSearch();
            }
        });
    }
});

// Helper function to seed mock order information
function seedMockOrders() {
    const defaultMock = {
        'TLL-202601': {
            product: 'Nike Dunk Low Retro Panda (Size 42)',
            payment: 'Đã cọc 50% (1,350,000đ)',
            date: '02/07/2026',
            status: 'DELIVERED',
            currentStep: 5,
            timeline: [
                { time: '02/07/2026 10:14', title: 'Đặt cọc thành công', desc: 'Hệ thống xác nhận cọc tối thiểu 50%.' },
                { time: '02/07/2026 14:30', title: 'Đặt mua sản phẩm', desc: 'The Local Lab hoàn tất thanh toán mua hộ trên Poizon.' },
                { time: '04/07/2026 09:22', title: 'Nhập kho Trung Quốc', desc: 'Sản phẩm đã về đến kho Bằng Tường, kiểm tra ngoại quan thành công.' },
                { time: '06/07/2026 16:45', title: 'Thông quan xuất khẩu', desc: 'Kiện hàng đã hoàn tất thủ tục và đang vận chuyển về Hà Nội.' },
                { time: '08/07/2026 11:00', title: 'Nhập kho Việt Nam', desc: 'Hàng đã cập kho Hà Nội, sẵn sàng giao nội địa.' },
                { time: '09/07/2026 14:12', title: 'Đã giao hàng thành công', desc: 'Khách hàng đồng kiểm và ký nhận nguyên vẹn.' }
            ]
        },
        'TLL-202602': {
            product: 'Supreme Box Logo Tee White (Size L)',
            payment: 'Đã cọc 70% (2,100,000đ)',
            date: '05/07/2026',
            status: 'IN_TRANSIT',
            currentStep: 3,
            timeline: [
                { time: '05/07/2026 16:40', title: 'Đặt cọc thành công', desc: 'Hệ thống xác nhận cọc trước 70%.' },
                { time: '06/07/2026 10:15', title: 'Đặt mua sản phẩm', desc: 'Hoàn thành checkout trên website chính hãng Supreme.' },
                { time: '08/07/2026 15:30', title: 'Nhập kho Trung Quốc', desc: 'Hàng hóa đã cập kho Bằng Tường, tem nhãn đầy đủ.' },
                { time: '09/07/2026 08:00', title: 'Đang vận chuyển về VN', desc: 'Kiện hàng đang làm thủ tục thông quan tại biên giới.' },
                { time: '', title: 'Về kho Hà Nội / Sài Gòn', desc: 'Dự kiến cập kho Việt Nam sau 2 - 3 ngày nữa.' },
                { time: '', title: 'Giao hàng tận nơi', desc: 'Đồng kiểm và thanh toán số dư.' }
            ]
        },
        'TLL-202603': {
            product: 'Bàn Trà Decor Minimalist Walnut',
            payment: 'Đã cọc 100% (4,200,000đ)',
            date: '08/07/2026',
            status: 'CONFIRMED',
            currentStep: 1,
            timeline: [
                { time: '08/07/2026 09:30', title: 'Đặt cọc thành công', desc: 'Xác nhận thanh toán 100% giá trị đơn hàng sẵn.' },
                { time: '09/07/2026 11:20', title: 'Đặt mua sản phẩm', desc: 'Đang liên hệ xưởng sản xuất Taobao để phát hàng.' },
                { time: '', title: 'Nhập kho Trung Quốc', desc: 'Kiểm tra chất lượng gỗ và đóng gói khung gỗ.' },
                { time: '', title: 'Đang vận chuyển về VN', desc: 'Thông quan xuất khẩu.' },
                { time: '', title: 'Về kho Việt Nam', desc: 'Sắp xếp vận chuyển xe tải chuyên dụng nội địa.' },
                { time: '', title: 'Giao hàng tận nơi', desc: 'Bàn giao sản phẩm nguyên vẹn.' }
            ]
        }
    };

    if (!localStorage.getItem('tll_mock_orders')) {
        localStorage.setItem('tll_mock_orders', JSON.stringify(defaultMock));
    }
}
