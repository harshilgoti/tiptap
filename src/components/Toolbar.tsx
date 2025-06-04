import React, { useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import type { ToolbarButtonConfig, ToolbarConfig } from "../types/editor";
import {
  DEFAULT_TOOLBAR_CONFIG,
  IMAGE_UPLOAD_OPTIONS,
  LABELS,
} from "../constants/editorConfig";
import { uploadImage as uploadImageUtil } from "../utils/uploadImage";

interface ToolbarProps {
  editor: Editor | null;
  config?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
}

const ToolbarButton: React.FC<{
  config: ToolbarButtonConfig;
  editor: Editor;
}> = ({ config, editor }) => {
  const IconComponent = config.icon;

  const handleClick = useCallback(() => {
    if (!config.action) return;

    if ("options" in config && config.options) {
      config.action(editor, config.options);
    } else {
      config.action(editor);
    }
  }, [editor, config]);

  // const isDisabled = config.disabled ? config.disabled(editor) : !editor.can();
  const isActive = config.isActive ? config.isActive(editor) : false;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={config.disabled?.(editor) ?? false}
      title={config.tooltip}
      className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isActive ? "bg-gray-300 dark:bg-gray-600" : "bg-transparent"
                  }`}
    >
      {IconComponent ? <IconComponent size={20} /> : config.label}
    </button>
  );
};

const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  config = DEFAULT_TOOLBAR_CONFIG,
  onImageUpload,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = event.target.files?.[0];
      if (file) {
        try {
          const imageUrl = onImageUpload
            ? await onImageUpload(file)
            : await uploadImageUtil(file);
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          alert((error as Error).message || "Image upload failed.");
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [editor, onImageUpload]
  );

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!editor || disabled) {
    return (
      <div className="p-2 border-b border-gray-300 dark:border-gray-700 flex flex-wrap items-center gap-1 bg-gray-100 dark:bg-gray-800 opacity-50">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Editor loading or disabled...
        </span>
      </div>
    );
  }

  const imageUploadButtonConfig = config.insertions.find(
    (btn) => btn.id === "imageUpload"
  );

  return (
    <div className="p-2 border-b border-gray-300 dark:border-gray-700 flex flex-wrap items-center gap-1 bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
      <div className="flex items-center gap-1">
        {config.blockFormatting.map((btnConfig) => (
          <ToolbarButton
            key={btnConfig.id}
            config={btnConfig}
            editor={editor}
          />
        ))}
      </div>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>{" "}
      <div className="flex items-center gap-1">
        {config.inlineFormatting.map((btnConfig) => (
          <ToolbarButton
            key={btnConfig.id}
            config={btnConfig}
            editor={editor}
          />
        ))}
      </div>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>{" "}
      <div className="flex items-center gap-1">
        {config.listFormatting.map((btnConfig) => (
          <ToolbarButton
            key={btnConfig.id}
            config={btnConfig}
            editor={editor}
          />
        ))}
      </div>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>{" "}
      <div className="flex items-center gap-1">
        {config.insertions
          .filter((btn) => btn.id !== "imageUpload")
          .map((btnConfig) => (
            <ToolbarButton
              key={btnConfig.id}
              config={btnConfig}
              editor={editor}
            />
          ))}
        {imageUploadButtonConfig && (
          <>
            <button
              type="button"
              onClick={triggerImageUpload}
              title={LABELS.IMAGE_UPLOAD}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={!editor.can()}
            >
              {imageUploadButtonConfig.icon ? (
                <imageUploadButtonConfig.icon size={20} />
              ) : (
                LABELS.IMAGE_UPLOAD
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept={IMAGE_UPLOAD_OPTIONS.ACCEPTED_FILE_TYPES.join(",")}
              className="hidden"
            />
          </>
        )}
      </div>
      <div className="flex-grow"></div>
      <div className="flex items-center gap-1">
        {config.history.map((btnConfig) => (
          <ToolbarButton
            key={btnConfig.id}
            config={btnConfig}
            editor={editor}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
