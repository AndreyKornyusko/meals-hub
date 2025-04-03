"use client";
import Link from "next/link";
import { useFavorites } from "../../../lib/useFavorites";
import styles from "./page.module.scss";
import { Meal } from "../../../ interfaces/data";

interface Ingredient {
  name: string;
  measure: string;
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) return <p>Немає збережених рецептів</p>;

  const ingredientsMap: Record<string, { amount: number; unit: string }> = {};

  // Обробка інгредієнтів із використанням нового поля `ingredients`
  favorites.forEach((meal: Meal) => {
    meal?.ingredients && meal?.ingredients.forEach(({ name, measure }) => {
      if (!name || !measure) return;

      const normalizedName = name.trim().toLowerCase(); // Нормалізація назв
      const parsedAmount = parseFloat(measure); // Виділяємо число
      const unit = measure.replace(/[0-9.]/g, "").trim(); // Видаляємо число, залишаємо тільки одиницю вимірювання

      if (!ingredientsMap[normalizedName]) {
        ingredientsMap[normalizedName] = { amount: 0, unit };
      }

      // Якщо одиниці вимірювання однакові — додаємо
      if (
        ingredientsMap[normalizedName].unit === unit ||
        !ingredientsMap[normalizedName].unit
      ) {
        ingredientsMap[normalizedName].amount += parsedAmount || 0;
      } else {
        // Якщо одиниці різні, не підсумовуємо
        ingredientsMap[normalizedName] = { amount: parsedAmount || 0, unit };
      }
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.btnWrap}>
        <Link href={`/`}>
          <div className={styles.button}>До головної &gt;</div>
        </Link>
      </div>
      <h1 className={styles.title}>Обрані рецепти</h1>
      <div className={styles.content}>
        <ul className={styles.list}>
          {favorites.map((meal: Meal, index:number) => (
            <li key={meal.idMeal+index} className={styles.card}>
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
        <div className={styles.ingredientsListWrap}>
          <h2 className={styles.ingredientsTitle}>
            Загальний список інгредієнтів
          </h2>

          <ul className={styles.ingredientsList}>
            {Object.entries(ingredientsMap).map(([name, value]) => (
              <li key={name} className={styles.ingredientItem}>
                {name}:{" "}
                <strong>
                  {value.amount} {value.unit}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}