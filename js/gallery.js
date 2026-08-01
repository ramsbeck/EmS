var loadedGalleryImages = {};
var galleryPageSize = 9;
var galleryLoadState = {};

function initGallery(galleryId) {
  var container = document.getElementById(galleryId);
  if (!container) return;
  var images = galleryConfig[galleryId] || [];
  if (images.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#7f8c8d;">Noch keine Bilder vorhanden.</p>';
    return;
  }
  loadedGalleryImages[galleryId] = [];
  galleryLoadState[galleryId] = 0;
  container.innerHTML = '';
  var loadBtnWrap = null;
  var loading = false;

  function appendImg(src) {
    var index = loadedGalleryImages[galleryId].length - 1;
    var img = document.createElement('img');
    img.src = 'gallery/' + galleryId + '/' + src;
    img.alt = 'Foto ' + (index + 1);
    img.loading = 'lazy';
    img.dataset.index = index;
    img.addEventListener('click', function() { openLightbox(galleryId, index); });
    container.appendChild(img);
  }

  function updateButton() {
    var remaining = images.length - (galleryLoadState[galleryId] || 0);
    if (!loadBtnWrap) {
      if (remaining <= 0) return;
      loadBtnWrap = document.createElement('div');
      loadBtnWrap.style.textAlign = 'center';
      loadBtnWrap.style.marginTop = '32px';
      var btn = document.createElement('button');
      btn.className = 'btn btn-dark';
      btn.id = galleryId + '-load-more';
      btn.addEventListener('click', function() {
        if (loading) return;
        loadNextBatch();
      });
      loadBtnWrap.appendChild(btn);
      container.parentNode.appendChild(loadBtnWrap);
    }
    var btn = loadBtnWrap.querySelector('button');
    if (remaining > 0) {
      btn.textContent = 'Weitere ' + Math.min(remaining, galleryPageSize) + ' Bilder laden';
    } else {
      loadBtnWrap.remove();
      loadBtnWrap = null;
    }
  }

  function loadNextBatch() {
    if (loading) return;
    loading = true;
    var start = galleryLoadState[galleryId] || 0;
    var batch = images.slice(start, start + galleryPageSize);
    galleryLoadState[galleryId] = start + batch.length;
    var pending = batch.length;
    if (pending === 0) {
      loading = false;
      if (loadBtnWrap) loadBtnWrap.remove();
      return;
    }
    batch.forEach(function(src) {
      var probe = new Image();
      probe.onload = function() {
        loadedGalleryImages[galleryId].push(src);
        appendImg(src);
        done();
      };
      probe.onerror = function() {
        done();
      };
      probe.src = 'gallery/' + galleryId + '/' + src;
    });
    function done() {
      pending--;
      if (pending === 0) {
        loading = false;
        updateButton();
      }
    }
  }

  loadNextBatch();
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