import { Model } from '@antv/layout';
import React, { useEffect, useRef } from 'react';

import Graph from './Graph';
import styles from './index.module.less';

// Graph.registerRouter('customArcRouter', customArcRouter as any);
// const customArcRouter =//   vertices: Point[],
//   options: any,
//   edgeView: EdgeView,
// ): Point[] => {
//   const source = edgeView.sourceBBox;
//   const target = edgeView.targetBBox;
//   const points: Point[] = [];

//   // 添加自定义路由逻辑
//   const offsetX = 20; // 路由水平偏移量
//   const offsetY = 20; // 路由垂直偏移量

//   // 添加起始点
//   points.push(
//     new Point(source.x + source.width + offsetX, source.y + source.height / 2),
//   );
//   // 添加弧线中的控制点
//   points.push(new Point((source.x + target.x) / 2, source.y + offsetY));
//   // 添加结束点
//   points.push(new Point(target.x - offsetX, target.y + target.height / 2));

//   return points;
// };
const ProcessStructureDiagram = ({ diagramData }: { diagramData: Model }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !diagramData) return;
    // Graph.registerRouter('customArcRouter', customArcRouter as any);

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    const graph = new Graph(
      {
        container: containerRef.current,
        width,
        height,
        background: { color: '#f7f8f9' },
        grid: { size: 10, visible: true },

        // panning: { enabled: true },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.1,
          maxScale: 3,
        },
        translating: {
          restrict(cellView) {
            const { cell } = cellView;
            const parentId = cell.prop('parent');
            if (parentId) {
              const parentNode = graph.getCellById(parentId);
              if (parentNode) {
                return parentNode
                  .getBBox()
                  .moveAndExpand({ x: 0, y: 30, width: 0, height: -30 });
              }
            }
            return cell.getBBox();
          },
        },
        onPortRendered(args) {
          const { label = '-' } = args.port.attrs;
          const { port } = args;
          const selectors = args.contentSelectors;
          const container = selectors && selectors.foContent;
          if (container) {
            const root = createRoot(container);
            if (port.group === 'circleLeft' || port.group === 'circleRight') {
              root.render(<div className={styles.circle} />);
            } else {
              root.render(<div className={styles.port}>{label}</div>);
            }
          }
        },
      },
      diagramData,
      width,
      height,
    );
  }, [diagramData]);

  return (
    <div className={styles.viewBox} style={{ height: '100vh' }}>
      <div
        className={styles.contain}
        ref={containerRef}
        style={{ height: '100vh' }}
      />
    </div>
  );
};

export default ProcessStructureDiagram;
