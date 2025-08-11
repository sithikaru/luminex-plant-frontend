'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText,
  Download,
  Filter,
  Calendar,
  Search,
  Plus,
  Eye,
  Share,
  Archive,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Sprout,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { formatDate, formatDateTime } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  downloadCount: number;
  size: string;
  format: 'PDF' | 'XLSX' | 'CSV' | 'DOC';
  isPublic: boolean;
}

enum ReportType {
  GROWTH_ANALYTICS = 'GROWTH_ANALYTICS',
  BATCH_SUMMARY = 'BATCH_SUMMARY',
  ZONE_PERFORMANCE = 'ZONE_PERFORMANCE',
  USER_ACTIVITY = 'USER_ACTIVITY',
  FINANCIAL = 'FINANCIAL',
  CUSTOM = 'CUSTOM',
}

const reportTypeColors = {
  GROWTH_ANALYTICS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  BATCH_SUMMARY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ZONE_PERFORMANCE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  USER_ACTIVITY: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  FINANCIAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CUSTOM: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const reportTypeIcons = {
  GROWTH_ANALYTICS: TrendingUp,
  BATCH_SUMMARY: Sprout,
  ZONE_PERFORMANCE: MapPin,
  USER_ACTIVITY: Users,
  FINANCIAL: BarChart3,
  CUSTOM: FileText,
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [authorFilter, setAuthorFilter] = useState<string>('ALL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as ReportType | '',
    tags: '',
    format: 'PDF' as 'PDF' | 'XLSX' | 'CSV' | 'DOC',
    isPublic: true,
  });

  // Mock data
  const mockReports: Report[] = [
    {
      id: '1',
      title: 'Monthly Growth Analytics Report',
      description: 'Comprehensive analysis of plant growth rates, health metrics, and environmental factors for July 2024',
      type: ReportType.GROWTH_ANALYTICS,
      author: 'John Doe',
      createdAt: '2024-08-01T10:00:00Z',
      updatedAt: '2024-08-01T10:00:00Z',
      tags: ['growth', 'analytics', 'monthly', 'health'],
      downloadCount: 24,
      size: '2.4 MB',
      format: 'PDF',
      isPublic: true,
    },
    {
      id: '2',
      title: 'Zone Performance Summary Q2 2024',
      description: 'Performance metrics and utilization analysis for all zones during the second quarter',
      type: ReportType.ZONE_PERFORMANCE,
      author: 'Jane Smith',
      createdAt: '2024-07-30T14:30:00Z',
      updatedAt: '2024-07-30T14:30:00Z',
      tags: ['zones', 'performance', 'quarterly', 'utilization'],
      downloadCount: 18,
      size: '1.8 MB',
      format: 'XLSX',
      isPublic: true,
    },
    {
      id: '3',
      title: 'Batch Production Report - July',
      description: 'Detailed production metrics, success rates, and batch timelines for July 2024',
      type: ReportType.BATCH_SUMMARY,
      author: 'Mike Johnson',
      createdAt: '2024-07-28T09:15:00Z',
      updatedAt: '2024-07-28T09:15:00Z',
      tags: ['batches', 'production', 'metrics', 'timeline'],
      downloadCount: 31,
      size: '3.1 MB',
      format: 'PDF',
      isPublic: false,
    },
    {
      id: '4',
      title: 'User Activity and Task Completion Report',
      description: 'Analysis of user engagement, task completion rates, and productivity metrics',
      type: ReportType.USER_ACTIVITY,
      author: 'Sarah Wilson',
      createdAt: '2024-07-25T16:45:00Z',
      updatedAt: '2024-07-25T16:45:00Z',
      tags: ['users', 'tasks', 'productivity', 'engagement'],
      downloadCount: 12,
      size: '856 KB',
      format: 'CSV',
      isPublic: true,
    },
    {
      id: '5',
      title: 'Financial Summary - H1 2024',
      description: 'Revenue, costs, and profitability analysis for the first half of 2024',
      type: ReportType.FINANCIAL,
      author: 'David Brown',
      createdAt: '2024-07-20T11:20:00Z',
      updatedAt: '2024-07-20T11:20:00Z',
      tags: ['financial', 'revenue', 'costs', 'profitability'],
      downloadCount: 8,
      size: '1.2 MB',
      format: 'XLSX',
      isPublic: false,
    },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!formData.title || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newReport: Report = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type as ReportType,
        author: 'Current User', // TODO: Get from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        downloadCount: 0,
        size: '0 KB',
        format: formData.format,
        isPublic: formData.isPublic,
      };
      
      setReports(prev => [newReport, ...prev]);
      toast.success('Report created successfully');
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      // Simulate download
      const report = reports.find(r => r.id === reportId);
      if (report) {
        // Update download count
        setReports(prev => 
          prev.map(r => 
            r.id === reportId 
              ? { ...r, downloadCount: r.downloadCount + 1 }
              : r
          )
        );
        toast.success(`Downloading ${report.title}...`);
      }
      
      // TODO: Replace with actual download implementation
      // const response = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `${report.title}.${report.format.toLowerCase()}`);
      // document.body.appendChild(link);
      // link.click();
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      tags: '',
      format: 'PDF',
      isPublic: true,
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || report.type === typeFilter;
    const matchesAuthor = authorFilter === 'ALL' || report.author === authorFilter;
    return matchesSearch && matchesType && matchesAuthor;
  });

  const uniqueAuthors = Array.from(new Set(reports.map(r => r.author)));

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
            <h1 className="text-3xl font-bold gradient-text">Reports & Documentation</h1>
            <p className="text-muted-foreground mt-1">
              Generate, manage, and share analytical reports and documentation
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Generate a new analytical report or documentation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Monthly Growth Analytics Report"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the report content..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="type">Report Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ReportType })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GROWTH_ANALYTICS">Growth Analytics</SelectItem>
                        <SelectItem value="BATCH_SUMMARY">Batch Summary</SelectItem>
                        <SelectItem value="ZONE_PERFORMANCE">Zone Performance</SelectItem>
                        <SelectItem value="USER_ACTIVITY">User Activity</SelectItem>
                        <SelectItem value="FINANCIAL">Financial</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="format">Format</Label>
                    <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="XLSX">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="DOC">Word</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., growth, analytics, monthly"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic">Make report publicly accessible</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateReport} className="flex-1">
                    Create Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
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
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-plant-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Public Reports</p>
                  <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.isPublic).length}</p>
                </div>
                <Share className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
                  </p>
                </div>
                <Download className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {reports.filter(r => {
                      const reportDate = new Date(r.createdAt);
                      const now = new Date();
                      return reportDate.getMonth() === now.getMonth() && 
                             reportDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
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
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="GROWTH_ANALYTICS">Growth Analytics</SelectItem>
                    <SelectItem value="BATCH_SUMMARY">Batch Summary</SelectItem>
                    <SelectItem value="ZONE_PERFORMANCE">Zone Performance</SelectItem>
                    <SelectItem value="USER_ACTIVITY">User Activity</SelectItem>
                    <SelectItem value="FINANCIAL">Financial</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Authors</SelectItem>
                    {uniqueAuthors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reports found</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first report
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Downloads</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report, index) => {
                        const IconComponent = reportTypeIcons[report.type];
                        
                        return (
                          <motion.tr
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{report.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {report.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {report.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {report.tags.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{report.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={reportTypeColors[report.type]}>
                                {report.type.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {report.author}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDate(report.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {report.downloadCount}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {report.size}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={report.isPublic ? "default" : "secondary"}>
                                {report.isPublic ? 'Public' : 'Private'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {}}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReport(report.id)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
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
