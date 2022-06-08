import * as mc from 'mojang-minecraft';

/**
 * 座標型から座標の文字列(string)に変換する
 *
 * @param location
 * @returns
 */
export function toString(location: mc.Location | mc.BlockLocation): string {
  // 小数点以下は切り捨て
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);
  // 文字列として返す
  return `${x} ${y} ${z}`;
}

/**
 * LocationをBlockLocationに変換する
 *
 * @param location
 * @returns
 */
export function toBlockLocation(location: mc.Location): mc.BlockLocation {
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);
  return new mc.BlockLocation(x, y, z);
}
