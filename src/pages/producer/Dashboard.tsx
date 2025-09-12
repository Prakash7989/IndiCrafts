import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
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

const ProducerDashboard: React.FC = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product added successfully!');
    setIsAddProductOpen(false);
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
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90 text-white">
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
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select required>
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
                  />
                </div>

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
                    Add Product
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
                    <th className="text-left py-3 px-4 font-poppins">Product</th>
                    <th className="text-left py-3 px-4 font-poppins">Category</th>
                    <th className="text-left py-3 px-4 font-poppins">Price</th>
                    <th className="text-left py-3 px-4 font-poppins">Stock</th>
                    <th className="text-left py-3 px-4 font-poppins">Views</th>
                    <th className="text-left py-3 px-4 font-poppins">Sold</th>
                    <th className="text-left py-3 px-4 font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProducerProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 px-4 font-poppins">{product.name}</td>
                      <td className="py-3 px-4 font-poppins">
                        {categories.find(c => c.slug === product.category)?.name}
                      </td>
                      <td className="py-3 px-4 font-poppins">₹{product.price}</td>
                      <td className="py-3 px-4 font-poppins">{product.stock}</td>
                      <td className="py-3 px-4 font-poppins">{product.views}</td>
                      <td className="py-3 px-4 font-poppins">{product.sold}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.success('Product deleted')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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