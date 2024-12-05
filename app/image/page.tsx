'use client';

import { useEffect, useState } from 'react';
import { File } from 'megajs';
import Image from 'next/image';

export default function MegaImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const file = File.fromURL('{sharedURL}');
        await file.loadAttributes();

        // ダウンロードストリームを取得
        const stream = file.download({});
        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const blob = new Blob(chunks, { type: 'image/jpeg' }); // 適切な MIME タイプを指定
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to load image from MEGA:', error);
      }
    };

    fetchImage()
      .then((r) => r)
      .catch((e) => e);
  }, []);

  return (
    <div>
      <h1>MEGA Image Display</h1>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="MEGA Image"
          width={800}
          height={600}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}
