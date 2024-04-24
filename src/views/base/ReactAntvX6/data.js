import t from '../../../locales/zh_CN';
import { Markup } from '@antv/x6';
export const configData = {
  laneW: 500,
  laneH: 500,
  laneX: 10,
  laneY: 60,
  laneRectW: 100,
  laneRectH: 60,
  laneRectX: 80,
  laneRectY: 120,
  nodeWidth: 30,
  nodeHeight: 30,
  padding: 30,
  laneRectPadding: 50,
};
const data = [
  {
    id: '1',
    shape: 'lane',
    width: 600,
    height: 700,
    position: {
      x: 0,
      y: 10,
    },
    label: t('daBlTkbz' /* 原材料获取及预加工 */),
  },
  {
    id: '2',
    shape: 'lane',
    width: 600,
    height: 700,
    position: {
      x: 600,
      y: 10,
    },
    label: '生产制造',
  },
  {
    id: '3',
    shape: 'lane',
    width: 400,
    height: 700,
    position: {
      x: 1200,
      y: 10,
    },
    label: '分销储存',
  },

  {
    id: '4',
    shape: 'lane',
    width: 400,
    height: 700,
    position: {
      x: 1600,
      y: 10,
    },
    label: '产品使用',
  },
  {
    id: '5',
    shape: 'lane',
    width: 400,
    height: 700,
    position: {
      x: 2000,
      y: 10,
    },
    label: '废弃处置',
  },
  // 面粉生产流程图
  {
    id: '1-1',
    parent: '1',
    shape: 'lane-rect',
    label: '面粉生产',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 50,
      y: 400,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port1',
        group: 'in',
        attrs: {
          label: '小麦100kg',
        },
      },
      {
        id: 'port2',
        group: 'in',
        attrs: {
          label: '卡车运输100/kg',
        },
      },
      {
        id: 'port3',
        group: 'in',
        attrs: {
          label: '电力，100kwh',
        },
      },
      {
        id: 'port21',
        group: 'out',
        attrs: {
          label: '面粉，750kg',
        },
      },
      {
        id: 'port22',
        group: 'out',
        attrs: {
          label: '饲料，200kg',
        },
      },
      {
        id: 'port23',
        group: 'out',
        attrs: {
          label: '小麦胚芽，40kg',
        },
      },
      {
        id: 'port24',
        group: 'out',
        attrs: {
          label: '废物，20kg',
        },
      },
    ],
  },

  {
    id: '1-2',
    shape: 'lane-rect',
    parent: '1',

    label: '包装材料运输',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 400,
      y: 100,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port1',
        group: 'in',
        attrs: {
          label: '包装材料运输，100kgKm',
        },
      },
      {
        id: 'port2',
        group: 'in',
        attrs: {
          label: '包装材料，10kg',
        },
      },
      {
        id: 'port21',
        group: 'out',
        attrs: {
          label: '包装材料，10kg',
        },
      },
    ],
  },
  {
    id: '1-3',
    parent: '1',

    shape: 'lane-rect',
    label: '面粉运输',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 400,
      y: 300,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port1',
        group: 'in',
        attrs: {
          label: '卡车运输，7500kg/km',
        },
      },

      {
        id: 'port1-left',
        group: 'circleLeft',
        attrs: {
          label: '卡车运输，7500kg/km',
        },
      },
      {
        id: 'port2',
        group: 'in',
        attrs: {
          label: '包装材料，10kg',
        },
      },
      {
        id: 'port21',
        group: 'out',
        attrs: {
          label: '面粉，750g',
        },
      },
    ],
  },
  {
    id: '1-4',
    parent: '1',

    shape: 'lane-rect',
    label: '废物处理',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 400,
      y: 500,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'circleLeft-1',
        group: 'circleLeft',
        attrs: {
          label: '包装材料运输',
        },
      },
      {
        id: 'circleLeft-2',
        group: 'in',
        attrs: {
          label: '卡车运输 2000kg/km',
        },
      },
      {
        id: 'circleLeft-3',
        group: 'in',
        attrs: {
          label: '电力，1kwh',
        },
      },
      {
        id: 'circleLeft-4',
        group: 'out',
        attrs: {
          label: '二氧化碳，1kg',
        },
      },
    ],
  },
  // 连线
  {
    id: '0->1-2',
    parent: '1',

    shape: 'lane-edge',
    source: { cell: '1-1', port: 'port21' }, // 指定源端口
    target: { cell: '1-3', port: 'port1-left' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('nNmKbdKI' /* 面粉生产 -> 面粉运输 */),
          },
        },
      },
    ],
  },
  {
    id: 'port24->1-2',
    shape: 'lane-edge',
    source: { cell: '1-1', port: 'port24' }, // 指定源端口
    target: { cell: '1-4', port: 'circleLeft-1' }, // 指定目标端口
  },
  {
    id: '2-1',
    parent: '2',
    shape: 'lane-rect',
    label: '烘培',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 680,
      y: 300,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-1',
        group: 'circleLeft',
        attrs: {
          label: '面粉',
        },
      },
      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '媒气，100m3',
        },
      },

      {
        id: 'port2-3',
        group: 'in',
        attrs: {
          label: '电力，100kwh',
        },
      },
      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '羊角包，700kg',
        },
      },

      {
        id: 'port2-5',
        group: 'out',
        attrs: {
          label: '废物，10kg',
        },
      },
    ],
  },
  {
    id: '1-3-port21->2-1-port2-1',
    shape: 'lane-edge',
    source: { cell: '1-3', port: 'port21' }, // 指定源端口
    target: { cell: '2-1', port: 'port2-1' }, // 指定目标端口
  },
  {
    id: '2-2',
    parent: '2',

    shape: 'lane-rect',
    label: '包装',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 900,
      y: 100,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-1',
        group: 'circleLeft',
        attrs: {
          label: '包装材料，10kg',
        },
      },
      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '电力，50kwh',
        },
      },
      {
        id: 'port2-3',
        group: 'circleLeft',
        attrs: {
          label: '羊角包',
        },
      },

      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '羊角包成品',
        },
      },
    ],
  },
  {
    id: '1-2-port21->2-1-port2-1',
    shape: 'lane-edge',
    source: { cell: '1-2', port: 'port21' }, // 指定源端口
    target: { cell: '2-2', port: 'port2-1' }, // 指定目标端口
  },
  {
    id: '2-1-port2-4->2-1-port2-1',
    shape: 'lane-edge',
    source: { cell: '2-1', port: 'port2-4' }, // 指定源端口
    target: { cell: '2-2', port: 'port2-3' }, // 指定目标端口
  },

  {
    id: '2-3',
    parent: '2',

    shape: 'lane-rect',
    label: '废物处理',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 1000,
      y: 340,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-3',
        group: 'circleLeft',
        attrs: {
          label: '废物',
        },
      },
      {
        id: 'port2-1',
        group: 'in',
        attrs: {
          label: '卡车运输',
        },
      },
      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '电力，50kwh',
        },
      },

      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '二氧化碳，0.5kg',
        },
      },
    ],
  },
  {
    id: '2-1-port2-5-->2-3-port2-3',
    shape: 'lane-edge',
    source: { cell: '2-1', port: 'port2-5' }, // 指定源端口
    target: { cell: '2-3', port: 'port2-3' }, // 指定目标端口
  },
  // position: {
  //   x: 1200,
  //   y: 10,
  // },
  {
    id: '3-1',
    parent: '3',
    shape: 'lane-rect',
    label: '羊角包分销和储存',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 1400,
      y: 100,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-3',
        group: 'circleLeft',
        attrs: {
          label: '羊角包成品',
        },
      },
      {
        id: 'port2-1',
        group: 'in',
        attrs: {
          label: '卡车运输',
        },
      },
      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '电力，50kwh',
        },
      },
      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '羊角包成品，710g',
        },
      },
    ],
  },
  // 羊角包成品
  {
    id: '2-2-port2-4-->3-1-port2-3',
    shape: 'lane-edge',
    source: { cell: '2-2', port: 'port2-4' }, // 指定源端口
    target: { cell: '3-1', port: 'port2-3' }, // 指定目标端口
  },
  //  position: {
  //   x: 1600,
  //   y: 10,
  // },
  // 产品使用

  {
    id: '4-1',
    parent: '4',

    shape: 'lane-rect',
    label: '羊角包使用',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 1800,
      y: 100,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-3',
        group: 'in',
        attrs: {
          label: '羊角包成品',
        },
      },

      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '电力，50kwh',
        },
      },

      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '废物',
        },
      },
    ],
  },
  {
    id: '3-1-port2-4-->3-1-port2-3',
    shape: 'lane-edge',
    source: { cell: '3-1', port: 'port2-4' }, // 指定源端口
    target: { cell: '4-1', port: 'port2-3' }, // 指定目标端口
  },
  // position: {
  //   x: 2000,
  //   y: 10,
  // },

  {
    id: '5-1',
    parent: '4',

    shape: 'lane-rect',
    label: '废弃处置',
    width: 140,
    height: 180,
    row: 1,
    col: 1,
    position: {
      x: 2200,
      y: 100,
    },
    portMarkup: [Markup.getForeignObjectMarkup()], // 可以渲染自定义链接桩
    ports: [
      {
        id: 'port2-1',
        group: 'in',
        attrs: {
          label: '废物10kg',
        },
      },
      {
        id: 'port2-3',
        group: 'in',
        attrs: {
          label: '羊角包成品',
        },
      },

      {
        id: 'port2-2',
        group: 'in',
        attrs: {
          label: '电力，50kwh',
        },
      },

      {
        id: 'port2-4',
        group: 'out',
        attrs: {
          label: '二氧化碳，0.5kg',
        },
      },
    ],
  },
  {
    id: '4-1-port2-4-->5-1-port2-3',
    shape: 'lane-edge',
    source: { cell: '4-1', port: 'port2-4' }, // 指定源端口
    target: { cell: '5-1', port: 'port2-1' }, // 指定目标端口
  },
  {
    id: '4-1-port2-4-->5-1-port2-4',
    shape: 'lane-edge',
    source: { cell: '5-1', port: 'port2-4' }, // 指定源端口
    target: { cell: '1-1', port: 'port1' }, // 指定目标端口
    attrs: {
      line: {
        stroke: '#722ed1',
      },
    },
    vertices: [
      { x: 2360, y: 800 },
      { x: 80, y: 800 },
    ],
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    connector: 'normal',
    router: {
      name: 'orth',
    },
    attrs: {
      line: {
        stroke: '#722ed1',
      },
    },
    // connector: 'manhattan',
  },
];
export default data;
