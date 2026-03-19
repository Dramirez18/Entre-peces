export type Category = 'Peces' | 'Plantas' | 'Camarones' | 'Plantados' | 'Termostatos' | 'Filtros' | 'Alimentos' | 'Acondicionadores' | 'Gravilla' | 'Medidores' | 'Lamparas';

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
}
