'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  MapPin, 
  Sprout, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Activity,
  Target,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { toast } from 'react-hot-toast';

// Mock data for charts
const growthTrendData = [
  { month: 'Jan', girth: 12.5, height: 45.2, batches: 85 },
  { month: 'Feb', girth: 13.1, height: 47.8, batches: 92 },
  { month: 'Mar', girth: 13.8, height: 51.3, batches: 98 },
  { month: 'Apr', girth: 14.2, height: 53.7, batches: 105 },
  { month: 'May', girth: 14.9, height: 56.1, batches: 112 },
  { month: 'Jun', girth: 15.3, height: 58.4, batches: 118 },
];

const zoneUtilizationData = [
  { zone: 'Zone A', capacity: 1000, occupied: 850, utilization: 85 },
  { zone: 'Zone B', capacity: 800, occupied: 720, utilization: 90 },
  { zone: 'Zone C', capacity: 1200, occupied: 960, utilization: 80 },
  { zone: 'Zone D', capacity: 600, occupied: 480, utilization: 80 },
  { zone: 'Zone E', capacity: 900, occupied: 630, utilization: 70 },
];

const speciesDistributionData = [
  { name: 'Hibiscus', value: 35, color: '#10B981' },
  { name: 'Rose', value: 25, color: '#F59E0B' },
  { name: 'Jasmine', value: 20, color: '#3B82F6' },
  { name: 'Bougainvillea', value: 12, color: '#8B5CF6' },
  { name: 'Others', value: 8, color: '#6B7280' },
];

const productionForecastData = [
  { month: 'Jul', predicted: 125, actual: 118 },
  { month: 'Aug', predicted: 132, actual: 128 },
  { month: 'Sep', predicted: 140, actual: null },
  { month: 'Oct', predicted: 148, actual: null },
  { month: 'Nov', predicted: 155, actual: null },
  { month: 'Dec', predicted: 162, actual: null },
];

const readinessTimelineData = [
  { week: 'Week 1', ready: 45, delayed: 5 },
  { week: 'Week 2', ready: 52, delayed: 8 },
  { week: 'Week 3', ready: 38, delayed: 12 },
  { week: 'Week 4', ready: 61, delayed: 4 },
  { week: 'Week 5', ready: 48, delayed: 7 },
  { week: 'Week 6', ready: 55, delayed: 9 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const handleRefreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Analytics data refreshed');
    }, 2000);
  };

  const handleExportReport = () => {
    toast.success('Analytics report exported successfully');
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
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your plant production and growth analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Zone Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Zones</SelectItem>
                    <SelectItem value="zone-a">Zone A</SelectItem>
                    <SelectItem value="zone-b">Zone B</SelectItem>
                    <SelectItem value="zone-c">Zone C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Production Rate</p>
                  <p className="text-2xl font-bold">125</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Growth Rate</p>
                  <p className="text-2xl font-bold">15.3cm</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">+8%</span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Zone Efficiency</p>
                  <p className="text-2xl font-bold">82%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-xs text-red-600">-3%</span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready Time</p>
                  <p className="text-2xl font-bold">14.5d</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">-2d</span>
                  </div>
                </div>
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="growth" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="growth">Growth Analytics</TabsTrigger>
              <TabsTrigger value="zones">Zone Performance</TabsTrigger>
              <TabsTrigger value="production">Production Forecast</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Trend Analysis</CardTitle>
                    <CardDescription>
                      Average growth measurements over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growthTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="girth" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Avg Girth (mm)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="height" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="Avg Height (cm)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Species Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Species Distribution</CardTitle>
                    <CardDescription>
                      Current batch distribution by species
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={speciesDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {speciesDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Batch Readiness Timeline */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Batch Readiness Timeline</CardTitle>
                    <CardDescription>
                      Weekly comparison of ready vs delayed batches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={readinessTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ready" fill="#10B981" name="Ready on Time" />
                        <Bar dataKey="delayed" fill="#EF4444" name="Delayed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="zones" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Zone Utilization Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Zone Utilization Analysis</CardTitle>
                    <CardDescription>
                      Capacity utilization across all growing zones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={zoneUtilizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zone" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="capacity" fill="#E5E7EB" name="Total Capacity" />
                        <Bar dataKey="occupied" fill="#3B82F6" name="Currently Occupied" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Zone Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Zone Performance</CardTitle>
                    <CardDescription>Key metrics by zone</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {zoneUtilizationData.map((zone) => (
                        <div key={zone.zone} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{zone.zone}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-plant-400 to-plant-600 h-2 rounded-full"
                                style={{ width: `${zone.utilization}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {zone.utilization}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts and Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Zone Alerts</CardTitle>
                    <CardDescription>Capacity and performance alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            Zone B Over Capacity
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-300">
                            90% utilization - consider redistribution
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Zone E Underutilized
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-300">
                            70% utilization - opportunity for expansion
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Forecast */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Production Forecast</CardTitle>
                    <CardDescription>
                      Predicted vs actual batch completion rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={productionForecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="predicted" 
                          stackId="1"
                          stroke="#8B5CF6" 
                          fill="#8B5CF6"
                          fillOpacity={0.3}
                          name="Predicted"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="actual" 
                          stackId="2"
                          stroke="#10B981" 
                          fill="#10B981"
                          fillOpacity={0.8}
                          name="Actual"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Production Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Forecast Accuracy</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Avg Cycle Time</span>
                        <span className="font-medium">21.5 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <span className="font-medium text-green-600">96.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Loss Rate</span>
                        <span className="font-medium text-red-600">3.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>Data-driven optimization suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Optimize Zone B Allocation
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Redistribute 15% of batches to improve efficiency
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Measurement Frequency
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                          Increase measurement frequency for Hibiscus species
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Insights */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>
                      Machine learning analysis of your plant production data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg border border-plant-200 bg-plant-50 dark:bg-plant-900/20">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-plant-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-plant-800 dark:text-plant-200">
                              Growth Pattern Optimization
                            </h4>
                            <p className="text-sm text-plant-600 dark:text-plant-300 mt-1">
                              Analysis shows that Rose species in Zone A achieve target growth 23% faster 
                              when measurements are taken every 5 days instead of weekly.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">
                              Seasonal Growth Prediction
                            </h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                              Based on historical data, expect 15% increase in growth rates during 
                              the upcoming monsoon season. Consider increasing capacity in Zone C.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-start gap-3">
                          <Activity className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-800 dark:text-purple-200">
                              Resource Allocation Insight
                            </h4>
                            <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                              Reallocating 20% of Jasmine batches from Zone B to Zone E could 
                              reduce overall production time by 2.3 days on average.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-800 dark:text-orange-200">
                              Quality Improvement Opportunity
                            </h4>
                            <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                              Bougainvillea batches show 12% higher loss rates in beds with 
                              lower sun exposure. Consider relocating for better outcomes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
