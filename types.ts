
export interface CodePayload {
  html: string;
  css: string;
  js: string;
}

export interface Product {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  code?: CodePayload;
  products?: Product[];
}
