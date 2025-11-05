# PDF Quiz Generator

PDFファイルをアップロードすると、AI（Claude 4 Sonnet）が自動的にクイズを生成するNext.jsアプリケーションです。

## 特徴

- 📄 **PDFアップロード**: ドラッグ&ドロップまたはファイル選択でPDFをアップロード
- 🤖 **AI生成**: Claude 4 Sonnetを使用してPDFの内容から多肢選択問題を自動生成
- 📊 **問題数選択**: 3問〜10問まで自由に選択可能
- ✨ **インタラクティブUI**: リアルタイムで問題生成の進捗を表示
- 🎯 **即座のフィードバック**: 回答後すぐに正解・不正解を確認
- 📈 **スコア表示**: クイズ終了後に詳細なスコアと復習画面を表示
- 🌓 **ダークモード対応**: ライト/ダークテーマの切り替えに対応

## 技術スタック

- **フレームワーク**: Next.js 15.1.8
- **言語**: TypeScript
- **UIライブラリ**: React 19.1.0
- **スタイリング**: Tailwind CSS 4.1.7
- **アニメーション**: Framer Motion
- **AIモデル**: Anthropic Claude 4 Sonnet (AI SDK経由)
- **バリデーション**: Zod
- **UIコンポーネント**: Radix UI
- **通知**: Sonner

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm / npm / yarn

### インストール

1. リポジトリをクローン:

```bash
git clone <repository-url>
cd pdf-to-quiz-generator
```

2. 依存関係をインストール:

```bash
pnpm install
# または
npm install
# または
yarn install
```

3. 環境変数を設定:

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Anthropic APIキーは[Anthropic Console](https://console.anthropic.com/)から取得できます。

4. 開発サーバーを起動:

```bash
pnpm dev
# または
npm run dev
# または
yarn dev
```

5. ブラウザで開く:

[http://localhost:3000](http://localhost:3000)にアクセスしてアプリケーションを表示します。

## 使い方

1. **PDFをアップロード**: PDFファイル（5MB以下）をドラッグ&ドロップまたはクリックして選択
2. **問題数を選択**: 3〜10問の中から生成したい問題数を選択
3. **クイズを生成**: 「クイズを生成」ボタンをクリック
4. **問題に回答**: 表示される問題に順番に回答
5. **結果を確認**: 全問回答後、スコアと復習画面が表示されます

## プロジェクト構成

```
pdf-to-quiz-generator/
├── app/
│   ├── (preview)/
│   │   ├── page.tsx          # メインページ（PDFアップロード画面）
│   │   ├── layout.tsx        # レイアウトコンポーネント
│   │   ├── globals.css       # グローバルスタイル
│   │   └── actions.ts        # サーバーアクション
│   └── api/
│       └── generate-quiz/
│           └── route.ts      # クイズ生成APIエンドポイント
├── components/
│   ├── quiz.tsx              # クイズコンポーネント
│   ├── quiz-overview.tsx     # クイズ復習コンポーネント
│   ├── score.tsx             # スコア表示コンポーネント
│   ├── themeToggle.tsx       # テーマ切り替えコンポーネント
│   └── ui/                   # Radix UI コンポーネント
├── lib/
│   ├── schemas.ts            # Zodスキーマ定義
│   └── utils.ts              # ユーティリティ関数
└── package.json
```

## API仕様

### POST /api/generate-quiz

PDFファイルからクイズを生成します。

**リクエストボディ:**

```json
{
  "files": [
    {
      "name": "document.pdf",
      "type": "application/pdf",
      "data": "base64_encoded_pdf_data"
    }
  ],
  "questionsLength": 4
}
```

**レスポンス:** ストリーミング形式で問題を順次返却

## デプロイ

### Vercelへのデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/pdf-to-quiz-generator)

1. Vercelにログイン
2. リポジトリをインポート
3. 環境変数 `ANTHROPIC_API_KEY` を設定
4. デプロイ

## ライセンス

このプロジェクトは[LICENSE](LICENSE)ファイルに基づいてライセンスされています。

## 参考リンク

- [AI SDK ドキュメント](https://sdk.vercel.ai/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [Vercel AI Playground](https://play.vercel.ai)

---

🤖 AI技術を活用した学習支援ツールとしてご活用ください。
