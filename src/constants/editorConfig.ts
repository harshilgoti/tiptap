import { Editor, generateJSON } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Image as ImageIcon,
  Link2,
  Undo,
  Redo,
  Eraser,
  Pilcrow,
} from "lucide-react";
import type { ToolbarButtonConfig, ToolbarConfig } from "../types/editor";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import CodeBlockLowlightExtension from "@tiptap/extension-code-block-lowlight";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import BlockquoteExtension from "@tiptap/extension-blockquote";
import UnderlineExtension from "@tiptap/extension-underline";
import { createLowlight } from "lowlight";

const lowlight = createLowlight();
export const NODE_TYPES = {
  HEADING: "heading",
  PARAGRAPH: "paragraph",
  BULLET_LIST: "bulletList",
  ORDERED_LIST: "orderedList",
  CODE_BLOCK: "codeBlock",
  BLOCKQUOTE: "blockquote",
  HORIZONTAL_RULE: "horizontalRule",
  IMAGE: "image",
  LINK: "link",
  TEXT: "text",
  DOC: "doc",
  LIST_ITEM: "listItem",
};

export const LABELS = {
  H1: "Heading 1",
  H2: "Heading 2",
  H3: "Heading 3",
  BOLD: "Bold",
  ITALIC: "Italic",
  UNDERLINE: "Underline",
  BULLET_LIST: "Bullet List",
  ORDERED_LIST: "Numbered List",
  CODE_BLOCK: "Code Block",
  BLOCKQUOTE: "Blockquote",
  HORIZONTAL_RULE: "Horizontal Rule",
  IMAGE_UPLOAD: "Upload Image",
  ADD_LINK: "Add Link",
  UNDO: "Undo",
  REDO: "Redo",
  CLEAR_FORMATTING: "Clear Formatting",
  TOGGLE_DARK_MODE: "Toggle Dark Mode",
  VIEW_HTML: "View HTML",
  VIEW_JSON: "View JSON",
  PARAGRAPH: "Paragraph",
};

const paragraphButton: ToolbarButtonConfig = {
  id: "paragraph",
  icon: Pilcrow,
  action: (editor) => editor.chain().focus().setParagraph().run(),
  isActive: (editor) => editor.isActive(NODE_TYPES.PARAGRAPH),
  type: "block",
  tooltip: LABELS.PARAGRAPH,
};

const headingButtons: ToolbarButtonConfig[] = [
  {
    id: "h1",
    icon: Heading1,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.HEADING, { level: 1 }),
    type: "block",
    options: { level: 1 },
    tooltip: LABELS.H1,
  },
  {
    id: "h2",
    icon: Heading2,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.HEADING, { level: 2 }),
    type: "block",
    options: { level: 2 },
    tooltip: LABELS.H2,
  },
  {
    id: "h3",
    icon: Heading3,
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.HEADING, { level: 3 }),
    type: "block",
    options: { level: 3 },
    tooltip: LABELS.H3,
  },
];

const inlineFormattingButtons: ToolbarButtonConfig[] = [
  {
    id: "bold",
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    type: "inline",
    tooltip: LABELS.BOLD,
  },
  {
    id: "italic",
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    type: "inline",
    tooltip: LABELS.ITALIC,
  },
  {
    id: "underline",
    icon: Underline,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    type: "inline",
    tooltip: LABELS.UNDERLINE,
  },
];

const listFormattingButtons: ToolbarButtonConfig[] = [
  {
    id: "bulletList",
    icon: List,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.BULLET_LIST),
    type: "block",
    tooltip: LABELS.BULLET_LIST,
  },
  {
    id: "orderedList",
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.ORDERED_LIST),
    type: "block",
    tooltip: LABELS.ORDERED_LIST,
  },
];

const insertBlockButtons: ToolbarButtonConfig[] = [
  {
    id: "codeBlock",
    icon: Code,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.CODE_BLOCK),
    type: "block",
    tooltip: LABELS.CODE_BLOCK,
  },
  {
    id: "blockquote",
    icon: Quote,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive(NODE_TYPES.BLOCKQUOTE),
    type: "block",
    tooltip: LABELS.BLOCKQUOTE,
  },
  {
    id: "horizontalRule",
    icon: Minus,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    type: "action",
    tooltip: LABELS.HORIZONTAL_RULE,
  },
];

