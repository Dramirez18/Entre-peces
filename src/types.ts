export type Category = 'Peces' | 'Plantas' | 'Camarones' | 'Plantados' | 'Termostatos' | 'Filtros' | 'Alimentos' | 'Acondicionadores' | 'Gravilla' | 'Medicamentos' | 'Lamparas';

export interface Product {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  size?: string | null;
  active?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;  // 'user' | 'admin'
}

export interface BugReport {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  assignedTo?: string;
  screenshot?: string;
  page?: string;
  steps?: string;
  elementInfo?: string;   // JSON string with tag, classes, id, text, rect
  viewport?: string;      // JSON string with width, height
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ClientRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  acceptedDataPolicy?: boolean;
  policyAcceptedAt?: string;
}

export interface OrderRow {
  id: number;
  clientId: number;
  address: string;
  date: string;
  time: string;
  total: number;
  createdAt: string;
  clientName?: string;
  itemCount?: number;
}

export interface OrderItemRow {
  id: number;
  orderId: number;
  productId: string | null;
  name: string;
  quantity: number;
  price: number;
}

export interface AunapNews {
  id: number;
  title: string;
  url: string;
  publishedDate: string | null;
  imageUrl: string | null;
  createdAt: string;
}
