'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sprout, 
  Eye, 
  EyeOff, 
  Loader2, 
  TreePine, 
  Leaf,
  Sun,
  Moon,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { UserRole } from '@/types/domain';
import { api } from '@/lib/api';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['MANAGER', 'FIELD_OFFICER'], {
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      await api.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      toast.success('Account created successfully! Please sign in.', { id: toastId });
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', { id: toastId });
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

      {/* Theme toggle and back button */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
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
              Join LuminexPlant
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-muted-foreground mt-2"
            >
              Create your account to start tracking plants
            </motion.p>
          </motion.div>

          {/* Registration form */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                <CardDescription className="text-center">
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          disabled={loading}
                          {...register('firstName')}
                          className={`pl-10 transition-colors ${
                            errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          disabled={loading}
                          {...register('lastName')}
                          className={`pl-10 transition-colors ${
                            errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        disabled={loading}
                        {...register('email')}
                        className={`pl-10 transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                    </div>
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

                  {/* Role field */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Select onValueChange={(value) => setValue('role', value as UserRole)}>
                        <SelectTrigger className={`pl-10 ${errors.role ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="FIELD_OFFICER">Field Officer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.role && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.role.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={loading}
                        {...register('password')}
                        className={`pl-10 pr-10 transition-colors ${
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

                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={loading}
                        {...register('confirmPassword')}
                        className={`pl-10 pr-10 transition-colors ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.confirmPassword.message}
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
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Login link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="text-plant-600 hover:text-plant-700 font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
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
