export async function fetchMeals() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    if (!res.ok) throw new Error("Ошибка загрузки данных");
    return res.json();
  }