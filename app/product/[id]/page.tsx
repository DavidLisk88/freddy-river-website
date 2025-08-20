"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, ShoppingCart, ArrowLeft, Download, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { sampleProducts } from "@/lib/data"

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const product = sampleProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const relatedProducts = sampleProducts
    .filter(
      (p) => p.id !== product.id && (p.genre === product.genre || p.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image and Audio Player */}
          <div className="space-y-6">
            <div className="relative">
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>
              )}
            </div>

            {/* Audio Player */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Button size="lg" onClick={handlePlayPause} className="rounded-full">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">Preview Track</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-secondary rounded-full cursor-pointer" onClick={handleSeek}>
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={product.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-accent mb-4">${product.price}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4">
              {product.type === "beat" && (
                <>
                  <div>
                    <span className="text-sm text-muted-foreground">BPM</span>
                    <p className="font-semibold text-foreground">{product.bpm}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Key</span>
                    <p className="font-semibold text-foreground">{product.key}</p>
                  </div>
                </>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Genre</span>
                <p className="font-semibold text-foreground">{product.genre}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Duration</span>
                <p className="font-semibold text-foreground">{product.duration}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Mood</span>
                <p className="font-semibold text-foreground">{product.mood}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Type</span>
                <p className="font-semibold text-foreground">
                  {product.type === "sample-pack" ? "Sample Pack" : "Beat"}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Tags</span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => addToCart(product)}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${product.price}
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Preview
                </Button>
              </div>
            </div>

            {/* License Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">License Information</h3>
                <p className="text-sm text-muted-foreground">
                  This purchase includes a non-exclusive license for unlimited commercial use. Full license terms will
                  be provided with your download.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={relatedProduct.imageUrl || "/placeholder.svg"}
                        alt={relatedProduct.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{relatedProduct.title}</h3>
                      <p className="text-accent font-bold mb-2">${relatedProduct.price}</p>
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/product/${relatedProduct.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
