import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Movie } from "../src/interfaces/movie";
import { MovieView } from "../src/components/MovieView";

describe("MovieView component", () => {
    const movie: Movie = {
        id: "movie-1",
        title: "Sample Movie",
        released: 1999,
        rating: 8,
        description: "Sample description",
        soundtrack: [
            {
                id: "track-1",
                name: "Song 1",
                by: "Artist 1",
            },
        ],
        watched: {
            seen: false,
            liked: false,
            when: null,
        },
    };

    const deleteMovie = jest.fn();
    const editMovie = jest.fn();
    const setMovieWatched = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieView
                movie={movie}
                deleteMovie={deleteMovie}
                editMovie={editMovie}
                setMovieWatched={setMovieWatched}
            />,
        );
    });

    test("renders the movie details and forwards watch actions", async () => {
        expect(
            screen.getByRole("heading", { name: "Sample Movie" }),
        ).toBeInTheDocument();
        expect(screen.getByText(/released 1999/i)).toBeInTheDocument();
        expect(screen.getByTitle(/youtube video player/i)).toHaveAttribute(
            "src",
            "https://www.youtube.com/embed/movie-1",
        );

        expect(document.querySelectorAll("iframe")).toHaveLength(2);

        await userEvent.click(
            screen.getByRole("button", { name: /mark as watched/i }),
        );

        expect(setMovieWatched).toHaveBeenCalledWith("movie-1", true, false);
    });

    test("switches into edit mode and back again", async () => {
        const title = screen.getByRole("heading", { name: "Sample Movie" });

        await userEvent.click(screen.getByRole("button", { name: /edit/i }));

        expect(screen.getByDisplayValue("Sample Movie")).toBeInTheDocument();
        expect(title).not.toBeVisible();

        await userEvent.click(
            screen.getByRole("button", { name: /^cancel$/i }),
        );

        expect(title).toBeVisible();
    });
});
