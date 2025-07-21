import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const bmiCategories = [
  { category: "Underweight", range: "< 18.5", color: "text-chart-3" },
  { category: "Normal", range: "18.5 - 24.9", color: "text-chart-2" },
  { category: "Overweight", range: "25 - 29.9", color: "text-chart-4" },
  { category: "Obese", range: "30 or greater", color: "text-chart-1" },
];

export function BmiTable() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>BMI Categories</CardTitle>
        <CardDescription>Based on WHO recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">BMI range (kg/m²)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bmiCategories.map((item) => (
              <TableRow key={item.category}>
                <TableCell className={`font-medium ${item.color}`}>{item.category}</TableCell>
                <TableCell className="text-right font-mono">{item.range}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
