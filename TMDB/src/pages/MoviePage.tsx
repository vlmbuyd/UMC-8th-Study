import axios from "axios";
import { useEffect, useState } from "react";
import { Movie, MovieResponse } from "../types/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);
      try {
        const { data } = await axios<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [category, page]);

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
          {movies &&
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </>
  );
}
