import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecordControls } from "../src/components/RecordControls";

describe("RecordControls component", () => {
    test("marks an unseen movie as watched", async () => {
        const setMovieWatched = jest.fn();

        render(
            <RecordControls
                watched={{ seen: false, liked: false, when: null }}
                changeEditing={jest.fn()}
                setMovieWatched={setMovieWatched}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: /mark as watched/i }),
        );

        expect(setMovieWatched).toHaveBeenCalledWith(true, false);
    });

    test("marks a watched and liked movie as unwatched", async () => {
        const setMovieWatched = jest.fn();

        render(
            <RecordControls
                watched={{ seen: true, liked: true, when: "2024-01-01" }}
                changeEditing={jest.fn()}
                setMovieWatched={setMovieWatched}
            />,
        );

        expect(
            screen.getByRole("button", { name: /^liked$/i }),
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: /mark as unwatched/i }),
        );

        expect(setMovieWatched).toHaveBeenCalledWith(false, true);
    });

    test("marks a watched but not liked movie as liked", async () => {
        const setMovieWatched = jest.fn();

        render(
            <RecordControls
                watched={{ seen: true, liked: false, when: "2024-01-01" }}
                changeEditing={jest.fn()}
                setMovieWatched={setMovieWatched}
            />,
        );

        expect(
            screen.getByRole("button", { name: /^not liked$/i }),
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: /^not liked$/i }),
        );

        expect(setMovieWatched).toHaveBeenCalledWith(true, true);
    });
});
