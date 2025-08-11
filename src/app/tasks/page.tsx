'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Task, TaskType, User as UserType, UserRole } from '@/types/domain';
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as TaskType | '',
    priority: 'MEDIUM',
    userId: '',
    dueDate: '',
    batchId: '',
    zoneId: '',
  });
  const router = useRouter();

  // Mock data for development
  const mockTasks: Task[] = [
    {
      id: '1',
      userId: 'user1',
      type: TaskType.MEASUREMENT,
      title: 'Weekly Growth Measurements - Zone A',
      description: 'Record growth measurements for all batches in Zone A',
      dueDate: '2024-08-15T10:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-11T09:00:00Z',
      user: { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '2',
      userId: 'user2',
      type: TaskType.STAGE_TRANSITION,
      title: 'Move Batch to Growing Stage',
      description: 'Transfer batch PU240808001 from propagation to growing stage',
      dueDate: '2024-08-14T14:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-11T08:30:00Z',
      user: { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '3',
      userId: 'user1',
      type: TaskType.MAINTENANCE,
      title: 'Irrigation System Check',
      description: 'Inspect and clean irrigation system in Zone B',
      dueDate: '2024-08-13T16:00:00Z',
      isCompleted: true,
      createdAt: '2024-08-10T15:45:00Z',
      completedAt: '2024-08-13T15:30:00Z',
      user: { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '4',
      userId: 'user3',
      type: TaskType.INSPECTION,
      title: 'Quality Control Inspection',
      description: 'Perform quality check on ready batches in Zone C',
      dueDate: '2024-08-16T09:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-10T12:20:00Z',
      user: { id: 'user3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: UserRole.MANAGER, isActive: true, createdAt: '', updatedAt: '' },
    },
  ];

  const mockUsers: UserType[] = [
    { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'user3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: UserRole.MANAGER, isActive: true, createdAt: '', updatedAt: '' },
  ];

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 1000);
      
      // Uncomment when API is ready:
      // const response = await api.get('/tasks');
      // setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // TODO: Replace with actual API call
      setUsers(mockUsers);
      
      // Uncomment when API is ready:
      // const response = await api.get('/users');
      // setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!formData.title || !formData.type || !formData.userId || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Replace with actual API call
      const newTask: Task = {
        id: Date.now().toString(),
        userId: formData.userId,
        type: formData.type as TaskType,
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        user: users.find(u => u.id === formData.userId),
      };
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
      
      // Uncomment when API is ready:
      // await api.post('/tasks', formData);
      
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      // TODO: Replace with actual API call
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, isCompleted: true, completedAt: new Date().toISOString() }
            : task
        )
      );
      toast.success('Task marked as completed');
      
      // Uncomment when API is ready:
      // await api.put(`/tasks/${taskId}/complete`);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      // TODO: Replace with actual API call
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      
      // Uncomment when API is ready:
      // await api.delete(`/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      priority: 'MEDIUM',
      userId: '',
      dueDate: '',
      batchId: '',
      zoneId: '',
    });
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingTask(null);
    resetForm();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || task.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'COMPLETED' && task.isCompleted) ||
                         (statusFilter === 'PENDING' && !task.isCompleted);
    const matchesAssignee = assigneeFilter === 'ALL' || task.userId === assigneeFilter;
    return matchesSearch && matchesType && matchesStatus && matchesAssignee;
  });

  const getTaskPriority = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'URGENT';
    if (diffHours < 24) return 'HIGH';
    if (diffHours < 72) return 'MEDIUM';
    return 'LOW';
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
            <h1 className="text-3xl font-bold gradient-text">Task Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track field operations and maintenance tasks
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Assign a new task to a team member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Weekly measurements for Zone A"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed task description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="type">Task Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as TaskType })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                    <Label htmlFor="assignee">Assignee *</Label>
                    <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Button onClick={handleCreateTask} className="flex-1">
                    Create Task
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
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-plant-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{tasks.filter(t => !t.isCompleted).length}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.isCompleted).length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date()).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
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
                      placeholder="Search tasks..."
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
                    <SelectItem value="MEASUREMENT">Measurement</SelectItem>
                    <SelectItem value="STAGE_TRANSITION">Stage Transition</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="INSPECTION">Inspection</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Assignees</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks found</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first task
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task, index) => {
                        const priority = getTaskPriority(task.dueDate);
                        const isOverdue = !task.isCompleted && new Date(task.dueDate) < new Date();
                        
                        return (
                          <motion.tr
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                  {task.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={taskTypeColors[task.type]}>
                                {task.type.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {task.user?.firstName} {task.user?.lastName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                                {formatDateTime(task.dueDate)}
                                {isOverdue && (
                                  <p className="text-xs text-red-600">Overdue</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={priorityColors[priority]}>
                                {priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {task.isCompleted ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-green-600">Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 text-orange-600" />
                                    <span className="text-orange-600">Pending</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {!task.isCompleted && (
                                    <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Mark Complete
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTask(task.id)}
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
