import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiPost } from '../lib/api.js';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../components/ui.jsx';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const response = await apiPost('/auth/forgot-password', values);
    alert(response.message || 'Check your email / console for reset token');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Forgot password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
            <Button type="submit" className="w-full">Send reset request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
