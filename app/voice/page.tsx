'use client';

import React, { useEffect, useState } from 'react';
import { File } from 'megajs';
import Link from 'next/link';

export default function MegaAudioPlayer() {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async (url: string) => {
      try {
        // MEGAのURLからファイルを取得
        const file = File.fromURL(url);
        await file.loadAttributes();

        // ダウンロードストリームを取得
        const stream = file.download({});
        const chunks: Uint8Array[] = [];

        for await (const chunk of stream) {
          chunks.push(chunk);
        }

        // 取得したデータをBlob形式に変換
        const blob = new Blob(chunks, { type: 'audio/mpeg' }); // MP3のMIMEタイプ
        const urlObject = URL.createObjectURL(blob);

        // ブラウザで再生可能なURLを設定
        setAudioUrl(urlObject);
      } catch (error) {
        console.error('Failed to load audio from MEGA:', error);
        setAudioUrl(null);
      }
    };

    if (inputUrl) {
      fetchAudio(inputUrl)
        .then((r) => r)
        .catch((e) => e);
    }
  }, [inputUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
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
      <h1>MEGA MP3 Player</h1>
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Enter MEGA file URL"
          value={inputUrl}
          onChange={handleInputChange}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      {audioUrl ? (
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : inputUrl ? (
        <p>Loading audio...</p>
      ) : (
        <p>Please enter a MEGA file URL to play the audio.</p>
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
        href="/image"
        style={{
          backgroundColor: '#17a2b8',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        Go to Image Page
      </Link>
    </div>
  );
}
