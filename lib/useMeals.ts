import {  useQuery } from "@tanstack/react-query";
import { fetchMeals } from "./api";
import { Meal } from "../ interfaces/data";

interface RawMeal extends Omit<Meal, "ingredients"> {
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

function transformMeals(rawMeals: RawMeal[]): Meal[] {
  return rawMeals.map((rawMeal) => {
    const ingredients = Array.from({ length: 50 }, (_, i) => i + 1)
      .map((i) => ({
        name: rawMeal[`strIngredient${i}`],
        measure: rawMeal[`strMeasure${i}`],
      }))
      .filter((ing) => ing.name && ing.name.trim() !== ""); // Видаляємо порожні значення

    return {
      ...rawMeal,
      ingredients: ingredients as { name: string; measure: string }[],
    };
  });
}

export function useMeals() {
  const {
    data: meals,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const rawMeals = await fetchMeals();
      return transformMeals(rawMeals.meals);
    },
    staleTime: 1000 * 60 * 5,
  });

  return { meals, error, isLoading };
}
