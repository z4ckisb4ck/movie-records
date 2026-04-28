import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableSongList } from "../src/components/EditableSongList";

function SongListHarness({ initialSongs }: { initialSongs: string[] }) {
    const [songs, setSongs] = React.useState(initialSongs);

    return <EditableSongList songs={songs} setSongs={setSongs} />;
}

describe("EditableSongList", () => {
    test("adds a new song row and lets the value be edited", async () => {
        render(<SongListHarness initialSongs={["existing-song"]} />);

        await userEvent.click(
            screen.getByRole("button", { name: /add song/i }),
        );

        const textboxes = screen.getAllByRole("textbox");
        expect(textboxes).toHaveLength(2);

        await userEvent.type(textboxes[1], "new-song-id");
        expect(textboxes[1]).toHaveValue("new-song-id");
    });

    test("removes a song row when the delete button is clicked", async () => {
        render(<SongListHarness initialSongs={["existing-song"]} />);

        await userEvent.click(
            screen.getByRole("button", { name: /add song/i }),
        );

        const secondSongInput = screen.getAllByRole("textbox")[1];
        await userEvent.type(secondSongInput, "new-song-id");

        const secondRow = secondSongInput.closest("li");
        if (secondRow === null) {
            throw new Error("Could not find the song row to delete");
        }

        await userEvent.click(within(secondRow).getByRole("button"));

        expect(screen.getAllByRole("textbox")).toHaveLength(1);
        expect(screen.getByDisplayValue("existing-song")).toBeInTheDocument();
    });
});
