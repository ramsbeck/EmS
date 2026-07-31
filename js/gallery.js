var loadedGalleryImages = {};

function initGallery(galleryId) {
  var container = document.getElementById(galleryId);
  if (!container) return;
  var images = galleryConfig[galleryId] || [];
  if (images.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">Noch keine Bilder vorhanden.</p>';
    return;
  }
  loadedGalleryImages[galleryId] = [];
  container.innerHTML = '';
  var pending = images.length;
  images.forEach(function(src) {
    var probe = new Image();
    probe.onload = function() {
      loadedGalleryImages[galleryId].push(src);
      checkDone();
    };
    probe.onerror = function() {
      checkDone();
    };
    probe.src = 'gallery/' + galleryId + '/' + src;
  });
  function checkDone() {
    pending--;
    if (pending === 0) {
      renderGallery(galleryId, container);
    }
  }
}

function renderGallery(galleryId, container) {
  var loaded = loadedGalleryImages[galleryId] || [];
  if (loaded.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">Noch keine Bilder vorhanden.</p>';
    return;
  }
  loaded.forEach(function(src, index) {
    var img = document.createElement('img');
    img.src = 'gallery/' + galleryId + '/' + src;
    img.alt = 'Foto ' + (index + 1);
    img.loading = 'lazy';
    img.dataset.index = index;
    img.addEventListener('click', function() { openLightbox(galleryId, index); });
    container.appendChild(img);
  });
}

function openLightbox(galleryId, index) {
  var images = loadedGalleryImages[galleryId] || [];
  if (!images[index]) return;
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.add('active');
  lightboxImg.src = 'gallery/' + galleryId + '/' + images[index];
  lightbox.dataset.gallery = galleryId;
  lightbox.dataset.index = index;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox || !lightbox.classList.contains('active')) return;
  var galleryId = lightbox.dataset.gallery;
  var images = loadedGalleryImages[galleryId] || [];
  var index = parseInt(lightbox.dataset.index) + direction;
  if (index < 0) index = images.length - 1;
  if (index >= images.length) index = 0;
  var lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = 'gallery/' + galleryId + '/' + images[index];
  lightbox.dataset.index = index;
}

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
});