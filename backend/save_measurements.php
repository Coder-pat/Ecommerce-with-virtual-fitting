<?php
// Connect to your MySQL database
$host = 'localhost';
$db   = 'trendtrade';
$user = 'root';
$pass = ''; // default XAMPP password is empty
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

// Read incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

// Prepare insert
$sql = "INSERT INTO measurements (user_name, height, shoulder_width, hip_width, waist, inseam)
        VALUES (:user_name, :height, :shoulder_width, :hip_width, :waist, :inseam)";
$stmt = $pdo->prepare($sql);

// Bind values
$stmt->execute([
    ':user_name' => $data['userId'] ?? 'guest',
    ':height' => $data['height'],
    ':shoulder_width' => $data['shoulderWidth'],
    ':hip_width' => $data['hip'],
    ':waist' => $data['waist'],
    ':inseam' => $data['inseam'],
]);

echo json_encode(['success' => true, 'message' => 'Data saved']);
?>
