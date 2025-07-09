 document.querySelectorAll(".trend img").forEach((img) => {
    img.addEventListener("click", () => {
      const fullSrc = img.src; // Get full path of the image
      localStorage.setItem("selectedDressImage", fullSrc);
    });
  });