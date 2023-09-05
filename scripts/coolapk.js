/**
 * 更新时间：2023 年 9 月 5 日 13 点 15 分
 * 说明：此脚本只处理开屏广告，建议支持其他广告以便平台可持续运营。只在 shadowrocket 上测试过。
 * 匹配模式：^https?:\/\/api\.coolapk\.com\/v6\/main\/init
 */

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

function modifyInitResponse(obj) {
  obj.data = obj.data.map((item) => {
    // Use == in case property is string
    if (item.entityId == 944 || item.entityId == 945) {
      // 热搜词条广告，比如 "巅峰极速" 和 "冒险岛"（规则已失效）
      return undefined;
    } else if (item.cardId == 6390 || item.description?.includes('AdSlot') || item.extraDataArr?.["SplashAd.Expires"]) {
      // 单位是秒
      item.extraDataArr["Ad.SPLASH_RETRY_PERIOD"] = "2147483647";
      item.extraDataArr["SplashAd.Expires"] = 2147483647; // 不知道是浮点数还是整数，已知填 0.001 必有广告
      item.extraDataArr["SplashAd.onResume"] = "0";
      item.extraData = JSON.stringify(item.extraDataArr);
    }
    return item;
  }).filter((item) => item)
}

if (url.includes("/main/init")) {
  modifyInitResponse(obj)
}

$done({ body: JSON.stringify(obj) });
