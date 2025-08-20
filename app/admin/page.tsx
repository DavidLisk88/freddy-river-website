"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AdminLogin } from "@/components/admin-login"
import { ProductTable } from "@/components/product-table"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, LogOut, BarChart3, Package, DollarSign } from "lucide-react"
import { useAdmin } from "@/hooks/use-admin"
import type { Product } from "@/lib/types"

export default function AdminPage() {
  const { products, isAuthenticated, logout, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + product.price, 0)
  const featuredProducts = products.filter((product) => product.featured).length

  const handleAddProduct = (productData: Omit<Product, "id">) => {
    addProduct(productData)
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (productData: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
      setEditingProduct(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your beats and sample packs</p>
          </div>
          <Button onClick={logout} variant="outline" className="bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Catalog value</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{featuredProducts}</div>
              <p className="text-xs text-muted-foreground">Featured products</p>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Products</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <ProductTable products={products} onEdit={setEditingProduct} onDelete={deleteProduct} />
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleEditProduct}
                onCancel={() => setEditingProduct(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
