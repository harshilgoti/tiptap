import { Editor } from "@tiptap/react";

export type ToolbarButtonConfig =
  | {
      id: string;
      label?: string;
      icon?: React.ElementType;
      action: (editor: Editor) => void;
      isActive?: (editor: Editor) => boolean;
      type: "block" | "inline" | "action" | "separator";
      disabled?: (editor: Editor) => boolean;
      tooltip: string;
      options?: undefined;
    }
  | {
      id: string;
      label?: string;
      icon?: React.ElementType;
      action: (editor: Editor, options: { level: 1 | 2 | 3 }) => void;
      isActive?: (editor: Editor) => boolean;
      type: "block" | "inline" | "action" | "separator";
      options: { level: 1 | 2 | 3 };
      disabled?: (editor: Editor) => boolean;
      tooltip: string;
    };

export interface ToolbarConfig {
  blockFormatting: ToolbarButtonConfig[];
  inlineFormatting: ToolbarButtonConfig[];
  listFormatting: ToolbarButtonConfig[];
  insertions: ToolbarButtonConfig[];
  history: ToolbarButtonConfig[];
  link: ToolbarButtonConfig[];
}

export interface EditorContentState {
  html: string;
  json: Record<string, unknown> | string;
}

export type Theme = "light" | "dark";
