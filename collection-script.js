// Hamplee - Shared JavaScript

// Product Modal Functions
function openProductModal(title, image, price, description, features) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    document.getElementById('modalTitle').textContent = title;
    const modalImage = document.getElementById('modalImage');
    modalImage.src = image;
    modalImage.alt = title;
    
    // Make modal image clickable to open lightbox
    modalImage.onclick = function() {
        openLightbox(image);
    };
    modalImage.style.cursor = 'zoom-in';
    
    document.getElementById('modalPrice').textContent = 'Starting from ' + price;
    document.getElementById('modalDescription').textContent = description;
    
    // Add features
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = '';
    features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
window.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
        closeProductModal();
    }
});

// Image Lightbox Functions
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

