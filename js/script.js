if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-overlay');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1200);
});

const scrollHandlers = [];
let scrollScheduled = false;

function runScrollHandlers() {
    scrollScheduled = false;
    const y = window.scrollY;
    for (let i = 0; i < scrollHandlers.length; i++) scrollHandlers[i](y);
}

function onScroll(handler) {
    scrollHandlers.push(handler);
}

window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(runScrollHandlers);
    }
}, { passive: true });

const greetingElement = document.getElementById('hero-greeting');
const finalText = 'Hi there! 👋';
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

function matrixTypingEffect() {
    let iterations = 0;
    const interval = setInterval(() => {
        greetingElement.textContent = finalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return finalText[index];
                }
                if (char === ' ' || char === '👋') {
                    return char;
                }
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            })
            .join('');

        if (iterations >= finalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 3;
    }, 50);
}

setTimeout(matrixTypingEffect, 500);

let photoTilted = false;
const heroPhoto = document.querySelector('.hero-photo');

onScroll(y => {
    if (!photoTilted && y > 5) {
        heroPhoto.classList.add('tilted');
        photoTilted = true;
    }
});

heroPhoto.addEventListener('mouseenter', () => {
    heroPhoto.classList.remove('tilted');
});

heroPhoto.addEventListener('mouseleave', () => {
    if (photoTilted) {
        heroPhoto.classList.add('tilted');
    }
});

const heroSection = document.getElementById('hero');
if (heroSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
        document.body.classList.toggle('hero-idle', !entries[0].isIntersecting);
    }, { rootMargin: '100px' }).observe(heroSection);
}

let terminalFallen = false;
const decoTerminal = document.querySelector('.deco-terminal');
const heroContent = document.querySelector('.hero-content');

function calculateFallDistance() {
    const heroContentRect = heroContent.getBoundingClientRect();
    const heroContentBottom = heroContentRect.bottom;
    const terminalRect = decoTerminal.getBoundingClientRect();
    const terminalFall = Math.max(0, heroContentBottom - terminalRect.bottom - 50);
    decoTerminal.style.setProperty('--fall-distance', `${terminalFall}px`);
}

calculateFallDistance();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        calculateFallDistance();
        if (typeof measureSections === 'function') measureSections();
    }, 150);
}, { passive: true });

onScroll(y => {
    if (!terminalFallen && y > 5) {
        decoTerminal.classList.add('falling');
        terminalFallen = true;
    }
});

const highlights = document.querySelectorAll('.highlight');
const highlightData = new Map();

highlights.forEach((highlight, index) => {
    const direction = index % 2 === 0 ? 'left' : 'right';
    highlight.setAttribute('data-direction', direction);
    highlightData.set(highlight, {
        hasStarted: false,
        startScroll: 0,
        duration: 100,
        direction: direction
    });
});

function updateHighlights() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    highlights.forEach(highlight => {
        const rect = highlight.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const data = highlightData.get(highlight);

        const triggerPoint = scrollY + windowHeight * 0.8;

        if (!data.hasStarted && triggerPoint >= elementTop) {
            data.hasStarted = true;
            data.startScroll = scrollY;
        }

        if (data.hasStarted) {
            const progress = Math.min(1, Math.max(0, (scrollY - data.startScroll) / data.duration));
            highlight.style.setProperty('--highlight-progress', `${progress * 100}%`);
        }

        if (data.hasStarted && scrollY < data.startScroll - 50) {
            data.hasStarted = false;
            highlight.style.setProperty('--highlight-progress', '0%');
        }
    });
}

onScroll(updateHighlights);
requestAnimationFrame(() => {
    updateHighlights();
});

const journeyTimeline = document.querySelector('.journey-timeline');
const journeyTimelineBack = document.querySelector('.journey-timeline-back');
const journeyTimelineData = {
    hasStarted: false,
    startScroll: 0,
    pageRange: 200
};

