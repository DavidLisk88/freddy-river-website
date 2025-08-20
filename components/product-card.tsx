"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { addToCart } = useCart()

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPlaying(!isPlaying)
    // TODO: Implement actual audio playback
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img src={product.imageUrl || "/placeholder.svg"} alt={product.title} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{product.title}</h3>
            <span className="text-accent font-bold text-lg">${product.price}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            {product.type === "beat" && (
              <>
                <span>{product.bpm} BPM</span>
                <span>•</span>
                <span>Key: {product.key}</span>
                <span>•</span>
              </>
            )}
            <span>{product.duration}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>

          <Button asChild className="w-full">
            <Link href={`/product/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
