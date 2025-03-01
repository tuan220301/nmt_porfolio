import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';

const CustomImageComponent = ({ node, editor }: any) => {
  return (
    <NodeViewWrapper className="relative">
      <img src={node.attrs.src} alt={node.attrs.alt} className="max-w-full h-auto rounded-lg" />
      <button
        className="absolute top-0 right-0 bg-red-500 text-white text-sm px-2 py-1 rounded"
        onClick={() => editor.chain().focus().deleteNode('customImage').run()}
      >
        X
      </button>
    </NodeViewWrapper>
  );
};

const CustomImage = Node.create({
  name: 'customImage',
  group: 'block',
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'img' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent);
  },
});

export default CustomImage;
