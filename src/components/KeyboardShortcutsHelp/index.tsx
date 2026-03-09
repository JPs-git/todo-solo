import React from "react";
import "./index.css";

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  shortcuts: ShortcutItem[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "任务操作",
    shortcuts: [
      { keys: ["Ctrl", "N"], description: "新建任务" },
      { keys: ["Enter"], description: "确认保存" },
      { keys: ["Esc"], description: "取消操作" },
      { keys: ["Delete"], description: "删除任务" },
      { keys: ["Space"], description: "标记完成/未完成" },
    ],
  },
  {
    title: "导航与选择",
    shortcuts: [
      { keys: ["Ctrl", "F"], description: "聚焦搜索框" },
      { keys: ["Ctrl", "A"], description: "全选任务" },
    ],
  },
  {
    title: "帮助",
    shortcuts: [{ keys: ["?"], description: "显示/隐藏快捷键帮助" }],
  },
];

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="keyboard-shortcuts-modal fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50 p-4"
      data-testid="keyboard-shortcuts-help"
      onClick={onClose}
    >
      <div
        className="keyboard-shortcuts-modal__content bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="keyboard-shortcuts-modal__header flex justify-between items-center p-6 border-b border-gray-200">
          <h2
            className="keyboard-shortcuts-modal__title text-xl font-semibold text-gray-800"
            data-testid="keyboard-shortcuts-title"
          >
            键盘快捷键
          </h2>
          <button
            className="keyboard-shortcuts-modal__close text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="关闭"
            data-testid="keyboard-shortcuts-close"
          >
            ×
          </button>
        </div>
        <div
          className="keyboard-shortcuts-modal__body p-6"
          data-testid="keyboard-shortcuts-list"
        >
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="keyboard-shortcuts-group mb-6">
              <h3 className="keyboard-shortcuts-group__title text-sm font-medium text-gray-500 uppercase mb-3">
                {group.title}
              </h3>
              <div className="keyboard-shortcuts-group__items space-y-3">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="keyboard-shortcuts-item flex items-center justify-between"
                  >
                    <div className="keyboard-shortcuts-item__keys flex items-center gap-2">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="keyboard-shortcuts-key px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="keyboard-shortcuts-separator text-gray-400">
                              +
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="keyboard-shortcuts-item__description text-gray-700">
                      {shortcut.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
