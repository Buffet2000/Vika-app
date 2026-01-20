import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import styles from './RichTextEditor.module.css'

export default function RichTextEditor({ value, onChange, disabled }) {
  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Напиши текст статьи…',
      }),
    ],
    content: value || { type: 'doc', content: [{ type: 'paragraph' }] },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  if (editor && value && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
    editor.commands.setContent(value)
  }

  if (!editor) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-pressed={editor.isActive('bold')}
          title="Жирный"
        >
          B
        </button>

        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-pressed={editor.isActive('italic')}
          title="Курсив"
        >
          I
        </button>

        <span className={styles.sep} />

        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          aria-pressed={editor.isActive('bulletList')}
          title="Маркированный список"
        >
          ••
        </button>

        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          aria-pressed={editor.isActive('orderedList')}
          title="Нумерованный список"
        >
          1.
        </button>

        <span className={styles.sep} />

        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          title="Отменить"
        >
          ↶
        </button>

        <button
          type="button"
          className={styles.tb}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          title="Повторить"
        >
          ↷
        </button>
      </div>

      <div className={`${styles.editor} ${disabled ? styles.disabled : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
