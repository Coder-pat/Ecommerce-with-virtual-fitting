document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form reload
    loginUser();        // Call the function
  });
});

function loginUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  // Send POST request to backend
  fetch("../backend/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
    .then((res) => res.text())
    .then((response) => {
      if (response.includes("Login successful")) {
        alert(response);
        // Redirect to dashboard or homepage
        window.location.href = "/brands.html";
      } else {
        alert(response);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    });
}

// After successful login (in login.js)
sessionStorage.setItem("username", "Abena");
window.location.href = "brands.html";
