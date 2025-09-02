<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Active rentals count
    $query = "SELECT COUNT(*) as active_rentals FROM rentals WHERE status = 'active'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $active_rentals = $stmt->fetch()['active_rentals'];

    // Monthly revenue (sum of active rentals)
    $query = "SELECT COALESCE(SUM(total_amount), 0) as monthly_revenue FROM rentals WHERE status = 'active'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $monthly_revenue = $stmt->fetch()['monthly_revenue'];

    // Products in stock
    $query = "SELECT COALESCE(SUM(quantity), 0) as products_in_stock FROM products";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $products_in_stock = $stmt->fetch()['products_in_stock'];

    // Low stock items
    $query = "SELECT COUNT(*) as low_stock_items FROM products WHERE quantity <= min_stock";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $low_stock_items = $stmt->fetch()['low_stock_items'];

    $stats = array(
        "activeRentals" => (int)$active_rentals,
        "monthlyRevenue" => (float)$monthly_revenue,
        "productsInStock" => (int)$products_in_stock,
        "lowStockItems" => (int)$low_stock_items
    );

    http_response_code(200);
    echo json_encode($stats);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Unable to get dashboard stats"));
}
?>