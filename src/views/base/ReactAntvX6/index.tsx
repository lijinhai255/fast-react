import { CellView, Graph, Shape } from '@antv/x6';
// import { register } from '@antv/x6-react-shape';
// import { Dropdown } from 'antd';
import { useRef, useEffect } from 'react';
// import createRoot from 'react-dom';
import { createRoot } from 'react-dom/client';

import data from './data';
import styles from './index.module.less';

import './index.less';
import { Cell } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

Graph.registerNode(
  'lane',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'rect',
        selector: 'name-rect',
      },
      {
        tagName: 'text',
        selector: 'name-text',
      },
    ],
    attrs: {
      body: {
        fill: '#FFF',
        stroke: '#5F95FF',
        strokeWidth: 1,
      },
      'name-rect': {
        width: 200,
        height: 30,
        fill: '#5F95FF',
        stroke: '#fff',
        strokeWidth: 1,
        x: -1,
      },
      'name-text': {
        ref: 'name-rect',
        refY: 0.5,
        refX: 0.5,
        textAnchor: 'middle',
        fontWeight: 'bold',
        fill: '#fff',
        fontSize: 22,
      },
    },
  },
  true,
);

Graph.registerNode(
  'lane-rect',
  {
    inherit: 'rect',
    width: 100,
    height: 60,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
);

Graph.registerNode(
  'lane-polygon',
  {
    inherit: 'polygon',
    width: 80,
    height: 80,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        refPoints: '0,10 10,0 20,10 10,20',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
);
Graph.registerEdge(
  'lane-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    connector: 'smooth',
    target: { cell: 'rect' },
    label: {
      attrs: {
        label: {
          fill: '#A2B1C3',
          fontSize: 10,
        },
      },
    },
  },
  true,
);
const Example = () => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    Shape.Rect.config({
      width: 300,
      height: 150,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          in: {
            position: { name: 'left' },
            label: {
              position: 'absolute', // 标签位置
            },
            width: 100,
            attrs: {
              fo: {
                width: 100,
                height: 22,
                x: -50,
                y: -5,
                magnet: 'true',
              },
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
            zIndex: 1,
          },
          out: {
            position: { name: 'right' },
            width: 100,
            attrs: {
              fo: {
                width: 100,
                height: 22,
                x: -50,
                y: -5,
                magnet: 'true',
              },
            },
            zIndex: 1,
          },
        },
      },
      // https://x6.antv.antgroup.com/api/model/node#portmarkup
      // portMarkup: [
      //   {
      //     tagName: 'circle',
      //     selector: 'portBody',
      //     attrs: {
      //       r: 5,
      //       magnet: true,
      //       stroke: '#31d0c6',
      //       fill: '#fff',
      //       strokeWidth: 2,
      //     },
      //   },
      // ],
      // portMarkup: [Markup.getForeignObjectMarkup()],
    });
    Shape.Rect.config({
      width: 10,
      height: 10,
      attrs: {
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          circleLeft: {
            position: { name: 'left' },
            width: 10,
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -5,
                y: 0,
                magnet: 'true',
              },
            },
          },
          circleRight: {
            position: { name: 'right' },
            width: 10,
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -5,
                y: 0,
                magnet: 'true',
              },
            },
          },
        },
      },
    });
    if (!container.current) {
      return;
    }
    const width = container.current.offsetWidth;
    const height = container.current.offsetHeight;

    const graph = new Graph({
      container: container.current,
      autoResize: true,
      width,
      height,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      translating: {
        restrict(cellView: CellView) {
          const cell = cellView.cell as Node;
          const parentId = cell.prop('parent');
          if (parentId) {
            const parentNode = graph.getCellById(parentId) as Node;
            if (parentNode) {
              return parentNode.getBBox().moveAndExpand({
                x: 0,
                y: 30,
                width: 0,
                height: -30,
              });
            }
          }
          return cell.getBBox();
        },
      },
      panning: {
        enabled: true,
      },
      onPortRendered(args) {
        const { label = '-' } = args.port.attrs;
        const { port } = args;
        // const { title = '-' } = args.port;

        const selectors = args.contentSelectors;
        const container = selectors && selectors.foContent;
        if (container) {
          const root = createRoot(container); // Ensure to create the root correctly
          if (port.group === 'circleLeft' || port.group === 'circleRight') {
            root.render(<div className={styles.circle} />); // Render depending on the group
          } else {
            root.render(<div className={styles.port}>{label}</div>); // Default rendering
          }
        }
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.1,
        maxScale: 3,
      },
      connecting: {},
    });

    const cells: Cell[] = [];
    data.forEach((item: any) => {
      if (item.shape === 'lane-edge') {
        // @ts-ignore
        cells.push(graph.createEdge(item));
      } else {
        // @ts-ignore
        cells.push(graph.createNode(item));
      }
    });
    graph.fromJSON(data);
    graph.centerContent(); // 将画布中元素居中展示
  }, [container.current, data]);

  return (
    <div className='react-shape-app'>
      <div className='app-content' ref={container} />
    </div>
  );
};

export default Example;
