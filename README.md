# Minecraft BE アドオン開発テンプレート

アドオン開発用に必要な初期設定をまとめたものです。


## PCの初回設定


### Visual Studio Code(VSCode)のインストール

エディタはVSCodeを使用していることを前提に説明していきます。

[Visual Studio Code website](https://code.visualstudio.com)


### Node.jsのインストール

アドオン制作を簡単に行うためのツール(npm)の導入をするためにNode.jsをインストールします。

[https://nodejs.org/](https://nodejs.org)

特別な理由がない限りは、LTSバージョンの方をダウンロード・インストールしましょう。


### gulpCLIをインストール

次のコマンドを実行してgulpコマンドを実行できるようにします。

```powershell
npm install gulp-cli --global
```


## プロジェクトの初回設定


### 1. このリポジトリをダウンロードして展開する

展開したプロジェクトフォルダはどこに置いても構いません。
後で移動させることもできます。
 

### 2. プロジェクトフォルダをVSCodeで開く

プロジェクトを開いたとき、推奨拡張機能が表示されるので、同時にインストールしておくと便利です。
必須ではありません。

* Prettier - Code formatter
* UUID Generator


### 2. npmパッケージをインストールする

このファイル(`README.md`)がプロジェクトの最上位にあるか確認してください。
階層が重要なので、余計なフォルダが挟まっていたりする場合は開きなおしましょう。

正しい階層であれば、その状態でVSCodeのターミナルを開きます。(`Ctrl + Shift + @`)

次のコマンドでnpmパッケージをプロジェクトにインストールします。
（プロジェクトフォルダに必要なファイルをダウンロードするだけで、PC上のソフトウェアとしてインストールされるわけではありません）

```powershell
npm install
```

`package.json`で指定されているファイルをインストールするという意味です。


### 3. プロジェクト名を設定する

`gulpfile.js`を開き`projectName`を自分のプロジェクト名に変更します。

```JavaScript
// TODO: 自分のプロジェクト名に変更する
const projectName = 'my_project';
```

この値がアドオンのフォルダ名になります。


### 4. manifest.jsonを変更する

`behavior_pack/manifestt.json`を開いて、自分のプロジェクト用に変更してください。

その際、`header.uuid`だけは必ず変更してください。

`dependencies`の値はスクリプトを動かすためのAPIをマインクラフトに読み込む設定です。
削除しないでください。



## プロジェクトを開きなおす度に実行すること

### コマンドの実行ポリシーを変更する

このコマンド実行ポリシーを変更せずに、後述のgulpコマンドを実行しようとすると、次のような警告文が出て止まります。

> gulp : このシステムではスクリプトの実行が無効になっているため...(以下略)

gulpではファイルの操作を行うので、初期設定ではセキュリティ上の制限がかかっています。  
この制限を解除するためには次のコマンドを実行します。

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

コマンドが具体的に何をしているかは、次の記事を参考にしてください。

[about_Execution_Policies](https://docs.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2)


### gulpを使ってデプロイ

#### A. コマンド実行時にデプロイ

コマンドを実行するとデプロイします。

```powershell
gulp
```

実行後は`/AppData/.../com.mojang/development_behavior_packs/[project name]`にファイルがコピーされています。


#### B. ファイル更新毎にデプロイ（推奨）

ファイルを更新する度に自動でコンパイルからデプロイまでの一連の作業を実行します。

```powershell
gulp watch
```

停止する場合は`Ctrl + c`を押してください。


## 参考

* https://docs.microsoft.com/ja-jp/minecraft/creator/documents/scriptinggettingstarted
* https://github.com/microsoft/minecraft-scripting-samples/
