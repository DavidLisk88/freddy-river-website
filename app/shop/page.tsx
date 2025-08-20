"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { sampleProducts } from "@/lib/data"

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Get unique genres and types for filters
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(sampleProducts.map((product) => product.genre)))
    return uniqueGenres
  }, [])

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(sampleProducts.map((product) => product.type)))
    return uniqueTypes
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = sampleProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesGenre = selectedGenre === "all" || product.genre === selectedGenre
      const matchesType = selectedType === "all" || product.type === selectedType

      return matchesSearch && matchesGenre && matchesType
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "bpm-low":
        filtered.sort((a, b) => a.bpm - b.bpm)
        break
      case "bpm-high":
        filtered.sort((a, b) => b.bpm - a.bpm)
        break
      case "newest":
      default:
        // Keep original order for newest
        break
    }

    return filtered
  }, [searchTerm, selectedGenre, selectedType, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGenre("all")
    setSelectedType("all")
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground mb-4">
            Shop Beats & Sample Packs
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our complete collection of premium digital beats and sample packs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search beats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "sample-pack" ? "Sample Packs" : "Beats"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="bpm-low">BPM: Low to High</SelectItem>
                <SelectItem value="bpm-high">BPM: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {selectedGenre !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Genre: {selectedGenre}
                <button onClick={() => setSelectedGenre("all")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Type: {selectedType === "sample-pack" ? "Sample Packs" : "Beats"}
                <button onClick={() => setSelectedType("all")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {(searchTerm || selectedGenre !== "all" || selectedType !== "all") && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {sampleProducts.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
