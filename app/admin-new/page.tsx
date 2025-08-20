"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Package, 
  DollarSign, 
  Download,
  Mail,
  ExternalLink
} from "lucide-react"

interface Product {
  beat_id?: number
  sample_id?: number
  title: string
  genre?: string
  bpm?: number
  lease_price: number
  exclusive_price: number
  is_available: boolean
  productFiles: any[]
  collaborators: any[]
}

interface Collaborator {
  id: number
  name: string
  email: string
  stripe_account_id?: string
  paypal_payer_id?: string
}

interface Order {
  id: number
  customer: {
    name: string
    email: string
  }
  provider: string
  status: string
  total_cents: number
  created_at: string
  items: any[]
}

export default function AdminNewPage() {
  const [products, setProducts] = useState<{ beats: Product[], samples: Product[] }>({ beats: [], samples: [] })
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Product form state
  const [productForm, setProductForm] = useState({
    type: 'beat',
    title: '',
    genre: '',
    bpm: '',
    lease_price: '',
    exclusive_price: '',
    preview_url: '',
    is_available: true
  })

  // Collaborator form state
  const [collaboratorForm, setCollaboratorForm] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, collaboratorsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/collaborators'),
        fetch('/api/admin/orders')
      ])

      const productsData = await productsRes.json()
      const collaboratorsData = await collaboratorsRes.json()
      const ordersData = await ordersRes.json()

      setProducts(productsData)
      setCollaborators(collaboratorsData)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          bpm: productForm.bpm ? parseInt(productForm.bpm) : null,
          lease_price: parseFloat(productForm.lease_price),
          exclusive_price: parseFloat(productForm.exclusive_price),
        })
      })

      if (response.ok) {
        setProductForm({
          type: 'beat',
          title: '',
          genre: '',
          bpm: '',
          lease_price: '',
          exclusive_price: '',
          preview_url: '',
          is_available: true
        })
        fetchData()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleCollaboratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/collaborators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collaboratorForm)
      })

      if (response.ok) {
        setCollaboratorForm({ name: '', email: '' })
        fetchData()
      }
    } catch (error) {
      console.error('Error creating collaborator:', error)
    }
  }

  const handleFileUpload = async (productType: string, productId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('productType', productType)
    formData.append('productId', productId.toString())

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const toggleProductAvailability = async (type: string, id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !currentStatus })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  const totalProducts = products.beats.length + products.samples.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_cents, 0) / 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your digital products store</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {products.beats.length} beats, {products.samples.length} samples
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{orders.length} orders</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collaborators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{collaborators.length}</div>
              <p className="text-xs text-muted-foreground">Active collaborators</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {products.beats.filter(b => b.is_available).length + products.samples.filter(s => s.is_available).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently for sale</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Products Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Beats ({products.beats.length})</h3>
                    <div className="space-y-2">
                      {products.beats.map((beat) => (
                        <div key={beat.beat_id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{beat.title}</h4>
                              <Badge variant={beat.is_available ? "default" : "secondary"}>
                                {beat.is_available ? "Available" : "Unavailable"}
                              </Badge>
                              {beat.productFiles.length > 0 && (
                                <Badge variant="outline">Has Files</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {beat.genre} • {beat.bpm} BPM • Lease: ${beat.lease_price} • Exclusive: ${beat.exclusive_price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="audio/*,.zip"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file && beat.beat_id) {
                                  handleFileUpload('beat', beat.beat_id, file)
                                }
                              }}
                              className="hidden"
                              id={`upload-beat-${beat.beat_id}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`upload-beat-${beat.beat_id}`)?.click()}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => beat.beat_id && toggleProductAvailability('beat', beat.beat_id, beat.is_available)}
                            >
                              {beat.is_available ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Samples ({products.samples.length})</h3>
                    <div className="space-y-2">
                      {products.samples.map((sample) => (
                        <div key={sample.sample_id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{sample.title}</h4>
                              <Badge variant={sample.is_available ? "default" : "secondary"}>
                                {sample.is_available ? "Available" : "Unavailable"}
                              </Badge>
                              {sample.productFiles.length > 0 && (
                                <Badge variant="outline">Has Files</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {sample.bpm} BPM • Lease: ${sample.lease_price} • Exclusive: ${sample.exclusive_price}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="audio/*,.zip"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file && sample.sample_id) {
                                  handleFileUpload('sample', sample.sample_id, file)
                                }
                              }}
                              className="hidden"
                              id={`upload-sample-${sample.sample_id}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`upload-sample-${sample.sample_id}`)?.click()}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sample.sample_id && toggleProductAvailability('sample', sample.sample_id, sample.is_available)}
                            >
                              {sample.is_available ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Add Collaborator</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCollaboratorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="collab-name">Name</Label>
                      <Input
                        id="collab-name"
                        value={collaboratorForm.name}
                        onChange={(e) => setCollaboratorForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="collab-email">Email</Label>
                      <Input
                        id="collab-email"
                        type="email"
                        value={collaboratorForm.email}
                        onChange={(e) => setCollaboratorForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Collaborator
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Collaborators ({collaborators.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">{collaborator.name}</h4>
                          <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {collaborator.stripe_account_id && (
                            <Badge variant="outline">Stripe Connected</Badge>
                          )}
                          {collaborator.paypal_payer_id && (
                            <Badge variant="outline">PayPal Connected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">Order #{order.id}</h4>
                          <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                          <Badge variant="outline">{order.provider}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customer.name} ({order.customer.email}) • ${(order.total_cents / 100).toFixed(2)} • {order.items.length} items
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="product-type">Product Type</Label>
                    <Select value={productForm.type} onValueChange={(value) => setProductForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beat">Beat</SelectItem>
                        <SelectItem value="sample">Sample</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-title">Title</Label>
                      <Input
                        id="product-title"
                        value={productForm.title}
                        onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-genre">Genre</Label>
                      <Input
                        id="product-genre"
                        value={productForm.genre}
                        onChange={(e) => setProductForm(prev => ({ ...prev, genre: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="product-bpm">BPM</Label>
                      <Input
                        id="product-bpm"
                        type="number"
                        value={productForm.bpm}
                        onChange={(e) => setProductForm(prev => ({ ...prev, bpm: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-lease-price">Lease Price ($)</Label>
                      <Input
                        id="product-lease-price"
                        type="number"
                        step="0.01"
                        value={productForm.lease_price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, lease_price: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-exclusive-price">Exclusive Price ($)</Label>
                      <Input
                        id="product-exclusive-price"
                        type="number"
                        step="0.01"
                        value={productForm.exclusive_price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, exclusive_price: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="product-preview-url">Preview URL</Label>
                    <Input
                      id="product-preview-url"
                      type="url"
                      value={productForm.preview_url}
                      onChange={(e) => setProductForm(prev => ({ ...prev, preview_url: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="product-available"
                      checked={productForm.is_available}
                      onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, is_available: checked as boolean }))}
                    />
                    <Label htmlFor="product-available">Available for purchase</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}