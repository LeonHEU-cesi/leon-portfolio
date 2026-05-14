import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

const setThemeMock = vi.fn();
const useThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => useThemeMock(),
}));

describe("<ThemeToggle />", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
    useThemeMock.mockReset();
  });

  it("affiche l'icône lune et l'aria-label 'sombre' quand resolvedTheme = light", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light", setTheme: setThemeMock });
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /sombre/i });
    expect(button).toBeInTheDocument();
  });

  it("affiche l'icône soleil et l'aria-label 'clair' quand resolvedTheme = dark", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark", setTheme: setThemeMock });
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /clair/i });
    expect(button).toBeInTheDocument();
  });

  it("appelle setTheme('dark') quand on clique depuis light", async () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light", setTheme: setThemeMock });
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("appelle setTheme('light') quand on clique depuis dark", async () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark", setTheme: setThemeMock });
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});
