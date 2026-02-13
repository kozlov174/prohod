import React, { memo, useRef, useState } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '@/Components/UI/Icon';
import { formatFileSize } from '@/Utils';

type FileInputProps = {
  file: File;
  onUploadFile: (file: File) => void;
};

export const FileInputComponent = ({ file, onUploadFile }: FileInputProps) => {
  return (
    <div className={styles.container}>
      <Input onUploadFile={onUploadFile} />
      {file && (
        <div className={styles.container__list}>
          <File file={file} />
        </div>
      )}
    </div>
  );
};

type InputProps = {
  onUploadFile: (file: File) => void;
};

function Input({ onUploadFile }: InputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && input.current) {
      input.current.files = files;
    }
  };

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    console.log(e.target.files[0]);
    onUploadFile(e.target.files[0]);
  };

  return (
    <div
      className={`${styles.input} ${isDragOver ? styles.input_hover : ''}`}
      onClick={() => input.current && input.current.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        onChange={addFiles}
        draggable
        ref={input}
        type="file"
        accept=".png, .jpg, .jpeg"
        className={styles.input__input}
      />
      <div className={styles.input__controls}>
        <Icon size={40} glyph="upload" />
        <p className={styles.input__text}>
          <span>Выберите файл</span> или перетяните его сюда
        </p>
      </div>
    </div>
  );
}

function File({ file }: { file: File }) {
  console.log(file);
  return (
    <div className={styles.file}>
      <div className={styles.file__info}>
        <div className={styles.file__about}>
          <p className={styles.file__name}>{file.name}</p>
          <p className={styles.file__size}>{`${formatFileSize(file.size)}`}</p>
          <Icon size={24} glyph="close" pointer glyphColor="red" />
        </div>
      </div>
    </div>
  );
}

export const FileInput = memo(FileInputComponent);
