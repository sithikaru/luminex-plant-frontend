'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Bell, 
  LogOut, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Search,
  Zap,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import Sidebar from './Sidebar';
import { toast } from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    toast.loading('Signing out...', { id: 'signout' });
    try {
      await signOut({ callbackUrl: '/login' });
      toast.success('Signed out successfully', { id: 'signout' });
    } catch (error) {
      toast.error('Failed to sign out', { id: 'signout' });
    }
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.header
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="bg-card/80 backdrop-blur-lg border-b border-border/50 px-4 lg:px-6 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="lg:hidden hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search batches, species..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-2">
                {/* Theme toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hover:bg-accent/50"
                >
                  <motion.div
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </motion.div>
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:bg-accent/50"
                >
                  <Bell className="h-4 w-4" />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                    >
                      {notifications}
                    </motion.span>
                  )}
                </Button>

                {/* System status */}
                <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ['#22c55e', '#16a34a', '#22c55e']
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-2 h-2 bg-plant-500 rounded-full"
                  />
                  <span>System Online</span>
                </div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full hover:bg-accent/50"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-plant-400 to-plant-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                ease: 'easeOut'
              }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Global loading overlay */}
      <AnimatePresence>
        {/* Add loading state when needed */}
      </AnimatePresence>

      {/* Floating action for mobile search */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Button
            size="sm"
            className="h-12 w-12 rounded-full bg-plant-500 hover:bg-plant-600 text-white shadow-lg plant-shadow"
          >
            <Search className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
