import t from '../../../locales/zh_CN';
export const webData = [
  {
    id: '1',
    label: '原材料获取以及预加工',
    type: 'lane',
    children: [
      {
        id: '1-0',
        type: 'lane-rect',
        label: '面粉生产',
        parent: '1',
        step: 2,
        input: [
          {
            id: '1-0-1',
            label: '小麦',
            current: 1,
            type: 'lane-rect',
            parent: '1-0',
            from: 'input',
            step: 1,
          },
          {
            id: '1-0-2',
            label: '卡车运输',
            current: 2,
            type: 'lane-rect',
            parent: '1-0',
            from: 'input',
            step: 1,
          },
          {
            id: '1-0-3',
            label: '电力',
            current: 3,
            type: 'lane-rect',
            parent: '1-0',
            from: 'input',
            step: 1,
          },
        ],
        output: [
          {
            id: '1-0-4',
            label: '面粉运输',
            type: 'lane-rect',
            current: 4,
            target: '1-2-2',
            parent: '1',
            from: 'output',
            step: 4,
            isCreateNode: true,
            input: [
              {
                id: '1-0-4-1',
                label: '卡车运输',
                type: 'lane-rect',
                current: 1,
                parent: '1-0-4',
                from: 'input',
                step: 2,
              },
            ],
          },
          {
            id: '1-0-5',

            label: '饲料',
            type: 'lane-rect',
            current: 5,
            target: '',
            parent: '1',
            from: 'output',
            step: 3,
          },
          {
            id: '1-0-6',

            label: '小麦胚芽',
            type: 'lane-rect',
            current: 6,
            target: '1-4-1',
            parent: '1',
            from: 'output',
            step: 3,
          },
          {
            id: '1-0-7',

            label: '废物生产',
            type: 'lane-rect',
            current: 7,
            target: '1-4-1',
            parent: '1',
            from: 'output',
            step: 3,
          },
        ],
      },
      // {
      //   id: '1-1',
      //   type: 'lane-rect',
      //   parent: '1',
      //   label: '包装材料运输',
      //   step: 4,
      //   input: [
      //     {
      //       id: '1-1-1',
      //       label: '卡车运输',
      //       current: 1,
      //       type: 'lane-rect',
      //       parent: '1-1',
      //       from: 'input',
      //       step: 2,
      //     },
      //     {
      //       id: '1-1-2',
      //       label: '包装材料',
      //       current: 1,
      //       type: 'lane-rect',
      //       parent: '1-1',
      //       from: 'input',
      //       step: 2,
      //     },
      //   ],
      // },

      // {
      //   id: '1-3',
      //   type: 'lane-rect',
      //   parent: '1',
      //   label: '废物处理',
      //   step: 4,
      //   input: [
      //     {
      //       id: '1-3-1',
      //       label: '卡车运输',
      //       type: 'lane-rect',
      //       current: 1,
      //       parent: '1-3',
      //       from: 'input',
      //       step: 2,
      //     },
      //     {
      //       id: '1-3-2',
      //       label: '电力',
      //       type: 'lane-rect',
      //       current: 1,
      //       parent: '1-3',
      //       from: 'input',
      //       step: 2,
      //     },
      //   ],
      // },
    ],
  },
];

