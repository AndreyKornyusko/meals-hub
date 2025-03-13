"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMeals } from "./lib/api";

export default function HomePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>error: {error.message}</p>;

  return (
    <div>
      <h1>Meal menu</h1>
      <ul>
        {data?.meals.map((meal: any) => (
          <li key={meal.idMeal}>
            <h2>{meal.strMeal}</h2>
            <img src={meal.strMealThumb} alt={meal.strMeal} width={200} />
            <p>{meal.strInstructions.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}