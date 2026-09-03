# Postframe

**Frame your ideas.**

Postframe is a content-to-visual composition tool for turning written content, technical explanations, quotes, and social posts into polished visuals that are ready to share.

The goal is simple: **the content is the visual. Postframe stays out of the way.**

## What it does

Postframe provides focused creation flows for different types of content:

* **Social posts** — create polished visuals from social media content
* **Quotes** — turn quotes and attribution into composed visuals
* **Threads** — structure longer-form content into shareable visuals
* **Code posts** — combine technical explanations with syntax-highlighted code blocks
* **Custom** — for content that doesn't fit a predefined format

Each creation flow separates **content** from **visual composition**, allowing the same underlying content to be presented through different designs.

## Code posts

Code posts are built around structured blocks rather than a single code editor.

A post can alternate naturally between explanations and code:

```text
Text
  ↓
Code
  ↓
Text
  ↓
Code
  ↓
Text
```

This makes it possible to explain a technical concept alongside the code that demonstrates it.

Supported code languages include JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, HTML, CSS, SQL, JSON, Bash, and Plain Text.

## Design philosophy

Postframe deliberately avoids the visual conventions common in generic SaaS products.

The interface is:

* Minimal
* Editorial
* Precise
* Typography-driven
* Structured
* Technical without feeling like an IDE

The generated visuals are treated differently from the application UI. The application provides the tools for composition; the final visual is designed around the content itself.

> **Postframe doesn't decorate content. It composes it.**

## Tech stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Browser APIs

Postframe currently runs entirely in the browser.

There is no authentication, database, or backend in the current version.

## Getting started

### Prerequisites

* Node.js
* npm

### Installation

```bash
git clone https://github.com/your-username/postframe.git
cd postframe
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project structure

```text
src/
├── components/
│   ├── layout/
│   └── ui/
│
├── features/
│   └── create/
│       ├── quote/
│       ├── social-post/
│       ├── thread/
│       └── code-post/
│
├── styles/
└── App.tsx
```

The application is organized around **features and creation flows**, rather than one large collection of shared components. This keeps each content type independent while allowing common UI primitives and rendering infrastructure to be reused.

## Current scope

Postframe is intentionally being built incrementally.

The current version focuses on the core creation experience:

**Choose → Compose → Preview → Download**

Features such as authentication, cloud storage, collaboration, publishing, AI generation, and template marketplaces are outside the current V1 scope.

## Roadmap

The architecture is designed to allow Postframe to grow without coupling the core editor to a backend.

Potential future capabilities include:

* Additional content block types
* More visual presets
* Advanced composition controls
* Additional export formats
* Saved projects
* Cloud storage
* Authentication
* Collaboration
* Publishing integrations

These will be added only when they support the core product rather than adding complexity for its own sake.

## Contributing

Postframe is currently developed as a focused product project.

If you find a bug or have a suggestion, open an issue with enough context to reproduce or evaluate it.

## License

License information will be added when the project's distribution terms are finalized.
