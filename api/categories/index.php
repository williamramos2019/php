<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        try {
            if(isset($_GET['id'])) {
                // Get single category
                $query = "SELECT * FROM categories WHERE id = ? LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->bindParam(1, $_GET['id']);
                $stmt->execute();
                $result = $stmt->fetch();
                if($result) {
                    http_response_code(200);
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Category not found"));
                }
            } else {
                // Get all categories
                $query = "SELECT * FROM categories ORDER BY name";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $result = $stmt->fetchAll();
                http_response_code(200);
                echo json_encode($result);
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to get categories"));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name)) {
            try {
                $query = "INSERT INTO categories (id, name, description) 
                        VALUES (UUID(), :name, :description)";
                
                $stmt = $db->prepare($query);
                $stmt->bindParam(":name", $data->name);
                $stmt->bindParam(":description", $data->description ?? null);
                
                if($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Category created successfully"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to create category"));
                }
            } catch(Exception $e) {
                http_response_code(400);
                echo json_encode(array("message" => "Error creating category: " . $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Category name is required"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?>