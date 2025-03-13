export async function fetchMeals() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  }

  export async function searchMeals(query: string) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    if (!res.ok) throw new Error("Failed to fetch meals");
    return res.json();
  }