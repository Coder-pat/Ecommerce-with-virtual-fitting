function sendDressToVirtual() {
    const dressSrc = document.getElementById('dressImage').src;
    localStorage.setItem('selectedDress', dressSrc);
    window.location.href = "/virtual.html";
  }

  // Load the selected image from localStorage
  window.onload = function () {
    const imageSrc = localStorage.getItem("selectedDressImage");
    if (imageSrc) {
      document.getElementById("dressImage").src = imageSrc;
    } else {
      // Optional fallback image
      document.getElementById("dressImage").src = "images/default-dress.jpg";
    }
  };
