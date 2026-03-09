import React from "react";

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
    <div className="keyboard-shortcuts-modal" onClick={onClose}>
      <div
        className="keyboard-shortcuts-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="keyboard-shortcuts-modal__header">
          <h2 className="keyboard-shortcuts-modal__title">键盘快捷键</h2>
          <button
            className="keyboard-shortcuts-modal__close"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        <div className="keyboard-shortcuts-modal__body">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="keyboard-shortcuts-group">
              <h3 className="keyboard-shortcuts-group__title">{group.title}</h3>
              <div className="keyboard-shortcuts-group__items">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div key={shortcutIndex} className="keyboard-shortcuts-item">
                    <div className="keyboard-shortcuts-item__keys">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="keyboard-shortcuts-key">{key}</kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="keyboard-shortcuts-separator">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="keyboard-shortcuts-item__description">
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
