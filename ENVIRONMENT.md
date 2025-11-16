# 環境設定ガイド

## 環境の種類

### 1. ローカル環境 (local)
- ローカルのPostgreSQLとバックエンドAPIを使用
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:3001

### 2. Azure環境 (azure)
- Azure Static Web Apps + Azure Functions/Web Apps
- Azure Database for PostgreSQL
- 本番環境用

### 3. モック環境 (mock)
- フロントエンドのみでテスト
- モックAPIを使用（実装が必要な場合）

## バックエンドの環境設定

### ローカル環境で起動
```powershell
cd backend
$env:ENVIRONMENT="local"
uvicorn app.main:app --reload --port 3001
```

または `.env` ファイルを編集:
```
ENVIRONMENT=local
```

### Azure環境用の設定
`.env` ファイルを以下のように設定:
```
ENVIRONMENT=azure
AZURE_DATABASE_URL=postgresql+psycopg2://username:password@server.postgres.database.azure.com:5432/yoga_reserve?sslmode=require
AZURE_CORS_ORIGINS=["https://your-static-web-app.azurestaticapps.net"]
SECRET_KEY=<本番用の強力なキー>
```

## フロントエンドの環境設定

### ローカル環境で起動
```powershell
cd sample-app
npm start
# または
npm run start:local
```

### モック環境で起動
```powershell
cd sample-app
npm run start:mock
```

### Azure用ビルド
```powershell
cd sample-app
npm run build:azure
```

## 環境ファイルの説明

### バックエンド
- `.env` - 環境変数設定ファイル
  - `ENVIRONMENT`: local, azure, mock
  - `DATABASE_URL`: ローカルDB接続文字列
  - `AZURE_DATABASE_URL`: Azure PostgreSQL接続文字列
  - `CORS_ORIGINS`: ローカル用CORS設定
  - `AZURE_CORS_ORIGINS`: Azure用CORS設定

### フロントエンド
- `.env.local` - ローカル開発環境用
- `.env.production` - Azure本番環境用
- `.env.mock` - モック環境用

## Azureデプロイ時の設定

### Azure Static Web Apps
1. `.env.production` でAPIのURLを設定
2. `npm run build:azure` でビルド
3. `build` フォルダをデプロイ

### Azure Functions / Web Apps
1. Azure Portal で環境変数を設定:
   - `ENVIRONMENT=azure`
   - `AZURE_DATABASE_URL=<接続文字列>`
   - `AZURE_CORS_ORIGINS=<Static Web AppsのURL>`
   - `SECRET_KEY=<強力なランダムキー>`

## 環境切り替えの確認

### バックエンド
```powershell
# デバッグエンドポイントで確認
curl http://localhost:3001/debug/config
```

### フロントエンド
ブラウザのコンソールで:
```javascript
console.log(window.location.origin)
```

## トラブルシューティング

### CORSエラー
- バックエンドの `CORS_ORIGINS` または `AZURE_CORS_ORIGINS` を確認
- フロントエンドのURLが正しく設定されているか確認

### データベース接続エラー
- `ENVIRONMENT` が正しく設定されているか確認
- Azure環境の場合、`AZURE_DATABASE_URL` が設定されているか確認
- 接続文字列にSSLモード(`?sslmode=require`)が含まれているか確認

### 認証エラー
- `SECRET_KEY` が環境間で一致しているか確認（本番とローカルで別の値を使用推奨）
