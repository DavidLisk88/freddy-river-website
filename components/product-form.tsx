"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Omit<Product, "id">) => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    price: initialData?.price || 0,
    bpm: initialData?.bpm || 120,
    key: initialData?.key || "C",
    description: initialData?.description || "",
    type: initialData?.type || ("beat" as const),
    duration: initialData?.duration || "",
    genre: initialData?.genre || "",
    mood: initialData?.mood || "",
    audioUrl: initialData?.audioUrl || "/placeholder.mp3",
    imageUrl: initialData?.imageUrl || "/placeholder.svg",
    featured: initialData?.featured || false,
  })

  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, tags })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beat">Beat</SelectItem>
              <SelectItem value="sample-pack">Sample Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => handleInputChange("genre", e.target.value)}
            required
          />
        </div>
      </div>

      {formData.type === "beat" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bpm">BPM</Label>
            <Input
              id="bpm"
              type="number"
              min="60"
              max="200"
              value={formData.bpm}
              onChange={(e) => handleInputChange("bpm", Number.parseInt(e.target.value) || 120)}
              required
            />
          </div>
          <div>
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => handleInputChange("key", e.target.value)}
              placeholder="e.g., Am, C, F#m"
              required
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="e.g., 3:24 or 50 samples"
            required
          />
        </div>
        <div>
          <Label htmlFor="mood">Mood</Label>
          <Input
            id="mood"
            value={formData.mood}
            onChange={(e) => handleInputChange("mood", e.target.value)}
            placeholder="e.g., Dark, Chill, Energetic"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="audioUrl">Audio URL</Label>
          <Input
            id="audioUrl"
            value={formData.audioUrl}
            onChange={(e) => handleInputChange("audioUrl", e.target.value)}
            placeholder="/path/to/audio.mp3"
            required
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            placeholder="/path/to/image.jpg"
            required
          />
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag()
              }
            }}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
