'use client';

import { useUser } from '@/firebase';
import { Auth } from '@/components/auth';
import { BmiCalculator } from '@/components/bmi-calculator';
import { BmiHistory } from '@/components/bmi-history';
import { BmiTable } from '@/components/bmi-table';
import { DonateButton } from '@/components/donate-button';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 py-12 sm:p-8 md:p-16">
      <div className="w-full max-w-5xl space-y-12">
        <header className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
            HealthCheckApp
          </h1>
          {user ? (
            <div className="mt-4">
              <p className="text-lg text-muted-foreground">Welcome back, {user.email}!</p>
              <Button onClick={handleSignOut} variant="link" className="text-primary">Sign Out</Button>
            </div>
          ) : (
            <>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Get an instant analysis of your Body Mass Index. Our AI-powered tool provides a personalized interpretation of your results.
              </p>
              <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
                Keep your weight within the normal range by balancing the eating practices from dietitians with physical activity.
              </p>
            </>
          )}
        </header>

        {user ? (
          <>
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <BmiCalculator />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <BmiTable />
                <DonateButton />
              </div>
            </div>
            <BmiHistory userId={user.uid} />
          </>
        ) : (
          <div className="flex justify-center">
             <Auth />
          </div>
        )}
      </div>
    </main>
  );
}
