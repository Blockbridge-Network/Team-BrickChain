"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { upload } from 'thirdweb/storage';
import { useClient } from '../../../app/client';

export type FileWithIpfs = File & { ipfsUri: string };

interface FileUploaderProps {
  label: string;
  description: string;
  accept: string;
  multiple: boolean;
  files: FileWithIpfs[];
  onFilesChange: (files: FileWithIpfs[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

export function FileUploader({
  label,
  description,
  accept,
  multiple,
  files,
  onFilesChange,
  maxFiles = 10,
  maxSize = 5242880, // 5MB default
}: FileUploaderProps) {
  const client = useClient();
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Upload to IPFS
      const uploadedFiles = await upload({
        client,
        files: acceptedFiles,
      });

      // Update files state with IPFS information
      const filesWithIpfs = acceptedFiles.map((file, index) => {
        const ipfsUri = Array.isArray(uploadedFiles) ? uploadedFiles[index] : uploadedFiles;
        return Object.assign(file, { ipfsUri }) as FileWithIpfs;
      });

      onFilesChange([...files, ...filesWithIpfs]);
      setUploading(false);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
      setUploading(false);
    }
  }, [client, files, maxFiles, maxSize, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple,
    maxFiles,
    maxSize,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="text-gray-300">{label}</div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          {uploading && <p className="text-sm text-purple-500 mt-2">Uploading...</p>}
        </div>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 rounded bg-gray-800"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="text-sm text-white truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
