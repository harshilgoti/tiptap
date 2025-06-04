import React, { useCallback, useEffect, useState } from "react";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  Editor as TiptapEditorInstance,
} from "@tiptap/react";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";

import Toolbar from "./Toolbar";
import type { EditorContentState, Theme, ToolbarConfig } from "../types/editor";
import {
  DEFAULT_EDITOR_CONTENT,
  DEFAULT_TOOLBAR_CONFIG,
  EXTENSIONS_CONFIG,
  NODE_TYPES,
} from "../constants/editorConfig";
import { uploadImage as defaultUploadImage } from "../utils/uploadImage";
import { debounce } from "../utils/debounce";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("xml", html);
lowlight.register("python", python);
lowlight.register("py", python);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);

interface TiptapEditorProps {
  initialContent?: string;
  onContentChange?: (content: EditorContentState) => void;
  toolbarConfig?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  editable?: boolean;
  theme?: Theme;
  onDragAndDropImage?: (
    editor: TiptapEditorInstance,
    files: FileList
  ) => Promise<void>;
  onMarkdownPaste?: (
    editor: TiptapEditorInstance,
    event: ClipboardEvent
  ) => boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent = DEFAULT_EDITOR_CONTENT,
  onContentChange,
  toolbarConfig = DEFAULT_TOOLBAR_CONFIG,
  onImageUpload = defaultUploadImage,
  editable = true,
  theme = "light",
  onDragAndDropImage,
  onMarkdownPaste,
}: TiptapEditorProps) => {
  const [editorMounted, setEditorMounted] = useState(false);

  const debouncedOnChange = debounce((editor: TiptapEditorInstance) => {
    onContentChange?.({
      html: editor.getHTML(),
      json: editor.getJSON(),
    });
  }, 300);
  const editor = useEditor({
    editable,
    extensions: EXTENSIONS_CONFIG,
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      debouncedOnChange(currentEditor);
    },
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-lg m-5 focus:outline-none p-4 border border-gray-300 dark:border-gray-700 rounded-b-md min-h-[300px] ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-white text-gray-900"
        }`,
      },
      handleDrop: (__, event, _, moved) => {
        if (moved || !onDragAndDropImage) return false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
          );
          if (imageFiles.length > 0) {
            event.preventDefault();
            const dataTransfer = new DataTransfer();
            imageFiles.forEach((file) => dataTransfer.items.add(file));
            if (editor && dataTransfer.files) {
              onDragAndDropImage(editor, dataTransfer.files);
            }

            return true;
          }
        }
        return false;
      },
      handlePaste: (_, event) => {
        if (editor && onMarkdownPaste && onMarkdownPaste(editor, event)) {
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && !editorMounted) {
      setEditorMounted(true);
    }
  }, [editor, editorMounted]);

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes(NODE_TYPES.LINK).href as
      | string
      | undefined;
    const url = window.prompt("Enter URL:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange(NODE_TYPES.LINK).unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange(NODE_TYPES.LINK)
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className={`tiptap-editor-wrapper ${theme}`}>
      <Toolbar
        editor={editor}
        config={toolbarConfig}
        onImageUpload={onImageUpload}
        disabled={!editorMounted || !editable}
      />
      {editor && (
        <>
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, placement: "bottom-start" }}
            className="bubble-menu bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 flex gap-1 border border-gray-200 dark:border-gray-700"
            shouldShow={({ editor: currentEditor, from, to }) => {
              return (
                currentEditor.isActive(NODE_TYPES.LINK) ||
                (from !== to && !currentEditor.isActive(NODE_TYPES.LINK))
              );
            }}
          >
            {editor.isActive(NODE_TYPES.LINK) ? (
              <>
                <button
                  onClick={handleSetLink}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                >
                  Edit Link
                </button>
                <button
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-red-500"
                >
                  Remove Link
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSetLink}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                >
                  Add Link
                </button>
              </>
            )}
          </BubbleMenu>
          <EditorContent editor={editor} className="tiptap-editor-content" />{" "}
        </>
      )}
    </div>
  );
};

export default React.memo(TiptapEditor);
