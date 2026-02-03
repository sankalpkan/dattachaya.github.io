document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("festivalTrack");
  if (!track) return;

  let index = 0;
  const cards = track.children;

  setInterval(() => {
    index++;

    if (window.innerWidth <= 768) {
      const width = cards[0].offsetWidth;
      track.style.transform = `translateX(-${index * width}px)`;
    } else {
      track.style.transform = `translateX(-${index * 25}%)`;
    }

    if (index >= cards.length) {
      setTimeout(() => {
        track.style.transition = "none";
        index = 0;
        track.style.transform = "translateX(0)";
        track.offsetHeight;
        track.style.transition = "transform 0.5s ease-in-out";
      }, 600);
    }
  }, 3500);
});
function renderFestivals(data) {
  const track = document.getElementById("festivalTrack");
  if (!track || !data.festivals) return;

  track.innerHTML = "";

  data.festivals.forEach(f => {
    const card = document.createElement("div");
    card.className = "festival-card";
    card.innerHTML = `
      <img src="${f.image}" alt="${f.name}">
      <p>${f.name}</p>
    `;
    track.appendChild(card);
  });
}
