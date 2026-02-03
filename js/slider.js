fetch("data/slider.json")
  .then(res => res.json())
  .then(images => initHeroSlider(images));

function initHeroSlider(images) {
  const slider = document.getElementById("heroSlider");
  let index = 0;

  images.forEach((img, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " active" : "");
    slide.style.backgroundImage = `url(${img})`;
    slider.appendChild(slide);
  });

  const slides = document.querySelectorAll(".slide");

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 4000);
}
