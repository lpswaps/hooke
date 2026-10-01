/**
 * 精度格式化工具库
 *
 * 核心背景：
 * - 链上金额（如 BNB、USDT、代币数量）在数据库和 API 里通常以「最小单位」的整数字符串存储，
 *   例如 18 位精度的 ETH，1.5 ETH 会存成 "1500000000000000000"。
 * - JS 的 Number 最大安全整数是 2^53 - 1（约 9e15），18 位精度的数动辄 1e18+，
 *   直接用 Number() 转会丢精度。所以这里用「字符串切分」的方式做格式化，完全避开浮点误差。
 */

/**
 * 把最小单位整数字符串按指定精度转成人类可读的十进制字符串。
 *
 * 例：formatUnits("1500000000000000000", 18) → "1.5"
 *     formatUnits("1234500000000000000", 18) → "1.2345"
 *     formatUnits("1000000000000000000", 18) → "1"
 *     formatUnits("-1500000000000000000", 18) → "-1.5"
 *
 * @param {string|number|bigint} rawValue - 最小单位的原始值，通常是整数字符串
 * @param {number} decimals - 精度位数（ETH/BNB 是 18，USDT 是 6，USDC 是 6）
 * @returns {string} 格式化后的十进制字符串；非法输入返回 "0"
 */
export function formatUnits(rawValue, decimals = 18) {
    // 空值兜底：undefined / null 都返回 "0"，避免调用方报错
    if (rawValue === undefined || rawValue === null) return '0';

    // 统一转字符串并去掉首尾空格，后续做纯字符串运算，不用 Number，避免精度丢失
    let str = String(rawValue).trim();

    // 处理负号：先剥离出来，最后再拼回去。因为下面的切分逻辑只处理正数部分
    const negative = str.startsWith('-');
    if (negative) str = str.slice(1);

    // 合法性校验：只允许纯数字。空字符串、含小数点、含字母、含空格等一律返回 "0"
    if (!/^\d+$/.test(str)) return '0';

    // 补足位数到至少 decimals + 1 位。
    // 目的：保证下面的 slice 切分时，整数部分至少有一位，不会出现空字符串。
    // 例：decimals = 18，输入 "5" → 补成 "0000000000000000005"（19 位）
    //     slice(0, 19-18) = slice(0,1) = "0"，slice(1) = "000000000000000005"
    str = str.padStart(decimals + 1, '0');

    // 从右往左数 decimals 位，左边是整数部分，右边是小数部分
    const intPart = str.slice(0, str.length - decimals) || '0';

    // 小数部分：去掉尾部的 0（例如 "500000000000000000" → "5"）
    // 这样 "1.500000000000000000" 就会变成 "1.5"，而不是拖一大堆 0
    const fracPart = str.slice(str.length - decimals).replace(/0+$/, '');

    // 有小数部分就拼成 "int.frac"，没有就只返回整数部分
    const result = fracPart ? `${intPart}.${fracPart}` : intPart;

    // 恢复负号
    return negative ? `-${result}` : result;
}

/**
 * 把最小单位的原始值格式化成紧凑的、带单位的字符串（K / M / B）。
 *
 * 例：formatCompact("987910000000000000000000") → "987.91K"
 *     formatCompact("1234500000000000000000000") → "1.23M"
 *     formatCompact("987910000000000000000000000") → "987.91M"
 *
 * 用途：行情面板里表格的「24H VOL」「MCAP」等列，避免超长数字撑破布局。
 *
 * ⚠️ 注意：内部经过 Number()，超出 2^53 会丢精度，仅用于「展示」，
 *         不要用它的结果参与精确计算或比较。
 *
 * @param {string|number|bigint} rawValue - 最小单位的原始值
 * @param {number} decimals - 精度位数
 * @returns {string} 带 K/M/B 单位的字符串；非法输入返回 "0"
 */
export function formatCompact(rawValue, decimals = 18) {
    // 先转成人类可读的十进制字符串，再转 Number 做量级判断
    const formatted = Number(formatUnits(rawValue, decimals));

    // 转换失败（NaN）兜底
    if (Number.isNaN(formatted)) return '0';

    // 十亿级：1,000,000,000 以上，用 B（Billion）
    if (formatted >= 1_000_000_000) return `${(formatted / 1_000_000_000).toFixed(2)}B`;

    // 百万级：1,000,000 以上，用 M（Million）
    if (formatted >= 1_000_000) return `${(formatted / 1_000_000).toFixed(2)}M`;

    // 千级：1,000 以上，用 K（Kilo）
    if (formatted >= 1_000) return `${(formatted / 1_000).toFixed(2)}K`;

    // 小于 1,000：直接保留两位小数
    return formatted.toFixed(2);
}

/**
 * 缩短区块链地址，用于 UI 展示。
 *
 * 例：shortenAddress("0x1234567890abcdef1234567890abcdef12345678")
 *     → "0x1234...5678"
 *
 * @param {string} address - 完整地址（通常 42 个字符，以 0x 开头）
 * @param {number} chars - 首尾各保留多少个字符，默认 4
 * @returns {string} 缩短后的地址；空输入返回空字符串
 */
export function shortenAddress(address, chars = 4) {
    // 空值兜底：直接返回空字符串，让调用方自己决定显示什么
    if (!address) return '';

    // chars + 2 是因为要额外保留 "0x" 前缀；slice(-chars) 取末尾 chars 位
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * 计算百分比，返回保留两位小数的字符串。
 *
 * 例：calcPercent(25, 100) → "25.00"
 *     calcPercent(1, 3)    → "33.33"
 *
 * 用途：交易占比、涨跌幅、进度百分比等。
 *
 * @param {number|string} numerator - 分子
 * @param {number|string} denominator - 分母
 * @returns {string} 百分比字符串（不带 % 符号）；非法输入或分母为 0 返回 "0.00"
 */
export function calcPercent(numerator, denominator) {
    const n = Number(numerator);
    const d = Number(denominator);

    // 校验：分子分母任一不是有限数（NaN/Infinity），或分母为 0，都返回 "0.00"
    // 避免出现 NaN% / Infinity% 这种脏数据污染 UI
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return '0.00';

    return ((n / d) * 100).toFixed(2);
}

/**
 * 保留两位小数，返回字符串。
 *
 * 例：round2(1.005)  → "1.01"（受浮点影响可能是 "1.00"，注意）
 *     round2("3.1415") → "3.14"
 *     round2(null)     → "0.00"
 *
 * ⚠️ 注意：toFixed 走的是 Number 浮点，对于「必须精确」的金额场景，
 *         应该用 formatUnits 做字符串级别的截断，而不是这个函数。
 *         这个函数适合「UI 展示用的普通数字」。
 *
 * @param {number|string} num - 待处理的数字
 * @returns {string} 保留两位小数的字符串；非法输入返回 "0.00"
 */
export function round2(num) {
    const n = Number(num);

    // 非法输入兜底
    if (!Number.isFinite(n)) return '0.00';

    return n.toFixed(2);
}

//计算曲线剩余的可售代币数量
export function formatCurveRemaining(targetRaw, soldRaw, decimals = 18) {
    const remaining =
        BigInt(targetRaw) > BigInt(soldRaw)
            ? BigInt(targetRaw) - BigInt(soldRaw)
            : 0n;

    return formatCompact(remaining);
}

