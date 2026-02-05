document.querySelectorAll(".auto-carousel").forEach(track => {

  const SPEED = 15;
  const INTERVAL = 30;
  const RESTART_DELAY = 2000;

  let direction = 1; // 1 = right, -1 = left
  let timer = null;
  let restartTimeout = null;

  function startAuto() {
    stopAuto(); // safety
    timer = setInterval(() => {
      track.scrollLeft += SPEED * direction;

      // loop
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
        track.scrollLeft = 0;
      }
      if (track.scrollLeft <= 0 && direction === -1) {
        track.scrollLeft = track.scrollWidth;
      }
    }, INTERVAL);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function restartAuto() {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(startAuto, RESTART_DELAY);
  }

  // Start on load
  startAuto();

  // Pause on manual scroll / drag
  track.addEventListener("mousedown", stopAuto);
  track.addEventListener("touchstart", stopAuto);
  track.addEventListener("wheel", stopAuto, { passive: true });

  track.addEventListener("mouseup", restartAuto);
  track.addEventListener("touchend", restartAuto);
  track.addEventListener("mouseleave", restartAuto);
  track.addEventListener("scroll", restartAuto);

  // 🔥 ARROWS (the important part)
  document.querySelectorAll(`.carousel-arrow[data-target="${track.id}"]`)
    .forEach(btn => {

      btn.addEventListener("click", () => {

        stopAuto();
        clearTimeout(restartTimeout);

        const firstItem = track.children[0];
        if (!firstItem) return;

        const gap = 16;
        const move = firstItem.offsetWidth + gap;

        if (btn.classList.contains("left")) {
          direction = -1;
          track.scrollLeft -= move;
        } else {
          direction = 1;
          track.scrollLeft += move;
        }

        restartAuto();
      });
    });

});
/* ================= LIGHTBOX (IMAGE CLICK) ================= */

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (!lightbox || !lightboxImg) return;

  // Open lightbox when ANY gallery image is clicked
  document.querySelectorAll(".gallery-grid img").forEach(img => {
    img.addEventListener("click", e => {
      e.stopPropagation(); // prevent drag interference
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
    });
  });

  // Close on X
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  });

  // Close on background click
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
    }
  });
});

/* ================= LIGHTBOX ZOOM & PAN ================= */

(() => {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  if (!lightbox || !img) return;

  let scale = 1;
  let lastScale = 1;
  let startDistance = 0;

  let posX = 0;
  let posY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  function updateTransform() {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  function resetZoom() {
    scale = 1;
    lastScale = 1;
    posX = 0;
    posY = 0;
    updateTransform();
  }

  /* Reset on close */
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) resetZoom();
  });

  document.getElementById("lightboxClose")?.addEventListener("click", resetZoom);

  /* ===== Desktop: Scroll to Zoom ===== */
  lightbox.addEventListener("wheel", e => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(1, scale), 4);
    updateTransform();
  }, { passive: false });

  /* ===== Desktop: Drag to Pan ===== */
  img.addEventListener("mousedown", e => {
    if (scale === 1) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    img.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    img.style.cursor = "grab";
  });

  /* ===== Mobile: Pinch to Zoom ===== */
  img.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      startDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      lastScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      startX = e.touches[0].pageX - posX;
      startY = e.touches[0].pageY - posY;
    }
  }, { passive: true });

  img.addEventListener("touchmove", e => {
    if (e.touches.length === 2) {
      const newDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      scale = Math.min(Math.max(1, lastScale * (newDistance / startDistance)), 4);
      updateTransform();
    } else if (e.touches.length === 1 && scale > 1) {
      posX = e.touches[0].pageX - startX;
      posY = e.touches[0].pageY - startY;
      updateTransform();
    }
  }, { passive: true });

  /* Double tap to reset */
  let lastTap = 0;
  img.addEventListener("touchend", () => {
    const now = Date.now();
    if (now - lastTap < 300) resetZoom();
    lastTap = now;
  });

  /* Cursor hint */
  img.style.cursor = "grab";
})();