function updateJourneyTimeline() {
    if (!journeyTimeline || !journeyTimelineBack) return;

    if (window.innerWidth < 1001) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const rect = journeyTimeline.getBoundingClientRect();
    const elementTop = rect.top + scrollY;

    const triggerPoint = scrollY + windowHeight * 0.5;

    if (!journeyTimelineData.hasStarted && triggerPoint >= elementTop) {
        journeyTimelineData.hasStarted = true;
        journeyTimelineData.startScroll = scrollY;
    }

    if (journeyTimelineData.hasStarted) {
        const progress = Math.min(1, Math.max(0, (scrollY - journeyTimelineData.startScroll) / journeyTimelineData.pageRange));

        const rotateY = 180 - (180 * progress);

        journeyTimeline.style.transform = `rotateY(${rotateY}deg)`;
        journeyTimelineBack.style.transform = `rotateY(${rotateY}deg)`;

        if (rotateY > 95) {

            journeyTimeline.style.zIndex = '1';
            journeyTimelineBack.style.zIndex = '100';
        } else {

            journeyTimeline.style.zIndex = '100';
            journeyTimelineBack.style.zIndex = '1';
        }

        if (progress >= 1) {
            journeyTimeline.style.overflowY = 'auto';
        } else {
            journeyTimeline.style.overflowY = 'hidden';
        }
    } else {

        journeyTimeline.style.transform = 'rotateY(180deg)';
        journeyTimelineBack.style.transform = 'rotateY(180deg)';
        journeyTimeline.style.zIndex = '1';
        journeyTimelineBack.style.zIndex = '100';
        journeyTimeline.style.overflowY = 'hidden';
    }
}

onScroll(updateJourneyTimeline);
requestAnimationFrame(() => {
    updateJourneyTimeline();
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

const navSections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
let sectionBounds = [];
let activeNavId = null;

function measureSections() {
    sectionBounds = navSections.map(section => ({
        id: section.id,
        top: section.offsetTop - 100,
        bottom: section.offsetTop - 100 + section.offsetHeight
    }));
}

measureSections();

onScroll(currentScroll => {
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('navbar-hidden');
    } else if (currentScroll < lastScroll) {
        navbar.classList.remove('navbar-hidden');
    }

    let current = null;
    for (let i = 0; i < sectionBounds.length; i++) {
        const b = sectionBounds[i];
        if (currentScroll >= b.top && currentScroll < b.bottom) { current = b.id; break; }
    }

    if (current && current !== activeNavId) {
        activeNavId = current;
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.toggle('active',
                navLinks[i].getAttribute('href') === `#${current}`);
        }
    }

    lastScroll = currentScroll;
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .timeline-item, .skill-box').forEach(el => {
    observer.observe(el);
});

const loadedAssets = new Map();

function loadScript(src) {
    if (!loadedAssets.has(src)) {
        loadedAssets.set(src, new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = src;
            el.onload = resolve;
            el.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(el);
        }));
    }
    return loadedAssets.get(src);
}

function loadStylesheet(href) {
    if (!loadedAssets.has(href)) {
        loadedAssets.set(href, new Promise(resolve => {
            const el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = href;
            el.onload = resolve;
            el.onerror = resolve;
            document.head.appendChild(el);
        }));
    }
    return loadedAssets.get(href);
}

function whenNear(el, callback, margin = '600px') {
    if (!el) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            io.disconnect();
            callback();
        }
    }, { rootMargin: margin });
    io.observe(el);
}

