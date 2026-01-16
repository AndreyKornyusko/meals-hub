"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useMeal } from "../../../../lib/useMeal";
import { Button } from "../../../components/Button";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { EmptyState } from "../../../components/EmptyState";

export default function RecipePage() {
  const { id } = useParams();
  const mealId = id as string;
  const { meal, isLoading } = useMeal(mealId);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!meal) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-end">
          <Button href="/" variant="primary" size="md">
            До головної →
          </Button>
        </div>
        <div className="py-12">
          <EmptyState
            title="Рецепт не знайдено"
            message="Спробуйте вибрати інший рецепт"
            action={<Button href="/" variant="primary">Повернутися до списку</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex justify-end">
        <Button href="/" variant="primary" size="md">
          До головної →
        </Button>
      </div>

      {/* Title */}
      <h1 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl">
        {meal.strMeal}
      </h1>

      {/* Image */}
      <div className="mb-12 flex justify-center">
        <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-xl sm:h-96 md:h-[500px]">
          <Image
            src={meal.strMealThumb || "/placeholder.jpg"}
            alt={meal.strMeal || "Recipe image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Інгредієнти:
        </h2>
        {meal?.ingredients && meal.ingredients.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meal.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/50"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {ing.name}
                </span>
                <span className="ml-3 font-bold text-primary">
                  {ing.measure}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Інгредієнти не вказані
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Інструкція
        </h2>
        <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <p className="whitespace-pre-line text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {meal.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}
