'use client';

import { useEffect, useState } from 'react';
import { File } from 'megajs';

export default function MegaAudioPlayer() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        // MEGAのURLからファイルを取得
        const file = File.fromURL('sharedURL');
        await file.loadAttributes();

        // ダウンロードストリームを取得
        const stream = file.download({});
        const chunks: Uint8Array[] = [];

        for await (const chunk of stream) {
          chunks.push(chunk);
        }

        // 取得したデータをBlob形式に変換
        const blob = new Blob(chunks, { type: 'audio/mpeg' }); // MP3のMIMEタイプ
        const url = URL.createObjectURL(blob);

        // ブラウザで再生可能なURLを設定
        setAudioUrl(url);
      } catch (error) {
        console.error('Failed to load audio from MEGA:', error);
      }
    };

    fetchAudio()
      .then((r) => r)
      .catch((e) => e);
  }, []);

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
      {audioUrl ? (
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
}
