document.addEventListener("DOMContentLoaded", () => {
  // Example: capture brand name click and store it
  const brandLinks = document.querySelectorAll(".brand");

  brandLinks.forEach((brand) => {
    brand.addEventListener("click", () => {
      const selectedBrand = brand.textContent;
      localStorage.setItem("selectedBrand", selectedBrand);
      console.log("Selected brand:", selectedBrand);
    });
  });

  // ✅ First get the username
  const username = sessionStorage.getItem("username");

  // ✅ Then log it
  console.log("Loaded username from session:", username);

  // ✅ Then show it
  if (username) {
    document.querySelector(".center-text").textContent = `Welcome ${username}!`;
  }
});


fetch("../backend/brands.php")
  .then((res) => res.json())
  .then((brands) => {
    const brandContainer = document.querySelector(".brand-select");
    brandContainer.innerHTML = ""; // Clear hardcoded brands
    brands.forEach((name) => {
      const div = document.createElement("div");
      div.className = "brand";
      div.textContent = name;
      const link = document.createElement("a");
      link.href = "/home.html";
      link.appendChild(div);
      brandContainer.appendChild(link);
    });
  })
  .catch((err) => console.error("Failed to load brands:", err));

