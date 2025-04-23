'use server';
/**
 * @fileOverview Recipe generation flow based on available ingredients.
 *
 * - generateRecipe - A function that generates recipes based on ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available in the fridge.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string().describe('The title of the recipe.'),
      ingredients: z.string().describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
    })
  ).describe('An array of recipe suggestions based on the provided ingredients.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {
    schema: z.object({
      ingredients: z
        .string()
        .describe('A comma-separated list of ingredients available in the fridge.'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          title: z.string().describe('The title of the recipe.'),
          ingredients: z.string().describe('A list of ingredients required for the recipe.'),
          instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
        })
      ).describe('An array of recipe suggestions based on the provided ingredients.'),
    }),
  },
  prompt: `You are a recipe generation AI. Given the ingredients below, suggest some recipes.

Ingredients: {{{ingredients}}}

Respond in JSON format.
`,
});

const generateRecipeFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
