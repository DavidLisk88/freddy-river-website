import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { sampleProducts } from "@/lib/data"

export default function HomePage() {
  const featuredProducts = sampleProducts.filter((product) => product.featured)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black font-[family-name:var(--font-heading)] text-foreground mb-6">
            PREMIUM
            <span className="block text-accent">BEATS</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover high-quality digital beats and sample packs crafted for musicians, rappers, and content creators
            who demand excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/shop">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Beats
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="#featured">
                <Play className="mr-2 h-5 w-5" />
                Listen Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-4">
              Featured Beats
            </h2>
            <p className="text-muted-foreground text-lg">Hand-picked selections from our premium collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <Button size="sm" variant="secondary">
                        <Play className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-foreground">{product.title}</h3>
                      <span className="text-accent font-bold">${product.price}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{product.bpm} BPM</span>
                      <span>Key: {product.key}</span>
                      <span>{product.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/product/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View All Beats</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
