import { render, screen } from "@testing-library/react";
import { WatchStatus } from "../src/components/WatchStatus";

describe("WatchStatus component", () => {
    test("renders the unseen state", () => {
        render(
            <WatchStatus
                watched={{
                    seen: false,
                    liked: false,
                    when: null,
                }}
            ></WatchStatus>,
        );

        expect(screen.getByText(/^not yet watched$/i)).toBeInTheDocument();
    });

    test("renders the watched state", () => {
        render(
            <WatchStatus
                watched={{
                    seen: true,
                    liked: true,
                    when: "2024-04-28",
                }}
            ></WatchStatus>,
        );

        expect(screen.getByText(/^watched$/i)).toBeInTheDocument();
    });
});
