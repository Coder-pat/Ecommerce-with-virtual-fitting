<?php
// save_fitting.php

$host = 'localhost';
$dbname = 'trendtrade';         // replace with your database name
$username = 'root';             // default for XAMPP
$password = '';                 // default for XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['fittingImage'])) {
        $uploadDir = 'fittings/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $imageName = uniqid('fitting_') . '.png';
        $imagePath = $uploadDir . $imageName;

        if (move_uploaded_file($_FILES['fittingImage']['tmp_name'], $imagePath)) {
            $userName = $_POST['userId'] ?? 'anonymous';
            $dressImage = $_POST['productId'] ?? 'unknown';

            // Save to DB
            $stmt = $pdo->prepare("INSERT INTO fittings (user_name, body_image, dress_image) VALUES (?, ?, ?)");
            $stmt->execute([$userName, $imagePath, $dressImage]);

            echo "✅ Success! Image saved and DB updated.";
        } else {
            echo "❌ Failed to move uploaded file.";
        }
    } else {
        echo "⚠️ No image received.";
    }
} else {
    echo "❌ Invalid request method.";
}
