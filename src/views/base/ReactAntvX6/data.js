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
            target: '1-1-1',
            parent: '1',
            from: 'output',
            step: 4,
            isCreateNode: false,
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
      {
        id: '1-1',
        label: '面粉运输',
        type: 'lane-rect',
        current: 4,
        target: '1-2-2',
        parent: '1',
        from: 'output',
        step: 4,
        isCreateNode: false,
        input: [
          {
            id: '1-1-1',
            label: '面粉生产',
            type: 'lane-rect',
            current: 1,
            parent: '1-1',
            from: 'input',
            step: 2,
            x: true,
            isCreateLine: true,
          },
          {
            id: '1-1-2',
            label: '卡车运输',
            type: 'lane-rect',
            current: 1,
            parent: '1-1',
            from: 'input',
            step: 2,
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
  padding: 20,
  laneRectPadding: 50,
  baseNodeHeight: 20,
  baseNodeWidth: 100,
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
const createRightLine = item => {
  console.log(
    item,
    'createRightLine',
    {
      cell: `portRight${item.id}`,
      port: `portLeft${item.target}`,
    },
    { cell: `portLeft${item.target}`, port: `portLeft${item.target}` },
  );
  return {
    id: `${item.id}->portLeft${item.id}`,
    shape: 'lane-edge',
    source: { cell: `portRight${item.id}`, port: `portLeft${item.target}` }, // 指定源端口
    target: { cell: `portLeft${item.target}`, port: `portLeft${item.target}` }, // 指定目标端口
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
        finalData.push({
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
        });

        if (childitem.input) {
          [...childitem.input].forEach((portItem, portIndex) => {
            if (!portItem.isCreateNode) {
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
              finalData.push(nodeObj);
            }
            if (!portItem.isCreateLine) {
              const lineObj = createLine(portItem);
              finalData.push(lineObj);
            }

            // // 创建连接线
            // const lineObj = createLine(portItem);
            // finalData.push(lineObj);
          });
          finalData.push({
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
          });
        }
        if (childitem.output) {
          [...childitem.output].forEach((portItem, portIndex) => {
            // if (portItem.isCreateNode) {
            //   const nodeObj = createRightNode(
            //     portItem,
            //     portIndex,
            //     {
            //       x: configData.laneRectX * portItem.step,
            //       y:
            //         configData.laneRectH * childrenIndex +
            //         configData.laneRectY +
            //         childrenIndex * 20,
            //     },
            //     {
            //       x: configData.laneRectX * childitem.step,
            //       y:
            //         configData.laneRectH * childrenIndex +
            //         configData.laneRectY +
            //         childrenIndex * 20,
            //     },
            //   );
            //   finalData.push(nodeObj);
            // }
            // 创建连接线
            const lineObj = createRightLine(portItem);
            finalData.push(lineObj);
            if (portItem.input) {
              composeData(portItem.input);
            }
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
