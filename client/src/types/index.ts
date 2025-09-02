// Local types for frontend - replacing shared schema imports
import { z } from "zod";

// Base entity types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  document?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category_id?: string;
  unit_price: number;
  quantity: number;
  min_stock: number;
  is_rentable: boolean;
  created_at?: string;
}

export interface Rental {
  id: string;
  supplier_id: string;
  equipment_name: string;
  equipment_type?: string;
  quantity: number;
  start_date: string;
  end_date: string;
  rental_period: string;
  daily_rate: number;
  total_amount: number;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  reason: string;
  notes?: string;
  user_id?: string;
  created_at?: string;
}

export interface EquipmentSubstitution {
  id: string;
  rental_id: string;
  original_equipment_name: string;
  new_equipment_name: string;
  reason: string;
  substitution_date: string;
  notes?: string;
  created_at?: string;
}

// Detailed types with relationships
export interface ProductWithCategory extends Product {
  category_name?: string;
}

export interface RentalWithDetails extends Rental {
  supplier_name?: string;
  supplier_email?: string;
  supplier_phone?: string;
}

export interface InventoryMovementWithDetails extends InventoryMovement {
  product_name?: string;
  product_code?: string;
}

// Form validation schemas
export const insertProductSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  unitPrice: z.string().min(1, "Preço unitário é obrigatório"),
  quantity: z.number().int().min(0, "Quantidade deve ser maior ou igual a zero"),
  minStock: z.number().int().min(0, "Estoque mínimo deve ser maior ou igual a zero"),
  isRentable: z.boolean().default(true)
});

export const insertRentalSchema = z.object({
  supplierId: z.string().min(1, "Fornecedor é obrigatório"),
  equipmentName: z.string().min(1, "Nome do equipamento é obrigatório"),
  equipmentType: z.string().optional(),
  quantity: z.number().int().min(1, "Quantidade deve ser maior que zero"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  rentalPeriod: z.string().default("daily"),
  dailyRate: z.string().min(1, "Valor diário é obrigatório"),
  totalAmount: z.string().min(1, "Valor total é obrigatório"),
  status: z.string().default("pending"),
  notes: z.string().optional()
});

export const insertSupplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  document: z.string().optional()
});

export const insertCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional()
});

// Form types
export type ProductFormData = z.infer<typeof insertProductSchema>;
export type RentalFormData = z.infer<typeof insertRentalSchema>;
export type SupplierFormData = z.infer<typeof insertSupplierSchema>;
export type CategoryFormData = z.infer<typeof insertCategorySchema>;