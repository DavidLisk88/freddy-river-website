export interface Product {
  id: string
  title: string
  price: number
  bpm: number
  key: string
  tags: string[]
  audioUrl: string
  imageUrl: string
  description: string
  type: "beat" | "sample-pack"
  duration: string
  genre: string
  mood: string
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}
