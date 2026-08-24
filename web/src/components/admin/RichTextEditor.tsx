import { useEffect, useRef } from 'react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button type="button" onClick={() => exec('bold')}><b>B</b></button>
        <button type="button" onClick={() => exec('italic')}><i>I</i></button>
        <button type="button" onClick={() => exec('underline')}><u>U</u></button>
        <span className={styles.divider} />
        <button type="button" onClick={() => exec('formatBlock', 'h2')}>H2</button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')}>H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')}>P</button>
        <span className={styles.divider} />
        <button type="button" onClick={() => exec('insertUnorderedList')}>• Список</button>
        <button type="button" onClick={() => exec('insertOrderedList')}>1. Список</button>
        <span className={styles.divider} />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('Ссылка');
            if (url) {
              exec('createLink', url);
            }
          }}
        >
          Ссылка
        </button>
        <button type="button" onClick={() => exec('removeFormat')}>Очистить</button>
      </div>
      <div
        ref={editorRef}
        className={styles.surface}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
        suppressContentEditableWarning
      />
    </div>
  );
}
