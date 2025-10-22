// ============================================
// BACKGROUND ELEMENTS - SCROLL-BASED MOVEMENT
// ============================================

// Check if user prefers reduced motion
function checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Scroll tracking
let scrollPosition = 0;
const elementMovementData = new Map();
const maxMovementDistance = 20;

let activeLogos = 0;
const maxLogos = 10;

// ============================================
// BACKGROUND LOGO FUNCTIONS
// ============================================

function createBackgroundLogo() {
    if (activeLogos >= maxLogos) {
        return;
    }
    
    const logo = document.createElement('div');
    logo.classList.add('background-logo');
    
    const size = 50 + Math.random() * 100;
    logo.style.width = `${size}px`;
    logo.style.height = `${size}px`;
    
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    
    const posX = Math.random() * maxX;
    const posY = Math.random() * maxY;
    
    logo.style.left = `${posX}px`;
    logo.style.top = `${posY}px`;
    
    const animationDuration = 6000 + Math.random() * 6000;
    const animationDelay = Math.random() * 5000;
    
    logo.style.animationDuration = `${animationDuration}ms`;
    logo.style.animationDelay = `${animationDelay}ms`;
    
    document.body.appendChild(logo);
    activeLogos++;
    
    // Store movement data BEFORE animation starts
    storeElementMovementData(logo, 'logo', posX, posY, size);
    
    setTimeout(() => {
        logo.remove();
        elementMovementData.delete(logo);
        activeLogos--;
        
        if (activeLogos < maxLogos) {
            setTimeout(() => {
                if (activeLogos < maxLogos) {
                    createBackgroundLogo();
                }
            }, 1000);
        }
    }, animationDuration + animationDelay);
}

// ============================================
// BACKGROUND CODE IMAGE FUNCTIONS
// ============================================

const activeCodeImagePositions = [];
let activeCodeImages = 0;
const maxCodeImages = 4;

function isOverlapping(posX, posY, size) {
    const buffer = 50;
    const newRect = { x: posX, y: posY, width: size, height: size };
    
    for (const position of activeCodeImagePositions) {
        if (newRect.x < position.x + position.width + buffer &&
            newRect.x + newRect.width + buffer > position.x &&
            newRect.y < position.y + position.height + buffer &&
            newRect.y + newRect.height + buffer > position.y) {
            return true;
        }
    }
    return false;
}

function addCodeImagePosition(id, posX, posY, size) {
    activeCodeImagePositions.push({ id, x: posX, y: posY, width: size, height: size });
}

function removeCodeImagePosition(id) {
    const index = activeCodeImagePositions.findIndex(pos => pos.id === id);
    if (index !== -1) {
        activeCodeImagePositions.splice(index, 1);
    }
}

function createBackgroundCodeImage() {
    const codeImages = [
        'images/randomcodepics/csharp1.png',
        'images/randomcodepics/csharp2.png',
        'images/randomcodepics/eng1.png',
        'images/randomcodepics/eng2.png',
        'images/randomcodepics/eng3.png',
        'images/randomcodepics/flutter1.png',
        'images/randomcodepics/flutter3.png',
        'images/randomcodepics/flutter4.png',
        'images/randomcodepics/html1.png',
        'images/randomcodepics/html2.png',
        'images/randomcodepics/html3.png'
    ];
    
    const codeImageId = 'code-img-' + Date.now() + Math.random();
    const randomImage = codeImages[Math.floor(Math.random() * codeImages.length)];
    
    const size = 400 + Math.random() * 600;
    
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    
    let posX, posY;
    let attempts = 0;
    const maxAttempts = 20;
    
    do {
        posX = Math.random() * maxX;
        posY = Math.random() * maxY;
        attempts++;
    } while (attempts < maxAttempts && isOverlapping(posX, posY, size));
    
    const codeImage = document.createElement('div');
    codeImage.classList.add('background-code-image');
    codeImage.style.backgroundImage = `url('${randomImage}')`;
    codeImage.style.width = `${size}px`;
    codeImage.style.height = `${size}px`;
    codeImage.style.left = `${posX}px`;
    codeImage.style.top = `${posY}px`;
    
    const animationDuration = 8000 + Math.random() * 5000;
    const animationDelay = Math.random() * 3000;
    
    codeImage.style.animationDuration = `${animationDuration}ms`;
    codeImage.style.animationDelay = `${animationDelay}ms`;
    
    document.body.appendChild(codeImage);
    
    if (!isOverlapping(posX, posY, size)) {
        addCodeImagePosition(codeImageId, posX, posY, size);
    }
    
    // Store movement data
    storeElementMovementData(codeImage, 'code-image', posX, posY, size);
    
    setTimeout(() => {
        codeImage.remove();
        elementMovementData.delete(codeImage);
        removeCodeImagePosition(codeImageId);
    }, animationDuration + animationDelay);
}

