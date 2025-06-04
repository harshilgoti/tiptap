import React, { useCallback, useEffect, useState } from "react";
import TiptapEditor from "./components/Editor";
import type { EditorContentState, Theme } from "./types/editor";
import {
  DEFAULT_EDITOR_CONTENT,
  LABELS,
  OUTPUT_VIEW_OPTIONS,
  DARK_MODE_CLASS,
  DEFAULT_EDITOR_CONTENT_JSON,
} from "./constants/editorConfig";
import {
  Moon,
  Sun,
  MonitorSmartphone,
  Code2,
  Type,
  FileCode,
} from "lucide-react";
import { uploadImage as uploadImageUtil } from "./utils/uploadImage";
import { marked } from "marked";
import { Editor as TiptapCoreEditor } from "@tiptap/core";

const App: React.FC = () => {
  const [editorContent, setEditorContent] = useState<EditorContentState>({
    html: DEFAULT_EDITOR_CONTENT,
    json: DEFAULT_EDITOR_CONTENT_JSON,
  });
  const [activeOutputView, setActiveOutputView] = useState<"HTML" | "JSON">(
    OUTPUT_VIEW_OPTIONS.HTML as "HTML" | "JSON"
  );
  const [theme, setTheme] = useState<Theme>("light");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      if (theme === "dark") {
        document.documentElement.classList.add(DARK_MODE_CLASS);
      } else {
        document.documentElement.classList.remove(DARK_MODE_CLASS);
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme, isClient]);

  const handleContentChange = useCallback((content: EditorContentState) => {
    setEditorContent(content);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  const handleDragAndDropImage = useCallback(
    async (editor: TiptapCoreEditor, files: FileList) => {
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          try {
            const imageUrl = await uploadImageUtil(file);
            if (imageUrl) {
              editor.chain().focus().setImage({ src: imageUrl }).run();
            }
          } catch (error) {
            alert(
              (error as Error).message || "Drag & drop image upload failed."
            );
          }
        }
      }
    },
    []
  );

  const handleMarkdownPaste = useCallback(
    (editor: TiptapCoreEditor, event: ClipboardEvent): boolean => {
      const text = event.clipboardData?.getData("text/plain");
      if (text && editor) {
        if (text.match(/^(#+\s|\*\s|-\s|>\s|```)/m)) {
          event.preventDefault();
          const html = marked.parse(text);
          editor
            .chain()
            .focus()
            .insertContent(html, {
              parseOptions: { preserveWhitespace: "full" },
            })
            .run();
          return true;
        }
      }
      return false;
    },
    []
  );

  const outputDisplay =
    activeOutputView === "HTML" ? (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-[400px] text-sm whitespace-pre-wrap break-all">
        {editorContent.html}
      </pre>
    ) : (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-[400px] text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(editorContent.json, null, 2)}
      </pre>
    );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-semibold flex items-center">
          <Type size={28} className="mr-2 text-blue-600 dark:text-blue-400" />
          Tiptap Rich Text Editor
        </h1>
        <button
          onClick={toggleTheme}
          title={LABELS.TOGGLE_DARK_MODE}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </header>

      <main className="container mx-auto p-4">
        <TiptapEditor
          initialContent={DEFAULT_EDITOR_CONTENT}
          onContentChange={handleContentChange}
          theme={theme}
          onDragAndDropImage={handleDragAndDropImage}
          onMarkdownPaste={handleMarkdownPaste}
        />

        <section className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MonitorSmartphone
                size={24}
                className="mr-2 text-green-600 dark:text-green-400"
              />
              Live Output
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveOutputView("HTML")}
                title={LABELS.VIEW_HTML}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1
                            ${
                              activeOutputView === "HTML"
                                ? "bg-blue-500 text-white dark:bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
              >
                <Code2 size={16} /> {OUTPUT_VIEW_OPTIONS.HTML}
              </button>
              <button
                onClick={() => setActiveOutputView("JSON")}
                title={LABELS.VIEW_JSON}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-1
                            ${
                              activeOutputView === "JSON"
                                ? "bg-blue-500 text-white dark:bg-blue-600"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
              >
                <FileCode size={16} /> {OUTPUT_VIEW_OPTIONS.JSON}
              </button>
            </div>
          </div>
          <div className="output-preview min-h-[100px] max-h-[400px] overflow-y-auto p-4 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900">
            {isClient ? outputDisplay : <p>Loading preview...</p>}
          </div>
        </section>
      </main>

      <footer className="text-center p-4 mt-8 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <p>Tiptap Editor Demo</p>
      </footer>
    </div>
  );
};

export default App;
