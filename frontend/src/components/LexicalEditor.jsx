import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import LexicalToolbar from "./LexicalToolbar";

export default function LexicalEditor({ value, onChange, placeholder = "Nhập nội dung..." }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme: {},
    onError(error) {
      throw error;
    },
    editorState: value || null,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalToolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className="form-control mb-2" style={{ minHeight: 120, background: "#fff" }} />}
        placeholder={<div style={{ color: "#aaa", padding: 8 }}>{placeholder}</div>}
      />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={editorState => {
          editorState.read(() => {
            const htmlString = $getRoot().getTextContent();
            onChange(htmlString);
          });
        }}
      />
    </LexicalComposer>
  );
}
