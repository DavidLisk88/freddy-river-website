"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Looks like you haven't added any beats to your cart yet. Discover our collection of premium beats and sample
            packs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">Browse Beats</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Shopping Cart ({cart.items.length})
          </h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.imageUrl || "/placeholder.svg"}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{item.product.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.type === "sample-pack" ? "Sample Pack" : "Beat"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {item.product.type === "beat" && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{item.product.bpm} BPM</span>
                          <span>Key: {item.product.key}</span>
                          <span>{item.product.duration}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                          <p className="font-semibold text-accent">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="text-foreground">$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-accent text-lg">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">What's Included</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• High-quality audio files</li>
                    <li>• Commercial use license</li>
                    <li>• Instant download</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
