# Fortnite replayファイル読み込み

- replayファイルから順位、撃破数、撃破した相手が人間かBotか、、などを読み取り、ファイルに保存
- わかる範囲で。。

- 出力ファイル
  - xxx_parsed.json : 指定したプロパティのパースデータ
  - xxx_summary.md : 上記データから作成したサマリー

## Setting
- index.jsのREPLAY_PATHにreplayファイル格納フォルダパスをセット

## Usage
- replayファイルの読み込み、サマリーファイル出力
  ```
  $ npm run exec [ReplayFile Name] [debug]
  ```
  [option]
    - ReplayFile Name: replayファイル名（xxx.replay）。index.js内の変数replayFileNameにセットするか、引数で渡す
    - debug: ライブラリfortnite-replay-parserに渡すconfigのdebugフラグをtrueにする場合

- replayファイル一覧
  - index.js内で定義しているreplayファイル格納フォルダ配下のファイルを確認
  ```
  $ npm run files
  ```

## 使用ライブラリと参考プロジェクト
- https://github.com/xNocken/replay-reader
- https://github.com/xNocken/replay-reader-demo-project

