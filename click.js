function sendDressToVirtual() {
    const dressSrc = document.getElementById('dressImage').src;
    localStorage.setItem('selectedDress', dressSrc);
    window.location.href = "/virtual.html";
  }

   window.onload = function () {
    const imageSrc = localStorage.getItem("selectedDressImage");

    if (imageSrc) {
      const dressImg = document.getElementById("dressImage");
      dressImg.src = imageSrc;
      dressImg.alt = "Selected Dress";

      // Optional: Clear the localStorage after loading
      // localStorage.removeItem("selectedDressImage");
    } else {
      console.warn("No image found in localStorage.");
    }
  };