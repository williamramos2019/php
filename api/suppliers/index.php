<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Supplier.php';

$database = new Database();
$db = $database->getConnection();
$supplier = new Supplier($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single supplier
            $result = $supplier->getById($_GET['id']);
            if($result) {
                http_response_code(200);
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Supplier not found"));
            }
        } else {
            // Get all suppliers
            $result = $supplier->getAll();
            http_response_code(200);
            echo json_encode($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->email)) {
            $supplier->name = $data->name;
            $supplier->email = $data->email;
            $supplier->phone = $data->phone ?? null;
            $supplier->address = $data->address ?? null;
            $supplier->document = $data->document ?? null;
            
            if($supplier->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Supplier created successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create supplier"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $supplier->id = $data->id;
            $supplier->name = $data->name;
            $supplier->email = $data->email;
            $supplier->phone = $data->phone ?? null;
            $supplier->address = $data->address ?? null;
            $supplier->document = $data->document ?? null;
            
            if($supplier->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Supplier updated successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update supplier"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID required"));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $supplier->id = $data->id;
            
            if($supplier->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Supplier deleted successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete supplier"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID required"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?>