const data = [
  {
    id: '1',
    shape: 'lane',
    width: 500,
    height: 500,
    position: {
      x: 0,
      y: 60,
    },
    label: t('daBlTkbz' /* 原材料获取及预加工 */),
  },
  {
    id: '1-1-1',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 180,
      y: 120,
    },
    label: t('YTNPsDss' /* 卡车运输 */),
    parent: '1',
  },
  {
    id: '1-1-2',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 180,
      y: 160,
    },
    label: t('zILlahPQ' /* 包装材料 */),
    parent: '1',
  },

  {
    id: '0',
    shape: 'lane-rect',
    width: 100,
    height: 180,
    position: {
      x: 180,
      y: 270,
    },
    label: t('RtYTwAKV' /* 面粉生产 */),
    parent: '1',
    ports: {
      groups: {
        group0: {
          // Group for the left side
          position: 'left', // This will place all the ports in this group on the left side
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: '#31d0c6',
              fill: '#fff',
              strokeWidth: 1,
            },
          },
        },
        groupRight: {
          // Group for the right side
          position: 'right', // This will place all the ports in this group on the right side
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: '#31d0c6',
              fill: '#fff',
              strokeWidth: 1,
            },
          },
        },
      },
      items: [
        { id: 'port0-1', group: 'group0' },
        { id: 'port0-2', group: 'group0' },
        { id: 'port0-3', group: 'group0' },
        { id: 'port0-4', group: 'groupRight' },
        { id: 'port0-5', group: 'groupRight' },
        { id: 'port0-6', group: 'groupRight' },
        { id: 'port0-7', group: 'groupRight' },
      ],
    },
  },

  {
    id: '0-1',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 0,
      y: 270,
    },
    label: t('RAXsyXFm' /* 小麦 */),
    parent: '1',
  },
  {
    id: '0-1->0',
    shape: 'lane-edge',
    source: { cell: '0-1', port: 'port0-1' }, // 指定源端口
    target: { cell: '0', port: 'port0-1' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('wNDlarNG' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0-2->0',
    shape: 'lane-edge',
    source: { cell: '0-2', port: 'port0-2' }, // 指定源端口
    target: { cell: '0', port: 'port0-2' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('cTlMYXgE' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0-3->0',
    shape: 'lane-edge',
    source: { cell: '0-3', port: 'port0-3' }, // 指定源端口
    target: { cell: '0', port: 'port0-3' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('hJbsYMVt' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0-2',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 0,
      y: 330,
    },
    label: t('jdSLmpCT' /* 卡车运输 */),
    parent: '1',
  },

  {
    id: '0-3',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 0,
      y: 380,
    },
    label: t('VRfkIPeE' /* 电力 */),
    parent: '1',
  },
  {
    id: '0->1-2',
    shape: 'lane-edge',
    source: { cell: '0', port: 'port0-4' }, // 指定源端口
    target: { cell: '1-2', port: 'port1-2-2' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('nNmKbdKI' /* 面粉生产 -> 面粉运输 */),
            fill: '#7C68FC',
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0->put->0-1',
    shape: 'lane-edge',
    source: { cell: '0', port: 'port0-5' }, // 指定源端口
    target: [360, 340],
    labels: [
      {
        attrs: {
          label: {
            text: t('kTUrXUYk' /* 饲料200g */),
            fill: '#7C68FC',
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0->put-0-2',
    shape: 'lane-edge',
    source: { cell: '0', port: 'port0-6' }, // 指定源端口
    target: [370, 380],
    labels: [
      {
        attrs: {
          label: {
            text: t('oZXlJtYB' /* 小麦胚芽200g */),
            fill: '#7C68FC',
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '0->put-1-3',
    shape: 'lane-edge',
    source: { cell: '0', port: 'port0-7' }, // 指定源端口
    target: { cell: '1-3', port: 'port1-3-1' },
    labels: [
      {
        attrs: {
          label: {
            text: t('DDOGeQeb' /* 废物20g */),
            fill: '#7C68FC',
            fontSize: 12,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '1-1',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: {
      x: 400,
      y: 120,
    },
    label: t('dXlGMdCL' /* 包装材料运输 */),
    parent: '1',
    ports: {
      groups: {
        group1: {
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: '#31d0c6',
              fill: '#fff',
              strokeWidth: 1,
            },
          },
        },
      },
      items: [
        { id: 'port1', group: 'group1' },
        { id: 'port2', group: 'group1' },
      ],
    },
  },
  {
    id: '1-1-1->1-1',
    shape: 'lane-edge',
    source: { cell: '1-1-1', port: 'port1' }, // 指定源端口
    target: { cell: '1-1', port: 'port1' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('OishTjzl' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },

  {
    id: '1-1-2->1-1',
    shape: 'lane-edge',
    source: '1-1-2',
    target: '1-1',
    source: { cell: '1-1-2', port: 'port2' }, // 指定源端口
    target: { cell: '1-1', port: 'port2' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('gRxNbSAX' /* 包装材料，10kg */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '1-2',
    shape: 'lane-rect',
    width: 100,
    height: 150,
    position: {
      x: 380,
      y: 200,
    },
    label: t('NTLoSLda' /* 面粉运输 */),
    parent: '1',
    ports: {
      groups: {
        group1: {
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: '#31d0c6',
              fill: '#fff',
              strokeWidth: 1,
            },
          },
        },
      },
      items: [
        { id: 'port1-2-1', group: 'group1' },
        { id: 'port1-2-2', group: 'group1' },
      ],
    },
  },
  {
    id: '1-2-1',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 180,
      y: 220,
    },
    label: t('IideGYPv' /* 卡车运输 */),
    parent: '1',
  },
  {
    id: '1-2-1->1-2',
    shape: 'lane-edge',
    source: '1-1-2',
    target: '1-1',
    source: { cell: '1-2-1', port: 'port1-2-1' }, // 指定源端口
    target: { cell: '1-2', port: 'port1-2-1' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('kFQtTXpC' /* 包装材料，10kg */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '1-3',
    shape: 'lane-rect',
    width: 100,
    height: 180,
    position: {
      x: 380,
      y: 380,
    },
    label: t('SYYjWzRo' /* 废物处理 */),
    parent: '1',

    ports: {
      groups: {
        group1: {
          attrs: {
            circle: {
              r: 2,
              magnet: true,
              stroke: '#31d0c6',
              fill: '#fff',
              strokeWidth: 1,
            },
          },
        },
      },
      items: [
        { id: 'port1-3-1', group: 'group1' },
        { id: 'port1-3-2', group: 'group1' },
        { id: 'port1-3-3', group: 'group1' },
      ],
    },
  },
  {
    id: '1-3-1',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 180,
      y: 480,
    },
    label: t('TwvdURhZ' /* 卡车运输 */),
    parent: '1',
  },
  {
    id: '1-3-2',
    shape: 'lane-rect',
    width: 100,
    height: 20,
    position: {
      x: 180,
      y: 520,
    },
    label: t('FeuGKlHe' /* 电力处理 */),
    parent: '1',
  },
  {
    id: '1-3-2->1-3',
    shape: 'lane-edge',
    source: { cell: '1-3-2', port: 'port1-3-3' }, // 指定源端口
    target: { cell: '1-3', port: 'port1-3-3' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('TvJjndkb' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },

  {
    id: '1-3-1->1-3',
    shape: 'lane-edge',
    source: { cell: '1-3-1', port: 'port1-3-2' }, // 指定源端口
    target: { cell: '1-3', port: 'port1-3-2' }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('tRoQWyBM' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  },
  {
    id: '2',
    shape: 'lane',
    width: 500,
    height: 500,
    position: {
      x: 660,
      y: 60,
    },
    label: t('KLKCaiZU' /* 生产制造 */),
  },

  {
    id: '3',
    shape: 'lane',
    width: 500,
    height: 500,
    position: {
      x: 1060,
      y: 60,
    },
    label: t('IbjhpvKs' /* 阶段三 */),
  },
];
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
// 创建占桩
const createPort = (input, output, id, groupId) => {
  const leftPort = [];
  const rightPort = [];
  input?.forEach((item, index) => {
    // console.log(item, index);
    leftPort.push({
      id: `portLeft${item.id}`,
      group: `groupLeft-${id}-${groupId}`,
    });
  });
  output?.forEach((item, index) => {
    rightPort.push({
      id: `portRight${item.id}`,
      group: `groupRight-${id}-${groupId}`,
    });
  });
  return {
    groups: {
      [`groupLeft-${id}-${groupId}`]: {
        // Group for the left side
        position: 'left', // This will place all the ports in this group on the left side
        attrs: {
          circle: {
            r: 2,
            magnet: true,
            stroke: '#31d0c6',
            fill: '#fff',
            strokeWidth: 1,
          },
        },
      },
      [`groupRight-${id}-${groupId}`]: {
        // Group for the right side
        position: 'right', // This will place all the ports in this group on the right side
        attrs: {
          circle: {
            r: 2,
            magnet: true,
            stroke: '#31d0c6',
            fill: '#fff',
            strokeWidth: 1,
          },
        },
      },
    },
    items: [...leftPort, ...rightPort],
    // items: [
    //   { id: `port${groupId}-${id}-0`, group: `groupLeft-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-1`, group: `groupLeft-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-2`, group: `groupLeft-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-3`, group: `groupRight-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-4`, group: `groupRight-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-5`, group: `groupRight-${id}-${groupId}` },
    //   { id: `port${groupId}-${id}-6`, group: `groupRight-${id}-${groupId}` },
    // ],
  };
};
// 创建 连接线
const createLine = item => {
  console.log(item, 'createLine');
  return {
    id: `${item.id}->portLeft${item.id}`,
    shape: 'lane-edge',
    source: { cell: `${item.id}`, port: `portLeft${item.id}` }, // 指定源端口
    target: { cell: `${item.parent}`, port: `portLeft${item.id}` }, // 指定目标端口
    labels: [
      {
        attrs: {
          label: {
            text: t('hJbsYMVt' /* 包装运输，100kgKm */),
            fill: '#7C68FC',
            fontSize: 10,
            fontWeight: 'bold',
          },
        },
      },
    ],
  };
};
const createNode = (item, index, position, parentNodePosition) => {
  // console.log(item, index, position);
  // const positionX =
  //   item.from === 'input'
  //     ? position.x -
  //       (configData.laneRectW + configData.padding) -
  //       item.step * configData.padding
  //     : position.x + configData.laneRectW + configData.padding;
  const positionX =
    item.step === 1
      ? item.step * configData.padding
      : parentNodePosition.x - (configData.laneRectW + configData.padding);
  const positionY =
    item.from === 'input'
      ? position.y + configData.padding * index + configData.nodeHeight * index
      : position.y + configData.padding * index + configData.nodeHeight * index;
  return {
    id: item.id,
    shape: item.type,
    label: item.label,
    width: configData.laneRectW,
    height: configData.nodeHeight,
    position: {
      ...position,
      x: positionX,
      y: positionY,
    },
  };
};
const createRightNode = (item, index, position, parentNodePosition) => {
  const positionX =
    item.step === 1
      ? item.step * configData.padding
      : parentNodePosition.x + (configData.laneRectW + configData.padding);
  const positionY =
    item.from === 'input'
      ? position.y + configData.padding * index + configData.nodeHeight * index
      : position.y + configData.padding * index + configData.nodeHeight * index;
  return {
    id: item.id,
    shape: item.type,
    label: item.label,
    width: configData.laneRectW,
    height: configData.laneRectH,
    position: {
      ...position,
      x: positionX,
      y: positionY,
    },
  };
};
// 定义方法 通过web数据 生成data数据
const composeData = webData => {
  const finalData = [];
  webData?.forEach((item, index) => {
    finalData.push({
      id: item.id,
      label: item.label,
      shape: item.type,
      width: configData.laneW,
      height: configData.laneH,
      position: {
        x: configData.laneX,
        y: configData.laneY,
      },
    });
    // 创建流程
    // const obj = createPort(item.input, item.output, item.id, item.id);

    if (item.input || item.output) {
      [...item.input].forEach((portItem, portIndex) => {
        const nodeObj = createNode(portItem, portIndex, {
          x: configData.laneX,
          y: configData.laneY,
        });
        finalData.push(nodeObj);
      });

      // [...item.output].forEach((portItem, portIndex) => {
      //   const nodeObj = createNode(portItem, portIndex, {
      //     x: configData.laneX,
      //     y: configData.laneY,
      //   });
      //   finalData.push(nodeObj);
      // });
    }
    // 创建节点
    if (item.children) {
      item.children?.forEach((childitem, childrenIndex) => {
        // 创建流程
        const obj = createPort(
          childitem.input,
          childitem.output,
          item.id,
          item.id,
        );
        console.log(childitem.label, 'item-item');
        finalData.push(
          childitem.input
            ? {
                id: childitem.id,
                shape: childitem.type,
                label: childitem.label,
                width: configData.laneRectW,
                height: configData.laneRectH,
                position: {
                  x: configData.laneRectX * childitem.step,
                  y:
                    configData.laneRectH * childrenIndex +
                    configData.laneRectY +
                    childrenIndex * 20,
                },
                ports: obj,
              }
            : {
                id: childitem.id,
                shape: childitem.type,
                label: childitem.label,
                width: configData.laneRectW,
                height: configData.laneRectH,
                position: {
                  x: configData.laneRectX * childitem.step,
                  y:
                    configData.laneRectH * childrenIndex +
                    configData.laneRectY +
                    childrenIndex * 20,
                },
              },
        );

        if (childitem.input) {
          [...childitem.input].forEach((portItem, portIndex) => {
            const nodeObj = createNode(
              portItem,
              portIndex,
              {
                x: configData.laneRectX * portItem.step,
                y:
                  configData.laneRectH * childrenIndex +
                  configData.laneRectY +
                  childrenIndex * 20,
              },
              {
                x: configData.laneRectX * childitem.step,
                y:
                  configData.laneRectH * childrenIndex +
                  configData.laneRectY +
                  childrenIndex * 20,
              },
            );
            // 创建连接线
            const lineObj = createLine(portItem);
            finalData.push(lineObj);
            finalData.push(nodeObj);
          });

          // [...childitem.output].forEach((portItem, portIndex) => {
          //   const nodeObj = createNode(portItem, portIndex, {
          //     x: configData.laneRectX,
          //     y:
          //       configData.laneRectH * childrenIndex +
          //       configData.laneRectY +
          //       childrenIndex * 20,
          //   });
          //   finalData.push(nodeObj);
          // });
          // [...childitem.input, ...childitem.output].forEach(
          //   (portItem, portIndex) => {
          //     const nodeObj = createNode(portItem, portIndex, {
          //       x: configData.laneRectX,
          //       y:
          //         configData.laneRectH * childrenIndex +
          //         configData.laneRectY +
          //         childrenIndex * 20,
          //     });
          //     finalData.push(nodeObj);
          //   },
          // );
        }
        if (childitem.output) {
          [...childitem.output].forEach((portItem, portIndex) => {
            if (portItem.isCreateNode) {
              const nodeObj = createRightNode(
                portItem,
                portIndex,
                {
                  x: configData.laneRectX * portItem.step,
                  y:
                    configData.laneRectH * childrenIndex +
                    configData.laneRectY +
                    childrenIndex * 20,
                },
                {
                  x: configData.laneRectX * childitem.step,
                  y:
                    configData.laneRectH * childrenIndex +
                    configData.laneRectY +
                    childrenIndex * 20,
                },
              );
              finalData.push(nodeObj);
            }
            // 创建连接线
            const lineObj = createLine(portItem);
            finalData.push(lineObj);
          });
        }
      });
    }
  });
  return finalData;
};
const newData = composeData(webData);
console.log(newData, 'newData-newData', webData);
export default newData;
