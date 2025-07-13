<?php
header('Content-Type: application/json');
$host = "localhost:3307";
$user = "root";
$pass = "";
$db = "trendtrade";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT name FROM brands"; // assume you have a `brands` table
$result = $conn->query($sql);

$brands = [];
while ($row = $result->fetch_assoc()) {
  $brands[] = $row['name'];
}

echo json_encode($brands);
$conn->close();
?>
