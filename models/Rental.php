<?php
require_once '../config/database.php';

class Rental {
    private $conn;
    private $table_name = "rentals";

    public $id;
    public $supplier_id;
    public $equipment_name;
    public $equipment_type;
    public $quantity;
    public $start_date;
    public $end_date;
    public $rental_period;
    public $daily_rate;
    public $total_amount;
    public $status;
    public $notes;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all rentals with supplier details
    public function getAll() {
        $query = "SELECT r.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone 
                FROM " . $this->table_name . " r 
                LEFT JOIN suppliers s ON r.supplier_id = s.id 
                ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get active rentals
    public function getActive() {
        $query = "SELECT r.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone 
                FROM " . $this->table_name . " r 
                LEFT JOIN suppliers s ON r.supplier_id = s.id 
                WHERE r.status = 'active' 
                ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get overdue rentals
    public function getOverdue() {
        $query = "SELECT r.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone 
                FROM " . $this->table_name . " r 
                LEFT JOIN suppliers s ON r.supplier_id = s.id 
                WHERE r.status = 'active' AND r.end_date < CURDATE() 
                ORDER BY r.end_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get single rental
    public function getById($id) {
        $query = "SELECT r.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone 
                FROM " . $this->table_name . " r 
                LEFT JOIN suppliers s ON r.supplier_id = s.id 
                WHERE r.id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create rental
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (id, supplier_id, equipment_name, equipment_type, quantity, start_date, end_date, 
                 rental_period, daily_rate, total_amount, status, notes) 
                VALUES (UUID(), :supplier_id, :equipment_name, :equipment_type, :quantity, :start_date, 
                        :end_date, :rental_period, :daily_rate, :total_amount, :status, :notes)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":supplier_id", $this->supplier_id);
        $stmt->bindParam(":equipment_name", $this->equipment_name);
        $stmt->bindParam(":equipment_type", $this->equipment_type);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":rental_period", $this->rental_period);
        $stmt->bindParam(":daily_rate", $this->daily_rate);
        $stmt->bindParam(":total_amount", $this->total_amount);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":notes", $this->notes);
        
        return $stmt->execute();
    }

    // Update rental
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET supplier_id = :supplier_id, equipment_name = :equipment_name, 
                    equipment_type = :equipment_type, quantity = :quantity, 
                    start_date = :start_date, end_date = :end_date, 
                    rental_period = :rental_period, daily_rate = :daily_rate, 
                    total_amount = :total_amount, status = :status, notes = :notes,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":supplier_id", $this->supplier_id);
        $stmt->bindParam(":equipment_name", $this->equipment_name);
        $stmt->bindParam(":equipment_type", $this->equipment_type);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":rental_period", $this->rental_period);
        $stmt->bindParam(":daily_rate", $this->daily_rate);
        $stmt->bindParam(":total_amount", $this->total_amount);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":notes", $this->notes);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Delete rental
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
?>