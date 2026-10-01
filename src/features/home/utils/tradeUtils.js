import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getQuoteAsset } from '../../../constants/quoteAssets';
import { shortenAddress, formatUnits } from '../../../utils/format';

/**
 * @typedef {Object} FeedItem
 * @property {string} id
 * @property {'big_trade'} type
 * @property {number} receivedAt            前端收到的时间戳(ms)
 * @property {Object} data
 * @property {boolean} data.isBuy
 * @property {string} data.trader
 * @property {string} data.token
 * @property {string} data.amountIn         最小单位(wei)字符串
 * @property {string} data.amountOut
 * @property {string} data.quoteAsset       配对资产地址
 * @property {string} data.txHash
 * @property {string} [data.timestamp]      链上时间 ISO 字符串
 */

const formatRelativeTime = (time) =>
    formatDistanceToNow(new Date(time), { addSuffix: true, locale: zhCN });

/**
 * 把原始 feed 数据转换成 UI 直接可用的展示模型。
 * 所有格式化逻辑都在这里,组件里只负责渲染。
 * @param {FeedItem} item
 */
export function toTradeViewModel({ data, receivedAt }) {
    const { isBuy, trader, token, amountIn, quoteAsset, txHash, timestamp } = data;
    const asset = getQuoteAsset(quoteAsset);

    return {
        isBuy,
        txHash,
        trader: shortenAddress(trader, 4),
        token: shortenAddress(token, 4),
        amount: formatUnits(amountIn, asset.decimals),
        symbol: asset.symbol,
        time: formatRelativeTime(timestamp ?? receivedAt),
    };
}