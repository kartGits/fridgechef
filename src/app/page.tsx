"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRecipe, GenerateRecipeOutput } from "@/ai/flows/generate-recipe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Home() {
  const [ingredients, setIngredients] = useState<string>("");
  const [recipes, setRecipes] = useState<GenerateRecipeOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateRecipe({ ingredients });
      setRecipes(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate recipes.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-secondary">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
        FridgeChef 🧑‍🍳
      </h1>
      <div className="w-full max-w-md px-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>What's in your fridge?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Enter ingredients, separated by commas"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <Button
                onClick={handleGenerateRecipe}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {loading ? "Generating..." : "Generate Recipes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recipes && recipes.recipes.length > 0 ? (
          recipes.recipes.map((recipe, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Ingredients:</h3>
                  <p>{recipe.ingredients}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Instructions:</h3>
                  <p>{recipe.instructions}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : recipes ? (
          <Alert className="w-full">
            <Info className="h-4 w-4" />
            <AlertTitle>No Recipes Found</AlertTitle>
            <AlertDescription>
              No recipes could be generated with the given ingredients. Please try
              again with different ingredients.
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}
