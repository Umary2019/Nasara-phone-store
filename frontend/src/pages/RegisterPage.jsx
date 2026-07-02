import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button, Input, Label } from '../components/ui.jsx';
import { AuthLayout } from '../components/layout/AuthLayout.jsx';

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string().min(6)
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      navigate('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      badge="Staff onboarding"
      title="Create a staff account"
      description="Create a staff account for your shop."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Already registered?{' '}
            <Link className="font-medium text-brand-600 hover:underline" to="/login">
              Sign in instead
            </Link>
          </span>
        </div>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input {...register('fullName')} placeholder="Ada Okafor" autoComplete="name" />
          </div>
          <div>
            <Label>Phone number</Label>
            <Input {...register('phoneNumber')} placeholder="08012345678" autoComplete="tel" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Email</Label>
            <Input type="email" {...register('email')} placeholder="you@company.com" autoComplete="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register('password')} placeholder="Create a strong password" autoComplete="new-password" />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
