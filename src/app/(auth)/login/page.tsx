'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Berhasil masuk!');
      const redirect = searchParams.get('redirect') ?? '/';
      router.push(redirect);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Login gagal, coba lagi.';
      toast.error(message);
    },
  });

  return (
    <div className="font-nunito min-h-screen flex">
      {/* Left — burger image, desktop only */}
      <div className="relative hidden md:flex md:w-1/2">
        <Image src="/login/burger.png" alt="Food" fill className="object-cover" priority />
      </div>

      {/* Right — form panel */}
      <div
        className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen bg-white"
        style={{ padding: 'clamp(2rem, 8vw, 5rem)' }}
      >
        {/* Main container — mobile gap:16px → desktop gap:20px */}
        <div
          className="flex flex-col items-start gap-4 md:gap-5 p-0 w-full max-w-93.5"
        >

          {/* Brand — mobile: logo 32px gap 11.43px, desktop: logo 42px gap 15px */}
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
                lineHeight: 'clamp(32px, 4vw, 42px)',
              }}
            >
              Foody
            </span>
          </div>

          {/* Heading — mobile: no gap, desktop: gap 4px */}
          <div className="flex flex-col items-start gap-0 md:gap-1 w-full self-stretch">
            <h1
              className="font-extrabold text-gray-950 w-full self-stretch"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                lineHeight: 'clamp(36px, 4vw, 38px)',
              }}
            >
              Welcome Back
            </h1>
            <p
              className="font-medium text-gray-950 w-full self-stretch"
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                lineHeight: 'clamp(28px, 3vw, 30px)',
                letterSpacing: '-0.03em',
              }}
            >
              Good to see you again! Let&apos;s eat
            </p>
          </div>

          {/* Tabs — mobile: h-12 rounded-2xl, desktop: h-14 rounded-2xl */}
          <div className="flex flex-row items-center gap-2 p-2 w-full h-12 md:h-14 bg-gray-100 rounded-2xl self-stretch shrink-0">
            {/* Active tab — mobile: h-9 rounded-lg, desktop: h-10 rounded-xl */}
            <div className="flex flex-row justify-center items-center px-3 py-2 gap-2 h-9 md:h-10 bg-white rounded-lg md:rounded-xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] grow">
              <span
                className="font-bold text-gray-950"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: 'clamp(28px, 3vw, 30px)',
                  letterSpacing: '-0.02em',
                }}
              >
                Sign in
              </span>
            </div>
            {/* Inactive tab */}
            <Link
              href="/register"
              className="flex flex-row justify-center items-center px-3 py-2 gap-2 h-9 md:h-10 grow"
            >
              <span
                className="font-medium text-gray-600"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: 'clamp(28px, 3vw, 30px)',
                  letterSpacing: '-0.03em',
                }}
              >
                Sign up
              </span>
            </Link>
          </div>

          {/* Inputs container — mobile: gap 16px, desktop: gap 20px */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => mutate(values))}
              className="flex flex-col items-start gap-4 md:gap-5 w-full self-stretch"
            >
              {/* Email — mobile: h-12, desktop: h-14 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start gap-1 w-full self-stretch space-y-0 p-0">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="flex flex-row justify-center items-center px-3 py-2 gap-2 w-full h-12 md:h-14 border border-gray-300 rounded-xl font-normal placeholder:text-gray-500 self-stretch"
                        style={{
                          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                          lineHeight: 'clamp(28px, 3vw, 30px)',
                          letterSpacing: '-0.02em',
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage
                      className="font-semibold text-primary self-stretch"
                      style={{
                        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                        lineHeight: '28px',
                        letterSpacing: '-0.02em',
                      }}
                    />
                  </FormItem>
                )}
              />

              {/* Password — mobile: h-12, desktop: h-14 */}
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
                          className="flex flex-row justify-center items-center px-3 py-2 gap-2 w-full h-12 md:h-14 border border-gray-300 rounded-xl font-normal placeholder:text-gray-500 pr-10 self-stretch"
                          style={{
                            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                            lineHeight: 'clamp(28px, 3vw, 30px)',
                            letterSpacing: '-0.02em',
                          }}
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
                      style={{
                        fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                        lineHeight: '28px',
                        letterSpacing: '-0.02em',
                      }}
                    />
                  </FormItem>
                )}
              />

              {/* Remember Me — mobile: line-height 28px, desktop: 30px */}
              <div className="flex flex-row items-center gap-2 shrink-0">
                <Checkbox
                  id="remember"
                  className="w-5 h-5 border border-gray-300 rounded-[6px] shrink-0"
                />
                <label
                  htmlFor="remember"
                  className="font-medium text-gray-950 cursor-pointer select-none"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                    lineHeight: 'clamp(28px, 3vw, 30px)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Remember Me
                </label>
              </div>

              {/* Button — same height both breakpoints (48px = h-12) */}
              <Button
                type="submit"
                className="flex flex-row justify-center items-center gap-2 p-2 w-full h-12 bg-primary hover:bg-primary/90 rounded-full self-stretch grow-0 font-bold text-gray-25"
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  lineHeight: '30px',
                  letterSpacing: '-0.02em',
                }}
                disabled={isPending}
              >
                {isPending ? 'Memproses...' : 'Login'}
              </Button>
            </form>
          </Form>

        </div>
      </div>
    </div>
  );
}
