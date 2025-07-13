document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent page reload
    registerUser();     // Call your function
  });
});

function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  fetch("../backend/customer.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
})
  .then(async (response) => {
    const result = await response.text();

    // Log for debugging
    console.log("Status:", response.status);
    console.log("Response:", result);

    // ✅ Handle duplicate email
    if (response.status === 409) {
      alert("This email is already registered. Please use a different one.");
      return;
    }

    // ❌ Handle all other server errors
    if (!response.ok) {
      throw new Error(result); // Will be caught below
    }

    // ✅ Successful registration
    alert(result);

    if (result.toLowerCase().includes("successful")) {
      const formattedName = capitalizeWords(name);
      sessionStorage.setItem("username", formattedName);
      window.location.href = "brands.html";
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    alert("An error occurred: " + error.message);
  });

}


// Helper to capitalize first letter of each word
function capitalizeWords(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
