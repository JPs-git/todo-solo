import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import KeyboardShortcutsHelp from "./index";

describe("KeyboardShortcutsHelp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
  };

  it("should not render when isOpen is false", () => {
    const { container } = render(<KeyboardShortcutsHelp {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render when isOpen is true", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    expect(screen.getByTestId("keyboard-shortcuts-help")).toBeInTheDocument();
  });

  it("should display correct title", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    expect(screen.getByTestId("keyboard-shortcuts-title")).toHaveTextContent(
      "键盘快捷键"
    );
  });

  it("should call onClose when clicking close button", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    fireEvent.click(screen.getByTestId("keyboard-shortcuts-close"));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking outside the modal", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    const modal = screen.getByTestId("keyboard-shortcuts-help");
    fireEvent.click(modal);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("should display all shortcut groups", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    expect(screen.getByTestId("keyboard-shortcuts-list")).toBeInTheDocument();
    expect(screen.getByText("任务操作")).toBeInTheDocument();
    expect(screen.getByText("导航与选择")).toBeInTheDocument();
    expect(screen.getByText("帮助")).toBeInTheDocument();
  });

  it("should display shortcut items with keys", () => {
    const props = { ...defaultProps, isOpen: true };
    render(<KeyboardShortcutsHelp {...props} />);

    expect(screen.getAllByText("Ctrl").length).toBeGreaterThan(0);
    expect(screen.getByText("新建任务")).toBeInTheDocument();
    expect(screen.getByText("确认保存")).toBeInTheDocument();
  });
});
