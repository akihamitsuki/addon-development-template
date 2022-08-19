// import * as test from 'mojang-gametest';
import * as mc from 'mojang-minecraft';
// import * as mcui from 'mojang-minecraft-ui';
import { setBlock } from './slash_commands.js';

// 最初にオーバーワールドの次元情報を取得しておく（今回の使い方では毎回取得する必要がないので）
const overworld = mc.world.getDimension('overworld');

/**
 * 1ティックごとに実行される
 * https://docs.microsoft.com/ja-jp/minecraft/creator/scriptapi/mojang-minecraft/tickevent
 *
 * @param event
 */
mc.world.events.tick.subscribe((event) => {
  // 200ティックごとに（10秒ごとに）
  if (event.currentTick % 200 === 0) {
    // ティック数を秒数に変換する
    const seconds: number = Math.floor(event.currentTick / 20);
    // /sayコマンドを使ってメッセージを表示
    overworld.runCommand(`say アドオンを起動してから${seconds}秒経過しました。`);
  }
});

/**
 * プレイヤーがチャットを送信した時のイベント（表示される前にスクリプトが動く）
 * https://docs.microsoft.com/ja-jp/minecraft/creator/scriptapi/mojang-minecraft/beforechatevent
 *
 * @param event
 */
mc.world.events.beforeChat.subscribe((event) => {
  if (event.message === 'destroy') {
    // 送信者の位置を取得する
    const location = event.sender.location;
    // y座標を -1 (送信者の足元にする)
    location.y -= 1;
    // setblock関数に引数を渡して実行する
    setBlock(event.sender.dimension, location, mc.MinecraftBlockTypes.air, 'destroy');
    // メッセージの送信を取りやめる
    event.cancel = true;
  }
});

/**
 * 攻撃したエンティティを増やす
 *
 * エンティティがダメージを受けた時のイベント
 * https://docs.microsoft.com/ja-jp/minecraft/creator/scriptapi/mojang-minecraft/entityhurtevent
 *
 * @param event
 */
mc.world.events.entityHurt.subscribe((event) => {
  // 攻撃したエンティティがプレイヤーでなければ終了（早期リターン）
  if (event.damagingEntity.id !== 'minecraft:player') {
    return;
  }
  // 攻撃されたエンティティを取得
  const hurtEntity = event.hurtEntity;
  // それがプレイヤー以外なら
  if (hurtEntity.id !== 'minecraft:player') {
    // 攻撃したエンティティと同じ次元に、同じ種類のエンティティを同じ座標に出現させる
    hurtEntity.dimension.spawnEntity(hurtEntity.id, hurtEntity.location);
  }
});

/**
 * 発射物が何かに当たった時のイベント
 * https://docs.microsoft.com/ja-jp/minecraft/creator/scriptapi/mojang-minecraft/projectilehitevent
 *
 * @param event
 */
mc.world.events.projectileHit.subscribe((event) => {
  // 当たったブロック情報を取得する
  const blockInfo = event.blockHit;
  // ブロックに当たっていれば真
  if (blockInfo) {
    // 当たったブロックの座標を取得する
    const location = blockInfo.block.location;
    // そのブロックを入れ替える
    setBlock(event.dimension, location, mc.MinecraftBlockTypes.goldBlock, 'replace');
  } else {
    // ブロックに当たっていなければ偽
    event.dimension.runCommand('say ブロックに当たりませんでした');
  }
});
