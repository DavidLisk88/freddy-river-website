"use client"

import { useState, useEffect } from "react"
import type { Cart, CartItem, Product } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("freddy-river-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("freddy-river-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Product already in cart, increase quantity
        const updatedItems = prevCart.items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        return { items: updatedItems, total }
      } else {
        // Add new product to cart
        const newItem: CartItem = { product, quantity: 1 }
        const updatedItems = [...prevCart.items, newItem]
        const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        return { items: updatedItems, total }
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.product.id !== productId)
      const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: updatedItems, total }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: updatedItems, total }
    })
  }

  const clearCart = () => {
    setCart({ items: [], total: 0 })
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
