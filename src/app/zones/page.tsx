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
  Users, 
  Package,
  TrendingUp,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Zone } from '@/types/domain';
import { formatDate } from '@/lib/utils';

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/zones');
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async () => {
    if (!formData.name || !formData.capacity) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.post('/zones', {
        name: formData.name,
        capacity: parseInt(formData.capacity),
      });
      toast.success('Zone created successfully');
      setShowCreateDialog(false);
      setFormData({ name: '', capacity: '' });
      fetchZones();
    } catch (error) {
      console.error('Error creating zone:', error);
      toast.error('Failed to create zone');
    }
  };

  const handleUpdateZone = async () => {
    if (!editingZone || !formData.name || !formData.capacity) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.put(`/zones/${editingZone.id}`, {
        name: formData.name,
        capacity: parseInt(formData.capacity),
      });
      toast.success('Zone updated successfully');
      setEditingZone(null);
      setFormData({ name: '', capacity: '' });
      fetchZones();
    } catch (error) {
      console.error('Error updating zone:', error);
      toast.error('Failed to update zone');
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this zone? This action cannot be undone.')) return;

    try {
      await api.delete(`/zones/${zoneId}`);
      toast.success('Zone deleted successfully');
      fetchZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast.error('Failed to delete zone');
    }
  };

  const openEditDialog = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      capacity: zone.capacity.toString(),
    });
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingZone(null);
    setFormData({ name: '', capacity: '' });
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div>
            <h1 className="text-3xl font-bold gradient-text">Zone Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage growing zones and their capacities
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700">
                <Plus className="h-4 w-4 mr-2" />
                New Zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Zone</DialogTitle>
                <DialogDescription>
                  Add a new growing zone to your facility
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Zone Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Zone A, Greenhouse 1"
                  />
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
                  <Button onClick={handleCreateZone} className="flex-1">
                    Create Zone
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
                  <p className="text-sm font-medium text-muted-foreground">Total Zones</p>
                  <p className="text-2xl font-bold">{zones.length}</p>
                </div>
                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-plant-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold">{zones.reduce((sum, zone) => sum + zone.capacity, 0).toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold">{zones.reduce((sum, zone) => sum + (zone.occupied || 0), 0).toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
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
                    {zones.length > 0 
                      ? Math.round((zones.reduce((sum, zone) => sum + ((zone.occupied || 0) / zone.capacity * 100), 0) / zones.length))
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

        {/* Search */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search zones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zones Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Zones</CardTitle>
              <CardDescription>
                {filteredZones.length} zone{filteredZones.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredZones.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No zones found</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first zone
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone Name</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Occupied</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Beds</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredZones.map((zone, index) => (
                        <motion.tr
                          key={zone.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-plant-600" />
                              </div>
                              {zone.name}
                            </div>
                          </TableCell>
                          <TableCell>{zone.capacity.toLocaleString()}</TableCell>
                          <TableCell>{(zone.occupied || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-plant-400 to-plant-600 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(((zone.occupied || 0) / zone.capacity) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {Math.round(((zone.occupied || 0) / zone.capacity) * 100)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{zone._count?.beds || 0}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(zone.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/zones/${zone.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/zones/${zone.id}/beds`)}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Manage Beds
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(zone)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteZone(zone.id)}
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

        {/* Edit Zone Dialog */}
        <Dialog open={!!editingZone} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Zone</DialogTitle>
              <DialogDescription>
                Update zone information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Zone Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Zone A, Greenhouse 1"
                />
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
                <Button onClick={handleUpdateZone} className="flex-1">
                  Update Zone
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
