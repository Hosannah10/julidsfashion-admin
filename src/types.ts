export type Wear = {
  id: number;
  wearName: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export type Order = {
  id: number;
  wearName: string;
  price: number;
  description?: string;
  category?: string;
  quantity: number;
  total: number;
  image?: string;
  status: 'pending' | 'completed';
  name: string;
  email: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_staff: boolean;
}

export type CustomOrder = {
  id: number;
  name: string;
  email: string;
  phone: string;
  description: string;
  image: string;
  status: 'pending' | 'completed';
}