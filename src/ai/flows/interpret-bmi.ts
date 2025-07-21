'use server';

/**
 * @fileOverview An AI agent that interprets BMI scores and provides personalized explanations.
 *
 * - interpretBmi - A function that handles the BMI interpretation process.
 * - InterpretBmiInput - The input type for the interpretBmi function.
 * - InterpretBmiOutput - The return type for the interpretBmi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretBmiInputSchema = z.object({
  bmi: z.number().describe('The calculated BMI value.'),
});
export type InterpretBmiInput = z.infer<typeof InterpretBmiInputSchema>;

const InterpretBmiOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The BMI category (Underweight, Normal, Overweight, or Obese) based on the BMI value.'
    ),
  interpretation: z
    .string()
    .describe(
      'A personalized explanation of what the BMI means for the users health.'
    ),
});
export type InterpretBmiOutput = z.infer<typeof InterpretBmiOutputSchema>;

export async function interpretBmi(input: InterpretBmiInput): Promise<InterpretBmiOutput> {
  return interpretBmiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretBmiPrompt',
  input: {schema: InterpretBmiInputSchema},
  output: {schema: InterpretBmiOutputSchema},
  prompt: `You are a health expert specializing in interpreting BMI scores.

You will use the provided BMI value to determine the BMI category and provide a personalized explanation of what the BMI means for the users health.

BMI value: {{{bmi}}}

Based on the BMI value, determine the appropriate category (Underweight, Normal, Overweight, or Obese) and set the category output field accordingly.

Provide a detailed interpretation of what the BMI means for the users health, taking into account the category. Set the interpretation output field with this personalized explanation.
`,
});

const interpretBmiFlow = ai.defineFlow(
  {
    name: 'interpretBmiFlow',
    inputSchema: InterpretBmiInputSchema,
    outputSchema: InterpretBmiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
