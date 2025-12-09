import type { Timestamp } from 'firebase/firestore';

export interface BmiRecord {
  id: string;
  userId: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  category: string;
  timestamp: Timestamp;
}
