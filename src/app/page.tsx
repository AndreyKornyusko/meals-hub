"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMeals, searchMeals } from "../../lib/api";
import { useFavorites } from "../../lib/useFavorites";
import { useDebounce } from "../../lib/useDebounce";
import Link from "next/link";
import styles from "./page.module.scss";
import { Meal } from "../../ interfaces/data";

const ITEMS_PER_PAGE = 6;
export default function HomePage() {
  const { favorites, addFavorite } = useFavorites();

  // Стан для категорії та пошуку
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Дебаунс для введеного тексту
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Запит на отримання всіх страв
  const {
    data: mealsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
    staleTime: 1000 * 60 * 5,
  });

  // Запит на пошук страв за назвою
  const { data: searchResults, refetch } = useQuery({
    queryKey: ["searchMeals", debouncedSearchTerm],
    queryFn: () => searchMeals(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm, // Запит виконується тільки при введенні тексту
  });

  // Викликаємо `refetch` щоразу, коли змінюється `debouncedSearchTerm`
  useEffect(() => {
    if (debouncedSearchTerm) {
      refetch();
    }
  }, [debouncedSearchTerm, refetch]);

  const mealsToShow = useMemo(() => {
    const allMeals = debouncedSearchTerm
      ? Array.isArray(searchResults?.meals)
        ? searchResults.meals
        : []
      : Array.isArray(mealsData?.meals)
      ? mealsData.meals
      : [];

    return Array.isArray(allMeals)
      ? allMeals.filter((meal: Meal) =>
          selectedCategory
            ? meal.strCategory?.toLowerCase() === selectedCategory.toLowerCase()
            : true
        )
      : [];
  }, [searchResults, mealsData, selectedCategory, debouncedSearchTerm]);

  const totalPages = Math.ceil(mealsToShow.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const displayedMeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return mealsToShow.slice(start, start + ITEMS_PER_PAGE);
  }, [mealsToShow, currentPage]);

  const categories = useMemo(() => {
    if (!mealsData?.meals) return [];
    return Array.from(
      new Set(mealsData.meals.map((meal: Meal) => meal.strCategory))
    ) as string[];
  }, [mealsData]);

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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Усі категорії</option>
            {categories &&
              categories.map((category) => (
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
        {displayedMeals.length > 0 ? (
          displayedMeals.map((meal: Meal) => (
            <li key={meal.idMeal} className={styles.card}>
              <img
                src={meal.strMealThumb || "/placeholder.jpg"}
                alt={meal.strMeal}
              />
              <h3 className={styles.title}>{meal.strMeal}</h3>
              <p className={styles.subtitle}>
                {meal.strCategory} | {meal.strArea}
              </p>
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

      {/* Пагинация */}
      <div className={styles.paginatiionWrap}>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.arrow}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return page <= 7 || page === totalPages || page === currentPage;
              })
              .map((page, index, arr) => (
                <React.Fragment key={page}>
                  {index > 0 && page !== arr[index - 1] + 1 && (
                    <span className={styles.dots}>...</span>
                  )}
                  <button
                    className={`${styles.page} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              className={styles.arrow}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