function initJourneyMap() {

    const initialView = { center: [25.5, 78], zoom: 5 };

    const map = L.map('journey-map', {
        center: initialView.center,
        zoom: initialView.zoom,
        scrollWheelZoom: false,
        zoomControl: true
    });

    L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
        attribution: '© Stamen Design, © OpenStreetMap contributors',
        maxZoom: 16
    }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        opacity: 0.5
    }).addTo(map);

    L.Control.Home = L.Control.extend({
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-home');
            const link = L.DomUtil.create('a', '', container);
            link.href = '#';
            link.title = 'Reset map view';
            link.innerHTML = '<i class="fas fa-home"></i>';

            L.DomEvent.on(link, 'click', function (e) {
                e.preventDefault();
                map.setView(initialView.center, initialView.zoom);
            });

            return container;
        }
    });

    new L.Control.Home({ position: 'topright' }).addTo(map);

    const locations = [
        {
            coords: [24.192581, 85.8957076],
            country: 'Suriya, Giridih, JH',
            companies: [
                {
                    city: 'Suriya, Giridih',
                    company: 'SRK DAV Public School',
                    period: '2021',
                    role: 'Matriculation (10th)'
                }
            ]
        },
        {
            coords: [23.6715811, 86.1500295],
            country: 'Bokaro Steel City, JH',
            companies: [
                {
                    city: 'Sector4, Bokaro Steel City',
                    company: 'DAV Public School, Sector 4',
                    period: '2021 - 2023',
                    role: 'Intermediate (12th)'
                }
            ]
        },
        {
            coords: [28.2649495, 77.0644829],
            country: 'Sohna, Gurugram, HR',
            companies: [
                {
                    city: 'Sohna, Gurugram',
                    company: 'GD Goenka University',
                    period: '2023 - Present',
                    role: 'Bachelor of Tech',
                    course: 'Computer Science & Engineering'
                }
            ]
        },
        {
            coords: [26.8465566, 80.9797793],
            country: 'Lucknow, UP',
            companies: [
                {
                    city: 'Lucknow, UP',
                    company: 'To-Let Globe',
                    period: 'Jul 2025 - Sept 2025',
                    role: 'Tech Research Intern'
                }
            ]
        }
    ];

    const markers = {};

    locations.forEach(location => {
        const isCurrent = location.country === 'Gurugram, Haryana';
        const markerIcon = L.divIcon({
            className: isCurrent ? 'neo-marker neo-marker-current' : 'neo-marker',
            html: `
                        <div class="neo-marker-label ${isCurrent ? 'neo-marker-label-current' : ''}">${location.country}</div>
                        <div class="neo-marker-pin ${isCurrent ? 'neo-marker-pin-current' : ''}"></div>
                    `,
            iconSize: isCurrent ? [35, 35] : [30, 30],
            iconAnchor: isCurrent ? [17.5, 50] : [15, 45],
            popupAnchor: [0, isCurrent ? -50 : -45]
        });

        let popupContent = `<div class="map-popup">`;
        popupContent += `<div class="map-popup-country">${location.country}</div>`;

        location.companies.forEach((company, index) => {
            if (index > 0) popupContent += `<div class="map-popup-divider"></div>`;
            popupContent += `
                        <div class="map-popup-company">
                            <strong>${company.company}</strong>
                            <span>${company.role}</span>
                            ${company.course ? `<span class="map-popup-course">${company.course}</span>` : ''}
                            <small>${company.city}</small>
                            <small>${company.period}</small>
                        </div>
                    `;
        });

        popupContent += `</div>`;

        const marker = L.marker(location.coords, { icon: markerIcon }).addTo(map);
        marker.bindPopup(popupContent);

        markers[location.country] = marker;
    });

    document.querySelectorAll('.timeline-item-flat, .work-card').forEach(item => {
        item.addEventListener('click', () => {
            const country = item.getAttribute('data-country');
            const marker = markers[country];
            if (marker) {
                map.setView(marker.getLatLng(), 6, {
                    animate: true,
                    duration: 1
                });
                setTimeout(() => {
                    marker.openPopup();
                }, 500);
            }
        });
    });
}

whenNear(document.getElementById('journey-map'), () => {
    Promise.all([
        loadStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'),
        loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
    ]).then(initJourneyMap).catch(err => console.error(err));
});

const track = document.getElementById("certificatesTrack")
if (track) {
    track.innerHTML += track.innerHTML
    track.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused"
    })
    track.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running"
    })
}

const educationData = [
    {
        title: 'Bachelor of Technology',
        course: 'Computer Science & Engineering',
        school: 'GD Goenka University',
        period: '2023 - Present',
        location: 'Sohna, Gurugram, HR, IN',
        link: 'https://www.gdgoenkauniversity.com',
        linkLabel: 'Visit University',
        current: true
    },
    {
        title: 'Intermediate (12th)',
        school: 'DAV Public School',
        period: '2021 - 2023',
        location: 'Sector 4, Bokaro Steel City, JH, IN',
        link: 'https://dav4bokaro.org/home/',
        linkLabel: 'Visit School'
    },
    {
        title: 'Matriculate (10th)',
        school: 'SRK DAV Public School',
        period: '2021',
        location: 'Suriya, Giridih, JH, IN',
        link: 'http://davsuriya.com',
        linkLabel: 'Visit School'
    }
];

