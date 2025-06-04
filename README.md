````
# 📝 React Rich Text Block Editor using Tiptap

## 📌 Title

Build a Rich Text Block Editor Using Tiptap

## 🎯 Objective

Create a block-based editor using Tiptap in React that allows users to write and format content. The editor supports rich formatting, block elements (like headings, lists, code blocks), and inline media (like images).

---

## ✅ Features

### Core Functionalities

- ✅ Headings (H1–H3)
- ✅ Bullet list and Numbered list
- ✅ Bold, italic, underline
- ✅ Code block
- ✅ Blockquote
- ✅ Horizontal rule
- ✅ Image upload from local
- ✅ Undo / Redo
- ✅ Toolbar for block and inline formatting
- ✅ View HTML or JSON output of the content

---

## 🛠 Tech Stack

- ⚛️ React (19+)
- ✍️ Tiptap (v2)
- 🧠 TypeScript
- 🎨 TailwindCSS
- ⚡ Vite

---

## 📁 Folder Structure

```plaintext
.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── Editor.tsx
│   │   └── Toolbar.tsx
│   ├── constants
│   │   └── editorConfig.ts
│   ├── index.css
│   ├── index.tsx
│   ├── types
│   │   ├── editor.d.ts
│   │   ├── highlight-languages.d.ts
│   │   └── lowlight-core.d.ts
│   ├── utils
│   │   └── uploadImage.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
````

---

## ▶️ Getting Started

### 📦 Installation

```bash
git clone https://github.com/harshilgoti/tiptap.git
cd tiptap
npm install
```

### 🚀 Run the App

```bash
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## 💡 Notes

- The editor uses `@tiptap/react` and a set of popular extensions (`StarterKit`, `Image`, `Link`, `Underline`, etc.).
- Uploading images uses the native file input, and images are embedded as base64.
- Output can be viewed in HTML and JSON format below the editor.
- The toolbar dynamically highlights active formatting.

---

## 📦 Assumptions / Libraries Used

- [`@tiptap/react`](https://www.tiptap.dev/)
- [`tailwindcss`](https://tailwindcss.com/)
- Base64 image embedding (no backend)
