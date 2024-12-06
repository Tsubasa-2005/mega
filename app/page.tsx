'use client';

import React, { useState } from 'react';
import { File as MegaFile, Storage } from 'megajs';
import Link from 'next/link';

export default function MediaStreamPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size > 100 * 1024 * 1024) {
      setError('File size exceeds the 100MB limit.');
      setFile(null);
    } else {
      setFile(selectedFile || null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setFileURL(null);
    setProgress(0);

    try {
      const email = process.env.NEXT_PUBLIC_STORAGE_EMAIL!;
      const password = process.env.NEXT_PUBLIC_STORAGE_PASSWORD!;

      const storage = new Storage({
        email: email,
        password: password,
      });

      await storage.login();

      if (!storage.root.children) {
        return new Error('Failed to log in to MEGA.');
      }

      // MEGAにアップロード
      const folderName = 'test'; // 対象フォルダ
      const folder = storage.root.children.find(
        (child) => child.name === folderName
      );
      if (!folder) {
        return new Error(
          `Target folder "${folderName}" does not exist in MEGA.`
        );
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
          throw new Error('Failed to read the file data.');
        }

        const buffer = Buffer.from(
          new Uint8Array(event.target.result as ArrayBuffer)
        );
        if (!file.name || !buffer) {
          throw new Error('Invalid file name or buffer.');
        }
        await folder.upload(file.name, buffer);

        if (!folder.children) {
          throw new Error('No children found in the folder.');
        }

        for (let i = 0; i < 10; i++) {
          const uploadedFile = folder.children.find(
            (child) => child.name === file.name
          ) as MegaFile | undefined;
          if (uploadedFile) {
            const link = await uploadedFile.link({}, undefined);
            setFileURL(link);
          }

          console.log(`File not found yet. Retrying... (${i + 1}/10)`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      };

      reader.readAsArrayBuffer(file);
    } catch {
      console.error('Error during upload:');
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
      setProgress(100); // 完了
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileURL(null);
    setError('');
    setProgress(0);
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>Upload and Stream Media</h1>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: '10px', display: 'block' }}
      />

      {file && (
        <p>
          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}

      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          marginBottom: '10px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Uploading...' : 'Upload and Stream'}
      </button>

      {loading && (
        <div style={{ marginBottom: '10px' }}>
          <p>Uploading... {progress}%</p>
          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#eee',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {fileURL && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: 'green' }}>File uploaded successfully!</p>
          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007bff' }}
          >
            View File
          </a>
          <button
            onClick={resetForm}
            style={{
              marginLeft: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Upload Another File
          </button>
        </div>
      )}
      <div>
        <Link
          href="/image"
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Go to Image Page
        </Link>
        <Link
          href="/voice"
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Go to Voice Page
        </Link>
      </div>
    </div>
  );
}
