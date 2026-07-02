import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg text-slate-600">Page not found</p>
        <a href="/" className="mt-4 inline-block text-brand-600">Go home</a>
      </div>
    </div>
  );
}
