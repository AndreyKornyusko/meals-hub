"use client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useFavorites } from "../../lib/useFavorites";
import { useDebounce } from "../../lib/useDebounce";
import { useSearchMeals } from "../../lib/useSearchMeals";
import { useSearchParams, useRouter } from "next/navigation";
import { usePagination } from "../../lib/usePagination";
import { useMeals } from "../../lib/useMeals";
import { Meal } from "../../ interfaces/data";
import { Button } from "../components/Button";
import { MealCard } from "../components/MealCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";

const useUpdatedSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Отримання параметрів з URL
  const selectedCategory = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Оновлення URL с новими параметрами
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

  return {
    selectedCategory,
    searchTerm,
    currentPage,
    updateSearchParams,
  };
};

const HomePageContent = () => {
  const { favorites, addFavorite } = useFavorites();
  const { meals, error, isLoading } = useMeals();
  const { selectedCategory, searchTerm, updateSearchParams } = useUpdatedSearchParams();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm); 
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const { searchResults } = useSearchMeals(debouncedSearchTerm);


  // Фильтрація та пошук по категоріям
  const mealsToShow = useMemo(() => {
  
    const allMeals = debouncedSearchTerm
      ? Array.isArray(searchResults?.meals)
        ? searchResults?.meals
        : []
      : Array.isArray(meals)
      ? meals
      : [];
    
    const filteredMeals = allMeals.filter((meal: Meal) =>
      selectedCategory
        ? meal.strCategory?.toLowerCase() === selectedCategory.toLowerCase()
        : true
    );
    
    return filteredMeals;
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setLocalSearchTerm(newSearchTerm);
    updateSearchParams({ search: newSearchTerm, page: "1" });
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-red-800 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
          <p className="mb-2 font-semibold">Помилка завантаження</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  // #region agent log
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const container = document.querySelector('.w-full.px-4.py-12');
      const header = document.querySelector('.mb-12.flex');
      const cardContent = document.querySelector('.px-6.pt-8.pb-6');
      if (container) {
        const styles = window.getComputedStyle(container);
        fetch('http://127.0.0.1:7242/ingest/76d80f5e-5eca-4749-8ca3-f89ecb9efd9d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:117',message:'Container computed styles',data:{paddingTop:styles.paddingTop,paddingBottom:styles.paddingBottom,paddingLeft:styles.paddingLeft,paddingRight:styles.paddingRight,className:container.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      if (header) {
        const styles = window.getComputedStyle(header);
        fetch('http://127.0.0.1:7242/ingest/76d80f5e-5eca-4749-8ca3-f89ecb9efd9d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:119',message:'Header computed styles',data:{marginBottom:styles.marginBottom,className:header.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      if (cardContent) {
        const styles = window.getComputedStyle(cardContent);
        fetch('http://127.0.0.1:7242/ingest/76d80f5e-5eca-4749-8ca3-f89ecb9efd9d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:34',message:'Card content computed styles',data:{paddingLeft:styles.paddingLeft,paddingRight:styles.paddingRight,paddingTop:styles.paddingTop,paddingBottom:styles.paddingBottom,className:cardContent.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
      const tailwindStyles = Array.from(document.styleSheets).find(sheet => {
        try { return sheet.href?.includes('_next') || sheet.cssRules?.[0]?.cssText?.includes('px-4'); } catch { return false; }
      });
      fetch('http://127.0.0.1:7242/ingest/76d80f5e-5eca-4749-8ca3-f89ecb9efd9d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:check',message:'Tailwind CSS loaded',data:{tailwindFound:!!tailwindStyles,styleSheetsCount:document.styleSheets.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }, 1000);
  }
  // #endregion
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
        <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl">
          Meals Hub
        </h1>
        <Button href="/favorites" variant="primary" size="md">
          До обраних →
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div className="w-full sm:max-w-xs">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-left">
            Категорія
          </label>
          <select
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:focus:border-primary"
            value={selectedCategory}
            onChange={(e) =>
              updateSearchParams({ category: e.target.value, page: "1" })
            }
          >
            <option value="">Усі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:max-w-xs">
          <label className="mb-2 block text-center text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-left">
            Пошук
          </label>
          <div className="relative">
            <input
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 pl-12 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 hover:shadow-md focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-gray-500 dark:focus:border-primary"
              type="text"
              placeholder="Пошук за назвою..."
              value={localSearchTerm}
              onChange={handleSearchChange}
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      {displayedMeals.length > 0 ? (
        <>
          <div className="mb-12 flex justify-center">
            <div className="w-full max-w-[80%] px-[15px]">
              <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedMeals.map((meal: Meal) => (
                  <MealCard
                    key={meal.idMeal}
                    meal={meal}
                    isFavorite={favorites.some(
                      (fav: Meal) => fav.idMeal === meal.idMeal
                    )}
                    onToggleFavorite={(meal) => addFavorite.mutate(meal)}
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <nav
                className="flex items-center gap-3"
                aria-label="Pagination"
              >
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  disabled={page === 1}
                  onClick={() => setCurrentPage(page - 1)}
                  aria-label="Previous page"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        page === pageNum
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={page === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  )
                )}
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  disabled={page === totalPages}
                  onClick={() => setCurrentPage(page + 1)}
                  aria-label="Next page"
                >
                  →
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="py-12">
          <EmptyState
            title="Результатів не знайдено"
            message="Спробуйте змінити параметри пошуку або вибрати іншу категорію"
          />
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <HomePageContent />
    </Suspense>
  );
}