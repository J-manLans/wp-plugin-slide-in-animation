function initTransitionFadeIn() {
    // If user opt out of animations
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elems = document.querySelectorAll('[data-slide]');
    if (!elems.length) return;

    // Helper: determine breakpoint key
    function currentBreakpoint() {
        if (window.matchMedia('(max-width: 767px)').matches) return 'Sm';
        if (window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) return 'Md';
        return '';
    }

    elems.forEach(el => {
        // load default values
        const direction = el.dataset.slideDirection;
        const threshold = parseFloat(el.dataset.slideThreshold);
        let speed = parseFloat(el.dataset.slideSpeed);
        let distance = parseFloat(el.dataset.slideDistance);

        // Responsive overloads for different screen sizes
        const bp = currentBreakpoint();
        let speedParsed;
        let distanceParsed;

        if (bp == 'Md') {
            speedParsed = parseFloat(el.dataset.slideSpeedMd);
            speed = isNaN(speedParsed) ? speed : speedParsed;

            distanceParsed = parseFloat(el.dataset.slideDistanceMd);
            distance = isNaN(distanceParsed) ? distance : distanceParsed;
        } else if (bp == 'Sm') {
            speedParsed = parseFloat(el.dataset.slideSpeedSm);
            speed = isNaN(speedParsed)
                ? (isNaN(parseFloat(el.dataset.slideSpeedMd)) ? speed : parseFloat(el.dataset.slideSpeedMd))
                : speedParsed;

            distanceParsed = parseFloat(el.dataset.slideDistanceSm);
            distance = isNaN(distanceParsed)
                ? (isNaN(parseFloat(el.dataset.slideDistanceMd)) ? distance : parseFloat(el.dataset.slideDistanceMd))
                : distanceParsed;
        }

        // Init styles before observing
        switch (direction) {
            case 'right': el.style.transform = `translateX(${distance}%)`; break;
            case 'up': el.style.transform = `translateY(-${distance}%)`; break;
            case 'down': el.style.transform = `translateY(${distance}%)`; break;
            default: el.style.transform = `translateX(-${distance}%)`;
        }
        el.style.opacity = 0;
        el.style.transition = `opacity ${speed}s ease, transform ${speed}s ease`;

        // Create observer per element to allow per-element threshold
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    if (direction == 'right' || direction == 'left') {
                        entry.target.style.transform = 'translateX(0)';
                    } else {
                        entry.target.style.transform = 'translateY(0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: threshold });

        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTransitionFadeIn();
});
