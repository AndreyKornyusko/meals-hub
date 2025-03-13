import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Meal } from "../ interfaces/data";

export function useFavorites() {
  const queryClient = useQueryClient();

  // Read saved favorites from localStorage
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => JSON.parse(localStorage.getItem("favorites") || "[]"),
  });

  // Add a new favorite
  const addFavorite = useMutation({
    mutationFn: (meal: Meal) => {
      const updatedFavorites = [...favorites, meal];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["favorites"], data);
    },
  });

  // Remove a favorite
  const removeFavorite = useMutation({
    mutationFn: (id: string) => {
      const updatedFavorites = favorites.filter((meal: Meal) => meal.idMeal !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["favorites"], data);
    },
  });

  return { favorites, addFavorite, removeFavorite };
}