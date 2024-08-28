/**
 * @description 过程结构图
 */

import { useEffect, useState } from 'react';

import Calculator from './components/ClassCulNode';
import ProcessStructureDiagram from './components/ProcessStructureDiagram';
import styles from './index.module.less';

const ProcessStructureDiagramIndex = () => {
  const [diagramData, setDiagramData] = useState<any>();

  useEffect(() => {
    const data = {
      nodes: [
        {
          id: '5a3ecaf32b124167af0d086fb8f9d5a0',
          label: 'test Product Name (Chinese) 的生产过程',
          lifeCycleId: 9,
          lifeCycle: '产品生产阶段',
          ports: [
            {
              id: '7d42ffd0536f43a887c2c14249842af7',
              group: 'Input',
              attrs: {
                label: '材料',
                dataValue: '1',
                unit: 'kg',
                baselineValue: null,
                balanceValue: null,
              },
            },
            {
              id: '29700ba224304c4f847b568eab6dadf0',
              group: 'Output',
              attrs: {
                label: 'test Product Name (Chinese) ',
                dataValue: '1',
                unit: 'kg',
                baselineValue: null,
                balanceValue: null,
              },
            },
          ],
        },
        {
          id: 'e085d345d7204e3d8cea9f1802d3bd9e',
          label: 'test输出',
          lifeCycleId: 9,
          lifeCycle: '产品生产阶段',
          ports: [
            {
              id: '78b5c0617130421e92308a0ec92a6e2c',
              group: 'Input',
              attrs: {
                label: 'test输入名称中文',
                dataValue: '52',
                unit: 'mm',
                baselineValue: '52',
                balanceValue: '52',
              },
            },
            {
              id: 'b7f4752715e04101b73fc0cb229a1237',
              group: 'Input',
              attrs: {
                label: '2',
                dataValue: '1',
                unit: 'kg',
                baselineValue: null,
                balanceValue: null,
              },
            },
            {
              id: '50b5015a02364e65ad02074c53d539c8',
              group: 'Output',
              attrs: {
                label: '产品中文',
                dataValue: '51',
                unit: 'ml',
                baselineValue: '51',
                balanceValue: '51',
              },
            },
          ],
        },
        // {
        //   id: '8afb29daba714e2caac296a4ca938c16',
        //   label: 'test Name of the main process where the',
        //   lifeCycleId: 9,
        //   lifeCycle: '产品生产阶段',
        //   ports: [
        //     {
        //       id: 'a3d80934d93a4b79999786d5b37d20ac',
        //       group: 'Output',
        //       attrs: {
        //         label: 'test Product Name (Chinese) ',
        //         dataValue: '53',
        //         unit: 'mm',
        //         baselineValue: '351.9999988731',
        //         balanceValue: '351.9999988731',
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: 'c61043b8de284e5ebb331a85c57d53a7',
        //   label: 'test包装',
        //   lifeCycleId: 10,
        //   lifeCycle: '建造过程阶段',
        //   ports: [
        //     {
        //       id: 'd988e9666d0c41128640197c52c1df7d',
        //       group: 'Input',
        //       attrs: {
        //         label: '443',
        //         dataValue: '44',
        //         unit: 'TJ',
        //         baselineValue: '0.9444444416',
        //         balanceValue: '0.9444444416',
        //       },
        //     },
        //     {
        //       id: '03999e6ac4264fc781522d6ef6b29469',
        //       group: 'Input',
        //       attrs: {
        //         label: '43',
        //         dataValue: '654',
        //         unit: 'TJ',
        //         baselineValue: '14.0378787456',
        //         balanceValue: '14.0378787456',
        //       },
        //     },
        //     {
        //       id: 'e6bfc543495040a0b1866eeeac7a18e0',
        //       group: 'Output',
        //       attrs: {
        //         label: '54',
        //         dataValue: '65',
        //         unit: 'mm',
        //         baselineValue: '0',
        //         balanceValue: '1.395202016',
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: '3066a088282f4ca4906c8dccd3d0e395',
        //   label: 'test过程22222',
        //   lifeCycleId: 11,
        //   lifeCycle: '使用阶段',
        //   ports: [
        //     {
        //       id: '5fd6bf0a14b24378b53ecc3ede44a82e',
        //       group: 'Input',
        //       attrs: {
        //         label: '44',
        //         dataValue: '4',
        //         unit: '英亩',
        //         baselineValue: '4',
        //         balanceValue: '4',
        //       },
        //     },
        //     {
        //       id: '67815e59749b456aa9a255612e19a417',
        //       group: 'Output',
        //       attrs: {
        //         label: '产品中文',
        //         dataValue: '51',
        //         unit: 'ml',
        //         baselineValue: '51',
        //         balanceValue: '51',
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: '13bd38759a2048beb0be460401368020',
        //   label: 'test入场',
        //   lifeCycleId: 11,
        //   lifeCycle: '使用阶段',
        //   ports: [
        //     {
        //       id: '38b7afedd8a544209546d0ab93de22ed',
        //       group: 'Input',
        //       attrs: {
        //         label: '564',
        //         dataValue: '43',
        //         unit: 'ml',
        //         baselineValue: '0.0160368027',
        //         balanceValue: '0.0160368027',
        //       },
        //     },
        //     {
        //       id: 'e9db603ff0c547c38195b03c964806ac',
        //       group: 'Output',
        //       attrs: {
        //         label: '65',
        //         dataValue: '43',
        //         unit: 'ml',
        //         baselineValue: '0.0160368027',
        //         balanceValue: '0.0160368027',
        //       },
        //     },
        //     {
        //       id: '467dd82f048048559a947b79b583f504',
        //       group: 'Output',
        //       attrs: {
        //         label: '65一通',
        //         dataValue: '43',
        //         unit: 'TJ',
        //         baselineValue: '0',
        //         balanceValue: '0.0160368027',
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: 'e42efc12ae2e4a0b98b2c98eff970d0b',
        //   label: '仍然',
        //   lifeCycleId: 12,
        //   lifeCycle: '生命终结阶段',
        //   ports: [
        //     {
        //       id: '9f11c1ccee90415396c3a8ab5c345918',
        //       group: 'Input',
        //       attrs: {
        //         label: '突然',
        //         dataValue: '44',
        //         unit: 'kWh',
        //         baselineValue: '0.0002467212',
        //         balanceValue: '0.0002467212',
        //       },
        //     },
        //     {
        //       id: 'c1b4f86df5ca489aa18905d26127d5d1',
        //       group: 'Input',
        //       attrs: {
        //         label: 'test能好43',
        //         dataValue: '65',
        //         unit: '立方英尺',
        //         baselineValue: '0.0003644745',
        //         balanceValue: '0.0003644745',
        //       },
        //     },
        //     {
        //       id: '7e3dd23c4a994e579bc9729f07b173f7',
        //       group: 'Output',
        //       attrs: {
        //         label: '输出名称(中文) ',
        //         dataValue: '73',
        //         unit: 'km',
        //         baselineValue: '0',
        //         balanceValue: '0.0004093329',
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: '065d295a762d44158c3b744d56ff9a41',
        //   label: 'test废弃物过程',
        //   lifeCycleId: 13,
        //   lifeCycle: '额外效益和负担',
        //   ports: [
        //     {
        //       id: '40a9142b3b8f47c8905fe0bfcf0b3ea6',
        //       group: 'Input',
        //       attrs: {
        //         label: '54',
        //         dataValue: '43',
        //         unit: 'ml',
        //         baselineValue: '0.0000818677',
        //         balanceValue: '0.0000818677',
        //       },
        //     },
        //     {
        //       id: 'd279953b5abf4efea36f2b9e6dd23fad',
        //       group: 'Output',
        //       attrs: {
        //         label: '碳',
        //         dataValue: '54',
        //         unit: '立方英尺',
        //         baselineValue: '0.0001028106',
        //         balanceValue: '0.0001028106',
        //       },
        //     },
        //   ],
        // },
      ],
      edges: [
        {
          source: {
            cell: 'e085d345d7204e3d8cea9f1802d3bd9e',
            port: '50b5015a02364e65ad02074c53d539c8',
          },
          target: {
            cell: '5a3ecaf32b124167af0d086fb8f9d5a0',
            port: '7d42ffd0536f43a887c2c14249842af7',
          },
        },
        // {
        //   source: {
        //     cell: '3066a088282f4ca4906c8dccd3d0e395',
        //     port: '67815e59749b456aa9a255612e19a417',
        //   },
        //   target: {
        //     cell: 'c61043b8de284e5ebb331a85c57d53a7',
        //     port: 'd988e9666d0c41128640197c52c1df7d',
        //   },
        // },
        // {
        //   source: {
        //     cell: 'c61043b8de284e5ebb331a85c57d53a7',
        //     port: 'e6bfc543495040a0b1866eeeac7a18e0',
        //   },
        //   target: {
        //     cell: '13bd38759a2048beb0be460401368020',
        //     port: '38b7afedd8a544209546d0ab93de22ed',
        //   },
        // },
        // {
        //   source: {
        //     cell: '13bd38759a2048beb0be460401368020',
        //     port: '467dd82f048048559a947b79b583f504',
        //   },
        //   target: {
        //     cell: 'e42efc12ae2e4a0b98b2c98eff970d0b',
        //     port: '9f11c1ccee90415396c3a8ab5c345918',
        //   },
        // },
        // {
        //   source: {
        //     cell: 'e42efc12ae2e4a0b98b2c98eff970d0b',
        //     port: '7e3dd23c4a994e579bc9729f07b173f7',
        //   },
        //   target: {
        //     cell: '065d295a762d44158c3b744d56ff9a41',
        //     port: '40a9142b3b8f47c8905fe0bfcf0b3ea6',
        //   },
        // },
        // {
        //   source: {
        //     cell: '065d295a762d44158c3b744d56ff9a41',
        //     port: 'd279953b5abf4efea36f2b9e6dd23fad',
        //   },
        //   target: {
        //     cell: 'e085d345d7204e3d8cea9f1802d3bd9e',
        //     port: 'b7f4752715e04101b73fc0cb229a1237',
        //   },
        // },
        // {
        //   source: {
        //     cell: '8afb29daba714e2caac296a4ca938c16',
        //     port: 'a3d80934d93a4b79999786d5b37d20ac',
        //   },
        //   target: {
        //     cell: '3066a088282f4ca4906c8dccd3d0e395',
        //     port: '5fd6bf0a14b24378b53ecc3ede44a82e',
        //   },
        // },
      ],
    };
    // const data = {
    //   nodes: [
    //     {
    //       id: '6fb8facba0964f6eb3edfa893c6cf908',
    //       label: '过程11',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '964aa96b6d934f36bad0ba1d819c3b5a',
    //           group: 'out',
    //           attrs: {
    //             label: 'io16',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 16637.4,
    //             qualityValue: 27000,
    //           },
    //         },
    //         {
    //           id: '58790235583b4f03995d548975d59686',
    //           group: 'out',
    //           attrs: {
    //             label: 'io17',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 16637.4,
    //             qualityValue: 27000,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'ff04186b24f1497d9dc370eb1db70323',
    //       label: '过程1',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '40d426ff414c4786a98a804067adf573',
    //           group: 'in',
    //           attrs: {
    //             label: 'io8',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 711,
    //             qualityValue: 900,
    //           },
    //         },
    //         {
    //           id: '0223395d7b6c48dfaf1b1f59f8dd7b10',
    //           group: 'out',
    //           attrs: {
    //             label: 'io15',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 711,
    //             qualityValue: 900,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'c73c934508b74deea7506765093b7a15',
    //       label: '过程2',
    //       lifeCycleId: 2,
    //       lifeCycle: '包装材料阶段',
    //       ports: [
    //         {
    //           id: 'c8ae4ee3003446fd91dea26ef7958f1f',
    //           group: 'in',
    //           attrs: {
    //             label: 'io5',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 554.58,
    //             qualityValue: 900,
    //           },
    //         },
    //         {
    //           id: 'a115c898cbeb43d582afd5ca3ae3bd8a',
    //           group: 'in',
    //           attrs: {
    //             label: 'io6',
    //             dataValue: 120,
    //             unit: 'kg',
    //             baselineValue: 2218.32,
    //             qualityValue: 3600,
    //           },
    //         },
    //         {
    //           id: 'a6f9abc13bc44fb79fb61f1df0021eb0',
    //           group: 'in',
    //           attrs: {
    //             label: 'io7',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 554.58,
    //             qualityValue: 900,
    //           },
    //         },
    //         {
    //           id: '8ca8c2b4437e46ff9c65299c3f2fd353',
    //           group: 'in',
    //           attrs: {
    //             label: 'io12',
    //             dataValue: 120,
    //             unit: 'kg',
    //             baselineValue: 2218.32,
    //             qualityValue: 3600,
    //           },
    //         },
    //         {
    //           id: 'b7c5e954269d4389a4a04797cd29fa44',
    //           group: 'out',
    //           attrs: {
    //             label: 'io9',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 711,
    //             qualityValue: 900,
    //           },
    //         },
    //         {
    //           id: 'ff5d9ce81da8497595b2a843561aaaeb',
    //           group: 'out',
    //           attrs: {
    //             label: 'io10',
    //             dataValue: 120,
    //             unit: 'kg',
    //             baselineValue: 0,
    //             qualityValue: 3600,
    //           },
    //         },
    //         {
    //           id: '5f09be84945c4bf4989084e943fe475b',
    //           group: 'out',
    //           attrs: {
    //             label: 'io13',
    //             dataValue: 120,
    //             unit: 'kg',
    //             baselineValue: 2218.32,
    //             qualityValue: 3600,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'd1130aeabc284cc2969b9064a218e3b3',
    //       label: '过程4',
    //       lifeCycleId: 4,
    //       lifeCycle: '生产阶段',
    //       ports: [
    //         {
    //           id: '014cdad88bf84ab2bd932b3665b91202',
    //           group: 'in',
    //           attrs: {
    //             label: 'io2',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 23.7,
    //             qualityValue: 30,
    //           },
    //         },
    //         {
    //           id: '4f4132c355314a329242ca81899c7e82',
    //           group: 'in',
    //           attrs: {
    //             label: 'io3',
    //             dataValue: 10,
    //             unit: 'kg',
    //             baselineValue: 7.9,
    //             qualityValue: 10,
    //           },
    //         },
    //         {
    //           id: 'ba42d6a828104f979ca3e9dd935feca8',
    //           group: 'in',
    //           attrs: {
    //             label: 'io4',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 23.7,
    //             qualityValue: 30,
    //           },
    //         },
    //         {
    //           id: 'a33e2d4da7df485b82028bae99ae6825',
    //           group: 'out',
    //           attrs: {
    //             label: '主要研究对象',
    //             dataValue: 999,
    //             unit: 'kg',
    //             baselineValue: 999,
    //             qualityValue: 999,
    //           },
    //         },
    //         {
    //           id: '5e45cfd79d834bbbb69d62048adfc67c',
    //           group: 'out',
    //           attrs: {
    //             label: 'io14',
    //             dataValue: 120,
    //             unit: 'kg',
    //             baselineValue: 120,
    //             qualityValue: 120,
    //           },
    //         },
    //         {
    //           id: '8157b7a0305847ffb26033fc5c922bf2',
    //           group: 'out',
    //           attrs: {
    //             label: 'io19',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 0,
    //             qualityValue: 30,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '9b837cc53ef4423f9f355cad5f31b9ad',
    //       label: '过程5',
    //       lifeCycleId: 5,
    //       lifeCycle: '废弃物阶段（包括废物处理和处置）',
    //       ports: [
    //         {
    //           id: '2ac4f660125a448e9eb2411aaeb243f8',
    //           group: 'in',
    //           attrs: {
    //             label: 'io11',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 29970,
    //             qualityValue: 29970,
    //           },
    //         },
    //         {
    //           id: '31cd674befc74f17af6dd65400517cdd',
    //           group: 'in',
    //           attrs: {
    //             label: 'io18',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 0,
    //             qualityValue: 29970,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '144f2b771e8e40bba85a3790cf2799ce',
    //       label: '过程12',
    //       lifeCycleId: 6,
    //       lifeCycle: '分销阶段',
    //       ports: [
    //         {
    //           id: 'd1a2d23b1b004e119e298f9a43032b2e',
    //           group: 'in',
    //           attrs: {
    //             label: 'io20',
    //             dataValue: 30,
    //             unit: 'kg',
    //             baselineValue: 0,
    //             qualityValue: 0,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: 'd1130aeabc284cc2969b9064a218e3b3',
    //         port: 'a33e2d4da7df485b82028bae99ae6825',
    //       },
    //       target: {
    //         cell: '9b837cc53ef4423f9f355cad5f31b9ad',
    //         port: '2ac4f660125a448e9eb2411aaeb243f8',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'c73c934508b74deea7506765093b7a15',
    //         port: 'b7c5e954269d4389a4a04797cd29fa44',
    //       },
    //       target: {
    //         cell: 'd1130aeabc284cc2969b9064a218e3b3',
    //         port: '014cdad88bf84ab2bd932b3665b91202',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'd1130aeabc284cc2969b9064a218e3b3',
    //         port: '5e45cfd79d834bbbb69d62048adfc67c',
    //       },
    //       target: {
    //         cell: 'ff04186b24f1497d9dc370eb1db70323',
    //         port: '40d426ff414c4786a98a804067adf573',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'ff04186b24f1497d9dc370eb1db70323',
    //         port: '0223395d7b6c48dfaf1b1f59f8dd7b10',
    //       },
    //       target: {
    //         cell: 'd1130aeabc284cc2969b9064a218e3b3',
    //         port: 'ba42d6a828104f979ca3e9dd935feca8',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '6fb8facba0964f6eb3edfa893c6cf908',
    //         port: '964aa96b6d934f36bad0ba1d819c3b5a',
    //       },
    //       target: {
    //         cell: 'c73c934508b74deea7506765093b7a15',
    //         port: 'c8ae4ee3003446fd91dea26ef7958f1f',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '6fb8facba0964f6eb3edfa893c6cf908',
    //         port: '58790235583b4f03995d548975d59686',
    //       },
    //       target: {
    //         cell: 'c73c934508b74deea7506765093b7a15',
    //         port: 'a115c898cbeb43d582afd5ca3ae3bd8a',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'd1130aeabc284cc2969b9064a218e3b3',
    //         port: '8157b7a0305847ffb26033fc5c922bf2',
    //       },
    //       target: {
    //         cell: '144f2b771e8e40bba85a3790cf2799ce',
    //         port: 'd1a2d23b1b004e119e298f9a43032b2e',
    //       },
    //     },
    //   ],
    // };
    // const data = {
    //   nodes: [
    //     {
    //       id: '77783d45a9834153a734bd1de8928960',
    //       label: 'test输入',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: 'ea53a721239646ab9d967f4ae21c3229',
    //           group: 'in',
    //           attrs: {
    //             label:
    //               'Test012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345',
    //             dataValue: 83,
    //             unit: 'km',
    //             baselineValue: 83,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '2e3ea97dc7be4a5596390846aff0d639',
    //           group: 'out',
    //           attrs: {
    //             label: 'test有价值输出物体',
    //             dataValue: 44,
    //             unit: 'g',
    //             baselineValue: 44,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '457eea2dc65749fe9adec2807f320f4e',
    //       label: 'test过程1405',
    //       lifeCycleId: 2,
    //       lifeCycle: '包装材料阶段',
    //       ports: [
    //         {
    //           id: 'ccf86145d44649559a2e52cad11e400a',
    //           group: 'in',
    //           attrs: {
    //             label: 'test有价值输出物引用',
    //             dataValue: 0.000001,
    //             unit: 'ml',
    //             baselineValue: 11,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '41a4ae2965b247b1bd41c8eb5f5503a5',
    //           group: 'in',
    //           attrs: {
    //             label: 'test输入111',
    //             dataValue: 43,
    //             unit: 'km',
    //             baselineValue: 473000000,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '52153e21e2754fb1b63846c427897b93',
    //           group: 'in',
    //           attrs: {
    //             label: 'test耗材333',
    //             dataValue: 453,
    //             unit: 'TJ',
    //             baselineValue: 4983000000,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: '77783d45a9834153a734bd1de8928960',
    //         port: '2e3ea97dc7be4a5596390846aff0d639',
    //       },
    //       target: {
    //         cell: '457eea2dc65749fe9adec2807f320f4e',
    //         port: 'ccf86145d44649559a2e52cad11e400a',
    //       },
    //     },
    //   ],
    // };
    // const data = {
    //   nodes: [
    //     {
    //       id: '35cada9422984ad996fe29eaa65ff59f',
    //       label: 'test运输过程',
    //       lifeCycleId: 3,
    //       lifeCycle: '入厂运输阶段',
    //       ports: [
    //         {
    //           id: '277ea651faa245909017eb6905e1ab10',
    //           group: 'in',
    //           attrs: {
    //             label: 'test鲈鱼运输',
    //             dataValue: 2,
    //             unit: 'ml',
    //             baselineValue: 2.1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '503bf786b5be4a57a4bb4529f3041e60',
    //           group: 'in',
    //           attrs: {
    //             label: '清蒸鲈鱼电力',
    //             dataValue: 2,
    //             unit: 'mm',
    //             baselineValue: 0,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '1012076a43f543a5aa511b55c65bd583',
    //           group: 'in',
    //           attrs: {
    //             label: 'test炒菜1648',
    //             dataValue: 53,
    //             unit: '立方英尺',
    //             baselineValue: 0,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '400e90968b1147fd9824686bd0517b4b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test运输阶段计算测试',
    //             dataValue: 5.17,
    //             unit: 'km',
    //             baselineValue: 4.88565,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6d24f3184db54636a418d8485299f092',
    //           group: 'out',
    //           attrs: {
    //             label: '清蒸鲈鱼运输输出',
    //             dataValue: 48.22,
    //             unit: 'ml',
    //             baselineValue: 45.5679,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '16642e78bfaa472dbae1987138ab92d3',
    //           group: 'out',
    //           attrs: {
    //             label: 'test运输阶段输出测试',
    //             dataValue: 4.51,
    //             unit: 'km',
    //             baselineValue: 4.26195,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '325f6e47969e41c49cd3635ab74df962',
    //       label: 'test生产过程鲈鱼1',
    //       lifeCycleId: 4,
    //       lifeCycle: '生产阶段',
    //       ports: [
    //         {
    //           id: 'b16dc9bfe1ab4bbfb1f854ba1f2ffc77',
    //           group: 'in',
    //           attrs: {
    //             label:
    //               'Test012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345',
    //             dataValue: 81,
    //             unit: 'kg',
    //             baselineValue: 81,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'f5de4b03fe144e45972f7433c37a7b3b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test干净的盘子',
    //             dataValue: 27.361106,
    //             unit: 'kg',
    //             baselineValue: 19.1527742,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd16155fc7f554e8e91b252d308854f66',
    //           group: 'in',
    //           attrs: {
    //             label: 'test姜片',
    //             dataValue: 1.631,
    //             unit: 'mm',
    //             baselineValue: 1.1417,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6912bb2a630c4c22b32798f908a6c21e',
    //           group: 'in',
    //           attrs: {
    //             label: 'test鲈鱼',
    //             dataValue: 2.331,
    //             unit: 'mm',
    //             baselineValue: 1.6317,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd13aa6b6bb454b7184dc6ce66d89c7cd',
    //           group: 'in',
    //           attrs: {
    //             label: 'test煤气',
    //             dataValue: 2.961,
    //             unit: 'km',
    //             baselineValue: 2.0727,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd8c3248fc9a74be6bcb20b285959449f',
    //           group: 'in',
    //           attrs: {
    //             label: 'test姜末',
    //             dataValue: 5.23,
    //             unit: 'km',
    //             baselineValue: 3.661,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '1bac2ebcd18b4c0a948de21a95eee47b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test虾',
    //             dataValue: 5.23,
    //             unit: 'mm',
    //             baselineValue: 0,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '72d52959683242ba9b0d467d81ab0689',
    //           group: 'out',
    //           attrs: {
    //             label: 'test清蒸鲈鱼',
    //             dataValue: 6,
    //             unit: 'km',
    //             baselineValue: 4.2,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '03e03d27aed048bbad088120365e49d3',
    //           group: 'out',
    //           attrs: {
    //             label: 'testCO2',
    //             dataValue: 3,
    //             unit: 'mm',
    //             baselineValue: 2.1,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: '325f6e47969e41c49cd3635ab74df962',
    //         port: '72d52959683242ba9b0d467d81ab0689',
    //       },
    //       target: {
    //         cell: '35cada9422984ad996fe29eaa65ff59f',
    //         port: '277ea651faa245909017eb6905e1ab10',
    //       },
    //     },
    //   ],
    // };
    // const data = {
    //   nodes: [
    //     {
    //       id: '3b6ba6cce9f646cfbdd8d2ebe8282bd0',
    //       label: 'test过程5',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '98c3587ba52749369bc5067c0dbf9140',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程5输入1',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 10,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'af9cdf85fadf4f64850c9f67ae4a3ee0',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程输入2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 10,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '600eb519d0ab444594e284fe7bff4445',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程5输入3',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 10,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd3b0026984e1423b89f5d552f45d4f24',
    //           group: 'out',
    //           attrs: {
    //             label: '54',
    //             dataValue: 48,
    //             unit: 'kg',
    //             baselineValue: 48,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '857e5565077b41d49c3915c6f205fac4',
    //       label: 'test过程3',
    //       lifeCycleId: 2,
    //       lifeCycle: '包装材料阶段',
    //       ports: [
    //         {
    //           id: '4973a799223a4e6c9d218b7cab538c05',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程3输入1',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6c4f40fa13864e2c85e757b09dbe9012',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程3输入2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '73791c673e664a8aab6785099433f0c0',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程3输出1',
    //             dataValue: 10,
    //             unit: 'mm',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '9b199e659efd4351a5d14aeddc942353',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程3输出2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '3a2a208c22974e5982eed710a1a795fc',
    //       label: 'test过程2',
    //       lifeCycleId: 3,
    //       lifeCycle: '入厂运输阶段',
    //       ports: [
    //         {
    //           id: 'e8ee37a2a6ca44288fa1d1b66e71c519',
    //           group: 'in',
    //           attrs: {
    //             label: 'tes过程2输入1',
    //             dataValue: 10,
    //             unit: 'mm',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'bd540e72ccd14af99150d760273a0ee4',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程2输入2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '03860559b1284c7883118aefd3f279f1',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程2输出1',
    //             dataValue: 10,
    //             unit: 'mm',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '53bf0c60255945dfa1bb8750daeae94d',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程2输出1',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: null,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'de85539d8f3145a8997cad6789fe7eeb',
    //       label: 'test过程1',
    //       lifeCycleId: 4,
    //       lifeCycle: '生产阶段',
    //       ports: [
    //         {
    //           id: 'fc9ecb70a8004ea98fe69d6b487ef13f',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程1输入1',
    //             dataValue: 10,
    //             unit: 'cm',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'a95a2fcc45bd4f9ebbd5a7a650979d4e',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程1输入2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '446c2355d553482aade0713c80ea92eb',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出1',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '438e955b4049400a8b3dc796e7537555',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出2',
    //             dataValue: 10,
    //             unit: 'kg',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '344d1733a9e147de8b1ec538abdfa564',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出3',
    //             dataValue: 10,
    //             unit: 'mm',
    //             baselineValue: 1,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '63c5a7bf00b54f298e06be5bcc89f75b',
    //       label: 'test过程4',
    //       lifeCycleId: 5,
    //       lifeCycle: '废弃物阶段（包括废物处理和处置）',
    //       ports: [
    //         {
    //           id: '99554a855ae34730b877e25d0723994e',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程4输入1',
    //             dataValue: 10,
    //             unit: 'kg',
    //             baselineValue: null,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6534351d53cc445992fe64436955f105',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程4输入2',
    //             dataValue: 10,
    //             unit: 'mm',
    //             baselineValue: null,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '66248f31c5954ae89c860bc448b6769b',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程4输出1',
    //             dataValue: 10,
    //             unit: 'kg',
    //             baselineValue: null,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd9cf3be3da0b4bc6895cfc4a654d25b9',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程4输出2',
    //             dataValue: 10,
    //             unit: 'km',
    //             baselineValue: null,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: '857e5565077b41d49c3915c6f205fac4',
    //         port: '73791c673e664a8aab6785099433f0c0',
    //       },
    //       target: {
    //         cell: '3b6ba6cce9f646cfbdd8d2ebe8282bd0',
    //         port: '98c3587ba52749369bc5067c0dbf9140',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '3a2a208c22974e5982eed710a1a795fc',
    //         port: '03860559b1284c7883118aefd3f279f1',
    //       },
    //       target: {
    //         cell: '857e5565077b41d49c3915c6f205fac4',
    //         port: '4973a799223a4e6c9d218b7cab538c05',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'de85539d8f3145a8997cad6789fe7eeb',
    //         port: '446c2355d553482aade0713c80ea92eb',
    //       },
    //       target: {
    //         cell: '3a2a208c22974e5982eed710a1a795fc',
    //         port: 'bd540e72ccd14af99150d760273a0ee4',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'de85539d8f3145a8997cad6789fe7eeb',
    //         port: '344d1733a9e147de8b1ec538abdfa564',
    //       },
    //       target: {
    //         cell: '63c5a7bf00b54f298e06be5bcc89f75b',
    //         port: '99554a855ae34730b877e25d0723994e',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '63c5a7bf00b54f298e06be5bcc89f75b',
    //         port: 'd9cf3be3da0b4bc6895cfc4a654d25b9',
    //       },
    //       target: {
    //         cell: '3b6ba6cce9f646cfbdd8d2ebe8282bd0',
    //         port: '600eb519d0ab444594e284fe7bff4445',
    //       },
    //     },
    //   ],
    // };
    // const data = {
    //   nodes: [
    //     {
    //       id: '635827b94aec4b9da0b1a9ec2c58c6ae',
    //       label: '切姜末',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '6ece8640eca649908dfebc3f54a48516',
    //           group: 'in',
    //           attrs: {
    //             label: '姜片输入',
    //             dataValue: 2.33,
    //             unit: 'ml',
    //             baselineValue: 0.3148648648,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '67197ec1472747d0ba907cfb39f6c66f',
    //           group: 'out',
    //           attrs: {
    //             label: 'test姜末',
    //             dataValue: 5.18,
    //             unit: 'km',
    //             baselineValue: 0.6999999998,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '3f643ccc8eb843efadfdd402004f87ea',
    //       label: '切姜片',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '5af26029a3a2448782f53431adfd18b4',
    //           group: 'in',
    //           attrs: {
    //             label: '生姜',
    //             dataValue: 12.22,
    //             unit: 'kg',
    //             baselineValue: 0.1743605287,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '05d75e3274414b8dba4ec7c788d6d7c2',
    //           group: 'in',
    //           attrs: {
    //             label: '切生姜片',
    //             dataValue: 76,
    //             unit: 'mm',
    //             baselineValue: 1.0844026332,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '1d75c161771447ee87e1fac41184e8d3',
    //           group: 'out',
    //           attrs: {
    //             label: 'test姜片输出',
    //             dataValue: 5.12,
    //             unit: 'ml',
    //             baselineValue: 0.0730544932,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '8b66f6d787eb49f3a82a08049aff8347',
    //       label: 'test运输过程',
    //       lifeCycleId: 3,
    //       lifeCycle: '入厂运输阶段',
    //       ports: [
    //         {
    //           id: 'fb36c162d56e410db07922aca7c0595b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test鲈鱼运输',
    //             dataValue: 2,
    //             unit: 'ml',
    //             baselineValue: 2.1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6355fe3bde4044c9acbf4cc58aca0f82',
    //           group: 'in',
    //           attrs: {
    //             label: '清蒸鲈鱼电力',
    //             dataValue: 2,
    //             unit: 'mm',
    //             baselineValue: 2.1,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'a5f7a54332ad4705acc78281e4a2c08b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test炒菜1648',
    //             dataValue: 53,
    //             unit: '立方英尺',
    //             baselineValue: 0,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '88b69e91f34d46f99a5d97724c6fbb96',
    //           group: 'in',
    //           attrs: {
    //             label: 'test运输阶段计算测试',
    //             dataValue: 5.17,
    //             unit: 'km',
    //             baselineValue: 4.88565,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'fe3321c622b7431bab603e10b440be55',
    //           group: 'out',
    //           attrs: {
    //             label: '清蒸鲈鱼运输输出',
    //             dataValue: 48.22,
    //             unit: 'ml',
    //             baselineValue: 45.5679,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '74f13fb477764fddb67bd39cd81f41e2',
    //           group: 'out',
    //           attrs: {
    //             label: 'test运输阶段输出测试',
    //             dataValue: 4.51,
    //             unit: 'km',
    //             baselineValue: 4.26195,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'e421880cbea84f8292fc5484307159f0',
    //       label: 'test生产过程鲈鱼1',
    //       lifeCycleId: 4,
    //       lifeCycle: '生产阶段',
    //       ports: [
    //         {
    //           id: '8cbfa53636a74f46be68dd4a565a788e',
    //           group: 'in',
    //           attrs: {
    //             label:
    //               'Test012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345',
    //             dataValue: 81,
    //             unit: 'kg',
    //             baselineValue: 81,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '92e37f728c114358a0893b99c6ac3c7a',
    //           group: 'in',
    //           attrs: {
    //             label: 'test干净的盘子',
    //             dataValue: 27.361106,
    //             unit: 'kg',
    //             baselineValue: 19.1527742,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'd7f9aec3ffb1420b8107cc0dfda2fd02',
    //           group: 'in',
    //           attrs: {
    //             label: 'test姜片',
    //             dataValue: 1.631,
    //             unit: 'mm',
    //             baselineValue: 1.1417,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '14753afd0f594eeb927ea16a7ab6cc61',
    //           group: 'in',
    //           attrs: {
    //             label: 'test鲈鱼',
    //             dataValue: 2.331,
    //             unit: 'mm',
    //             baselineValue: 1.6317,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'b501f8f696bc4758ae5cd90320241071',
    //           group: 'in',
    //           attrs: {
    //             label: 'test煤气',
    //             dataValue: 2.961,
    //             unit: 'km',
    //             baselineValue: 2.0727,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '62912e36274d4ccd952630136eafa64a',
    //           group: 'in',
    //           attrs: {
    //             label: 'test姜末',
    //             dataValue: 5.23,
    //             unit: 'km',
    //             baselineValue: 3.661,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '724ef14d02f04e15841bf8be92bf9e04',
    //           group: 'in',
    //           attrs: {
    //             label: 'test虾',
    //             dataValue: 5.23,
    //             unit: 'mm',
    //             baselineValue: 0,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: 'e40118f5ea9e448194ea397096cf4c67',
    //           group: 'out',
    //           attrs: {
    //             label: 'test清蒸鲈鱼',
    //             dataValue: 6,
    //             unit: 'km',
    //             baselineValue: 4.2,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '7d33f31d7c0c4970ae2d36e6e31dc755',
    //           group: 'out',
    //           attrs: {
    //             label: 'testCO2',
    //             dataValue: 3,
    //             unit: 'mm',
    //             baselineValue: 2.1,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: 'd926a7bb9daa4d3786f445773974e3fc',
    //       label: 'test鲈鱼垃圾处理阶段',
    //       lifeCycleId: 5,
    //       lifeCycle: '废弃物阶段（包括废物处理和处置）',
    //       ports: [
    //         {
    //           id: 'da5071ba5c1246eba9ed737bee3101b4',
    //           group: 'in',
    //           attrs: {
    //             label: 'test剩菜处理1412',
    //             dataValue: 1,
    //             unit: 'TJ',
    //             baselineValue: 19.1527741143,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '678285788cea490dafd9cd02473bd00d',
    //           group: 'out',
    //           attrs: {
    //             label: 'test脏盘',
    //             dataValue: 1,
    //             unit: 'ml',
    //             baselineValue: 19.1527741143,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '5cbe3453f6f04075aadd744a018945a7',
    //           group: 'out',
    //           attrs: {
    //             label: 'test鱼骨',
    //             dataValue: 2.3,
    //             unit: 'km',
    //             baselineValue: 44.0513804629,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '71cd0472a3e442338db942a82de403b2',
    //       label: 'test鲈鱼食用阶段',
    //       lifeCycleId: 7,
    //       lifeCycle: '使用阶段',
    //       ports: [
    //         {
    //           id: '36b8b9cfb54a4a6ea5d04a6b89766e4b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test鲈鱼原材料食用',
    //             dataValue: 44.11,
    //             unit: 'km',
    //             baselineValue: 281.6096220606,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '45f9dc66818b46d580bdec882ac0332a',
    //           group: 'in',
    //           attrs: {
    //             label: 'test一次性筷子耗材',
    //             dataValue: 89,
    //             unit: 'ml',
    //             baselineValue: 454.5591723127,
    //             qualityValue: null,
    //           },
    //         },
    //         {
    //           id: '6542ade46b9f47bbb94a56248faf0023',
    //           group: 'out',
    //           attrs: {
    //             label: '鲈鱼原材料食用输出剩菜',
    //             dataValue: 3,
    //             unit: 'ml',
    //             baselineValue: 19.1527741143,
    //             qualityValue: null,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: 'e421880cbea84f8292fc5484307159f0',
    //         port: 'e40118f5ea9e448194ea397096cf4c67',
    //       },
    //       target: {
    //         cell: '8b66f6d787eb49f3a82a08049aff8347',
    //         port: 'fb36c162d56e410db07922aca7c0595b',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: 'e421880cbea84f8292fc5484307159f0',
    //         port: '7d33f31d7c0c4970ae2d36e6e31dc755',
    //       },
    //       target: {
    //         cell: '8b66f6d787eb49f3a82a08049aff8347',
    //         port: '6355fe3bde4044c9acbf4cc58aca0f82',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '8b66f6d787eb49f3a82a08049aff8347',
    //         port: 'fe3321c622b7431bab603e10b440be55',
    //       },
    //       target: {
    //         cell: '71cd0472a3e442338db942a82de403b2',
    //         port: '36b8b9cfb54a4a6ea5d04a6b89766e4b',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '71cd0472a3e442338db942a82de403b2',
    //         port: '6542ade46b9f47bbb94a56248faf0023',
    //       },
    //       target: {
    //         cell: 'd926a7bb9daa4d3786f445773974e3fc',
    //         port: 'da5071ba5c1246eba9ed737bee3101b4',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '635827b94aec4b9da0b1a9ec2c58c6ae',
    //         port: '67197ec1472747d0ba907cfb39f6c66f',
    //       },
    //       target: {
    //         cell: 'e421880cbea84f8292fc5484307159f0',
    //         port: '62912e36274d4ccd952630136eafa64a',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '3f643ccc8eb843efadfdd402004f87ea',
    //         port: '1d75c161771447ee87e1fac41184e8d3',
    //       },
    //       target: {
    //         cell: '635827b94aec4b9da0b1a9ec2c58c6ae',
    //         port: '6ece8640eca649908dfebc3f54a48516',
    //       },
    //     },
    //   ],
    // };
    // const data = {
    //   nodes: [
    //     {
    //       id: 'b97bde6fe8024ef98b3f0ac6c49d38b4',
    //       label: 'test过程5',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: 'debeba433a844b679035ac57852a76e9',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程5输入1',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '10',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '1730646024d84832886a41bab6dd8e78',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程输入2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '10',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '9220b91de4a7488a903a22b88e46dd9c',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程5输入3',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '10',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: 'dbcfa233ee41452c97660bc7d0b1c63c',
    //           group: 'out',
    //           attrs: {
    //             label: '54',
    //             dataValue: '48',
    //             unit: 'kg',
    //             baselineValue: '48',
    //             balanceValue: '48',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '351d9fb1fcbf43a4abc81733278a6019',
    //       label: 'test过程3',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: 'fd6318d26a9e480fbe2d5e1108804ece',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程3输入1',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '0',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '03126085da9649039c1405b573dd69b7',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程3输入2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '8',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '918f3fde66bb47b295d90cc8ea89e140',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程3输出1',
    //             dataValue: '10',
    //             unit: 'mm',
    //             baselineValue: '10',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '5b87470930e7443985290c943bf0eab3',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程3输出2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '0',
    //             balanceValue: '0',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '85e6215beafc4217b48260b946f5f896',
    //       label: 'test过程2',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: 'f3c82162fbdd4eeeb1c147991f8b3935',
    //           group: 'in',
    //           attrs: {
    //             label: 'tes过程2输入1',
    //             dataValue: '10',
    //             unit: 'mm',
    //             baselineValue: '8',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: 'e0da1196636f4e26a6ae2b2434556ed2',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程2输入2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '0',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '648cc83354e6444c9a30644e6cc95e77',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程2输出1',
    //             dataValue: '10',
    //             unit: 'mm',
    //             baselineValue: '8',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '43c612b8d0db48dca0d15442549cc0f8',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程2输出1',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '8',
    //             balanceValue: '10',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '2e6d0fd793e24e67923d1027597d7255',
    //       label: 'test过程1',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: 'f4d23a58746946258b6420a23194554b',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程1输入1',
    //             dataValue: '10',
    //             unit: 'cm',
    //             baselineValue: '5.4',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '6f2b4b58189b472aade4b94e5a1ec795',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程1输入2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '5.4',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '1ceb7cc1f22d466db1e1119371347a9a',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出1',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '8',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '54888349d2cb48a28f6ade440bf65393',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出2',
    //             dataValue: '10',
    //             unit: 'kg',
    //             baselineValue: '0',
    //             balanceValue: '0',
    //           },
    //         },
    //         {
    //           id: '933ab400fb1d436aa665ea12273d7b0e',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程1输出3',
    //             dataValue: '10',
    //             unit: 'mm',
    //             baselineValue: '6',
    //             balanceValue: '10',
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: '5e27e32464834ff5a13118b2af391f3d',
    //       label: 'test过程4',
    //       lifeCycleId: 1,
    //       lifeCycle: '原材料阶段（包括资源开采和运输）',
    //       ports: [
    //         {
    //           id: '79b2ce3505a74f16b52f5b2340eb6be6',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程4输入1',
    //             dataValue: '10',
    //             unit: 'kg',
    //             baselineValue: '0',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '85e918387133499a859a8ddf66494678',
    //           group: 'in',
    //           attrs: {
    //             label: 'test过程4输入2',
    //             dataValue: '10',
    //             unit: 'mm',
    //             baselineValue: '6',
    //             balanceValue: '10',
    //           },
    //         },
    //         {
    //           id: '50c6e009d0d64e568570cca3f62da13c',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程4输出1',
    //             dataValue: '10',
    //             unit: 'kg',
    //             baselineValue: '0',
    //             balanceValue: '0',
    //           },
    //         },
    //         {
    //           id: '804d4e11206e4710918f16742a10b4f1',
    //           group: 'out',
    //           attrs: {
    //             label: 'test过程4输出2',
    //             dataValue: '10',
    //             unit: 'km',
    //             baselineValue: '10',
    //             balanceValue: '10',
    //           },
    //         },
    //       ],
    //     },
    //   ],
    //   edges: [
    //     {
    //       source: {
    //         cell: '351d9fb1fcbf43a4abc81733278a6019',
    //         port: '918f3fde66bb47b295d90cc8ea89e140',
    //       },
    //       target: {
    //         cell: 'b97bde6fe8024ef98b3f0ac6c49d38b4',
    //         port: 'debeba433a844b679035ac57852a76e9',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '85e6215beafc4217b48260b946f5f896',
    //         port: '648cc83354e6444c9a30644e6cc95e77',
    //       },
    //       target: {
    //         cell: '351d9fb1fcbf43a4abc81733278a6019',
    //         port: 'fd6318d26a9e480fbe2d5e1108804ece',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '2e6d0fd793e24e67923d1027597d7255',
    //         port: '1ceb7cc1f22d466db1e1119371347a9a',
    //       },
    //       target: {
    //         cell: '85e6215beafc4217b48260b946f5f896',
    //         port: 'e0da1196636f4e26a6ae2b2434556ed2',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '2e6d0fd793e24e67923d1027597d7255',
    //         port: '933ab400fb1d436aa665ea12273d7b0e',
    //       },
    //       target: {
    //         cell: '5e27e32464834ff5a13118b2af391f3d',
    //         port: '79b2ce3505a74f16b52f5b2340eb6be6',
    //       },
    //     },
    //     {
    //       source: {
    //         cell: '5e27e32464834ff5a13118b2af391f3d',
    //         port: '804d4e11206e4710918f16742a10b4f1',
    //       },
    //       target: {
    //         cell: 'b97bde6fe8024ef98b3f0ac6c49d38b4',
    //         port: '9220b91de4a7488a903a22b88e46dd9c',
    //       },
    //     },
    //   ],
    // };
    const newCalculator = new Calculator(data);
    const newData = newCalculator.getData();

    setDiagramData(newData);
  }, []);

  return (
    <div className={styles.diagramWrapper}>
      <ProcessStructureDiagram diagramData={diagramData} />
    </div>
  );
};

export default ProcessStructureDiagramIndex;
