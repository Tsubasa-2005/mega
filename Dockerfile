# Node.js の公式イメージを使用
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# 環境変数ファイルを Docker イメージ内にコピー
COPY .env.local .env.local

# Next.js のビルド
RUN npm run build

# Next.js アプリケーションを起動
CMD ["npm", "run", "start"]

# コンテナがリッスンするポート
EXPOSE 3000