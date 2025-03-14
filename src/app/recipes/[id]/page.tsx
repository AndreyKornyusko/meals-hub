"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchMeals } from "../../../../lib/api";
import { Meal } from "../../../../ interfaces/data";
import styles from "./page.module.scss";

export default function RecipePage() {
  const params = useParams();
  const { id } = params;

  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchMeals();
      const foundMeal = data.meals.find((m: Meal) => m.idMeal === id);

      setMeal(foundMeal || null);
    }

    fetchData();
  }, [id]);

  if (!meal) return <p>Рецепт не знайдено</p>;

  return (
    <div className={styles.container}>
      <div className={styles.btnWrap}>
        <Link href={`/`}>
          <div className={styles.button}>До головної &gt;</div>
        </Link>
      </div>
      <h1 className={styles.title}>{meal.strMeal}</h1>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        width={300}
        className={styles.image}
      />
      <h2 className={styles.subtitle}>Інгредієнти:</h2>
      <ul className={styles.list}>
        {Array.from({ length: 20 }, (_, i) => i + 1)
          .map((i) => ({
            name: meal[`strIngredient${i}` as keyof Meal],
            measure: meal[`strMeasure${i}` as keyof Meal],
          }))
          .filter((ing) => ing.name)
          .map((ing, i) => (
            <li key={i} className={styles.item}>
              {ing.name} - <span className={styles.measure}>{ing.measure}</span>
            </li>
          ))}
      </ul>
      <h2 className={styles.subtitle}>Інструкція</h2>
      <p className={styles.instructions}>{meal.strInstructions}</p>
    </div>
  );
}
