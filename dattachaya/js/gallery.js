fetch("data/gallery.json")
  .then(res => res.json())
  .then(images => initGallery(images));

function initGallery(images) {
  const grid = document.getElementById("galleryGrid");
  const dotsContainer = document.getElementById("galleryDots");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  let index = 0;
  let interval;
  let isPaused = false;

  const allImages = [...images, ...images];

  /* ---------- Render Images ---------- */
  allImages.forEach((img, i) => {
    const box = document.createElement("div");
    box.className = "img-box";

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.alt;

    box.addEventListener("click", () => {
      pauseSlider();
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
    });

    box.appendChild(image);
    grid.appendChild(box);
  });

  /* ---------- Pagination Dots (mobile) ---------- */
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    const dots = dotsContainer.children;
    [...dots].forEach(d => d.classList.remove("active"));
    dots[index % images.length]?.classList.add("active");
  }

  /* ---------- Slide Logic ---------- */
  function slideNext() {
    if (isPaused) return;

    index++;

    if (window.innerWidth <= 768) {
      const slideWidth = grid.children[0].offsetWidth;
      grid.style.transform = `translateX(-${index * slideWidth}px)`;
    } else {
      grid.style.transform = `translateX(-${index * 25}%)`;
    }

    updateDots();

    if (index === images.length) {
      setTimeout(resetSlider, 500);
    }
  }

  function resetSlider() {
    grid.style.transition = "none";
    index = 0;
    grid.style.transform = "translateX(0)";
    grid.offsetHeight;
    grid.style.transition = "transform 0.4s ease-in-out";
  }

  function startSlider() {
    interval = setInterval(slideNext, 3000);
  }

  function pauseSlider() {
    isPaused = true;
    clearInterval(interval);
  }

  /* ---------- Lightbox Close ---------- */
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    isPaused = false;
    startSlider();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Swipe Support ---------- */
  let startX = 0;

  grid.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  grid.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      pauseSlider();
      if (diff > 0) index++;
      else index--;

      if (index < 0) index = images.length - 1;

      slideNext();
      startSlider();
    }
  });

  /* ---------- Init ---------- */
  startSlider();
}
