import * as mc from 'mojang-minecraft';
import { toBlockLocation } from './utilities';

/**
 * /setblock: 指定した位置のブロックを置き換える
 *
 * @param dimension 置き換えるブロックの次元
 * @param location 置き換えるブロックの座標
 * @param blockType 置き換えるブロックの種類
 * @param mode 破壊モード
 */
export function setBlock(
  dimension: mc.Dimension,
  location: mc.BlockLocation | mc.Location,
  blockType: mc.BlockType,
  mode: 'destroy' | 'keep' | 'replace' = 'replace'
): void {
  // Location型ならBlockLocation型に変換する
  if (location instanceof mc.Location) {
    location = toBlockLocation(location);
  }
  // 対象座標のブロックを取得
  const targetBlock = dimension.getBlock(location);

  // replace: 対象ブロックの状態に関係なく置き換える（何も指定しなかった場合の処理）
  if (mode === 'replace') {
    targetBlock.setType(blockType);
  }
  // keep: 対象ブロックが空気以外なら置き換えず残す（空気の場合だけ置き換える）
  else if (mode === 'keep') {
    if (targetBlock.id === 'minecraft:air') {
      targetBlock.setType(blockType);
    } else {
      return;
    }
  }
  // destory: 対象ブロックを破壊し、アイテム化させた上で置き換える
  else if (mode === 'destroy') {
    // 対象ブロックからアイテムの種類を取得する
    const itemType = mc.Items.get(targetBlock.id);
    // アイテムスタックを作成
    const itemStack = new mc.ItemStack(itemType, 1, 0);
    // アイテムをスポーンさせる
    dimension.spawnItem(itemStack, location);
    // ブロックの種類を入れ替える（上書きするのではなく、入れ替えると表現する）
    targetBlock.setType(blockType);
  }

  // スラッシュコマンドの場合
  // dimension.runCommand(`/setblock ${toString(location)} ${block.type} 0 ${mode}`);
}
