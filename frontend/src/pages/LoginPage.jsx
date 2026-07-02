import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowRight, Store, Users2, ShieldCheck } from 'lucide-react';
import { Button, Input, Label } from '../components/ui.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout
      badge="Nasara phone store"
      title="Sign in to your workspace"
      description="A clean access point for sales, inventory, reporting, and staff administration."
      highlights={[
        { title: 'Sales ready', description: 'Move from login to checkout in a few seconds.', icon: <Store className="h-4 w-4 text-emerald-300" /> },
        { title: 'Team access', description: 'Admin and cashier roles stay separated.', icon: <Users2 className="h-4 w-4 text-emerald-300" /> },
        { title: 'Protected sessions', description: 'Refresh tokens keep your session secure and smooth.', icon: <ShieldCheck className="h-4 w-4 text-emerald-300" /> }
      ]}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            New here?{' '}
            <Link className="font-medium text-brand-600 hover:underline" to="/register">
              Create an account
            </Link>
          </span>
          <Link className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300" to="/forgot-password">
            Forgot password
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input {...register('email')} placeholder="you@company.com" autoComplete="email" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" {...register('password')} placeholder="Your password" autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
}