const imageButton: ToolbarButtonConfig = {
  id: "imageUpload",
  icon: ImageIcon,

  action: () => {},
  type: "action",
  tooltip: LABELS.IMAGE_UPLOAD,
};

const linkButton: ToolbarButtonConfig = {
  id: "link",
  icon: Link2,
  action: (editor) => {
    const previousUrl = editor.getAttributes(NODE_TYPES.LINK).href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

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
  },
  isActive: (editor) => editor.isActive(NODE_TYPES.LINK),
  type: "inline",
  tooltip: LABELS.ADD_LINK,
};

const historyButtons: ToolbarButtonConfig[] = [
  {
    id: "undo",
    icon: Undo,
    action: (editor) => editor.chain().focus().undo().run(),
    type: "action",
    disabled: (editor) => !editor.can().undo(),
    tooltip: LABELS.UNDO,
  },
  {
    id: "redo",
    icon: Redo,
    action: (editor) => editor.chain().focus().redo().run(),
    type: "action",
    disabled: (editor) => !editor.can().redo(),
    tooltip: LABELS.REDO,
  },
];

export const clearFormattingButton: ToolbarButtonConfig = {
  id: "clearFormatting",
  icon: Eraser,
  action: (editor) => editor.chain().focus().unsetAllMarks().clearNodes().run(),
  type: "action",
  tooltip: LABELS.CLEAR_FORMATTING,
};

export const DEFAULT_TOOLBAR_CONFIG: ToolbarConfig = {
  blockFormatting: [paragraphButton, ...headingButtons, ...insertBlockButtons],
  inlineFormatting: [...inlineFormattingButtons, linkButton],
  listFormatting: listFormattingButtons,
  insertions: [imageButton],
  history: historyButtons,
  link: [linkButton],
};

export const PLACEHOLDER_TEXT = "Start typing...";

export const DEFAULT_EDITOR_CONTENT = `<h1>Tiptap Editor Demo App!</h1><p>Try out the formatting options in the toolbar above.</p><ul><li><p>Bullet list item</p></li></ul><ol><li><p>Numbered list item</p></li></ol><blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4"><p>This is a blockquote. It's great for highlighting text.</p></blockquote><pre class="bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded-md overflow-x-auto"><code class="language-javascript">console.log('Hello, world!');</code></pre><p>You can also insert horizontal rules:</p><hr class="my-4 border-gray-300 dark:border-gray-600"><p>And add <strong>bold</strong>, <em>italic</em>, or <u>underlined</u> text, as well as <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline" href="https://google.com">links</a>.</p>`;

export const EXTENSIONS_CONFIG = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: false,
    horizontalRule: false,
    blockquote: false,
    history: {
      depth: 20,
    },
  }),
  UnderlineExtension,
  ImageExtension.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class:
        "max-w-full h-auto rounded-md border border-gray-200 dark:border-gray-700",
    },
  }),
  LinkExtension.configure({
    openOnClick: true,
    autolink: true,
    HTMLAttributes: {
      class:
        "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline",
    },
  }),
  PlaceholderExtension.configure({
    placeholder: PLACEHOLDER_TEXT,
  }),
  CodeBlockLowlightExtension.configure({
    lowlight,
    defaultLanguage: "plaintext",
    HTMLAttributes: {
      class:
        "bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded-md overflow-x-auto",
    },
  }),
  HorizontalRuleExtension.configure({
    HTMLAttributes: {
      class: "my-4 border-gray-300 dark:border-gray-600",
    },
  }),
  BlockquoteExtension.configure({
    HTMLAttributes: {
      class: "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4",
    },
  }),
];
export const DEFAULT_EDITOR_CONTENT_JSON = generateJSON(
  DEFAULT_EDITOR_CONTENT,
  EXTENSIONS_CONFIG
);

export const IMAGE_UPLOAD_OPTIONS = {
  MAX_FILE_SIZE_MB: 5,
  ACCEPTED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

export const OUTPUT_VIEW_OPTIONS = {
  HTML: "HTML",
  JSON: "JSON",
};

export const DARK_MODE_CLASS = "dark";
