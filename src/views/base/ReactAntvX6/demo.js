import { configData } from './data';

const data = [
  {
    id: '1',
    shape: 'lane',
    width: 500,
    height: 500,
    position: {
      x: 0,
      y: 0,
    },
    label: '原材料获取及预加工',
  },
  {
    id: '1-1',
    shape: 'lane-rect',
    label: '小麦',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 1,
    col: 1,
  },
  {
    id: '1-2',
    shape: 'lane-rect',
    label: '卡车运输',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 1,
    col: 2,
  },
  {
    id: '1-3',
    shape: 'lane-rect',
    label: '电力',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 1,
    col: 3,
  },
  {
    id: '2-1',
    shape: 'lane-rect',
    label: '面粉生产',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 1,
    from: 3,
  },
  {
    id: '2-2',
    shape: 'lane-rect',
    label: '卡车运输',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 2,
  },
  {
    id: '2-3',
    shape: 'lane-rect',
    label: '包装材料',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 3,
  },
  {
    id: '2-4',
    shape: 'lane-rect',
    label: '卡车运输',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 4,
  },

  {
    id: '2-5',
    shape: 'lane-rect',
    label: '卡车运输',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 5,
  },
  {
    id: '2-6',
    shape: 'lane-rect',
    label: '电力',
    width: configData.baseNodeWidth,
    height: configData.baseNodeHeight,
    row: 2,
    col: 6,
  },
];
const returnDataPosition = item => {
  console.log(item.col, configData.baseNodeHeight, configData.padding);
  return {
    x:
      (item.row - 1) * configData.baseNodeWidth +
      configData.laneRectPadding * (item.row - 1),
    y:
      item.col * configData.baseNodeHeight +
      configData.laneRectPadding * item.col,
  };
};
const returnDataHeight = item => {
  if (item.shape === 'lane-rect') {
    return {
      height: item.from
        ? configData.baseNodeHeight * item.from +
          configData.laneRectPadding * item.from
        : configData.baseNodeHeight,
    };
  }
};
const newData = data.map(item => {
  return {
    ...item,
    ...returnDataHeight(item),
    ...returnDataPosition(item),
  };
});
export default newData;
