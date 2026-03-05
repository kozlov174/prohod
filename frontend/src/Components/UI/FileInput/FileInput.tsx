import React, { memo, useRef, useState } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '@/Components/UI/Icon';
import { formatFileSize } from '@/Utils';
import { displayImage, downloadFile } from '@/Components/UI/FileInput/utils';

type FileInputProps = {
  file: File;
  onUploadFile: (file: File) => void;
  onDeleteFile: () => void;
  label?: string;
  disabled?: boolean;
};

export const FileInputComponent = ({ file, label, disabled, onUploadFile, onDeleteFile }: FileInputProps) => {
  return (
    <div className={styles.container}>
      {label && <p className={styles.container__label}>{label}</p>}
      {file && file.size ? (
        <div className={styles.container__list}>
          <File disabled={disabled} onDeleteFile={onDeleteFile} file={file} />
        </div>
      ) : (
        <Input onUploadFile={onUploadFile} />
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

function File({ file, disabled, onDeleteFile }: { file: File; disabled?: boolean; onDeleteFile: () => void }) {
  return (
    <div className={styles.file}>
      <div onClick={() => downloadFile(file)} className={styles.file__info}>
        <img src={displayImage(file)} />
        <div className={styles.file__about}>
          <p className={styles.file__size}>{`${formatFileSize(file.size)}`}</p>
        </div>
      </div>
      {!disabled && <Icon onClick={onDeleteFile} size={24} glyph="close" pointer glyphColor="red" />}
    </div>
  );
}

export const FileInput = memo(FileInputComponent);
