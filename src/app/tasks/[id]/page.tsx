'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  Check,
  MapPin,
  Sprout,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Task, TaskType, UserRole } from '@/types/domain';
import { formatDate, formatDateTime } from '@/lib/utils';

const taskTypeColors = {
  MEASUREMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  STAGE_TRANSITION: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  INSPECTION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function TaskDetailPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as TaskType | '',
    dueDate: '',
  });
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  // Mock task data
  const mockTask: Task = {
    id: taskId,
    userId: 'user1',
    type: TaskType.MEASUREMENT,
    title: 'Weekly Growth Measurements - Zone A',
    description: 'Record growth measurements for all batches in Zone A. Measure height, girth, and overall health. Note any anomalies or concerns. Update the digital tracking system with all measurements.',
    dueDate: '2024-08-15T10:00:00Z',
    isCompleted: false,
    createdAt: '2024-08-11T09:00:00Z',
    user: { 
      id: 'user1', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com', 
      role: UserRole.FIELD_OFFICER, 
      isActive: true, 
      createdAt: '', 
      updatedAt: '' 
    },
    batchId: 'PU240808001',
    zoneId: 'zone-a',
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setTask(mockTask);
        setFormData({
          title: mockTask.title,
          description: mockTask.description || '',
          type: mockTask.type,
          dueDate: mockTask.dueDate.slice(0, 16), // Format for datetime-local input
        });
        setLoading(false);
      }, 1000);
      
      // Uncomment when API is ready:
      // const response = await api.get(`/tasks/${taskId}`);
      // setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;

    try {
      const updatedTask = { 
        ...task, 
        isCompleted: true, 
        completedAt: new Date().toISOString() 
      };
      setTask(updatedTask);
      toast.success('Task marked as completed');
      
      // TODO: Replace with actual API call
      // await api.put(`/tasks/${taskId}/complete`);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const handleUpdateTask = async () => {
    if (!formData.title || !formData.type || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedTask = {
        ...task!,
        title: formData.title,
        description: formData.description,
        type: formData.type as TaskType,
        dueDate: new Date(formData.dueDate).toISOString(),
      };
      setTask(updatedTask);
      toast.success('Task updated successfully');
      setShowEditDialog(false);
      
      // TODO: Replace with actual API call
      // await api.put(`/tasks/${taskId}`, formData);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      toast.success('Task deleted successfully');
      router.push('/tasks');
      
      // TODO: Replace with actual API call
      // await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getTaskPriority = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'URGENT';
    if (diffHours < 24) return 'HIGH';
    if (diffHours < 72) return 'MEDIUM';
    return 'LOW';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Task not found</p>
          <Button onClick={() => router.push('/tasks')} className="mt-4">
            Back to Tasks
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const priority = getTaskPriority(task.dueDate);
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/tasks')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Task Details</h1>
              <p className="text-muted-foreground mt-1">Task ID: {task.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!task.isCompleted && (
              <Button
                onClick={handleCompleteTask}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                  <DialogDescription>
                    Update task details and information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Task Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as TaskType })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEASUREMENT">Measurement</SelectItem>
                        <SelectItem value="STAGE_TRANSITION">Stage Transition</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="INSPECTION">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateTask} className="flex-1">
                      Update Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Task Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Task Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={taskTypeColors[task.type]}>
                        {task.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={priorityColors[priority]}>
                        {priority}
                      </Badge>
                      {task.isCompleted && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                  </div>
                  {task.isCompleted ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Clock className="h-8 w-8 text-orange-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {task.description || 'No description provided'}
                  </p>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Due Date</p>
                        <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {formatDateTime(task.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Assigned To</p>
                        <p className="text-sm text-muted-foreground">
                          {task.user?.firstName} {task.user?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(task.createdAt)}
                        </p>
                      </div>
                    </div>
                    {task.completedAt && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Completed</p>
                          <p className="text-sm text-green-600">
                            {formatDateTime(task.completedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Information */}
          <div className="space-y-6">
            {/* Related Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {task.batchId && (
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-plant-600" />
                    <div>
                      <p className="text-sm font-medium">Batch</p>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm text-plant-600"
                        onClick={() => router.push(`/batches/${task.batchId}`)}
                      >
                        {task.batchId}
                      </Button>
                    </div>
                  </div>
                )}
                {task.zoneId && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Zone</p>
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-sm text-blue-600"
                        onClick={() => router.push(`/zones`)}
                      >
                        Zone {task.zoneId?.toUpperCase()}
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Assignee Role</p>
                    <p className="text-sm text-muted-foreground">
                      {task.user?.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <span className={`text-sm ${task.isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                      {task.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        task.isCompleted ? 'bg-green-600 w-full' : 'bg-orange-600 w-1/3'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {task.isCompleted 
                      ? 'Task completed successfully' 
                      : `Task in progress - Due ${formatDate(task.dueDate)}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
