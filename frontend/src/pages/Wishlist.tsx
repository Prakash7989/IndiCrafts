import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TribalDivider } from '@/components/ui/tribal-pattern';
import { useAuth } from '@/contexts/AuthContext';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await api.getWishlist();
        const items = ((res as any).wishlist || []).map((p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.imageUrl,
          producer: {
            name: p.producerName || 'Producer',
            location: p.producerLocation || '—',
          },
          inStock: p.inStock !== false,
          quantity: p.quantity,
        }));
        setWishlist(items);
      } catch (e: any) {
        setError(e.message || 'Could not fetch wishlist');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-earth py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-merriweather text-3xl md:text-4xl font-bold text-off-white text-center">
            My Wishlist
          </h1>
        </div>
      </section>
      <TribalDivider className="text-primary -mt-px" />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-40 w-full rounded-md" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-poppins text-lg text-muted-foreground">
              Your wishlist is empty.
            </p>
            <Button onClick={() => navigate('/products')} className="mt-4">
              Browse Products
            </Button>
            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
