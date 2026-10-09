(function () {
    // 1. Stats marquee animation (Safe initialization check included)
    const section = document.getElementById('statsSection');
    const track = document.getElementById('statsTrack');
    const slider = document.getElementById('reviewsSlider');
    if (!slider) return;

    new Swiper('#reviewsSlider', {
        loop: true,
        spaceBetween: 16,
        slidesPerView: 1, // Default: Mobile par 1 card
        speed: 600,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        pagination: {
            el: '#reviewsDots',
            clickable: true
        },
        breakpoints: {
            // Tablet / Small Laptop: 2 cards
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // Desktop: 3 cards
            992: {
                slidesPerView: 3,
                spaceBetween: 24
            }
        }
    });
    const featured = {
        box: document.getElementById('featured'),
        text: document.getElementById('featuredText'),
        img: document.getElementById('featuredImg'),
        name: document.getElementById('featuredName')
    };

    // Featured block sirf tab chalega jab HTML mein ho
    if (featured.box) {
        slider.addEventListener('click', (e) => {
            const card = e.target.closest('.t-card');
            if (!card) return;
            featured.text.textContent = card.querySelector('.t-text').textContent;
            featured.name.textContent = card.dataset.name;
            featured.img.src = card.dataset.img;
            featured.box.animate(
                [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
                { duration: 500, easing: 'ease-out' }
            );
        });
    }

    if (section && track) {
        const original = track.querySelector('.stat-set');
        const SPEED = 80;
        let animation = null;

        function build() {
            track.querySelectorAll('.stat-set.clone').forEach(el => el.remove());
            if (animation) { animation.pause(); animation = null; }
            anime.set(track, { translateX: 0 });

            const setWidth = original.getBoundingClientRect().width;
            const needed = section.clientWidth + setWidth;
            while (track.scrollWidth < needed) {
                const clone = original.cloneNode(true);
                clone.classList.add('clone');
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            }

            animation = anime({
                targets: track,
                translateX: -setWidth,
                duration: (setWidth / SPEED) * 1000,
                easing: 'linear',
                loop: true
            });
        }

        section.addEventListener('mouseenter', () => animation && animation.pause());
        section.addEventListener('mouseleave', () => animation && animation.play());
        section.addEventListener('touchstart', () => animation && animation.pause(), { passive: true });
        section.addEventListener('touchend', () => animation && animation.play());

        (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);

        let t;
        window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 200); });
    }

    const carouselEl = document.getElementById('whyCarousel');
    const bars = document.querySelectorAll('#barIndicators button');
    const slides = document.querySelectorAll('#textSlides .text-slide');

    if (!carouselEl) return;

    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: 2000,
        pause: false
    });

    function syncSlides(targetIndex) {
        // Update bar indicators
        bars.forEach((b, i) => b.classList.toggle('active', i === targetIndex));

        // Swap text slides using only opacity/visibility — never touch display
        // This prevents any layout reflow that causes the page blink
        slides.forEach((s, i) => {
            if (i === targetIndex) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    // Carousel Slide Change Event
    carouselEl.addEventListener('slide.bs.carousel', function (e) {
        syncSlides(e.to);
    });

    // Bar Indicators Click Event
    bars.forEach((button, index) => {
        button.addEventListener('click', function () {
            carousel.to(index);
            syncSlides(index);
        });
    });

    // Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('animate__animated', el.dataset.animate);
            observer.unobserve(el);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

})();