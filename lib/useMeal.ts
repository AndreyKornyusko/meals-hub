import { useQuery } from "@tanstack/react-query";
import { fetchMeal } from "./api";
import { Meal } from "../ interfaces/data";

interface RawMeal extends Omit<Meal, "ingredients"> {
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

function transformMeal(rawMeal: RawMeal): Meal {
  const ingredients = Array.from({ length: 50 }, (_, i) => i + 1)
    .map((i) => ({
      name: rawMeal[`strIngredient${i}`],
      measure: rawMeal[`strMeasure${i}`],
    }))
    .filter((ing) => ing.name && ing.name.trim() !== "");

  return {
    ...rawMeal,
    ingredients, // Додаємо масив інгредієнтів
  } as Meal;
}

export function useMeal(id: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meals", id],
    queryFn: async () => {
      const response = await fetchMeal(id);
      const rawMeal = response?.meals?.[0];
      return rawMeal ? transformMeal(rawMeal) : null;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { meal: data, error, isLoading };
}
