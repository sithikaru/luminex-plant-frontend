'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Sprout,
  TreePine,
  MapPin,
  Ruler,
  Users,
  Bell,
  Settings,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '@/types/domain';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
  roles?: UserRole[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Batches',
    icon: Sprout,
    children: [
      { title: 'All Batches', href: '/batches', icon: Sprout },
      { title: 'Create Batch', href: '/batches/create', icon: Sprout },
      { title: 'Ready Plants', href: '/batches/ready', icon: Sprout },
    ],
  },
  {
    title: 'Species',
    href: '/species',
    icon: TreePine,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Zones & Beds',
    icon: MapPin,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    children: [
      { title: 'Zones', href: '/zones', icon: MapPin },
      { title: 'Beds', href: '/beds', icon: MapPin },
    ],
  },
  {
    title: 'Measurements',
    icon: Ruler,
    children: [
      { title: 'All Measurements', href: '/measurements', icon: Ruler },
      { title: 'New Measurement', href: '/measurements/new', icon: Ruler },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
    children: [
      { title: 'Growth Analytics', href: '/analytics/growth', icon: BarChart3 },
      { title: 'Zone Performance', href: '/analytics/zones', icon: BarChart3 },
      { title: 'Species Performance', href: '/analytics/species', icon: BarChart3 },
    ],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const userRole = (session?.user as any)?.role as UserRole;

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.href ? isActiveLink(item.href) : false;

    if (hasChildren) {
      return (
        <div key={item.title} className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-left font-normal h-10',
              level > 0 && 'ml-4 w-[calc(100%-1rem)]',
              'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              'transition-all duration-200'
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-sm">{item.title}</span>
            {item.badge && (
              <span className="ml-auto bg-plant-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse-glow">
                {item.badge}
              </span>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    opacity: 1,
                    height: 'auto',
                    transition: {
                      type: 'spring',
                      bounce: 0,
                      duration: 0.4,
                      delayChildren: 0.1,
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    opacity: 0,
                    height: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0,
                      duration: 0.3,
                    },
                  },
                }}
                className="pl-4 space-y-1 overflow-hidden"
              >
                {item.children?.map(child => (
                  <motion.div key={child.title} variants={itemVariants}>
                    {renderNavItem(child, level + 1)}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link key={item.title} href={item.href || '#'}>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-left font-normal h-10',
            level > 0 && 'ml-4 w-[calc(100%-1rem)]',
            isActive
              ? 'bg-plant-100 text-plant-700 dark:bg-plant-900 dark:text-plant-300 plant-shadow'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            'transition-all duration-200 hover-lift'
          )}
        >
          <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-sm">{item.title}</span>
          {item.badge && (
            <span className="ml-auto bg-plant-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse-glow">
              {item.badge}
            </span>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 bg-card border-r border-border',
          'lg:sticky lg:top-0 lg:translate-x-0',
          'overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-plant-400 to-plant-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">LuminexPlant</h1>
              <p className="text-xs text-muted-foreground">Plant Tracking System</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-plant-100 dark:bg-plant-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-plant-700 dark:text-plant-300">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole?.toLowerCase().replace('_', ' ') || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <motion.div
            initial="closed"
            animate="open"
            variants={{
              open: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {filteredNavigation.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants}>
                {renderNavItem(item)}
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
            <div className="flex items-center justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-plant-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
