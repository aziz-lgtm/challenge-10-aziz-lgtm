'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ confirmPassword: _, ...payload }: RegisterFormValues) => register(payload),
    onSuccess: (data) => {
      setAuth(data.token);
      toast.success('Akun berhasil dibuat!');
      router.push('/');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Registrasi gagal, coba lagi.';
      toast.error(message);
    },
  });

  const inputClass =
    'flex flex-row justify-center items-center px-3 py-2 gap-2 w-full h-12 border border-gray-300 rounded-xl font-normal placeholder:text-gray-500 self-stretch';
  const inputStyle = {
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    lineHeight: 'clamp(1.75rem, 3vw, 1.875rem)',
    letterSpacing: '-0.02em',
  };

  return (
    <div className="font-nunito min-h-screen flex w-full">
      {/* Left — burger image, desktop only */}
      <div className="relative hidden md:flex md:w-1/2">
        <Image src="/login/burger.png" alt="Food" fill className="object-cover" priority />
      </div>

      {/* Right — form panel */}
      <div
        className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen bg-white overflow-y-auto"
        style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}
      >
        <div className="flex flex-col items-start gap-3 md:gap-4 p-0 w-full max-w-93.5">

          {/* Brand */}
          <div
            className="flex flex-row items-center h-8 md:h-10.5 shrink-0"
            style={{ gap: 'clamp(0.71rem, 2vw, 0.9375rem)' }}
          >
            <Image
              src="/login/claude.png"
              alt="Foody logo"
              width={42}
              height={42}
              className="w-8 h-8 md:w-10.5 md:h-10.5 shrink-0"
            />
            <span
              className="font-extrabold text-gray-950"
              style={{
                fontSize: 'clamp(1.52rem, 3.5vw, 2rem)',
                lineHeight: 'clamp(2rem, 4vw, 2.625rem)',
              }}
            >
              Foody
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-start gap-0 md:gap-1 w-full self-stretch">
            <h1
              className="font-extrabold text-gray-950 w-full self-stretch"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                lineHeight: 'clamp(2.25rem, 4vw, 2.375rem)',
              }}
            >
              Create Account
            </h1>
            <p
              className="font-medium text-gray-950 w-full self-stretch"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                lineHeight: 'clamp(1.75rem, 3vw, 1.875rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Join us and start ordering now!
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-row items-center gap-2 p-2 w-full h-12 md:h-14 bg-gray-100 rounded-2xl self-stretch shrink-0">
            {/* Inactive tab — Sign in */}
            <Link
              href="/login"
              className="flex flex-row justify-center items-center px-3 py-2 gap-2 h-9 md:h-10 grow"
            >
              <span
                className="font-medium text-gray-600"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: 'clamp(1.75rem, 3vw, 1.875rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                Sign in
              </span>
            </Link>
            {/* Active tab — Sign up */}
            <div className="flex flex-row justify-center items-center px-3 py-2 gap-2 h-9 md:h-10 bg-white rounded-lg md:rounded-xl shadow-[0_0_1.25rem_rgba(203,202,202,0.25)] grow">
              <span
                className="font-bold text-gray-950"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: 'clamp(1.75rem, 3vw, 1.875rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Sign up
              </span>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => mutate(values))}
              className="flex flex-col items-start gap-3 md:gap-4 w-full self-stretch"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        className={inputClass}
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: '1.75rem', letterSpacing: '-0.02em' }}
                    />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className={inputClass}
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: '1.75rem', letterSpacing: '-0.02em' }}
                    />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        className={inputClass}
                        style={inputStyle}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: '1.75rem', letterSpacing: '-0.02em' }}
                    />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <div className="relative w-full self-stretch">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className={`${inputClass} pr-10`}
                          style={inputStyle}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-950 w-4 h-4"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: '1.75rem', letterSpacing: '-0.02em' }}
                    />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <div className="relative w-full self-stretch">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          className={`${inputClass} pr-10`}
                          style={inputStyle}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-950 w-4 h-4"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)', lineHeight: '1.75rem', letterSpacing: '-0.02em' }}
                    />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="flex flex-row justify-center items-center gap-2 p-2 w-full h-12 bg-primary hover:bg-primary/90 rounded-full self-stretch grow-0 font-bold text-gray-25"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: '1.875rem',
                  letterSpacing: '-0.02em',
                }}
                disabled={isPending}
              >
                {isPending ? 'Memproses...' : 'Sign up'}
              </Button>
            </form>
          </Form>

        </div>
      </div>
    </div>
  );
}
