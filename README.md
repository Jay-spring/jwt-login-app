# jwt-login-app

## 概要

Node.js+Express+MongoDB+JWTを使って構築した「ユーザー登録・ログイン・認証処理」を練習したプロジェクトです。

## 使用技術

- Node.js v22.14.0
- Express v5.1.0
- MongoDB（Mongoose） v8.13.2
- JWT（jsonwebtoken） v9.0.2
- bcrypt v5.1.1
- dotenv v16.5.0
- Postman（APIテスト用） v11.41.4

## 実装した機能

- ユーザー登録（バリデーションあり）
- パスワードのハッシュ化（bcrypt）
- ログイン機能（JWTトークン発行、画面遷移）
- 認証ミドルウェアでJWT検証
- ログアウト機能（クライアント側のトークン削除とログイン画面遷移）
- MongoDBへのユーザー情報保存
- .envによる秘密鍵管理

## ディレクトリ構成

```
.
└── jwt-login-ap
    ├── README.md
    ├── server.js
    ├── users.json
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── models
    │   └── User.js
    ├── public
    │   ├── register.html
    │   ├── login.html
    │   ├── dashboard.html
    │   └── js
    │       ├── register.js
    │       ├── login.js
    │       └─ logout.js    
    └── node_modules/
    Postman
    MongoDB
```

## 認証APIテスト手順（Postman）

- GET/profileで、AuthorizationのヘッダーにJWTトークンをつけてアクセス