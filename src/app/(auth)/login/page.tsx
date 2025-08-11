'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sprout, 
  Eye, 
  EyeOff, 
  Loader2, 
  TreePine, 
  Leaf,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { ROLE } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const toastId = toast.loading('Signing you in...');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password. Please try again.', { id: toastId });
        return;
      }

      toast.success('Welcome back! Redirecting...', { id: toastId });
      
      // Get session to determine redirect URL
      const session = await getSession();
      const role = (session?.user as any)?.role;
      
      const callbackUrl = searchParams.get('callbackUrl');
      
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        // Role-based redirect
        switch (role) {
          case ROLE.SUPER_ADMIN:
            router.push('/admin');
            break;
          case ROLE.MANAGER:
            router.push('/manager');
            break;
          case ROLE.FIELD_OFFICER:
            router.push('/officer');
            break;
          default:
            router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.', { id: toastId });
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
        delayChildren: 0.2,
      },
    },
  } as any;

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

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plant-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 text-plant-200 dark:text-plant-800"
        >
          <TreePine className="w-16 h-16 opacity-20" />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          style={{ animationDelay: '1s' }}
          className="absolute top-40 right-20 text-sky-200 dark:text-sky-800"
        >
          <Leaf className="w-12 h-12 opacity-20" />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          style={{ animationDelay: '2s' }}
          className="absolute bottom-32 left-1/4 text-earth-200 dark:text-earth-800"
        >
          <Sprout className="w-20 h-20 opacity-20" />
        </motion.div>
        <motion.div
          animate={floatingAnimation}
          style={{ animationDelay: '0.5s' }}
          className="absolute bottom-20 right-10 text-plant-200 dark:text-plant-800"
        >
          <TreePine className="w-14 h-14 opacity-20" />
        </motion.div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full"
        >
          <motion.div
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
        </Button>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo and header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-16 h-16 bg-gradient-to-br from-plant-400 to-plant-600 rounded-2xl flex items-center justify-center shadow-lg plant-shadow"
              >
                <Sprout className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold gradient-text"
            >
              LuminexPlant
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground mt-2"
            >
              Digital Plant Processing & Tracking System
            </motion.p>
          </motion.div>

          {/* Login form */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      disabled={loading}
                      {...register('email')}
                      className={`transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={loading}
                        {...register('password')}
                        className={`pr-10 transition-colors ${
                          errors.password ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-plant-500 to-plant-600 hover:from-plant-600 hover:to-plant-700 transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Demo credentials */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-4 bg-muted/50 rounded-lg border"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong>Admin:</strong> admin@luminexplant.com / admin123</p>
                    <p><strong>Manager:</strong> manager@luminexplant.com / manager123</p>
                    <p><strong>Officer:</strong> officer@luminexplant.com / officer123</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            <p>&copy; 2024 LuminexPlant. All rights reserved.</p>
            <p className="mt-1">Sustainable agriculture through technology</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
