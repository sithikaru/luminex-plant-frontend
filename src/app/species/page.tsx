'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Sprout, 
  Leaf,
  TreePine,
  MoreHorizontal,
  Download,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Species, SpeciesCategory } from '@/types/domain';
import { formatDate } from '@/lib/utils';

const categoryColors = {
  TREE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  SHRUB: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  HERB: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  GRASS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  FERN: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  VINE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  SUCCULENT: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  AQUATIC: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

const categoryIcons = {
  TREE: TreePine,
  SHRUB: Sprout,
  HERB: Leaf,
  GRASS: Sprout,
  FERN: Leaf,
  VINE: Sprout,
  SUCCULENT: Sprout,
  AQUATIC: Sprout,
};

export default function SpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SpeciesCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/species', {
        params: {
          search: searchTerm || undefined,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
          sortBy,
          sortOrder,
        },
      });
      setSpecies(response.data);
    } catch (error) {
      console.error('Error fetching species:', error);
      toast.error('Failed to load species');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, [searchTerm, categoryFilter, sortBy, sortOrder]);

  const handleDeleteSpecies = async (speciesId: string) => {
    if (!confirm('Are you sure you want to delete this species?')) return;

    try {
      await api.delete(`/species/${speciesId}`);
      toast.success('Species deleted successfully');
      fetchSpecies();
    } catch (error) {
      console.error('Error deleting species:', error);
      toast.error('Failed to delete species');
    }
  };

  const filteredSpecies = species.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as any;

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
            <h1 className="text-3xl font-bold gradient-text">Species Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your plant species catalog
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Export functionality coming soon!');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => router.push('/species/new')}
              className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Species
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Species</p>
                  <p className="text-2xl font-bold">{species.length}</p>
                </div>
                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-plant-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trees</p>
                  <p className="text-2xl font-bold">{species.filter(s => s.category === 'TREE').length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TreePine className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shrubs</p>
                  <p className="text-2xl font-bold">{species.filter(s => s.category === 'SHRUB').length}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                  <p className="text-2xl font-bold">
                    {species.reduce((acc, s) => acc + (s._count?.batches || 0), 0)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
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
                      placeholder="Search species by name or scientific name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as SpeciesCategory | 'ALL')}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="TREE">Trees</SelectItem>
                    <SelectItem value="SHRUB">Shrubs</SelectItem>
                    <SelectItem value="HERB">Herbs</SelectItem>
                    <SelectItem value="GRASS">Grasses</SelectItem>
                    <SelectItem value="FERN">Ferns</SelectItem>
                    <SelectItem value="VINE">Vines</SelectItem>
                    <SelectItem value="SUCCULENT">Succulents</SelectItem>
                    <SelectItem value="AQUATIC">Aquatic</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="scientificName-asc">Scientific A-Z</SelectItem>
                    <SelectItem value="scientificName-desc">Scientific Z-A</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Species Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Species Catalog</CardTitle>
              <CardDescription>
                {filteredSpecies.length} species found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredSpecies.length === 0 ? (
                <div className="text-center py-12">
                  <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No species found</p>
                  <Button 
                    onClick={() => router.push('/species/new')}
                    className="mt-4"
                    variant="outline"
                  >
                    Add your first species
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Scientific Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Batches</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSpecies.map((spec, index) => {
                        const IconComponent = categoryIcons[spec.category];
                        return (
                          <motion.tr
                            key={spec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                                  <IconComponent className="h-4 w-4 text-plant-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{spec.name}</p>
                                  {spec.description && (
                                    <p className="text-sm text-muted-foreground truncate max-w-32">
                                      {spec.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{spec.scientificName}</TableCell>
                            <TableCell>
                              <Badge className={categoryColors[spec.category]}>
                                {spec.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{spec._count?.batches || 0}</span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(spec.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/species/${spec.id}`)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/species/${spec.id}/edit`)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteSpecies(spec.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
