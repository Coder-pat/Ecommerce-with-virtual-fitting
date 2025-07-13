<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = "localhost:3307";
$user = "root";
$pass = "";
$db = "trendtrade";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST['name'], $_POST['email'], $_POST['password'])) {
        http_response_code(400);
        echo "Missing required fields.";
        exit;
    }

    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password_raw = $_POST['password'];
    $password_hashed = password_hash($password_raw, PASSWORD_DEFAULT);

    // ✅ Check if email already exists
    $check = $conn->prepare("SELECT id FROM customers WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409); // Conflict
        echo "This email is already registered.";
        $check->close();
        $conn->close();
        exit;
    }
    $check->close();

    // ✅ Safe to insert new user
    $stmt = $conn->prepare("INSERT INTO customers (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password_hashed);

    if ($stmt->execute()) {
        echo "Registration successful!";
        exit;
    } else {
        http_response_code(500);
        echo "Error: " . $stmt->error;
        exit;
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo "Only POST requests are allowed.";
}

$conn->close();
?>
