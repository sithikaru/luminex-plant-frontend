'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sprout,
  TreePine,
  MapPin,
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { DashboardStats, UserRole } from '@/types/domain';
import { dashboardApi } from '@/lib/api';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

// Mock data for development
const mockStats: DashboardStats = {
  totalBatches: 1247,
  readyBatches: 89,
  inProgressBatches: 1158,
  totalPlants: 45623,
  activeSpecies: 23,
  zonesUtilization: 78.5,
  pendingTasks: 15,
  weeklyMeasurements: 234,
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'batch_created',
    description: 'New batch created: Hibiscus rosa-sinensis',
    timestamp: '2024-08-11T10:30:00Z',
    user: 'John Smith',
  },
  {
    id: '2',
    type: 'measurement_recorded',
    description: 'Growth measurements recorded for batch PU240811001',
    timestamp: '2024-08-11T09:15:00Z',
    user: 'Sarah Wilson',
  },
  {
    id: '3',
    type: 'batch_ready',
    description: 'Batch PU240810001 marked as ready for delivery',
    timestamp: '2024-08-11T08:45:00Z',
    user: 'Mike Johnson',
  },
  {
    id: '4',
    type: 'stage_transition',
    description: 'Batch moved from Propagation to Growing stage',
    timestamp: '2024-08-10T16:20:00Z',
    user: 'Emily Brown',
  },
];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  description, 
  color = 'blue',
  delay = 0 
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: { value: number; isPositive: boolean };
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  delay?: number;
}) => {
  const colorClasses = {
    blue: 'from-sky-400 to-sky-600',
    green: 'from-plant-400 to-plant-600',
    yellow: 'from-earth-400 to-earth-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      <Card className="hover-lift transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`w-8 h-8 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {change.isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={change.isPositive ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(change.value)}%
              </span>
              <span className="ml-1">from last week</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActivityItem = ({ activity, index }: { activity: any; index: number }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'batch_created':
        return <Plus className="h-4 w-4 text-plant-500" />;
      case 'measurement_recorded':
        return <Activity className="h-4 w-4 text-sky-500" />;
      case 'batch_ready':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'stage_transition':
        return <ArrowUpRight className="h-4 w-4 text-earth-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center flex-shrink-0">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{activity.description}</p>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <span>{activity.user}</span>
          <span className="mx-2">•</span>
          <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role as UserRole;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For now, use mock data. Replace with actual API calls when backend is ready
        setTimeout(() => {
          setStats(mockStats);
          setRecentActivity(mockRecentActivity);
          setLoading(false);
        }, 1000);
        
        // Uncomment when backend is ready:
        // const [statsResponse, activityResponse] = await Promise.all([
        //   dashboardApi.getStats(),
        //   dashboardApi.getRecentActivity(),
        // ]);
        // setStats(statsResponse.data);
        // setRecentActivity(activityResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-plant-500 border-t-transparent rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-2"
        >
          <h1 className="text-3xl font-bold gradient-text">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your plants today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Batches"
            value={stats?.totalBatches.toLocaleString() || '0'}
            icon={Sprout}
            change={{ value: 12, isPositive: true }}
            description="Active plant batches"
            color="green"
            delay={0.1}
          />
          <StatCard
            title="Ready Plants"
            value={stats?.readyBatches.toLocaleString() || '0'}
            icon={CheckCircle2}
            change={{ value: 8, isPositive: true }}
            description="Ready for delivery"
            color="blue"
            delay={0.2}
          />
          <StatCard
            title="Total Plants"
            value={stats?.totalPlants.toLocaleString() || '0'}
            icon={TreePine}
            change={{ value: 5, isPositive: true }}
            description="Individual plants tracked"
            color="purple"
            delay={0.3}
          />
          <StatCard
            title="Zone Utilization"
            value={`${stats?.zonesUtilization || 0}%`}
            icon={MapPin}
            change={{ value: 3, isPositive: false }}
            description="Average across all zones"
            color="yellow"
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates across your plant management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Batch
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Record Measurements
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                {(userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MANAGER) && (
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Tasks Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>
                  Pending tasks and reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Measurements Due</span>
                  <span className="text-sm font-medium">{stats?.pendingTasks || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stage Transitions</span>
                  <span className="text-sm font-medium">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality Checks</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <Button className="w-full mt-4" size="sm">
                  View All Tasks
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
