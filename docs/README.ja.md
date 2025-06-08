[簡体字中文](../README.md) | [英語](./README.en.md) | [日本語](#)

# LCEDA Pro LabelMaker

[EasyEDA Pro](https://lceda.cn/)用のシルクラベル生成プラグイン。Reactによる現代的なUIとLCEDA SDKとのシームレスな連携を備えています。

---

## 概要

**LCEDA-Pro-LabelMaker** は嘉立創EDA Professional（EasyEDA Pro）環境向けに設計されたシルクラベル作成プラグインです。React技術スタックを使い、[EasyEDA標準版LabelMaker](https://github.com/xsrf/easyeda-labelmaker)の機能を参考にしつつ改良・拡張しています。

---

## 主な特徴

-   🖥️ モダンなUI：React実装による直感的かつ軽快な操作性
-   🔗 ネイティブ統合：LCEDA Pro SDKベースでスムーズに連携

---

## インストール

1.  [Releasesページ](../../releases) から最新の `.eext` ファイルをダウンロードします。
2.  EasyEDA Proの「プラグイン管理」より、ダウンロードした `.eext` を読み込みます。

---

## 使い方

-   PCBプロジェクトを開き、トップバーからLabelMakerを起動してください。
-   必要に応じてラベル内容を調整し、「配置」をクリックするとシルクラベルがPCB上に反映されます。

---

## 参考・謝辞

本プロジェクトは [EasyEDA標準版LabelMaker](https://github.com/xsrf/easyeda-labelmaker) をベースに、Reactフレームワークで再設計・拡張されたものです。  
オープンソースコミュニティによる技術交流・コントリビューションに感謝します。

---

## コントリビューション

プロジェクトへの貢献を歓迎します。PRを送る前に、以下をご確認ください。

1. [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) のコミット規約に従ってください。例：
    ```
    feat: バッチ生成機能を追加
    fix: 複数選択モード時の表示バグ修正
    ```
2. **バージョン番号やchangelogの手動更新は不要です。**  
   これらは全てCI/CDで自動処理されます。
3. 全てのコミット・リリース工程は自動化されています。マージ後、CIによりテスト、リリース、changelog生成が行われます。

---

## ライセンス

本プラグインは [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) で公開しています。  
「嘉立創EDA」「EasyEDA」は本プラグインの説明およびプロジェクトタイトルにのみ使用しており、商標権は各社に帰属します。

---

## サポート

-   不具合報告や要望は [GitHub Issues](../../issues) をご利用ください。
-   コミュニティとのディスカッションは Discussions タブにて。

![Plugin Screenshot 1](./docs/images/plugin1.png)
![Plugin Screenshot 2](./docs/images/plugin2.png)

```

```
