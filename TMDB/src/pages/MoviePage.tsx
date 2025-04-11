import { useState } from "react";
import { MovieResponse } from "../types/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useFetch from "../components/useFetch";

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();

  const [page, setPage] = useState(1);

  const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;

  const { data: movies, isPending, isError } = useFetch<MovieResponse>(url);

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="text-4xl"
        >
          {"<"}
        </button>
        &nbsp; &nbsp; &nbsp;
        <span>{page}페이지</span>
        &nbsp; &nbsp; &nbsp;
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="text-4xl"
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="py-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {movies?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
