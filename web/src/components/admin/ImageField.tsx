import { useId, useRef } from 'react';
import { uploadAdminImage } from '../../utils/adminApi';
import styles from './ImageField.module.css';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) {
      return;
    }

    const url = await uploadAdminImage(file);
    onChange(url);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <div className={styles.row}>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Загрузите файл или вставьте ссылку"
        />
        <button type="button" className={styles.uploadButton} onClick={() => fileRef.current?.click()}>
          Загрузить
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </div>
      {value && (
        <div className={styles.preview}>
          <img src={value} alt="" />
        </div>
      )}
    </div>
  );
}
