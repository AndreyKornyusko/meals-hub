import { useQuery } from "@tanstack/react-query";
import { searchMeals } from "./api";

export function useSearchMeals(searchTerm: string) {
  const {
    data: searchResults,
    refetch,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["searchMeals", searchTerm],
    queryFn: () => searchMeals(searchTerm),
    enabled: !!searchTerm, 
  });

  return { searchResults, refetch, error, isLoading };
}