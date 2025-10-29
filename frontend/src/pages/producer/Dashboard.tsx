import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { categories } from '@/lib/data';
import { toast } from 'sonner';
import apiService from '@/services/api';

const ProducerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    producerLocation: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const refreshMine = async () => {
    try {
      setLoading(true);
      const res = await apiService.listMyProducts();
      setProducts((res as any).products || []);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refreshMine();
    }
  }, [isAuthenticated, isLoading]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const editingId = (window as any)._editProductId as string | undefined;
    if (!editingId && !imageFile) {
      toast.error('Please select an image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', formValues.name);
      formData.append('category', formValues.category);
      formData.append('price', formValues.price);
      formData.append('quantity', formValues.quantity);
      formData.append('description', formValues.description);
      formData.append('producerLocation', formValues.producerLocation);
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await apiService.updateProduct(editingId, formData);
        toast.success('Product updated!');
      } else {
        await apiService.createProduct(formData);
        toast.success('Product added successfully!');
      }
      setIsAddProductOpen(false);
      setFormValues({ name: '', category: '', price: '', quantity: '', description: '', producerLocation: '' });
      setImageFile(null);
      setImagePreview(null);
      (window as any)._editProductId = undefined;
      refreshMine();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add product');
    }
  };

  const mockProducerProducts = [
    {
      id: '1',
      name: 'Handwoven Tribal Textile',
      price: 2499,
      category: 'textiles-apparel',
      stock: 5,
      views: 124,
      sold: 3,
    },
    {
      id: '2',
      name: 'Traditional Clay Pot Set',
      price: 1899,
      category: 'home-living',
      stock: 8,
      views: 89,
      sold: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-merriweather text-3xl font-bold text-primary">
            Producer Dashboard
          </h1>

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90 text-white" onClick={() => navigate('/producer/products/new')}>
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add your handmade product to the marketplace.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text"
                    required
                    className="mt-1"
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select required value={formValues.category} onValueChange={(v) => setFormValues({ ...formValues, category: v })}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      required
                      className="mt-1"
                      value={formValues.price}
                      onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      required
                      className="mt-1"
                      value={formValues.quantity}
                      onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    required
                    className="mt-1"
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Your Location (optional)</Label>
                  <Input
                    id="location"
                    type="text"
                    className="mt-1"
                    value={formValues.producerLocation}
                    onChange={(e) => setFormValues({ ...formValues, producerLocation: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    required
                    className="mt-1"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      setImageFile(f);
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setImagePreview(url);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2">
                    <Label>Preview</Label>
                    <div className="mt-2 w-full h-48 bg-muted rounded overflow-hidden flex items-center justify-center">
                      <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddProductOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-burnt-orange hover:bg-burnt-orange/90 text-white"
                  >
                    {(window as any)._editProductId ? 'Save Changes' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-poppins text-muted-foreground">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-merriweather text-2xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-poppins text-muted-foreground">
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-merriweather text-2xl font-bold">1,234</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-poppins text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-merriweather text-2xl font-bold">28</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-poppins text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-merriweather text-2xl font-bold">₹45,670</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-merriweather flex items-center">
              <Package className="h-5 w-5 mr-2" />
              My Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-poppins">Image</th>
                    <th className="text-left py-3 px-4 font-poppins">Product</th>
                    <th className="text-left py-3 px-4 font-poppins">Category</th>
                    <th className="text-left py-3 px-4 font-poppins">Price</th>
                    <th className="text-left py-3 px-4 font-poppins">Qty</th>
                    <th className="text-left py-3 px-4 font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex items-center justify-center">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-poppins">{product.name}</td>
                      <td className="py-3 px-4 font-poppins">
                        {categories.find(c => c.slug === product.category)?.name || product.category}
                      </td>
                      <td className="py-3 px-4 font-poppins">
                        <div>₹{product.price}</div>
                        {product.priceBreakdown && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Customer price: ₹{product.priceBreakdown.totalPrice}
                            <div className="text-xs text-muted-foreground mt-1">
                              Shipping: ₹{product.priceBreakdown.shippingCost} • Commission: ₹{product.priceBreakdown.commission ?? (product.price * 0.05).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-poppins">{product.quantity}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/producer/products/${product._id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              try {
                                await apiService.deleteProduct(product._id);
                                toast.success('Product deleted');
                                refreshMine();
                              } catch (e: any) {
                                toast.error(e?.message || 'Failed to delete');
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-muted-foreground font-poppins">
                        {loading ? 'Loading...' : 'No products yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProducerDashboard;