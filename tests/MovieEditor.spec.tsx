import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [
            { id: "song1", name: "Test Song", by: "Test Artist" },
            { id: "song2", name: "Second Song", by: "Second Artist" },
        ],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            />,
        );
    });

    test("saves edits including soundtrack changes", async () => {
        await userEvent.clear(screen.getByLabelText(/title/i));
        await userEvent.type(screen.getByLabelText(/title/i), "Updated Movie");

        const yearInput = screen.getByRole("spinbutton");
        await userEvent.clear(yearInput);
        await userEvent.type(yearInput, "2024");

        await userEvent.selectOptions(screen.getByRole("combobox"), "10");

        await userEvent.clear(screen.getByLabelText(/description/i));
        await userEvent.type(
            screen.getByLabelText(/description/i),
            "Updated description",
        );

        const songNameInput = screen.getByDisplayValue("Test Song");
        const songArtistInput = screen.getByDisplayValue("Test Artist");

        await userEvent.clear(songNameInput);
        await userEvent.type(songNameInput, "New Song");

        await userEvent.clear(songArtistInput);
        await userEvent.type(songArtistInput, "New Artist");

        await userEvent.click(screen.getByRole("button", { name: /^save$/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({
                title: "Updated Movie",
                released: 2024,
                rating: 10,
                description: "Updated description",
                soundtrack: [
                    {
                        id: "song1",
                        name: "New Song",
                        by: "New Artist",
                    },
                    {
                        id: "song2",
                        name: "Second Song",
                        by: "Second Artist",
                    },
                ],
            }),
        );
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });

    test("falls back to zero for blank numeric fields", async () => {
        const yearInput = screen.getByRole("spinbutton");
        const ratingSelect = screen.getByRole("combobox");

        await userEvent.clear(yearInput);
        await userEvent.selectOptions(ratingSelect, "0");

        await userEvent.click(screen.getByRole("button", { name: /^save$/i }));

        expect(mockEditMovie).toHaveBeenCalledWith(
            "test-movie-123",
            expect.objectContaining({
                released: 0,
                rating: 0,
            }),
        );
    });

    test("cancels editing without saving", async () => {
        await userEvent.click(
            screen.getByRole("button", { name: /^cancel$/i }),
        );

        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).not.toHaveBeenCalled();
    });

    test("deletes the movie when delete is clicked", async () => {
        await userEvent.click(
            screen.getByRole("button", { name: /^delete$/i }),
        );

        expect(mockDeleteMovie).toHaveBeenCalledWith("test-movie-123");
        expect(mockEditMovie).not.toHaveBeenCalled();
    });
});
