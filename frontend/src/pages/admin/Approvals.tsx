import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ApprovalList: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [preview, setPreview] = React.useState<{ imageUrl: string; name: string } | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-products', status],
        queryFn: () => apiService.getAdminProducts({ status, page: 1, limit: 50 }),
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => apiService.approveAdminProduct(id),
        onSuccess: () => {
            toast({ title: 'Product approved' });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        onError: (err: any) => toast({ title: 'Approval failed', description: err?.message, variant: 'destructive' }),
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => apiService.rejectAdminProduct(id),
        onSuccess: () => {
            toast({ title: 'Product rejected' });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        onError: (err: any) => toast({ title: 'Rejection failed', description: err?.message, variant: 'destructive' }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load products</div>;

    const products = (data as any)?.products || [];

    return (
        <Card>
            <CardContent className="p-0">
                <div className="w-full overflow-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Producer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((p: any) => (
                                <TableRow key={p._id}>
                                    <TableCell>
                                        <button type="button" onClick={() => setPreview({ imageUrl: p.imageUrl, name: p.name })}>
                                            <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
                                        </button>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[220px] truncate">{p.name}</TableCell>
                                    <TableCell>{p.category}</TableCell>
                                    <TableCell>₹{p.price}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {(p.producer?.firstName || p.producerName) || '-'}{p.producer?.email ? ` (${p.producer.email})` : ''}
                                    </TableCell>
                                    <TableCell className="capitalize">{p.approvalStatus || (p.isApproved ? 'approved' : 'pending')}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {(status === 'pending' || status === 'rejected') && (
                                                    <DropdownMenuItem onClick={() => approveMutation.mutate(p._id)}>Approve</DropdownMenuItem>
                                                )}
                                                {(status === 'pending' || status === 'approved') && (
                                                    <DropdownMenuItem onClick={() => rejectMutation.mutate(p._id)}>Reject</DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">No products found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{preview?.name}</DialogTitle>
                    </DialogHeader>
                    {preview?.imageUrl && (
                        <img src={preview.imageUrl} alt={preview.name} className="w-full max-h-[70vh] object-contain rounded" />
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
};

const ApprovalsPage: React.FC = () => {
    const [status, setStatus] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold">Product Approvals</h1>
                <div className="flex items-center gap-2">
                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <ApprovalList status={status} />
        </div>
    );
};

export default ApprovalsPage;


