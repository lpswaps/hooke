import { useMemo, useId } from 'react';

function buildSmoothPath(coords) {
  if (coords.length < 3) {
    return coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  }
  let path = `M${coords[0][0].toFixed(2)},${coords[0][1].toFixed(2)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const [x0, y0] = coords[i === 0 ? 0 : i - 1];
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    const [x3, y3] = coords[i + 2 < coords.length ? i + 2 : i + 1];
    const cp1x = x1 + (x2 - x0) / 6;
    const cp1y = y1 + (y2 - y0) / 6;
    const cp2x = x2 - (x3 - x1) / 6;
    const cp2y = y2 - (y3 - y1) / 6;
    path += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;
  }
  return path;
}

/**
 * 纯 SVG 实现的迷你走势图，无第三方依赖。
 * points: number[]（或可安全转数字的字符串数组），任意范围的数值，内部会自动归一化。
 */
export default function MiniSparkline({
  points = [],
  width = 80,
  height = 28,
  color = '#8FD14F',
  strokeWidth = 1.5,
  fill = true,
  smooth = true,
  showEndDot = true,
}) {
  const uid = useId();
  const gradientId = `sparkline-fill-${uid}`;

  const { linePath, areaPath, endPoint } = useMemo(() => {
    if (!points || points.length < 2) return { linePath: '', areaPath: '', endPoint: null };

    const numericPoints = points.map((p) => Number(p));
    const min = Math.min(...numericPoints);
    const max = Math.max(...numericPoints);
    const range = max - min;
    const isFlat = range === 0;
    const stepX = width / (numericPoints.length - 1);

    const coords = numericPoints.map((value, index) => {
      const x = index * stepX;
      const y = isFlat ? height / 2 : height - ((value - min) / range) * height;
      return [x, y];
    });

    const line = smooth ? buildSmoothPath(coords) : coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');

    const area = `${line} L${width},${height} L0,${height} Z`;

    return { linePath: line, areaPath: area, endPoint: coords[coords.length - 1] };
  }, [points, width, height, smooth]);

  // 无数据：不渲染
  if (!points || points.length === 0) return null;

  // 只有一个价格点：画一条水平线 + 右侧端点
  if (points.length === 1) {
    const y = height / 2;
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <line
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {showEndDot && (
          <circle cx={width} cy={y} r={strokeWidth * 1.5} fill={color} />
        )}
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {fill && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndDot && endPoint && (
        <circle cx={endPoint[0]} cy={endPoint[1]} r={strokeWidth * 1.5} fill={color} />
      )}
    </svg>
  );
}