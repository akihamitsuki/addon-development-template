// import * as test from 'mojang-gametest';
import * as mc from 'mojang-minecraft';
// import * as mcui from 'mojang-minecraft-ui';
import { settings } from './settings.js';
import { say, setBlock } from './slash_commands.js';

const overworld = mc.world.getDimension('overworld');

// 現在のティックを数える
let currentTick = 0;

/**
 * 1ティックごとに実行される
 */
mc.world.events.tick.subscribe((): void => {
  // 200ティックごとに（10秒ごとに）
  if (settings.showElapsedTime && currentTick % 200 === 0) {
    const seconds: number = Math.floor(currentTick / 20);
    say(overworld, `今回ログインして${seconds}秒経過しました。`);
  }

  currentTick++;
});

/**
 * プレイヤーがチャットを送信した時のイベント（表示される前にスクリプトが動く）
 * https://docs.microsoft.com/ja-jp/minecraft/creator/scriptapi/mojang-minecraft/beforechatevent
 *
 * @param event
 */
mc.world.events.beforeChat.subscribe((event): void => {
  // 送信したメッセージが特定の文字列に一致した場合
  if (event.message === 'tick') {
    // メッセージ内容を変更する
    event.message = `tick: '${currentTick}'`;
  }
});
// 同じイベントを複数登録しても有効
mc.world.events.beforeChat.subscribe((event): void => {
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
mc.world.events.entityHurt.subscribe((event): void => {
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
 *
 * @param event
 */
mc.world.events.projectileHit.subscribe((event): void => {
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
