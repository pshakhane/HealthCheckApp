import { BmiCalculator } from '@/components/bmi-calculator';
import { BmiTable } from '@/components/bmi-table';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 py-12 sm:p-8 md:p-16">
      <div className="w-full max-w-5xl space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
            BMI Snapshot
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an instant analysis of your Body Mass Index. Our AI-powered tool provides a personalized interpretation of your results.
          </p>
          <p className="mt-2 text-md text-muted-foreground max-w-2xl mx-auto">
            Keep your weight within the normal range by balancing the eating practices from dietitians with physical activity.
          </p>
        </header>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BmiCalculator />
          </div>
          <div className="lg:col-span-2">
            <BmiTable />
          </div>
        </div>
      </div>
    </main>
  );
}
