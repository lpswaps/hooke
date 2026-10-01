import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

// 导航栏仅这四项：发射台 / 市场 / 排行榜 / 我的
// 「创建 Token」不在导航栏中，独立路由 /create
// icon 目前只有移动端抽屉里的方形导航格子会用到，桌面顶栏是纯文字链接
export const NAV_ITEMS = [
  { label: '主页', to: '/', icon: RocketLaunchOutlinedIcon },
  // { label: '文档', to: '/market', icon: ShowChartOutlinedIcon },
  // { label: '排行榜', to: '/ranking', icon: EmojiEventsOutlinedIcon },
  // { label: '我的', to: '/profile', icon: PersonOutlineOutlinedIcon },
];