function initEducationTimeline() {

    const eduTimeline = document.getElementById('eduTimeline');

    if (eduTimeline && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const eduNodesContainer = document.getElementById('eduNodes');
        const eduPathSvg = document.getElementById('eduPathSvg');
        const eduPath = document.getElementById('eduPath');
        const eduFootprintsContainer = document.getElementById('eduFootprints');

        const footIconSvg = `
            <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="24" rx="8" ry="12" fill="currentColor" />
                <circle cx="6" cy="8" r="2.6" fill="currentColor" />
                <circle cx="11.5" cy="5" r="2.9" fill="currentColor" />
                <circle cx="17" cy="6.5" r="2.5" fill="currentColor" />
                <circle cx="21.5" cy="11" r="2" fill="currentColor" />
            </svg>
        `;

        educationData.forEach((edu, index) => {
            const node = document.createElement('div');
            node.className = `edu-node ${index % 2 === 0 ? 'edu-node--left' : 'edu-node--right'}${edu.current ? ' edu-node--current' : ''}`;
            node.dataset.index = index;

            node.innerHTML = `
                <div class="edu-node-dot"></div>
                <div class="card edu-card">
                    <div class="edu-card-header">
                        <div class="edu-card-heading">
                            <h3 class="education-title">${edu.title}</h3>
                            ${edu.course ? `<p class="education-course">${edu.course}</p>` : ''}
                            <p class="education-school">${edu.school}</p>
                        </div>
                        <span class="badge edu-card-badge">${edu.period}</span>
                    </div>
                    <a href="${edu.link}" target="_blank" rel="noopener noreferrer"
                       class="education-location education-location--link"
                       title="${edu.linkLabel}">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${edu.location}</span>
                        <i class="fas fa-arrow-up-right-from-square education-location-ext"></i>
                    </a>
                </div>
            `;

            eduNodesContainer.appendChild(node);
        });

        const originNode = document.createElement('div');
        originNode.className = 'edu-node edu-origin-node';
        originNode.innerHTML = `
            <div class="edu-node-dot edu-node-dot--origin"></div>
            <div class="edu-origin-row">
                <p class="edu-origin-text">Journey begin here - 2005</p>
            </div>
        `;
        eduNodesContainer.appendChild(originNode);

        const allEduNodes = eduNodesContainer.querySelectorAll('.edu-node');

        if (allEduNodes[0]) allEduNodes[0].classList.add('edu-node--visible');

        const eduObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('edu-node--visible');
                    eduObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

        allEduNodes.forEach((node, i) => {
            if (i === 0) return;
            eduObserver.observe(node);
        });

        let eduFootprintEls = [];

        function buildEduPath() {
            const dots = eduNodesContainer.querySelectorAll('.edu-node-dot');
            if (!dots.length) return 0;

            const timelineRect = eduTimeline.getBoundingClientRect();
            const isMobile = window.innerWidth <= 900;
            const centerX = isMobile ? 0 : timelineRect.width / 2;
            const amplitude = isMobile ? 0 : 45;

            const dotYs = Array.from(dots).map(dot => {
                const r = dot.getBoundingClientRect();
                return (r.top + r.height / 2) - timelineRect.top;
            });

            const totalHeight = dotYs[dotYs.length - 1] + 40;

            eduPathSvg.setAttribute('width', timelineRect.width);
            eduPathSvg.setAttribute('height', totalHeight);
            eduPathSvg.style.width = `${timelineRect.width}px`;
            eduPathSvg.style.height = `${totalHeight}px`;

            const points = [];
            dotYs.forEach((y, i) => {
                points.push({ x: centerX, y });
                if (i < dotYs.length - 1) {
                    const midY = (y + dotYs[i + 1]) / 2;
                    const side = i % 2 === 0 ? 1 : -1;
                    points.push({ x: centerX + amplitude * side, y: midY });
                }
            });

            let d = `M ${points[0].x},${points[0].y}`;
            for (let i = 1; i < points.length - 1; i += 2) {
                const ctrl = points[i];
                const end = points[i + 1];
                d += ` Q ${ctrl.x},${ctrl.y} ${end.x},${end.y}`;
            }
            eduPath.setAttribute('d', d);

            eduFootprintsContainer.innerHTML = '';
            eduFootprintEls = [];

            let footIndex = 0;
            for (let i = 0; i < dotYs.length - 1; i++) {
                const y0 = dotYs[i];
                const y1 = dotYs[i + 1];
                const midY = (y0 + y1) / 2;
                const side = i % 2 === 0 ? 1 : -1;
                const ctrlX = centerX + amplitude * side;

                const steps = Math.max(4, Math.round((y1 - y0) / 45));
                for (let s = 1; s < steps; s++) {
                    const t = s / steps;
                    const mt = 1 - t;
                    const x = mt * mt * centerX + 2 * mt * t * ctrlX + t * t * centerX;
                    const y = mt * mt * y0 + 2 * mt * t * midY + t * t * y1;

                    const isRight = footIndex % 2 === 1;
                    const footOffset = isRight ? 10 : -10;

                    const el = document.createElement('div');
                    el.className = `edu-footprint${isRight ? ' edu-footprint--right' : ''}`;
                    el.style.left = `${x + footOffset}px`;
                    el.style.top = `${y}px`;
                    el.style.setProperty('--foot-rotate', `${side * 8}deg`);
                    el.innerHTML = footIconSvg;

                    eduFootprintsContainer.appendChild(el);
                    eduFootprintEls.push({ el, threshold: y / totalHeight });

                    footIndex++;
                }
            }

            return totalHeight;
        }

        let eduScrollTrigger = null;
        let eduLastDirection = 1;

        function initEduScroll() {
            if (eduScrollTrigger) eduScrollTrigger.kill();
            eduLastDirection = 1;
            eduFootprintsContainer.style.setProperty('--edu-base-rotate', '180deg');
            eduFootprintsContainer.style.setProperty('--foot-dir', '1');

            eduScrollTrigger = ScrollTrigger.create({
                trigger: eduTimeline,
                start: 'top 75%',
                end: 'bottom 60%',
                scrub: 0.3,
                onUpdate: (self) => {

                    if (self.direction !== eduLastDirection) {
                        eduLastDirection = self.direction;
                        const goingUp = self.direction === -1;
                        eduFootprintsContainer.style.setProperty(
                            '--edu-base-rotate', goingUp ? '0deg' : '180deg');
                        eduFootprintsContainer.style.setProperty(
                            '--foot-dir', goingUp ? '-1' : '1');
                    }

                    const eduTrailWindow = 3;
                    const reachedCount = eduFootprintEls.filter(fp => self.progress >= fp.threshold).length;
                    const lead = reachedCount - 1;

                    eduFootprintEls.forEach((fp, i) => {
                        const isReached = self.progress >= fp.threshold;
                        const isWithinTrail = i > lead - eduTrailWindow;
                        const visible = isReached && isWithinTrail;

                        const delay = visible
                            ? Math.min(Math.max(lead - i, 0), eduTrailWindow) * 45
                            : 0;
                        if (fp.delay !== delay) {
                            fp.delay = delay;
                            fp.el.style.setProperty('--foot-delay', delay + 'ms');
                        }

                        if (fp.visible !== visible) {
                            fp.visible = visible;
                            fp.el.classList.toggle('edu-footprint--visible', visible);
                        }
                    });
                }
            });
        }

        function refreshEduTimeline() {
            buildEduPath();
            initEduScroll();
            ScrollTrigger.refresh();
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(refreshEduTimeline);
        });

        if (document.readyState !== 'complete') {
            window.addEventListener('load', refreshEduTimeline);
        }

        let eduResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(eduResizeTimeout);
            eduResizeTimeout = setTimeout(refreshEduTimeline, 200);
        });
    }
}

whenNear(document.getElementById('eduTimeline'), () => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js')
        .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'))
        .then(initEducationTimeline)
        .catch(err => console.error(err));
});

const projectsGrid = document.getElementById('projectsGrid');

if (projectsGrid && typeof projectsData !== 'undefined') {
    projectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <div class="project-card-image">
                ${project.image
                ? `<img src="${project.image}" alt="${project.name}">`
                : `<div class="project-card-image-placeholder"><i class="fas fa-image"></i></div>`}
            </div>
            <div class="project-card-body">
                <h3 class="project-card-name">${project.name}</h3>
                <span class="project-card-field">${project.field}</span>
                <p class="project-card-desc">${project.description}</p>
                <div class="project-card-stack">
                    ${project.stack.map(tech => `<span class="project-stack-tag ${getTechTagClass(tech)}">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(card);
    });
}
