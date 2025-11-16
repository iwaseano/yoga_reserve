# Yoga Reservation System

ヨガ教室の予約管理システム

## 技術スタック

### フロントエンド
- React 19.2.0 + TypeScript
- Azure Static Web Apps

### バックエンド
- FastAPI 0.115.5
- PostgreSQL
- Azure Web Apps

## ローカル開発環境

### バックエンド起動
```powershell
cd backend
# 仮想環境作成（初回のみ）
python -m venv venv
.\venv\Scripts\Activate.ps1
# 依存関係インストール
pip install -r requirements.txt
# マイグレーション実行
alembic upgrade head
# サーバー起動
uvicorn app.main:app --reload --port 3001
```

### フロントエンド起動
```powershell
cd sample-app
npm install
npm start
```

アクセス:
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:3001
- API Docs: http://localhost:3001/docs

## 環境設定

詳細は [ENVIRONMENT.md](ENVIRONMENT.md) を参照

## デプロイ

- フロントエンド: Azure Static Web Apps
- バックエンド: Azure Web Apps
- データベース: Azure Database for PostgreSQL
