"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Search, Star } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-foreground">Product</TableHead>
              <TableHead className="text-foreground">Type</TableHead>
              <TableHead className="text-foreground">Price</TableHead>
              <TableHead className="text-foreground">BPM/Key</TableHead>
              <TableHead className="text-foreground">Genre</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {product.title}
                        {product.featured && <Star className="h-3 w-3 text-accent fill-current" />}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.type === "sample-pack" ? "Sample Pack" : "Beat"}</Badge>
                </TableCell>
                <TableCell className="font-medium text-accent">${product.price}</TableCell>
                <TableCell className="text-muted-foreground">
                  {product.type === "beat" ? `${product.bpm} BPM • ${product.key}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.genre}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.featured ? "default" : "outline"}>
                    {product.featured ? "Featured" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No products found matching your search." : "No products available."}
        </div>
      )}
    </div>
  )
}
