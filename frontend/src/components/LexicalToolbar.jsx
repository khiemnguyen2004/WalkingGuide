import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();

  const format = (type) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  };

  const insertList = (type) => {
    if (type === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.update(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const img = document.createElement("img");
          img.src = url;
          img.style.maxWidth = "100%";
          range.insertNode(img);
        }
      });
    }
  };

  return (
    <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
      <button type="button" onClick={() => format('bold')}><b>B</b></button>
      <button type="button" onClick={() => format('italic')}><i>I</i></button>
      <button type="button" onClick={() => format('underline')}><u>U</u></button>
      <button type="button" onClick={() => insertList('bullet')}>• List</button>
      <button type="button" onClick={() => insertList('number')}>1. List</button>
      <button type="button" onClick={insertLink}>🔗 Link</button>
      <button type="button" onClick={insertImage}>🖼️ Image</button>
    </div>
  );
}
