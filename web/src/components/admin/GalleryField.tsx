import { useRef } from 'react';
import { uploadAdminImage } from '../../utils/adminApi';
import styles from './GalleryField.module.css';

interface GalleryFieldProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export default function GalleryField({ label, values, onChange }: GalleryFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const url = window.prompt('URL изображения');
    if (url) {
      onChange([...values, url]);
    }
  };

  const addFile = async (file?: File | null) => {
    if (!file) {
      return;
    }

    const url = await uploadAdminImage(file);
    onChange([...values, url]);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className={styles.field}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.actions}>
          <button type="button" onClick={addUrl}>Добавить URL</button>
          <button type="button" onClick={() => fileRef.current?.click()}>Загрузить</button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              void Promise.all(files.map((file) => addFile(file))).then(() => {
                if (fileRef.current) {
                  fileRef.current.value = '';
                }
              });
            }}
          />
        </div>
      </div>

      {values.length === 0 ? (
        <p className={styles.empty}>Дополнительные фотографии пока не добавлены.</p>
      ) : (
        <ul className={styles.list}>
          {values.map((url, index) => (
            <li key={`${url}-${index}`} className={styles.item}>
              <img src={url} alt="" />
              <button type="button" onClick={() => removeAt(index)}>Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
