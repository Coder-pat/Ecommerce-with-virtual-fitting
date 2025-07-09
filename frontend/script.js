// Function to preview uploaded images
function previewImage(inputElement, imgId) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.getElementById(imgId);
    img.src = e.target.result;

    // For clothing image: reset size & position
    if (imgId === "dressImage") {
      img.style.width = "150px";
      img.style.transform = "translate(0px, 0px)";
      img.setAttribute("data-x", 0);
      img.setAttribute("data-y", 0);
    }
  };
  reader.readAsDataURL(file);
}

// Handle file inputs
document.getElementById("bodyUpload").addEventListener("change", function () {
  previewImage(this, "bodyImage");
});


// Enable drag and resize for clothing image
interact("#dressImage")
  .draggable({
    onmove: dragMoveListener
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        let y = parseFloat(target.getAttribute("data-y")) || 0;

        
        // Update size
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";

        // Maintain position during resize
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      }
    },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: 50, height: 50 },
        max: { width: 600, height: 800 }
      })
    ],
    inertia: true
  });

// Drag move handler
function dragMoveListener(event) {
  let target = event.target;
  let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

 const dressSrc = localStorage.getItem('selectedDress');
if (dressSrc) {
  const img = document.createElement('img');
  img.src = dressSrc;
  img.id = "dressImage"; // ✅ give it the expected ID
  img.alt = "Selected Dress";
  img.style.position = "absolute"; // ✅ required for z-index
  img.style.zIndex = "2"; // ✅ make sure it's on top
  img.style.width = "150px"; // or whatever default size
  img.setAttribute("data-x", 0);
  img.setAttribute("data-y", 0);
  img.style.transform = "translate(0px, 0px)";
  document.querySelector('.fitting-area').appendChild(img);
}

document.getElementById("bodyUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result;
    document.getElementById("bodyImage").src = base64;

    // Save to localStorage so it can be used in measure.html
    localStorage.setItem("uploadedBody", base64);
  };
  reader.readAsDataURL(file);
});

document.getElementById("bodyUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result;
    const bodyImage = document.getElementById("bodyImage");

    // Display the uploaded image
    bodyImage.src = base64;

    // Save to localStorage for use in measure.html
    localStorage.setItem("uploadedBody", base64);
  };

  reader.readAsDataURL(file);
});

document.getElementById("bodyUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const img = document.getElementById("bodyImage");
      img.src = data.imageUrl; // path from server response
    })
    .catch(err => console.error("Upload error:", err));
});

document.getElementById('saveFittingBtn').addEventListener('click', function () {
  const fittingArea = document.querySelector('.fitting-area');

  html2canvas(fittingArea).then(canvas => {
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('fittingImage', blob, 'fitting.png');
      formData.append('userId', '1'); // You can replace this with dynamic user ID
      formData.append('productId', '123'); // You can replace this with the actual product ID

      fetch('http://localhost:3000/api/fitting/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Fitting uploaded successfully:', data);
        alert('Fitting saved!');
      })
      .catch(error => {
        console.error('Error uploading fitting:', error);
        alert('Error uploading fitting');
      });
    }, 'image/png');
  });
});

function saveFitting() {
  const bodyImg = document.getElementById("bodyImage").src;
  const dressImg = document.getElementById("dressImage").src;

  fetch("http://localhost/trendtrade/save_fitting.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: "Abena",
      bodyImage: bodyImg,
      dressImage: dressImg,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Fitting saved successfully!");
      } else {
        alert("Error: " + data.error);
      }
    });
}
