import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BatchToolbar from "./BatchToolbar";

describe("BatchToolbar", () => {
  const defaultProps = {
    selectedCount: 0,
    totalCount: 5,
    onSelectAll: vi.fn(),
    onDeselectAll: vi.fn(),
    onBatchComplete: vi.fn(),
    onBatchDelete: vi.fn(),
  };

  it("should not render when selectedCount is 0", () => {
    const { container } = render(<BatchToolbar {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render when selectedCount > 0", () => {
    const props = { ...defaultProps, selectedCount: 2 };
    render(<BatchToolbar {...props} />);

    expect(screen.getByTestId("batch-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("batch-toolbar-count")).toHaveTextContent(
      "已选择 2 个任务"
    );
  });

  it("should call onSelectAll when clicking select all button", () => {
    const props = { ...defaultProps, selectedCount: 2 };
    render(<BatchToolbar {...props} />);

    fireEvent.click(screen.getByTestId("select-all-button"));
    expect(props.onSelectAll).toHaveBeenCalledTimes(1);
  });

  it("should call onDeselectAll when clicking deselect all button", () => {
    const props = { ...defaultProps, selectedCount: 2 };
    render(<BatchToolbar {...props} />);

    fireEvent.click(screen.getByTestId("deselect-all-button"));
    expect(props.onDeselectAll).toHaveBeenCalledTimes(1);
  });

  it("should call onBatchComplete when clicking complete button", () => {
    const props = { ...defaultProps, selectedCount: 2 };
    render(<BatchToolbar {...props} />);

    fireEvent.click(screen.getByTestId("batch-complete-button"));
    expect(props.onBatchComplete).toHaveBeenCalledTimes(1);
  });

  it("should call onBatchDelete when clicking delete button", () => {
    const props = { ...defaultProps, selectedCount: 2 };
    render(<BatchToolbar {...props} />);

    fireEvent.click(screen.getByTestId("batch-delete-button"));
    expect(props.onBatchDelete).toHaveBeenCalledTimes(1);
  });

  it("should disable select all button when all items are selected", () => {
    const props = { ...defaultProps, selectedCount: 5, totalCount: 5 };
    render(<BatchToolbar {...props} />);

    const selectAllButton = screen.getByTestId("select-all-button");
    expect(selectAllButton).toBeDisabled();
  });

  it("should display correct selected count", () => {
    const props = { ...defaultProps, selectedCount: 3 };
    render(<BatchToolbar {...props} />);

    expect(screen.getByTestId("batch-toolbar-count")).toHaveTextContent(
      "已选择 3 个任务"
    );
  });
});
