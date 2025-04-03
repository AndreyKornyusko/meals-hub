"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Meal } from "../../../../ interfaces/data";
import { useMeal } from "../../../../lib/useMeal";

import styles from "./page.module.scss";

export default function RecipePage() {
  const { id } = useParams();
  const mealId = id as string;
  const { meal, isLoading } = useMeal(mealId);

  if (isLoading) return <p>Loading...</p>;
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
        src={meal.strMealThumb || "/placeholder.jpg"}
        alt={meal.strMeal}
        width={300}
        className={styles.image}
      />
      <h2 className={styles.subtitle}>Інгредієнти:</h2>
      <ul className={styles.list}>
        {meal?.ingredients?meal?.ingredients.map((ing, i) => (
          <li key={i} className={styles.item}>
            {ing.name} - <span className={styles.measure}>{ing.measure}</span>
          </li>
        )): null}
      </ul>
      <h2 className={styles.subtitle}>Інструкція</h2>
      <p className={styles.instructions}>{meal.strInstructions}</p>
    </div>
  );
}
