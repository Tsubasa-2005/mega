'use client';

import React, { useEffect, useState } from 'react';
import { File } from 'megajs';
import Image from 'next/image';
import Link from 'next/link';

export default function MegaImage() {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async (url: string) => {
      try {
        const file = File.fromURL(url);
        await file.loadAttributes();

        // ダウンロードストリームを取得
        const stream = file.download({});
        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const blob = new Blob(chunks, { type: 'image/jpeg' }); // 適切な MIME タイプを指定
        const urlObject = URL.createObjectURL(blob);
        setImageUrl(urlObject);
      } catch (error) {
        console.error('Failed to load image from MEGA:', error);
        setImageUrl(null);
      }
    };

    if (inputUrl) {
      fetchImage(inputUrl)
        .then((r) => r)
        .catch((e) => e);
    }
  }, [inputUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  return (
    <div>
      <h1>MEGA Image Display</h1>
      <div>
        <input
          type="text"
          placeholder="Enter MEGA file URL"
          value={inputUrl}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
        />
      </div>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="MEGA Image"
          width={800}
          height={600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ) : inputUrl ? (
        <p>Loading image...</p>
      ) : (
        <p>Please enter a MEGA file URL to display the image.</p>
      )}

      <Link
        href="/"
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        Go to Home Page
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
  );
}
