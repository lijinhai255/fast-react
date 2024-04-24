import { Graph } from '@antv/x6';
// import { register } from '@antv/x6-react-shape';
// import { Dropdown } from 'antd';
import React from 'react';

import data from './demo';

import './index.less';
import { Cell } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

// const CustomComponent = ({ node }: { node: Node }) => {
//   const label = node.prop('label');
//   return (
//     <Dropdown
//       menu={{
//         items: [
//           {
//             key: 'copy',
//             label: '复制',
//           },
//           {
//             key: 'paste',
//             label: '粘贴',
//           },
//           {
//             key: 'delete',
//             label: '删除',
//           },
//         ],
//       }}
//       trigger={['contextMenu']}
//     >
//       <div className='custom-react-node'>{label}</div>
//     </Dropdown>
//   );
// };

// register({
//   shape: 'custom-react-node',
//   width: 100,
//   height: 40,
//   component: CustomComponent,
// });

// const data = {
//   nodes: [
//     {
//       id: 'node1',
//       shape: 'custom-react-node',
//       x: 40,
//       y: 40,
//       label: 'hello',
//     },
//     {
//       id: 'node2',
//       shape: 'custom-react-node',
//       x: 160,
//       y: 180,
//       label: 'world',
//     },

//     {
//       id: 'node3',
//       shape: 'custom-react-node',
//       x: 300,
//       y: 180,
//       label: 'world3',
//     },
//   ],
//   edges: [
//     {
//       shape: 'edge',
//       source: 'node1',
//       target: 'node2',
//       label: 'x6',
//       attrs: {
//         line: {
//           stroke: '#8f8f8f',
//           strokeWidth: 1,
//         },
//       },
//     },

//     {
//       shape: 'edge',
//       source: 'node2',
//       target: 'node3',
//       label: 'x6',
//       attrs: {
//         line: {
//           stroke: '#8f8f8f',
//           strokeWidth: 1,
//         },
//       },
//     },
//   ],
// };
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
        fontSize: 12,
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
    label: {
      attrs: {
        label: {
          fill: '#A2B1C3',
          fontSize: 12,
        },
      },
    },
  },
  true,
);
export default class Example extends React.Component {
  private container: HTMLDivElement | undefined;

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
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
    });
    // row 1
    // -----
    // graph.addNode({
    //   x: 40,
    //   y: 40,
    //   width: 120,
    //   height: 60,
    //   label: 'rect',
    // });

    // graph.addNode({
    //   x: 200,
    //   y: 40,
    //   width: 120,
    //   height: 60,
    //   label: 'rect',
    //   attrs: {
    //     body: {
    //       fill: '#efdbff',
    //       stroke: '#9254de',
    //     },
    //   },
    // });

    // graph.addNode({
    //   x: 360,
    //   y: 40,
    //   width: 120,
    //   height: 60,
    //   label: 'rect',
    //   attrs: {
    //     body: {
    //       stroke: '#237804',
    //       fill: '#73d13d',
    //       rx: 10,
    //       ry: 10,
    //     },
    //   },
    // });
    // graph.addNode({
    //   x: 160,
    //   y: 120,
    //   width: 360,
    //   height: 120,
    //   shape: 'text-block',
    //   text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
    //   attrs: {
    //     body: {
    //       fill: '#efdbff',
    //       stroke: '#9254de',
    //       rx: 4,
    //       ry: 4,
    //     },
    //   },
    // });
    // const rect = graph.addNode({
    //   x: 240,
    //   y: 60,
    //   width: 100,
    //   height: 180,
    //   attrs: {
    //     body: {
    //       fill: '#f5f5f5',
    //       stroke: '#d9d9d9',
    //       strokeWidth: 1,
    //     },
    //   },
    //   ports: [
    //     // 默认样式
    //     { id: 'port1' },
    //     // 自定义连接桩样式
    //     {
    //       id: 'port2',
    //       attrs: {
    //         circle: {
    //           magnet: true,
    //           r: 8,
    //           stroke: '#31d0c6',
    //           fill: '#fff',
    //           strokeWidth: 2,
    //         },
    //       },
    //     },
    //   ],
    // });

    // rect.addPort({
    //   id: 'port3',
    //   attrs: {
    //     circle: {
    //       r: 6,
    //       magnet: true,
    //       stroke: '#31d0c6',
    //       fill: '#fff',
    //       strokeWidth: 2,
    //     },
    //   },
    // });
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
    // @ts-ignore
    graph.resetCells(cells);
    graph.zoomToFit({ padding: 10, maxScale: 1 });
    // graph.fromJSON(data);
    graph.centerContent();
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  render() {
    return (
      <div className='react-shape-app'>
        <div className='app-content' ref={this.refContainer} />
      </div>
    );
  }
}