function manageBackgroundCodeImages() {
    if (activeCodeImages < maxCodeImages) {
        createBackgroundCodeImage();
        activeCodeImages++;
        
        setTimeout(() => {
            activeCodeImages--;
        }, 8000 + Math.random() * 5000 + Math.random() * 3000);
    }
    
    setTimeout(manageBackgroundCodeImages, 2000 + Math.random() * 3000);
}

// ============================================
// MOVEMENT DATA & SCROLL HANDLER
// ============================================

function getRandomMovementDirection() {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * maxMovementDistance;
    return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        angle: angle
    };
}

function storeElementMovementData(element, type, posX, posY, size) {
    const movementDirection = getRandomMovementDirection();
    
    elementMovementData.set(element, {
        type: type,
        basePosition: { x: posX, y: posY },
        movementDirection: movementDirection,
        size: size,
        id: `${type}-${Date.now()}-${Math.random()}`
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -rect.height &&
        rect.left >= -rect.width &&
        rect.bottom <= (window.innerHeight + rect.height) ||
        document.documentElement.clientHeight + rect.height &&
        rect.right <= (window.innerWidth + rect.width) ||
        document.documentElement.clientWidth + rect.width
    );
}

function updateBackgroundElementPositions() {
    if (checkReducedMotion()) {
        return;
    }
    
    elementMovementData.forEach((data, element) => {
        // Sadece viewport'ta olan elementleri hareket ettir
        if (isElementInViewport(element)) {
            // Scroll position'ı normalize et
            const scrollFactor = scrollPosition * 0.003;
            
            // Hareket hesapla
            const moveMultiplier = 8;
            const offsetX = Math.sin(scrollFactor + data.movementDirection.angle) * 
                           data.movementDirection.x * moveMultiplier;
            const offsetY = Math.cos(scrollFactor + data.movementDirection.angle) * 
                           data.movementDirection.y * moveMultiplier;
            
            // Transform'u sadece position için kullan
            element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        } else {
            element.style.transform = 'translate(0px, 0px)';
        }
    });
}

// ============================================
// SCROLL EVENT LISTENER
// ============================================

window.addEventListener('scroll', function() {
    scrollPosition = window.pageYOffset;
    updateBackgroundElementPositions();
}, { passive: true });

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    if (checkReducedMotion()) {
        const style = document.createElement('style');
        style.innerHTML = '* { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }';
        document.head.appendChild(style);
    }
    
    // Background logoları oluştur
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createBackgroundLogo();
        }, Math.random() * 2000);
    }
    
    // Düzenli olarak logoları kontrol et
    setInterval(() => {
        if (activeLogos < maxLogos) {
            createBackgroundLogo();
        }
    }, 2000);
    
    // Background kod resimlerini yönet
    manageBackgroundCodeImages();
    
    // Window resize handling
    window.addEventListener('resize', function() {
        const existingLogos = document.querySelectorAll('.background-logo');
        existingLogos.forEach(logo => logo.remove());
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createBackgroundLogo();
            }, Math.random() * 2000);
        }
    });
});