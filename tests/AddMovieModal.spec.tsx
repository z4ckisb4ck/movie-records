import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddMovieModal } from "../src/components/AddMovieModal";

describe("AddMovieModal Component", () => {
    const mockHandleClose = jest.fn();
    const mockAddMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("does not render modal content when hidden", () => {
        render(
            <AddMovieModal
                show={false}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        expect(screen.queryByText(/add new movie/i)).not.toBeInTheDocument();
    });

    test("adds soundtrack ids and submits a new movie", async () => {
        render(
            <AddMovieModal
                show={true}
                handleClose={mockHandleClose}
                addMovie={mockAddMovie}
            />,
        );

        await userEvent.type(
            screen.getByLabelText(/youtube id/i),
            "dQw4w9WgXcQ",
        );
        await userEvent.click(
            screen.getByRole("button", { name: /add song/i }),
        );

        const textboxes = screen.getAllByRole("textbox");
        expect(textboxes).toHaveLength(2);

        await userEvent.type(textboxes[1], "spotify-track-1");
        await userEvent.click(
            screen.getByRole("button", { name: /save changes/i }),
        );

        expect(mockAddMovie).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "dQw4w9WgXcQ",
                title: "",
                rating: 0,
                description: "",
                released: 0,
                soundtrack: [
                    {
                        id: "spotify-track-1",
                        name: "",
                        by: "",
                    },
                ],
                watched: {
                    seen: false,
                    liked: false,
                    when: null,
                },
            }),
        );
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});
