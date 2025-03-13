"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMeals } from "../../lib/api";
import { useFavorites } from "../../lib/useFavorites";
import Link from "next/link";
import styles from "./page.module.scss";
import { Meal } from "../../ interfaces/data";

export default function HomePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
    staleTime: 1000 * 60 * 5,
  });
  console.log("data", data);
  const { favorites, addFavorite } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");


  const categories = Array.from(
    new Set(data?.meals.map((meal: Meal) => meal.strCategory))
  );

  // Фільтрація страв за категорією та пошуком
  const filteredMeals = data?.meals.filter((meal: Meal) => {
    const matchesCategory =
      selectedCategory === "" || meal.strCategory === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Страви</h1>
      <div className={styles.favorites}>
        <Link href={`/favorites`}>
          <div className={styles.button}>Обрані</div>
        </Link>
      </div>
      <div className={styles.separator}>
        <div className={styles.category}>
        <select
            name="category"
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.search}>
        <input
            type="text"
            placeholder="Пошук за назвою..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ul className={styles.list}>
        {filteredMeals.map((meal: Meal) => (
          <li key={meal?.idMeal} className={styles.card}>
            <img src={meal?.strMealThumb} alt={meal?.strMeal} />
            <h3 className={styles.title}>{meal?.strMeal}</h3>
            <p className={styles.subtitle}>
              {meal?.strCategory} | {meal.strArea}
            </p>
            <div className={styles.btnWrap}>
              <button
                onClick={() => addFavorite.mutate(meal)}
                className={styles.button}
              >
                {favorites.find((fav: Meal) => fav?.idMeal === meal?.idMeal)
                  ? "Збережено"
                  : "Зберегти"}
              </button>
              <Link href={`/recipes/${meal?.idMeal}`}>
                <div className={styles.button}>Детальніше</div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
