'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { BmiRecord } from '@/types/bmi-record';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BmiHistoryProps {
  userId: string;
}

export function BmiHistory({ userId }: BmiHistoryProps) {
  const firestore = useFirestore();

  const bmiRecordsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    const recordsRef = collection(firestore, 'users', userId, 'bmiRecords');
    return query(recordsRef, orderBy('timestamp', 'desc'));
  }, [firestore, userId]);
  
  const { data: bmiRecords, isLoading, error } = useCollection<BmiRecord>(bmiRecordsQuery);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Underweight': return 'text-chart-3';
      case 'Normal': return 'text-chart-2';
      case 'Overweight': return 'text-chart-4';
      case 'Obese': return 'text-chart-1';
      default: return 'text-foreground';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Could not load your BMI history. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (!bmiRecords || bmiRecords.length === 0) {
      return <p className="text-center text-muted-foreground">No BMI records found. Calculate your BMI to see your history.</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Height</TableHead>
            <TableHead>BMI</TableHead>
            <TableHead className="text-right">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bmiRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.timestamp ? format(record.timestamp.toDate(), 'MMM d, yyyy') : 'N/A'}
              </TableCell>
              <TableCell>{record.weightKg} kg</TableCell>
              <TableCell>{record.heightCm} cm</TableCell>
              <TableCell>{record.bmi}</TableCell>
              <TableCell className={`text-right font-semibold ${getCategoryColor(record.category)}`}>
                {record.category}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Your BMI History</CardTitle>
        <CardDescription>A log of your past BMI calculations.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
