'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Filter,
  Download,
  List,
  Grid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Task, TaskType, UserRole } from '@/types/domain';
import { formatDate, formatTime } from '@/lib/utils';

const taskTypeColors = {
  MEASUREMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  STAGE_TRANSITION: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  INSPECTION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export default function TaskSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as TaskType | '',
    userId: '',
    dueDate: '',
    dueTime: '09:00',
  });

  // Mock data
  const mockTasks: Task[] = [
    {
      id: '1',
      userId: 'user1',
      type: TaskType.MEASUREMENT,
      title: 'Zone A Measurements',
      description: 'Weekly growth measurements',
      dueDate: '2024-08-15T10:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-11T09:00:00Z',
      user: { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '2',
      userId: 'user2',
      type: TaskType.STAGE_TRANSITION,
      title: 'Batch Transfer',
      description: 'Move batch to next stage',
      dueDate: '2024-08-16T14:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-11T08:30:00Z',
      user: { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '3',
      userId: 'user1',
      type: TaskType.MAINTENANCE,
      title: 'Irrigation Check',
      description: 'Monthly system maintenance',
      dueDate: '2024-08-17T16:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-10T15:45:00Z',
      user: { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    },
    {
      id: '4',
      userId: 'user3',
      type: TaskType.INSPECTION,
      title: 'Quality Assessment',
      description: 'End-of-week quality check',
      dueDate: '2024-08-18T09:00:00Z',
      isCompleted: false,
      createdAt: '2024-08-10T12:20:00Z',
      user: { id: 'user3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: UserRole.MANAGER, isActive: true, createdAt: '', updatedAt: '' },
    },
  ];

  const mockUsers = [
    { id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: UserRole.FIELD_OFFICER, isActive: true, createdAt: '', updatedAt: '' },
    { id: 'user3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: UserRole.MANAGER, isActive: true, createdAt: '', updatedAt: '' },
  ];

  useEffect(() => {
    // TODO: Replace with actual API call
    setTasks(mockTasks);
  }, []);

  useEffect(() => {
    let filtered = tasks;
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(task => task.type === typeFilter);
    }
    setFilteredTasks(filtered);
  }, [tasks, typeFilter]);

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        tasks: getTasksForDate(date),
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        tasks: getTasksForDate(date),
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        tasks: getTasksForDate(date),
      });
    }
    
    return days;
  };

  const getTasksForDate = (date: Date): Task[] => {
    return filteredTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleCreateTask = async () => {
    if (!formData.title || !formData.type || !formData.userId || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}:00`);
      const newTask: Task = {
        id: Date.now().toString(),
        userId: formData.userId,
        type: formData.type as TaskType,
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime.toISOString(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        user: mockUsers.find(u => u.id === formData.userId),
      };
      
      setTasks(prev => [...prev, newTask]);
      toast.success('Task scheduled successfully');
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to schedule task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      userId: '',
      dueDate: '',
      dueTime: '09:00',
    });
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: date.toISOString().split('T')[0],
    }));
    setShowCreateDialog(true);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = generateCalendarDays();

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
            <h1 className="text-3xl font-bold gradient-text">Task Schedule</h1>
            <p className="text-muted-foreground mt-1">
              Plan and schedule field operations and maintenance tasks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
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
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Task</DialogTitle>
                  <DialogDescription>
                    Create and schedule a new task for a specific date and time
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
                          {mockUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="dueDate">Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueTime">Time</Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={formData.dueTime}
                        onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateTask} className="flex-1">
                      Schedule Task
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Calendar Header */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Calendar */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`
                      min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200
                      ${day.isCurrentMonth 
                        ? 'bg-background hover:bg-muted/50 border-border' 
                        : 'bg-muted/30 border-muted text-muted-foreground'
                      }
                      ${day.isToday ? 'ring-2 ring-plant-500 ring-offset-2' : ''}
                      hover:shadow-sm
                    `}
                    onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                  >
                    <div className={`
                      text-sm font-medium mb-2
                      ${day.isToday ? 'text-plant-600 font-bold' : ''}
                      ${!day.isCurrentMonth ? 'text-muted-foreground' : ''}
                    `}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`
                            text-xs p-1 rounded truncate
                            ${taskTypeColors[task.type]}
                          `}
                          title={`${task.title} - ${formatTime(task.dueDate)}`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {day.tasks.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{day.tasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks scheduled for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks
                  .filter(task => {
                    const taskDate = new Date(task.dueDate);
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return taskDate >= now && taskDate <= weekFromNow && !task.isCompleted;
                  })
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge className={taskTypeColors[task.type]}>
                          {task.type.replace('_', ' ')}
                        </Badge>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)} at {formatTime(task.dueDate)}
                            <User className="h-3 w-3 ml-2" />
                            {task.user?.firstName} {task.user?.lastName}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                {filteredTasks.filter(task => {
                  const taskDate = new Date(task.dueDate);
                  const now = new Date();
                  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return taskDate >= now && taskDate <= weekFromNow && !task.isCompleted;
                }).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    <p>No upcoming tasks in the next 7 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
