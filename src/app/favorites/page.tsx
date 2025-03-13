"use client";
import { useFavorites } from "../../../lib/useFavorites";
import styles from "./page.module.scss";
import { Meal } from "../../../ interfaces/data";

interface Ingredient {
  name: string;
  measure: string;
}

function extractIngredients(meal: any): Ingredient[] {
  return Array.from({ length: 20 }, (_, i) => i + 1)
    .map((i) => ({
      name: meal[`strIngredient${i}`]?.trim(),
      measure: meal[`strMeasure${i}`]?.trim(),
    }))
    .filter((ing) => ing.name && ing.name !== "");
}
export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) return <p>Немає збережених рецептів</p>;

  const ingredientsMap: Record<string, number> = {};

  favorites.forEach((meal:Meal) => {
    extractIngredients(meal).forEach(({ name, measure }) => {
      const amount = parseFloat(measure) || 0;
      ingredientsMap[name] = (ingredientsMap[name] || 0) + amount;
    });
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Обрані рецепти</h1>
      <ul className={styles.list}>
        {favorites.map((meal: Meal) => (
          <li key={meal.idMeal} className={styles.card}>
            <h3>{meal.strMeal}</h3>
            <button onClick={() => removeFavorite.mutate(meal.idMeal)}>
              Видалити
            </button>
          </li>
        ))}
      </ul>

      <ul>
        {Object.entries(ingredientsMap).map(([name, amount]) => (
          <li key={name}>
            {name}: {amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
