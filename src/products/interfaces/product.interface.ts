export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  quantity: number;
  pk: string;
  freon_type: string;
  model_code: string;
  series_name: string;

  brand: {
    id: number;
    name: string;
  };

  category: {
    id: number;
    name: string;
  };

  ac_type: {
    id: number;
    name: string;
  };
}
