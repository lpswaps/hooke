import { colors } from "../../../styles/theme";

// 兜底色集中在一处,不再散落在各个 JSX 里
export const TRADE_COLORS = {
    buy: colors.success ?? '#3fbf6f',
    sell: colors.danger ?? '#e05656',
    accent: colors.accent ?? '#c8f542',
};

export const getActionColor = (isBuy) => (isBuy ? TRADE_COLORS.buy : TRADE_COLORS.sell);