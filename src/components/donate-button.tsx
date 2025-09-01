'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DonateButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDonate = () => {
    startTransition(async () => {
      try {
        await createCheckoutSession();
      } catch (error) {
        console.error('Failed to create checkout session:', error);
        toast({
          title: 'Error',
          description: 'Could not connect to Stripe. Please try again later.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-card border">
        <h3 className="text-lg font-semibold mb-2">Support Us</h3>
        <p className="text-sm text-muted-foreground mb-4">
            If you find this tool helpful, please consider a small donation to support its development and maintenance.
        </p>
        <Button onClick={handleDonate} disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                </>
            ) : (
                <>
                    <Heart className="mr-2 h-4 w-4" />
                    Donate $5
                </>
            )}
        </Button>
    </div>
  );
}
