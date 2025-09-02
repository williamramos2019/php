<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch($method) {
    case 'GET':
        try {
            if(strpos($path, '/low-stock') !== false) {
                // Get low stock products
                $query = "SELECT p.*, c.name as category_name 
                        FROM products p 
                        LEFT JOIN categories c ON p.category_id = c.id 
                        WHERE p.quantity <= p.min_stock 
                        ORDER BY p.name";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $result = $stmt->fetchAll();
            } elseif(isset($_GET['id'])) {
                // Get single product
                $query = "SELECT p.*, c.name as category_name 
                        FROM products p 
                        LEFT JOIN categories c ON p.category_id = c.id 
                        WHERE p.id = ? LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->bindParam(1, $_GET['id']);
                $stmt->execute();
                $result = $stmt->fetch();
            } else {
                // Get all products
                $query = "SELECT p.*, c.name as category_name 
                        FROM products p 
                        LEFT JOIN categories c ON p.category_id = c.id 
                        ORDER BY p.name";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $result = $stmt->fetchAll();
            }
            
            http_response_code(200);
            echo json_encode($result);
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to get products"));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->code)) {
            try {
                $query = "INSERT INTO products 
                        (id, code, name, description, category_id, unit_price, quantity, min_stock, is_rentable) 
                        VALUES (UUID(), :code, :name, :description, :category_id, :unit_price, :quantity, :min_stock, :is_rentable)";
                
                $stmt = $db->prepare($query);
                
                $stmt->bindParam(":code", $data->code);
                $stmt->bindParam(":name", $data->name);
                $stmt->bindParam(":description", $data->description ?? null);
                $stmt->bindParam(":category_id", $data->category_id ?? null);
                $stmt->bindParam(":unit_price", $data->unit_price ?? 0);
                $stmt->bindParam(":quantity", $data->quantity ?? 0);
                $stmt->bindParam(":min_stock", $data->min_stock ?? 0);
                $stmt->bindParam(":is_rentable", $data->is_rentable ?? true);
                
                if($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Product created successfully"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to create product"));
                }
            } catch(Exception $e) {
                http_response_code(400);
                echo json_encode(array("message" => "Error creating product: " . $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?>