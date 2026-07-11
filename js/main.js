document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }
  var path = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === path) { link.classList.add('active'); }
  });
});