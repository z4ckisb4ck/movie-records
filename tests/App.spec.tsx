import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

function getMovieCard(title: string) {
    const heading = screen.getByRole("heading", { name: title });
    const card = heading.closest("div.bg-light");

    if (card === null) {
        throw new Error(`Could not find movie card for ${title}`);
    }

    return card as HTMLElement;
}

describe("App Component", () => {
    test("adds a new movie when the add modal is saved", async () => {
        render(<App />);

        const initialEditButtons = screen.getAllByRole("button", {
            name: /^Edit$/i,
        });

        await userEvent.click(
            screen.getByRole("button", { name: /add new movie/i }),
        );
        await userEvent.type(
            screen.getByLabelText(/youtube id/i),
            "new-trailer-id",
        );
        await userEvent.click(
            screen.getByRole("button", { name: /save changes/i }),
        );

        expect(screen.queryByLabelText(/youtube id/i)).not.toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /^Edit$/i })).toHaveLength(
            initialEditButtons.length + 1,
        );
    });

    test("does not add a duplicate movie id", async () => {
        render(<App />);

        const initialEditButtons = screen.getAllByRole("button", {
            name: /^Edit$/i,
        });

        await userEvent.click(
            screen.getByRole("button", { name: /add new movie/i }),
        );
        await userEvent.type(
            screen.getByLabelText(/youtube id/i),
            "4bG17OYs-GA",
        );
        await userEvent.click(
            screen.getByRole("button", { name: /save changes/i }),
        );

        expect(screen.getAllByRole("button", { name: /^Edit$/i })).toHaveLength(
            initialEditButtons.length,
        );
    });

    test("marks a movie watched and liked from the movie card", async () => {
        render(<App />);

        const movieCard = getMovieCard("Kiki's Delivery Service");

        await userEvent.click(
            within(movieCard).getByRole("button", {
                name: /mark as watched/i,
            }),
        );

        expect(
            within(movieCard).getByRole("button", {
                name: /mark as unwatched/i,
            }),
        ).toBeInTheDocument();
        expect(
            within(movieCard).getByRole("button", { name: /^not liked$/i }),
        ).toBeInTheDocument();

        await userEvent.click(
            within(movieCard).getByRole("button", { name: /^not liked$/i }),
        );

        expect(
            within(movieCard).getByRole("button", { name: /^liked$/i }),
        ).toBeInTheDocument();
    });

    test("edits a movie title through the app", async () => {
        render(<App />);

        const movieCard = getMovieCard("Kiki's Delivery Service");

        await userEvent.click(
            within(movieCard).getByRole("button", { name: /edit/i }),
        );

        const titleInput = screen.getByLabelText(/title/i);
        await userEvent.clear(titleInput);
        await userEvent.type(titleInput, "Kiki Revisited");

        await userEvent.click(screen.getByRole("button", { name: /^save$/i }));

        expect(
            screen.getByRole("heading", { name: /kiki revisited/i }),
        ).toBeInTheDocument();
    });

    test("deletes a movie through the editor in the app", async () => {
        render(<App />);

        const initialEditButtons = screen.getAllByRole("button", {
            name: /^Edit$/i,
        });

        const movieCard = getMovieCard("Kiki's Delivery Service");

        await userEvent.click(
            within(movieCard).getByRole("button", { name: /edit/i }),
        );
        await userEvent.click(
            screen.getByRole("button", { name: /^delete$/i }),
        );

        expect(
            screen.queryByRole("heading", { name: "Kiki's Delivery Service" }),
        ).not.toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /^Edit$/i })).toHaveLength(
            initialEditButtons.length - 1,
        );
    });
});
