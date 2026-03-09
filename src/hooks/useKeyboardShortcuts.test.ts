import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("should add keydown event listener on mount", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
      })
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should remove event listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
      })
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should call handler when shortcut is triggered", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
      })
    );

    const event = new KeyboardEvent("keydown", {
      key: "n",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not call handler when enabled is false", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
        enabled: false,
      })
    );

    const event = new KeyboardEvent("keydown", {
      key: "n",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not call handler when modifier keys don't match", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
      })
    );

    const event = new KeyboardEvent("keydown", {
      key: "n",
      ctrlKey: false,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should not trigger shortcut when typing in input (except Escape)", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler,
            description: "新建任务",
            group: "任务操作",
          },
        ],
        ignoreInputs: true,
      })
    );

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "n",
      ctrlKey: true,
      bubbles: true,
    });
    Object.defineProperty(event, "target", { value: input });
    input.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("should allow Escape key in input fields", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "Escape",
            handler,
            description: "取消操作",
            group: "任务操作",
          },
        ],
        ignoreInputs: true,
      })
    );

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
  });

  it("should return formatted shortcuts", () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            shift: true,
            handler: () => {},
            description: "新建任务",
            group: "任务操作",
          },
        ],
      })
    );

    expect(result.current.shortcuts).toEqual([
      {
        keys: ["Ctrl", "Shift", "n"],
        description: "新建任务",
        group: "任务操作",
      },
    ]);
  });

  it("should handle space key correctly", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: " ",
            handler,
            description: "标记完成",
            group: "任务操作",
          },
        ],
      })
    );

    const event = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    const { result } = renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: " ",
            handler,
            description: "标记完成",
            group: "任务操作",
          },
        ],
      })
    );

    expect(result.current.shortcuts[0].keys).toContain("Space");
  });

  it("should work with multiple shortcuts", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts({
        shortcuts: [
          {
            key: "n",
            ctrl: true,
            handler: handler1,
            description: "新建任务",
            group: "任务操作",
          },
          {
            key: "a",
            ctrl: true,
            handler: handler2,
            description: "全选",
            group: "导航与选择",
          },
        ],
      })
    );

    const event1 = new KeyboardEvent("keydown", {
      key: "n",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event1);
    expect(handler1).toHaveBeenCalledTimes(1);

    const event2 = new KeyboardEvent("keydown", {
      key: "a",
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event2);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
