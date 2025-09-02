<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../models/Rental.php';

$database = new Database();
$db = $database->getConnection();
$rental = new Rental($db);

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch($method) {
    case 'GET':
        if(strpos($path, '/active') !== false) {
            // Get active rentals
            $result = $rental->getActive();
            http_response_code(200);
            echo json_encode($result);
        } elseif(strpos($path, '/overdue') !== false) {
            // Get overdue rentals
            $result = $rental->getOverdue();
            http_response_code(200);
            echo json_encode($result);
        } elseif(isset($_GET['id'])) {
            // Get single rental
            $result = $rental->getById($_GET['id']);
            if($result) {
                http_response_code(200);
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Rental not found"));
            }
        } else {
            // Get all rentals
            $result = $rental->getAll();
            http_response_code(200);
            echo json_encode($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->supplier_id) && !empty($data->equipment_name)) {
            $rental->supplier_id = $data->supplier_id;
            $rental->equipment_name = $data->equipment_name;
            $rental->equipment_type = $data->equipment_type ?? null;
            $rental->quantity = $data->quantity ?? 1;
            $rental->start_date = $data->start_date;
            $rental->end_date = $data->end_date;
            $rental->rental_period = $data->rental_period ?? 'daily';
            $rental->daily_rate = $data->daily_rate;
            $rental->total_amount = $data->total_amount;
            $rental->status = $data->status ?? 'pending';
            $rental->notes = $data->notes ?? null;
            
            if($rental->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "Rental created successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create rental"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data"));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $rental->id = $data->id;
            $rental->supplier_id = $data->supplier_id;
            $rental->equipment_name = $data->equipment_name;
            $rental->equipment_type = $data->equipment_type ?? null;
            $rental->quantity = $data->quantity ?? 1;
            $rental->start_date = $data->start_date;
            $rental->end_date = $data->end_date;
            $rental->rental_period = $data->rental_period ?? 'daily';
            $rental->daily_rate = $data->daily_rate;
            $rental->total_amount = $data->total_amount;
            $rental->status = $data->status ?? 'pending';
            $rental->notes = $data->notes ?? null;
            
            if($rental->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Rental updated successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update rental"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID required"));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $rental->id = $data->id;
            
            if($rental->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Rental deleted successfully"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete rental"));
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