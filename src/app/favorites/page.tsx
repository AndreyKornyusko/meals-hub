"use client";
import { useFavorites } from "../../../lib/useFavorites";
import { Meal } from "../../../ interfaces/data";
import { Button } from "../../components/Button";
import { MealCard } from "../../components/MealCard";
import { EmptyState } from "../../components/EmptyState";
import Image from "next/image";

interface Ingredient {
  name: string;
  measure: string;
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  const ingredientsMap: Record<string, { amount: number; unit: string }> = {};

  // Processing ingredients using the new `ingredients` field
  favorites.forEach((meal: Meal) => {
    meal?.ingredients &&
      meal?.ingredients.forEach(({ name, measure }) => {
        if (!name || !measure) return;

        const normalizedName = name.trim().toLowerCase();
        const parsedAmount = parseFloat(measure);
        const unit = measure.replace(/[0-9.]/g, "").trim();

        if (!ingredientsMap[normalizedName]) {
          ingredientsMap[normalizedName] = { amount: 0, unit };
        }

        if (
          ingredientsMap[normalizedName].unit === unit ||
          !ingredientsMap[normalizedName].unit
        ) {
          ingredientsMap[normalizedName].amount += parsedAmount || 0;
        } else {
          ingredientsMap[normalizedName] = { amount: parsedAmount || 0, unit };
        }
      });
  });

  if (favorites.length === 0) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-end">
          <Button href="/" variant="primary" size="md">
            До головної →
          </Button>
        </div>
        <div className="py-12">
          <EmptyState
            title="Немає збережених рецептів"
            message="Додайте рецепти до обраних, щоб вони з'явилися тут"
            action={<Button href="/" variant="primary">Перейти до рецептів</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
        <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl">
          Обрані рецепти
        </h1>
        <Button href="/" variant="primary" size="md">
          До головної →
        </Button>
      </div>

      {/* Content Grid */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-[90%]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Meals List */}
        <div className="lg:col-span-2">
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {favorites.map((meal: Meal, index: number) => (
              <li
                key={`${meal.idMeal}-${index}`}
                className="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/50"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={meal.strMealThumb || "/placeholder.jpg"}
                    alt={meal.strMeal || "Meal image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {meal.strMeal}
                  </h3>
                  <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Інструкція
                  </h4>
                  <div className="mb-6 max-h-48 overflow-y-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    <p className="line-clamp-6">{meal.strInstructions}</p>
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFavorite.mutate(meal.idMeal)}
                      className="w-full"
                    >
                      Видалити
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Ingredients Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 rounded-xl border-2 border-gray-200 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
              Загальний список інгредієнтів
            </h2>

            {Object.keys(ingredientsMap).length > 0 ? (
              <ul className="flex flex-col gap-3">
                {Object.entries(ingredientsMap).map(([name, value]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:border-primary/50 dark:hover:bg-gray-600"
                  >
                    <span className="capitalize">{name}:</span>
                    <strong className="text-primary font-bold">
                      {value.amount} {value.unit}
                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Немає інгредієнтів
              </p>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}