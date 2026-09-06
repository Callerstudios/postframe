// Extensible content model for the technical/code editor.
//
// To add a new block kind later (e.g. an "image" block): add it to this
// union, then add one case to `renderEditorBlock` and one to
// `renderPreviewBlock` in CodePostEditor.tsx. Nothing else needs to change.

export type TextBlock = {
  id: string;
  type: "text";
  content: string;
};

export type CodeBlock = {
  id: string;
  type: "code";
  language: string;
  content: string;
};

export type Block = TextBlock | CodeBlock;

export type CodePostData = {
  blocks: Block[];
};
