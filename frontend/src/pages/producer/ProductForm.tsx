import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import apiService from '@/services/api';
import { toast } from 'sonner';

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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

    useEffect(() => {
        const load = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const res = await apiService.listMyProducts();
                const products = (res as any).products || [];
                const current = products.find((p: any) => p._id === id);
                if (!current) {
                    toast.error('Product not found');
                    navigate('/producer/dashboard');
                    return;
                }
                setFormValues({
                    name: current.name || '',
                    category: current.category || '',
                    price: String(current.price ?? ''),
                    quantity: String(current.quantity ?? ''),
                    description: current.description || '',
                    producerLocation: current.producerLocation || '',
                });
                setImagePreview(current.imageUrl || null);
            } catch (e: any) {
                toast.error(e?.message || 'Failed to load product');
                navigate('/producer/dashboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.append('name', formValues.name);
            fd.append('category', formValues.category);
            fd.append('price', formValues.price);
            fd.append('quantity', formValues.quantity);
            fd.append('description', formValues.description);
            fd.append('producerLocation', formValues.producerLocation);
            if (imageFile) fd.append('image', imageFile);

            if (isEdit && id) {
                await apiService.updateProduct(id, fd);
                toast.success('Product updated');
            } else {
                await apiService.createProduct(fd);
                toast.success('Product created');
            }
            navigate('/producer/dashboard');
        } catch (e: any) {
            toast.error(e?.message || 'Submit failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-merriweather">
                            {isEdit ? 'Edit Product' : 'Add Product'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} />
                            </div>

                            <div>
                                <Label>Category</Label>
                                <Select value={formValues.category} onValueChange={(v) => setFormValues({ ...formValues, category: v })}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input id="price" type="number" min="0" required value={formValues.price} onChange={(e) => setFormValues({ ...formValues, price: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="qty">Quantity</Label>
                                    <Input id="qty" type="number" min="0" required value={formValues.quantity} onChange={(e) => setFormValues({ ...formValues, quantity: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="desc">Description</Label>
                                <Textarea id="desc" rows={3} required value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} />
                            </div>

                            <div>
                                <Label htmlFor="loc">Your Location (optional)</Label>
                                <Input id="loc" value={formValues.producerLocation} onChange={(e) => setFormValues({ ...formValues, producerLocation: e.target.value })} />
                            </div>

                            <div>
                                <Label htmlFor="image">Product Image {isEdit ? '(leave empty to keep current)' : ''}</Label>
                                <Input id="image" type="file" accept="image/*" className="mt-1" onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setImageFile(f);
                                    if (f) {
                                        const url = URL.createObjectURL(f);
                                        setImagePreview(url);
                                    }
                                }} />
                            </div>

                            {imagePreview && (
                                <div>
                                    <Label>Preview</Label>
                                    <div className="mt-2 w-full h-56 bg-muted rounded overflow-hidden flex items-center justify-center">
                                        <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => navigate('/producer/dashboard')}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductForm;


