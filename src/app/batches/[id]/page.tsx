'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { GrowthLineChart } from '@/components/analytics/GrowthLineChart'
import axios from 'axios'

interface GrowthData {
  createdAt: string
  avgGirth: number
  avgHeight: number
}

export default function BatchDetailPage() {
  const { id } = useParams()

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  MapPin, 
  Sprout, 
  TrendingUp,
  Package,
  Activity,
  Eye,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Batch, Measurement } from '@/types/domain';
import { formatDate, formatDateTime } from '@/lib/utils';

const statusColors = {
  CREATED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  READY: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  DELIVERED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function BatchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [measurementsLoading, setMeasurementsLoading] = useState(true);

  useEffect(() => {
    fetchBatchDetails();
    fetchMeasurements();
  }, [id]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/batch/${id}`);
      setBatch(response.data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast.error('Failed to load batch details');
      router.push('/batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeasurements = async () => {
    try {
      setMeasurementsLoading(true);
      const response = await api.get(`/batch/${id}/measurements`);
      setMeasurements(response.data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
      toast.error('Failed to load measurements');
    } finally {
      setMeasurementsLoading(false);
    }
  };

  const handleDeleteBatch = async () => {
    if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return;

    try {
      await api.delete(`/batch/${id}`);
      toast.success('Batch deleted successfully');
      router.push('/batches');
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Failed to delete batch');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Batch not found</p>
          <Button onClick={() => router.push('/batches')} className="mt-4">
            Back to Batches
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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

  const avgGirth = measurements.length > 0 
    ? measurements.reduce((sum, m) => sum + m.girth, 0) / measurements.length 
    : 0;

  const avgHeight = measurements.length > 0 
    ? measurements.reduce((sum, m) => sum + m.height, 0) / measurements.length 
    : 0;

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
              onClick={() => router.push('/batches')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Batch {batch.batchNumber}</h1>
              <p className="text-muted-foreground mt-1">
                {batch.species?.name || 'Unknown Species'} • Created {formatDate(batch.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/batches/${batch.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteBatch}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>

        {/* Status and Key Info */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={`mt-2 ${statusColors[batch.status]}`}>
                    {batch.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Quantity</p>
                  <p className="text-2xl font-bold">{batch.currentQty.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Initial Quantity</p>
                  <p className="text-2xl font-bold">{batch.initialQty.toLocaleString()}</p>
                </div>
                <Sprout className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loss Quantity</p>
                  <p className="text-2xl font-bold text-red-600">{batch.lossQty.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Batch Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Batch Number:</span>
                        <p className="font-medium">{batch.batchNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Custom Name:</span>
                        <p className="font-medium">{batch.customName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pathway:</span>
                        <p className="font-medium">{batch.pathway.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stage:</span>
                        <p className="font-medium">{batch.stage.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ready:</span>
                        <p className="font-medium">{batch.isReady ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ready Date:</span>
                        <p className="font-medium">{batch.readyDate ? formatDate(batch.readyDate) : 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location & Species */}
                <Card>
                  <CardHeader>
                    <CardTitle>Location & Species</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-plant-600" />
                        <span className="text-sm text-muted-foreground">Species:</span>
                        <span className="font-medium">{batch.species?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Zone:</span>
                        <span className="font-medium">{batch.zone?.name || 'No Zone'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-earth-600" />
                        <span className="text-sm text-muted-foreground">Bed:</span>
                        <span className="font-medium">{batch.bed?.name || 'No Bed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <span className="font-medium">{formatDateTime(batch.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Statistics */}
              {measurements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Statistics</CardTitle>
                    <CardDescription>
                      Average measurements from {measurements.length} record{measurements.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{avgHeight.toFixed(1)} cm</p>
                        <p className="text-sm text-muted-foreground">Average Height</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{avgGirth.toFixed(1)} mm</p>
                        <p className="text-sm text-muted-foreground">Average Girth</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{measurements.length}</p>
                        <p className="text-sm text-muted-foreground">Total Measurements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="measurements" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Measurements</h3>
                  <p className="text-sm text-muted-foreground">
                    Growth tracking data for this batch
                  </p>
                </div>
                <Button onClick={() => router.push(`/measurements/new?batchId=${batch.id}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Measurement
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  {measurementsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                    </div>
                  ) : measurements.length === 0 ? (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No measurements recorded yet</p>
                      <Button 
                        onClick={() => router.push(`/measurements/new?batchId=${batch.id}`)}
                        className="mt-4"
                        variant="outline"
                      >
                        Add first measurement
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Height (cm)</TableHead>
                          <TableHead>Girth (mm)</TableHead>
                          <TableHead>Sample Size</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead>Recorded By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {measurements.map((measurement) => (
                          <TableRow key={measurement.id}>
                            <TableCell>{formatDate(measurement.createdAt)}</TableCell>
                            <TableCell className="font-medium">{measurement.height}</TableCell>
                            <TableCell className="font-medium">{measurement.girth}</TableCell>
                            <TableCell>{measurement.sampleSize}</TableCell>
                            <TableCell className="max-w-48 truncate">
                              {measurement.notes || '-'}
                            </TableCell>
                            <TableCell>{measurement.user?.firstName} {measurement.user?.lastName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Batch History</CardTitle>
                  <CardDescription>
                    Track changes and updates to this batch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4" />
                    <p>Batch history tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}  return (
    <div className="max-w-4xl mx-auto py-4">
      <h1 className="text-xl font-bold mb-4">Batch Growth Details</h1>

      {isLoading && <p>Loading growth chart...</p>}
      {error && <p>Error loading chart.</p>}

      {data && data.length > 0 ? (
        <GrowthLineChart data={data} />
      ) : (
        !isLoading && <p>No growth data yet.</p>
      )}
    </div>
  )
}
