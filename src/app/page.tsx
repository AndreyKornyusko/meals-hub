"use client";
import React, { useEffect, useMemo } from "react";
import { useFavorites } from "../../lib/useFavorites";
import { useDebounce } from "../../lib/useDebounce";
import { useSearchMeals } from "../../lib/useSearchMeals";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePagination } from "../../lib/usePagination";
import { useMeals } from "../../lib/useMeals";
import { Meal } from "../../ interfaces/data";

import styles from "./page.module.scss";

export default function HomePage() {
  const { favorites, addFavorite } = useFavorites();
  const { meals, error, isLoading } = useMeals();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Отримання параметрів із URL
  const selectedCategory = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { searchResults } = useSearchMeals(debouncedSearchTerm);

  // Оновлення URL при зміні параметрів
  const updateSearchParams = (params: Record<string, string | null | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const mealsToShow = useMemo(() => {
    const allMeals = debouncedSearchTerm
      ? Array.isArray(searchResults)
        ? searchResults
        : []
      : Array.isArray(meals)
      ? meals
      : [];

    return allMeals.filter((meal: Meal) =>
      selectedCategory
        ? meal.strCategory?.toLowerCase() === selectedCategory.toLowerCase()
        : true
    );
  }, [searchResults, meals, selectedCategory, debouncedSearchTerm]);

  const {
    currentPage: page,
    totalPages,
    setCurrentPage,
    displayedItems,
  } = usePagination(mealsToShow.length);

  useEffect(() => {
    if (page > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const displayedMeals = useMemo(() => {
    return mealsToShow.slice(displayedItems.start, displayedItems.end);
  }, [mealsToShow, displayedItems]);

  const categories = useMemo(() => {
    if (!meals) return [];
    return Array.from(new Set(meals.map((meal: Meal) => meal.strCategory))) as string[];
  }, [meals]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Страви</h1>

      <div className={styles.favorites}>
        <Link href={`/favorites`}>
          <div className={styles.button}>До обраних &gt;</div>
        </Link>
      </div>

      <div className={styles.separator}>
        <div className={styles.category}>
          <select
            className={styles.select}
            value={selectedCategory}
            onChange={(e) => updateSearchParams({ category: e.target.value, page: "1" })}
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
            className={styles.input}
            type="text"
            placeholder="Пошук за назвою..."
            value={searchTerm}
            onChange={(e) => updateSearchParams({ search: e.target.value, page: "1" })}
          />
        </div>
      </div>

      <ul className={styles.list}>
        {displayedMeals.length > 0 ? (
          displayedMeals.map((meal: Meal) => (
            <li key={meal.idMeal} className={styles.card}>
              <img src={meal.strMealThumb || "/placeholder.jpg"} alt={meal.strMeal} />
              <h3 className={styles.title}>{meal.strMeal}</h3>
              <p className={styles.subtitle}>{meal.strCategory} | {meal.strArea}</p>
              <div className={styles.btnWrap}>
                <button
                  onClick={() => addFavorite.mutate(meal)}
                  className={styles.button}
                >
                  {favorites.some((fav: Meal) => fav.idMeal === meal.idMeal)
                    ? "Збережено"
                    : "Зберегти"}
                </button>
                <Link href={`/recipes/${meal.idMeal}`}>
                  <div className={styles.button}>Детальніше</div>
                </Link>
              </div>
            </li>
          ))
        ) : (
          <p>Результатів не знайдено</p>
        )}
      </ul>

      {/* Пагінація */}
      <div className={styles.paginatiionWrap}>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.arrow} disabled={page === 1} onClick={() => setCurrentPage(page - 1)}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`${styles.page} ${page === pageNum ? styles.active : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button className={styles.arrow} disabled={page === totalPages} onClick={() => setCurrentPage(page + 1)}>
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
