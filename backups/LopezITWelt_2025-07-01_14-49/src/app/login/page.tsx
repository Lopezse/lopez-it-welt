'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '../../components/Features/Button';
import { useI18n } from '../../components/Features/I18nProvider';

export default function Login() {
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulierte Authentifizierung
    setTimeout(() => {
      if (isLogin) {
        // Login-Logik
        localStorage.setItem('authToken', 'dummy-token');
        window.location.href = '/';
      } else {
        // Registrierungs-Logik
        localStorage.setItem('authToken', 'dummy-token');
        window.location.href = '/';
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-hellgrau dark:bg-dunkelgrau py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <Link href='/' className='flex justify-center'>
            <h2 className='text-3xl font-bold text-hauptblau dark:text-akzentblau'>
              Lopez IT Welt
            </h2>
          </Link>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-dunkelgrau dark:text-weiss'>
            {isLogin ? t('auth.login.titel') : t('auth.register.titel')}
          </h2>
          <p className='mt-2 text-center text-sm text-dunkelgrau dark:text-hellgrau'>
            {isLogin ? (
              <>
                {t('auth.no_account')}{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className='font-medium text-hauptblau hover:text-akzentblau dark:text-akzentblau dark:hover:text-gelb'
                >
                  {t('auth.login.registrieren_link')}
                </button>
              </>
            ) : (
              <>
                {t('auth.has_account')}{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className='font-medium text-hauptblau hover:text-akzentblau dark:text-akzentblau dark:hover:text-gelb'
                >
                  {t('auth.register.anmelden_link')}
                </button>
              </>
            )}
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm -space-y-px'>
            {!isLogin && (
              <div>
                <label htmlFor='name' className='sr-only'>
                  {t('auth.register.name')}
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required={!isLogin}
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-hellgrau dark:border-dunkelgrau placeholder-dunkelgrau dark:placeholder-hellgrau text-dunkelgrau dark:text-weiss rounded-t-md focus:outline-none focus:ring-hauptblau focus:border-hauptblau focus:z-10 sm:text-sm bg-weiss dark:bg-dunkelgrau'
                  placeholder={t('auth.register.name')}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              <label htmlFor='email' className='sr-only'>
                {t('auth.login.email')}
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-hellgrau dark:border-dunkelgrau placeholder-dunkelgrau dark:placeholder-hellgrau text-dunkelgrau dark:text-weiss focus:outline-none focus:ring-hauptblau focus:border-hauptblau focus:z-10 sm:text-sm bg-weiss dark:bg-dunkelgrau ${
                  isLogin ? 'rounded-t-md' : ''
                }`}
                placeholder={t('auth.login.email')}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                {t('auth.login.password')}
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-hellgrau dark:border-dunkelgrau placeholder-dunkelgrau dark:placeholder-hellgrau text-dunkelgrau dark:text-weiss focus:outline-none focus:ring-hauptblau focus:border-hauptblau focus:z-10 sm:text-sm bg-weiss dark:bg-dunkelgrau'
                placeholder={t('auth.login.password')}
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor='confirmPassword' className='sr-only'>
                  {t('auth.register.confirm_password')}
                </label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required={!isLogin}
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-hellgrau dark:border-dunkelgrau placeholder-dunkelgrau dark:placeholder-hellgrau text-dunkelgrau dark:text-weiss rounded-b-md focus:outline-none focus:ring-hauptblau focus:border-hauptblau focus:z-10 sm:text-sm bg-weiss dark:bg-dunkelgrau'
                  placeholder={t('auth.register.confirm_password')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {isLogin && (
              <div>
                <label htmlFor='password' className='sr-only'>
                  {t('auth.login.password')}
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-hellgrau dark:border-dunkelgrau placeholder-dunkelgrau dark:placeholder-hellgrau text-dunkelgrau dark:text-weiss rounded-b-md focus:outline-none focus:ring-hauptblau focus:border-hauptblau focus:z-10 sm:text-sm bg-weiss dark:bg-dunkelgrau'
                  placeholder={t('auth.login.password')}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {isLogin && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-hauptblau focus:ring-hauptblau border-hellgrau dark:border-dunkelgrau rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-dunkelgrau dark:text-hellgrau'
                >
                  {t('auth.login.remember_me')}
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-hauptblau hover:text-akzentblau dark:text-akzentblau dark:hover:text-gelb'
                >
                  {t('auth.login.forgot_password')}
                </a>
              </div>
            </div>
          )}

          <div>
            <Button
              type='submit'
              variante='haupt'
              groesse='gross'
              ladezustand={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-weiss bg-hauptblau hover:bg-akzentblau focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hauptblau'
            >
              {isLoading
                ? t('auth.loading')
                : isLogin
                  ? t('auth.login.submit')
                  : t('auth.register.submit')}
            </Button>
          </div>

          <div className='text-center'>
            <Link
              href='/'
              className='font-medium text-hauptblau hover:text-akzentblau dark:text-akzentblau dark:hover:text-gelb'
            >
              {t('auth.login.back_to_home')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
