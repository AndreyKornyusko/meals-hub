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

  favorites.forEach((meal: Meal) => {
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
            <img
              className={styles.image}
              src={meal.strMealThumb || "/placeholder.jpg"}
              alt={meal.strMeal}
            />
            <h3>Інструкція</h3>
            <p className={styles.instructions}>{meal.strInstructions}</p>
            <div className={styles.btnWrap}>
              <button
                onClick={() => removeFavorite.mutate(meal.idMeal)}
                className={styles.button}
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className={styles.ingredientsTitle}>Список інгредієнтів</h2>

      <ul className={styles.ingredientsList}>
        {Object.entries(ingredientsMap).map(([name, amount]) => (
          <li key={name} className={styles.ingredientItem}>
            {name}: <strong>{amount}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
