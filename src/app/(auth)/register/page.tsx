'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-md tracking-tight text-center">Join CREWCAM</CardTitle>
          <CardDescription className="text-center text-xs">Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                <Input id="firstName" required className="h-8 text-sm" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                <Input id="lastName" required className="h-8 text-sm" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required className="h-8 text-sm" value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <Input id="password" type="password" required className="h-8 text-sm" value={formData.password} onChange={handleChange} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required className="h-8 text-sm" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}

            <Button type="submit" className="w-full h-8 text-xs font-medium mt-2" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <div className="text-[11px] text-zinc-500 text-center w-full">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
