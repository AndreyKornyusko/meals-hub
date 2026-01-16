import Image from 'next/image'
import Link from 'next/link'
import { Meal } from '../../ interfaces/data'
import { Button } from './Button'

interface MealCardProps {
  meal: Meal
  isFavorite?: boolean
  onToggleFavorite?: (meal: Meal) => void
  showFullDetails?: boolean
}

export function MealCard({
  meal,
  isFavorite = false,
  onToggleFavorite,
  showFullDetails = false,
}: MealCardProps) {
  // #region agent log
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const card = document.querySelector(`[data-meal-id="${meal.idMeal}"]`);
      if (card) {
        const styles = window.getComputedStyle(card);
        fetch('http://127.0.0.1:7242/ingest/76d80f5e-5eca-4749-8ca3-f89ecb9efd9d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MealCard.tsx:20',message:'Card element computed styles',data:{padding:styles.padding,margin:styles.margin,border:styles.border,className:card.className},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      }
    }, 1500);
  }
  // #endregion
  return (
    <li data-meal-id={meal.idMeal} className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary/30">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          src={meal.strMealThumb || '/placeholder.jpg'}
          alt={meal.strMeal || 'Meal image'}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col px-5 pt-6 pb-4">
        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 line-clamp-2 dark:text-gray-100">
          {meal.strMeal}
        </h3>

        {/* Category and Area */}
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20">
            {meal.strCategory}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {meal.strArea}
          </span>
        </div>

        {/* Instructions (if showFullDetails) */}
        {showFullDetails && meal.strInstructions && (
          <div className="mb-6 max-h-48 overflow-y-auto rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
            <p className="line-clamp-6">{meal.strInstructions}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex gap-3 pt-4">
          {onToggleFavorite && (
            <Button
              variant={isFavorite ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggleFavorite(meal)}
              className="flex-1 font-semibold border-2 border-transparent shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
            >
              {isFavorite ? 'Збережено' : 'Зберегти'}
            </Button>
          )}
          <Button
            href={`/recipes/${meal.idMeal}`}
            variant="primary"
            size="sm"
            className="flex-1 font-semibold border-2 border-primary/20 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
          >
            Детальніше
          </Button>
        </div>
      </div>
    </li>
  )
}

