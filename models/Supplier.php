<?php
require_once '../config/database.php';

class Supplier {
    private $conn;
    private $table_name = "suppliers";

    public $id;
    public $name;
    public $email;
    public $phone;
    public $address;
    public $document;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all suppliers
    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Get single supplier
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Create supplier
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (id, name, email, phone, address, document) 
                VALUES (UUID(), :name, :email, :phone, :address, :document)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":document", $this->document);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Update supplier
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET name = :name, email = :email, phone = :phone, 
                    address = :address, document = :document
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":document", $this->document);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Delete supplier
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
?>