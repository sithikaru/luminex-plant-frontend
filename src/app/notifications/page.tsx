'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  User,
  Filter,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Notification, NotificationType } from '@/types/domain';
import { formatDate, formatDateTime } from '@/lib/utils';

const notificationIcons = {
  MEASUREMENT_DUE: Clock,
  BATCH_READY: CheckCheck,
  TASK_ASSIGNED: User,
  SYSTEM_ALERT: AlertTriangle,
};

const notificationColors = {
  MEASUREMENT_DUE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  BATCH_READY: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  TASK_ASSIGNED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SYSTEM_ALERT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const router = useRouter();

  // Mock data for development
  const mockNotifications: Notification[] = [
    {
      id: '1',
      userId: 'user1',
      type: NotificationType.MEASUREMENT_DUE,
      title: 'Weekly Measurements Due',
      message: 'Batch PU240811001 requires weekly growth measurements',
      isRead: false,
      createdAt: '2024-08-11T09:00:00Z',
    },
    {
      id: '2',
      userId: 'user1',
      type: NotificationType.BATCH_READY,
      title: 'Batch Ready for Delivery',
      message: 'Batch PU240808001 has reached target growth parameters',
      isRead: false,
      createdAt: '2024-08-11T08:30:00Z',
    },
    {
      id: '3',
      userId: 'user1',
      type: NotificationType.TASK_ASSIGNED,
      title: 'New Task Assigned',
      message: 'You have been assigned to record measurements for Zone A',
      isRead: true,
      createdAt: '2024-08-10T15:45:00Z',
    },
    {
      id: '4',
      userId: 'user1',
      type: NotificationType.SYSTEM_ALERT,
      title: 'Low Bed Capacity Alert',
      message: 'Zone B has exceeded 90% capacity utilization',
      isRead: true,
      createdAt: '2024-08-10T12:20:00Z',
    },
    {
      id: '5',
      userId: 'user1',
      type: NotificationType.MEASUREMENT_DUE,
      title: 'Growth Check Reminder',
      message: 'Multiple batches in Zone C need weekly measurements',
      isRead: false,
      createdAt: '2024-08-09T10:15:00Z',
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 1000);
      
      // Uncomment when API is ready:
      // const response = await api.get('/notifications');
      // setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      toast.success('Notification marked as read');
      
      // Uncomment when API is ready:
      // await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      toast.success('All notifications marked as read');
      
      // Uncomment when API is ready:
      // await api.put('/notifications/read-all');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // TODO: Replace with actual API call
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      toast.success('Notification deleted');
      
      // Uncomment when API is ready:
      // await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'UNREAD' && !notification.isRead) ||
                         (statusFilter === 'READ' && notification.isRead);
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
              <Bell className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with important system alerts and reminders
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <div className="h-8 w-8 bg-plant-100 dark:bg-plant-900/30 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-plant-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'TASK_ASSIGNED').length}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'SYSTEM_ALERT').length}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
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
                      placeholder="Search notifications..."
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
                    <SelectItem value="MEASUREMENT_DUE">Measurements</SelectItem>
                    <SelectItem value="BATCH_READY">Ready Batches</SelectItem>
                    <SelectItem value="TASK_ASSIGNED">Tasks</SelectItem>
                    <SelectItem value="SYSTEM_ALERT">Alerts</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="UNREAD">Unread</SelectItem>
                    <SelectItem value="READ">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plant-600"></div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => {
                    const Icon = notificationIcons[notification.type];
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          notification.isRead 
                            ? 'bg-muted/30 border-muted' 
                            : 'bg-background border-plant-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            notification.isRead ? 'bg-muted' : 'bg-plant-100 dark:bg-plant-900/30'
                          }`}>
                            <Icon className={`h-4 w-4 ${
                              notification.isRead ? 'text-muted-foreground' : 'text-plant-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className={`font-medium ${
                                  notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="inline-block w-2 h-2 bg-plant-500 rounded-full ml-2"></span>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge className={notificationColors[notification.type]}>
                                    {notification.type.replace('_', ' ')}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDateTime(notification.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
