'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Package,
  Users,
  TrendingUp,
  MoreHorizontal,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Bed, Zone } from '@/types/domain';
import { formatDate } from '@/lib/utils';

export default function BedsPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    zoneId: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchBeds();
    fetchZones();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const response = await api.get('/beds');
      setBeds(response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      toast.error('Failed to load beds');
    } finally {
      setLoading(false);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await api.get('/zones');
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const handleCreateBed = async () => {
    if (!formData.name || !formData.capacity || !formData.zoneId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.post('/beds', {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        zoneId: formData.zoneId,
      });
      toast.success('Bed created successfully');
      setShowCreateDialog(false);
      setFormData({ name: '', capacity: '', zoneId: '' });
      fetchBeds();
    } catch (error) {
      console.error('Error creating bed:', error);
      toast.error('Failed to create bed');
    }
  };

  const handleUpdateBed = async () => {
    if (!editingBed || !formData.name || !formData.capacity || !formData.zoneId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.put(`/beds/${editingBed.id}`, {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        zoneId: formData.zoneId,
      });
      toast.success('Bed updated successfully');
      setEditingBed(null);
      setFormData({ name: '', capacity: '', zoneId: '' });
      fetchBeds();
    } catch (error) {
      console.error('Error updating bed:', error);
      toast.error('Failed to update bed');
    }
  };

  const handleDeleteBed = async (bedId: string) => {
    if (!confirm('Are you sure you want to delete this bed? This action cannot be undone.')) return;

    try {
      await api.delete(`/beds/${bedId}`);
      toast.success('Bed deleted successfully');
      fetchBeds();
    } catch (error) {
      console.error('Error deleting bed:', error);
      toast.error('Failed to delete bed');
    }
  };

  const openEditDialog = (bed: Bed) => {
    setEditingBed(bed);
    setFormData({
      name: bed.name,
      capacity: bed.capacity.toString(),
      zoneId: bed.zoneId,
    });
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingBed(null);
    setFormData({ name: '', capacity: '', zoneId: '' });
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.zone?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'ALL' || bed.zoneId === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  } as any;

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/zones')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Bed Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage growing beds within zones
              </p>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700">
                <Plus className="h-4 w-4 mr-2" />
                New Bed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Bed</DialogTitle>
                <DialogDescription>
                  Add a new growing bed to a zone
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Bed Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bed A1, Section 1"
                  />
                </div>
                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Select value={formData.zoneId} onValueChange={(value) => setFormData({ ...formData, zoneId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maximum number of plants"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateBed} className="flex-1">
                    Create Bed
                  </Button>
                  <Button variant="outline" onClick={closeDialog} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Beds</p>
                  <p className="text-2xl font-bold">{beds.length}</p>
                </div>
                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-plant-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold">{beds.reduce((sum, bed) => sum + bed.capacity, 0).toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold">{beds.reduce((sum, bed) => sum + (bed.occupied || 0), 0).toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                  <p className="text-2xl font-bold">
                    {beds.length > 0 
                      ? Math.round((beds.reduce((sum, bed) => sum + ((bed.occupied || 0) / bed.capacity * 100), 0) / beds.length))
                      : 0}%
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search beds or zones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={zoneFilter} onValueChange={setZoneFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Zones</SelectItem>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Beds Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Beds</CardTitle>
              <CardDescription>
                {filteredBeds.length} bed{filteredBeds.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredBeds.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No beds found</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first bed
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bed Name</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Occupied</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBeds.map((bed, index) => (
                        <motion.tr
                          key={bed.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                                <Package className="h-4 w-4 text-plant-600" />
                              </div>
                              {bed.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {bed.zone?.name || 'Unknown Zone'}
                            </div>
                          </TableCell>
                          <TableCell>{bed.capacity.toLocaleString()}</TableCell>
                          <TableCell>{(bed.occupied || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-plant-400 to-plant-600 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(((bed.occupied || 0) / bed.capacity) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {Math.round(((bed.occupied || 0) / bed.capacity) * 100)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(bed.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/beds/${bed.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(bed)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteBed(bed.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Bed Dialog */}
        <Dialog open={!!editingBed} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bed</DialogTitle>
              <DialogDescription>
                Update bed information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Bed Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bed A1, Section 1"
                />
              </div>
              <div>
                <Label htmlFor="edit-zone">Zone</Label>
                <Select value={formData.zoneId} onValueChange={(value) => setFormData({ ...formData, zoneId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Maximum number of plants"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateBed} className="flex-1">
                  Update Bed
                </Button>
                <Button variant="outline" onClick={closeDialog} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
