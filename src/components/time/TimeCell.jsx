import TimeAgo from 'react-timeago';

const formatter = (value, unit) => {
    const map = { second: ' S', minute: ' M', hour: ' H', day: ' D', week: ' W', month: ' MO', year: ' Y' };
    return `${value}${map[unit] || unit[0]}`;
};

export function TimeCell({ date, className = '' }) {
    if (!date) return <span className={className}>-</span>;
    return <TimeAgo date={date} formatter={formatter} className={className} />;
}