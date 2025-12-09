"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { interpretBmi } from '@/ai/flows/interpret-bmi';
import type { InterpretBmiOutput } from '@/ai/flows/interpret-bmi';
import { useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ruler, Scale, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  height: z.coerce.number({invalid_type_error: "Please enter a valid height."}).positive({ message: "Height must be positive." }).min(50, {message: "Height must be at least 50 cm."}).max(250, {message: "Height must be at most 250 cm."}),
  weight: z.coerce.number({invalid_type_error: "Please enter a valid weight."}).positive({ message: "Weight must be positive." }).min(10, {message: "Weight must be at least 10 kg."}).max(300, {message: "Weight must be at most 300 kg."}),
});

type BmiResult = InterpretBmiOutput & { bmi: number };

export function BmiCalculator() {
  const [result, setResult] = useState<BmiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { user, firestore } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: undefined,
      weight: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const heightInMeters = values.height / 100;
      const bmi = parseFloat((values.weight / (heightInMeters * heightInMeters)).toFixed(1));

      const interpretation = await interpretBmi({ bmi });
      
      const newResult = { ...interpretation, bmi };
      setResult(newResult);

      if (user && firestore) {
        const bmiRecord = {
          userId: user.uid,
          heightCm: values.height,
          weightKg: values.weight,
          bmi: newResult.bmi,
          category: newResult.category,
          timestamp: serverTimestamp(),
        };
        const recordsRef = collection(firestore, 'users', user.uid, 'bmiRecords');
        addDocumentNonBlocking(recordsRef, bmiRecord);
      }
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (e) {
      setError("Failed to get BMI interpretation. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Underweight':
        return 'text-chart-3';
      case 'Normal':
        return 'text-chart-2';
      case 'Overweight':
        return 'text-chart-4';
      case 'Obese':
        return 'text-chart-1';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Calculate Your BMI</CardTitle>
        <CardDescription>Enter your height and weight below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" placeholder="e.g. 175" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input type="number" placeholder="e.g. 70" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate & Analyze'
              )}
            </Button>
          </form>
        </Form>
        
        <div ref={resultRef} className="pt-6">
          {result && !isLoading && (
            <Card className="animate-in fade-in-50 duration-500 border-accent">
              <CardHeader className="items-center text-center">
                <CardDescription>Your BMI is</CardDescription>
                <p className={`text-6xl font-bold ${getCategoryColor(result.category)}`}>{result.bmi}</p>
                <p className={`text-2xl font-semibold ${getCategoryColor(result.category)}`}>
                  {result.category}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4 rounded-lg bg-muted/50 p-4">
                  <Sparkles className="h-6 w-6 flex-shrink-0 text-accent mt-1" />
                  <p className="text-muted-foreground">{result.interpretation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {error && !isLoading && (
          <p className="mt-4 text-center text-sm text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
