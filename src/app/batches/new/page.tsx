'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Package, 
  Sprout, 
  Scissors,
  ExternalLink,
  MapPin,
  Plus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Species, Zone, Bed, PathwayType } from '@/types/domain';

const pathwayConfig = {
  PURCHASING: {
    title: 'Purchasing Plants',
    description: 'Plants purchased from external suppliers',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    steps: ['Initial Data', 'Media Transfer', 'Propagation', '60% Shade Area', 'Growing Zone', 'Hardening'],
  },
  SEED_GERMINATION: {
    title: 'Seed Germination',
    description: 'Growing plants from seeds',
    icon: Sprout,
    color: 'from-green-500 to-green-600',
    steps: ['Seed Data', 'Media Selection', 'Jiffy Processing', 'Propagation', '80% Shade Area', 'Growing Zone'],
  },
  CUTTING_GERMINATION: {
    title: 'Cutting Germination',
    description: 'Growing plants from cuttings',
    icon: Scissors,
    color: 'from-purple-500 to-purple-600',
    steps: ['Cutting Data', 'Jiffy Options', 'Direct Propagation', 'Growing Integration'],
  },
  OUT_SOURCING: {
    title: 'Out Sourcing',
    description: 'Plants from external sourcing partners',
    icon: ExternalLink,
    color: 'from-orange-500 to-orange-600',
    steps: ['Sourcing Data', 'Layering Process', '30cm Plastic Pot', 'Integration'],
  },
};

export default function NewBatchPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPathway, setSelectedPathway] = useState<PathwayType | null>(null);
  const [species, setSpecies] = useState<Species[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pathway: '' as PathwayType | '',
    speciesId: '',
    customName: '',
    initialQty: '',
    zoneId: '',
    bedId: '',
    supplierLocation: '',
    media: '',
    notes: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchSpecies();
    fetchZones();
  }, []);

  useEffect(() => {
    if (formData.zoneId) {
      fetchBeds(formData.zoneId);
    }
  }, [formData.zoneId]);

  const fetchSpecies = async () => {
    try {
      const response = await api.get('/species');
      setSpecies(response.data);
    } catch (error) {
      console.error('Error fetching species:', error);
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

  const fetchBeds = async (zoneId: string) => {
    try {
      const response = await api.get(`/zones/${zoneId}/beds`);
      setBeds(response.data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setBeds([]);
    }
  };

  const handlePathwaySelect = (pathway: PathwayType) => {
    setSelectedPathway(pathway);
    setFormData({ ...formData, pathway });
    setCurrentStep(2);
  };

  const handleCreateBatch = async () => {
    if (!formData.pathway || !formData.speciesId || !formData.initialQty) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/batches', {
        pathway: formData.pathway,
        speciesId: formData.speciesId,
        customName: formData.customName || undefined,
        initialQty: parseInt(formData.initialQty),
        zoneId: formData.zoneId || undefined,
        bedId: formData.bedId || undefined,
        notes: formData.notes || undefined,
      });
      toast.success('Batch created successfully');
      router.push('/batches');
    } catch (error) {
      console.error('Error creating batch:', error);
      toast.error('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

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

  const renderPathwaySelection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Select Processing Pathway</h2>
        <p className="text-muted-foreground mt-2">
          Choose the pathway that matches your plant source
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(pathwayConfig) as [PathwayType, typeof pathwayConfig[PathwayType]][]).map(([pathway, config]) => {
          const Icon = config.icon;
          return (
            <motion.div
              key={pathway}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 border-2 hover:border-plant-300 ${
                  selectedPathway === pathway ? 'border-plant-500 bg-plant-50 dark:bg-plant-900/20' : 'border-border'
                }`}
                onClick={() => handlePathwaySelect(pathway)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${config.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.title}</CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Process Steps:</p>
                    <div className="flex flex-wrap gap-1">
                      {config.steps.map((step, index) => (
                        <span 
                          key={step}
                          className="text-xs px-2 py-1 bg-muted rounded-full"
                        >
                          {index + 1}. {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderBatchDetails = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Batch Details</h2>
        <p className="text-muted-foreground mt-2">
          Configure your new {pathwayConfig[selectedPathway!].title.toLowerCase()} batch
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Selected Pathway Display */}
        <Card className="border-plant-200 bg-plant-50 dark:bg-plant-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {React.createElement(pathwayConfig[selectedPathway!].icon, {
                className: 'h-6 w-6 text-plant-600'
              })}
              <div>
                <h3 className="font-semibold">{pathwayConfig[selectedPathway!].title}</h3>
                <p className="text-sm text-muted-foreground">{pathwayConfig[selectedPathway!].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="species">Plant Species *</Label>
                <Select value={formData.speciesId} onValueChange={(value) => setFormData({ ...formData, speciesId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((species) => (
                      <SelectItem key={species.id} value={species.id}>
                        {species.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="initialQty">Initial Quantity *</Label>
                <Input
                  id="initialQty"
                  type="number"
                  value={formData.initialQty}
                  onChange={(e) => setFormData({ ...formData, initialQty: e.target.value })}
                  placeholder="Number of plants"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customName">Custom Batch Name (Optional)</Label>
              <Input
                id="customName"
                value={formData.customName}
                onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                placeholder="e.g., Spring 2024 Hibiscus Collection"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Location Assignment</CardTitle>
            <CardDescription>Assign the batch to a specific zone and bed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zone">Zone</Label>
                <Select value={formData.zoneId} onValueChange={(value) => setFormData({ ...formData, zoneId: value, bedId: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
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
                <Label htmlFor="bed">Bed</Label>
                <Select 
                  value={formData.bedId} 
                  onValueChange={(value) => setFormData({ ...formData, bedId: value })}
                  disabled={!formData.zoneId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {beds.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id}>
                        {bed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pathway-specific fields */}
        {formData.pathway === 'PURCHASING' && (
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="supplierLocation">Supplier Location</Label>
                <Input
                  id="supplierLocation"
                  value={formData.supplierLocation}
                  onChange={(e) => setFormData({ ...formData, supplierLocation: e.target.value })}
                  placeholder="Supplier name and location"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {(formData.pathway === 'SEED_GERMINATION' || formData.pathway === 'CUTTING_GERMINATION') && (
          <Card>
            <CardHeader>
              <CardTitle>Media Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="media">Growing Media</Label>
                <Select value={formData.media} onValueChange={(value) => setFormData({ ...formData, media: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perlite">Perlite</SelectItem>
                    <SelectItem value="cocopeat">Cocopeat</SelectItem>
                    <SelectItem value="rock_peat">Rock Peat</SelectItem>
                    <SelectItem value="sphagnum">Sphagnum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information about this batch..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pathway
          </Button>
          <Button 
            onClick={handleCreateBatch}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Create Batch
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/batches')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Create New Batch</h1>
            <p className="text-muted-foreground mt-1">
              Follow the pathway-specific process to create a new plant batch
            </p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-plant-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  <span className={currentStep >= 1 ? 'font-medium' : 'text-muted-foreground'}>
                    Select Pathway
                  </span>
                </div>
                <div className={`flex-1 h-px mx-4 ${currentStep > 1 ? 'bg-plant-500' : 'bg-muted'}`} />
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-plant-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    2
                  </div>
                  <span className={currentStep >= 2 ? 'font-medium' : 'text-muted-foreground'}>
                    Batch Details
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Content */}
        {currentStep === 1 && renderPathwaySelection()}
        {currentStep === 2 && renderBatchDetails()}
      </motion.div>
    </DashboardLayout>
  );
}
