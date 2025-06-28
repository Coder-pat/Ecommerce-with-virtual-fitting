// Function to preview uploaded images
function previewImage(inputElement, imgId) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.getElementById(imgId);
    img.src = e.target.result;

    // For clothing image: reset size & position
    if (imgId === "clothingImage") {
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

document.getElementById("clothingUpload").addEventListener("change", function () {
  previewImage(this, "clothingImage");
});

// Enable drag and resize for clothing image
interact("#clothingImage")
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

