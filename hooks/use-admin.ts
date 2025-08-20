"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { sampleProducts } from "@/lib/data"

export function useAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load products from localStorage or use sample data
  useEffect(() => {
    const savedProducts = localStorage.getItem("freddy-river-admin-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(sampleProducts)
    }

    // Check if admin is authenticated (simple demo auth)
    const adminAuth = localStorage.getItem("freddy-river-admin-auth")
    setIsAuthenticated(adminAuth === "authenticated")
  }, [])

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("freddy-river-admin-products", JSON.stringify(products))
    }
  }, [products])

  const login = (password: string) => {
    // Simple demo authentication
    if (password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("freddy-river-admin-auth", "authenticated")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("freddy-river-admin-auth")
  }

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return {
    products,
    isAuthenticated,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
