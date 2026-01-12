# ■ Azumill Whisky Store

ウイスキーメーカーの公式ECサイトを想定した、
**フロントエンド完結型のEC＋業務フォームシステム**です。

GitHub Pages 上で動作し、MockAPI と連携して
**注文・お問い合わせ・メールマガジン登録**のデータを管理します。

---

## ■ デモ

* [GitHub Pages](https://maruyamayuki2911.github.io/azemill-ec/)  

* [GitHub Repository](https://github.com/maruyamayuki2911/azemill-ec)

---

## ■ 主な機能

### ■ EC機能

* 商品一覧表示
* 数量指定でカートに追加
* カート内数量変更（＋ / −）
* 数量0の商品は自動削除
* 送料・税込み総額の自動計算
* 注文確定時に MockAPI に注文データをPOST
* 注文IDを採番し、完了画面に引き継ぎ

### ■ 注文管理

* 注文時に `orderId` を自動生成
* 注文データを `/orders` エンドポイントに保存
* 注文完了画面で `orderId` を表示

### ■ お問い合わせ機能

* お問い合わせ種別（ラジオボタン）
* 「ご注文について」選択時のみ注文番号入力を必須化
* 電話番号フォーマット正規化
* フォーム入力値のサニタイズ（XSS対策）
* バリデーションエラーをまとめて表示
* MockAPI `/form` にデータ送信

### ■ メールマガジン登録

* メールアドレスの正規表現バリデーション
* オートフィル対策
* XSS対策（sanitize）
* MockAPI `/form` に登録データを送信

---

## ■ 使用技術

| 分類           | 技術                           |
| ------------   | ----------------------------- |
| フロントエンド  | HTML / CSS(Sass) / JavaScript |
| API            | MockAPI                       |
| データ保存      | localStorage                  |
| ホスティング    | GitHub Pages                  |

---

## ■ 画面構成

* TOPページ
* 商品一覧ページ
* カートモーダル
* 注文完了ページ
* メールマガジン登録ページ
* お問い合わせフォーム
* お問い合わせ完了ページ

---

## ■ データ設計

### 注文データ（/orders）

```json
{
  "orderId": "ORD83951234",
  "date": "2026-01-11T16:32:00.000Z",
  "items": [
    {
      "name": "Highland Flame",
      "volume": "700ml",
      "price": 8800,
      "quantity": 1
    }
  ]
}
```

### フォームデータ（/form）

```json
{
  "name": "山田太郎",
  "email": "test@example.com",
  "phone": "09012345678",
  "contactType": "ご注文について",
  "orderNumber": "ORD83951234",
  "message": "商品が届きません",
  "agreement": "個人情報保護方針"
}
```

---

## ■ 設計の工夫

### ● orderIdをキーにした設計

* 注文時に `generateOrderId()` で一意のIDを発行
* 画面遷移対策として localStorage に保存
* 問い合わせ時に注文番号として再利用可能

### ● フロントエンドでも業務システムを再現

* カート = localStorage
* 注文管理 = MockAPI `/orders`
* 問い合わせ・メルマガ = MockAPI `/form`

---

## ■ セキュリティ・品質対策

| 対策     | 内容                                  |
| ------ | ----------------------------------- |
| XSS対策  | `sanitize()` により `< > & ' "` をエスケープ |
| 入力検証   | email / 電話番号 / 未入力チェック              |
| データ正規化 | 電話番号のハイフン削除・全角→半角                   |
| 二重管理防止 | DOMとlocalStorageの状態を同期              |

---

## ■ セットアップ

```
git clone https://github.com/xxxx/xxxx.git
cd xxxx
```

ブラウザで `index.html` を開くだけで動作します。

---

## ■ 今後の改善予定

* 注文履歴検索機能
* ログイン機能
* 管理画面（注文・問い合わせ一覧）
* 実APIへの切り替え

---