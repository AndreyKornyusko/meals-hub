import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export function usePagination(totalItems: number) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPageParam = searchParams.get("page");
  const initialPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalItems]);

  const totalPages = useMemo(() => Math.ceil(totalItems / ITEMS_PER_PAGE), [totalItems]);

  const displayedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return { start, end: start + ITEMS_PER_PAGE };
  }, [currentPage]);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    setCurrentPage: updatePage,
    displayedItems,
  };
}
