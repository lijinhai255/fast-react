import {
  Cell,
  Graph,
  Model,
  Options,
  Path,
  PointLike,
  Rectangle,
  Shape,
} from '@antv/x6';

// import Calculator from './ClassCulNode';
import { uniqBy } from 'lodash-es';

import {
  findNodeForPoint,
  addCoordinates,
  calculateVerticalDistances,
  createNewNodeCoordinates,
} from '@/utils';

import {
  CustomLifeCycleIconSVG,
  LaneColors,
  getLifeCycleSvg,
} from './utils/lifeCycle';

type EdgeType = {
  attr: (name: string, value: string | number) => void;
};
// const baseData = new Calculator({}, false);
// const configData = baseData.getBasicData();
/** 过程节点宽度 */
const NODE_WIDTH = 280;
/** 过程矩形节点最小高度 */
const NODE_MIN_HEIGHT = 148;
/** 过程节点间距 */
// const NODE_VERTICAL_GAP = 60;
/** 泳道宽度 */
const LANE_WIDTH = 340;
const LANE_HEIGHT = 1000;

class newGraph extends Graph {
  static customNodesRegistered = false;

  diagramData: any;

  width: any;

  height: any;

  graph: any;

  lanePositions: Record<number, { x: number; currentY: number }> = {};

  nodeBoundaries: Rectangle[] = [];

  cells: Cell[] = [];

  NODE_VERTICAL_GAP = 60;

  calLaneHight = 0;

  laneHight = 0;

  baseMarginDiatance = 10;

  uniqueName = 'restricted-connector';

  edageArr: any[] = [];

  map = new Map();

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(
    options: Partial<Options.Manual>,
    diagramData: { diagramData: Model },
    width: number,
    height: number,
  ) {
    super(options);
    this.diagramData = diagramData;
    this.width = width;
    this.height = height;
    this.graph = this;
    this.calLaneHight = this.calculateMaxLaneHeight();
    this.laneHight = this.calLaneHight < 1000 ? LANE_HEIGHT : this.calLaneHight;
    this.baseMarginDiatance = 10;
    this.init();
  }
  /** 注册lane、lane-react、edge方法 */

  // eslint-disable-next-line class-methods-use-this
  registerCustomNodes() {
    Graph.registerNode(
      'lane',
      {
        inherit: 'rect',
        width: LANE_WIDTH,
        height: LANE_HEIGHT,
        y: 0,
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
          {
            tagName: 'image',
            selector: 'image',
          },
        ],
        attrs: {
          body: {
            fill: '#FFF',
            stroke: 'none',
            strokeWidth: 1,
          },
          'name-rect': {
            width: LANE_WIDTH,
            height: 64,
            fill: '#fff',
            stroke: 'rgba(235, 237, 240, 1)',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
          },
          'name-text': {
            ref: 'name-rect',
            refY: 0.5,
            refX: 60,
            textAnchor: 'start',
            fontWeight: 'bold',
            fill: 'rgba(52, 58, 64, 1)',
            fontSize: 14,
          },
          image: {
            width: 32,
            height: 32,
            x: 16,
            y: 16,
          },
        },
      },
      true,
    );

    Graph.registerNode(
      'lane-rect',
      {
        inherit: 'rect',
        width: NODE_WIDTH,
        height: NODE_MIN_HEIGHT,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'rect',
            selector: 'header',
          },
          {
            tagName: 'text',
            selector: 'name-text',
          },
          {
            tagName: 'image',
            selector: 'image',
          },
        ],
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: 'none',
            fill: '#fff',
            rx: 4,
            ry: 4,
          },
          header: {
            width: NODE_WIDTH,
            height: 40,
            fill: '#fff',
            stroke: '#fff',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
            refY: -40,
          },
          'name-text': {
            ref: 'header',
            refX: 40,
            refY: 20,
            textAnchor: 'start',
            yAlignment: 'middle',
            fill: '#343A40',
            fontSize: 14,
            fontWeight: 500,
            textWrap: {
              width: 200,
              height: 20,
              ellipsis: true,
              breakWord: true,
            },
          },
          image: {
            ref: 'header',
            width: 18,
            height: 20,
            refX: 12,
            refY: 10,
            'xlink:href': `data:image/svg+xml;utf8,${encodeURIComponent(
              CustomLifeCycleIconSVG,
            )}`,
          },
        },
      },
      true,
    );

    Graph.registerEdge(
      'edge',
      {
        inherit: 'edge',
        router: {
          name: 'manhattan',
          args: {
            startDirections: ['left'],
            endDirections: ['right'],
          },
        },
        attrs: {
          line: {
            stroke: 'rgba(52, 145, 250, 0.56)',
            strokeWidth: 1,
            // targetMarker: {
            //   name: 'classic',
            //   size: 6,
            // },
          },
        },
        connector: {
          name: 'jumpover',
          args: {
            type: 'gap',
          },
        },
      },
      true,
    );
    /** TODO - edge*/
    // if (!newGraph.customNodesRegistered) {
    try {
      Graph.registerConnector(
        this.uniqueName,
        (sourcePoint, targetPoint) => {
          console.log(
            this.nodeBoundaries,
            ' this.nodeBoundaries',
            this.lanePositions,
          );
          if (!this.map.has(`${sourcePoint.x}_${sourcePoint.y}`)) {
            // 获取创建的节点
            const node = this.nodeBoundaries.filter(item => {
              return item.height < 1000;
            });
            const coordinatesArr = addCoordinates(node);

            // 处理某个端口 在是否某个节点下

            // 找出sourcePoint所在的节点 targetPoint所在的节点
            // 查找sourcePoint和targetPoint所在的节点
            const finalSourceNode = findNodeForPoint(
              sourcePoint,
              coordinatesArr,
            );
            const finalTargetNode = findNodeForPoint(
              targetPoint,
              coordinatesArr,
            );
            console.log(finalSourceNode, finalTargetNode);
            // finalSourceNode 和 sourcePoint  finalTargetNode 和targetPoint 进行结合
            const finalSourceObj = {
              ...finalSourceNode,
              point: sourcePoint,
            };
            const finalTargetObj = {
              ...finalTargetNode,
              point: targetPoint,
            };
            // 计算每个节点中端点的距离
            const distancesSourceNode =
              calculateVerticalDistances(finalSourceObj);
            const distancestargetNode =
              calculateVerticalDistances(finalTargetObj);

            const distancesSourceNodeObj = {
              ...finalSourceObj,
              ...distancesSourceNode,
            };
            const distancestargetNodeObj = {
              ...finalTargetObj,
              ...distancestargetNode,
            };

            const createPointArr = createNewNodeCoordinates(
              distancesSourceNodeObj,
              distancestargetNodeObj,
              this.baseMarginDiatance,
            );

            this.edageArr.push([
              sourcePoint,
              ...((createPointArr || []) as unknown as PointLike[]),
              targetPoint,
            ]);
            this.map.set(`${sourcePoint.x}_${sourcePoint.y}`, [
              sourcePoint,
              ...((createPointArr || []) as unknown as PointLike[]),
              targetPoint,
            ]);
            return Path.drawPoints([
              sourcePoint,
              ...((createPointArr || []) as unknown as PointLike[]),
              targetPoint,
            ]);
          }
          if (this.map.has(`${sourcePoint.x}_${sourcePoint.y}`)) {
            console.log(
              this.map.get(`${sourcePoint.x}_${sourcePoint.y}`),
              ' this.map.get(sourcePoint);',
            );
            return Path.drawPoints([
              ...this.map.get(`${sourcePoint.x}_${sourcePoint.y}`),
            ]);
          }
        },
        false,
      );
    } catch (error) {
      console.log(error);
    }
    // }
    newGraph.customNodesRegistered = true;
  }

  calculateMaxLaneHeight() {
    const laneHeights: Record<number, number> = {};
    this.diagramData.nodes.forEach(
      (node: {
        shape: string;
        ports: {
          filter: (arg0: { (port: any): boolean; (port: any): boolean }) => {
            (): any;
            new (): any;
            length: any;
          };
        };
        lifeCycleId: string | number;
      }) => {
        if (node.shape !== 'lane') {
          const portsCount = Math.max(
            node.ports?.filter(port => port.group === 'in').length || 0,
            node.ports?.filter(port => port.group === 'out').length || 0,
          );
          const nodeHeight =
            Math.max(NODE_MIN_HEIGHT, portsCount * 38) +
            this.NODE_VERTICAL_GAP +
            10;
          if (!laneHeights[Number(node.lifeCycleId)]) {
            laneHeights[Number(node.lifeCycleId)] = 0;
          }
          laneHeights[Number(node.lifeCycleId)] += nodeHeight;
        }
      },
    );
    // 计算所有周期阶段中的最大高度
    const maxLaneHeight = Math.max(...Object.values(laneHeights));

    return maxLaneHeight;
  }

  // ProcessStructureDiagram 通过  diagramData 计算出的数据
  // 用于处理生命周期
  returnLifeCycleData() {
    uniqBy(this.diagramData.nodes, 'id')?.forEach((nodeItem, index) => {
      const nodeInfValue = nodeItem as unknown as {
        shape: string;
        label: string;
        id: string;
        parent: string;
        lifeCycleId: number;
        ports: any[];
      };
      /** 处理生命周期阶段的图标、body的颜色 */
      if (nodeInfValue?.shape === 'lane') {
        const x = index * 380;

        const lifeCycleIdIcon = getLifeCycleSvg(Number(nodeInfValue?.id));
        console.log('LANE_WIDTH', LANE_WIDTH, this.laneHight);
        const laneNode = this.graph.createNode({
          shape: 'lane',
          label: nodeInfValue?.label,
          x,
          width: LANE_WIDTH,
          height: this.laneHight,
          attrs: {
            body: {
              fill: LaneColors[index % LaneColors.length],
            },
            image: {
              'xlink:href': `data:image/svg+xml;utf8,${encodeURIComponent(
                lifeCycleIdIcon as string,
              )}`,
            },
          },
        });
        this.cells.push(laneNode);
        this.lanePositions[Number(nodeInfValue.id)] = { x, currentY: 130 };
        this.nodeBoundaries.push(laneNode.getBBox());
      } else {
        const lane = this.lanePositions[nodeInfValue.lifeCycleId];
        // 计算桩点数量，取输入和输出数量的最大值
        const portsCount = Math.max(
          nodeInfValue.ports?.filter(port => port.group === 'in').length || 0,
          nodeInfValue.ports?.filter(port => port.group === 'out').length || 0,
        );
        // 根据桩点数量计算节点高度，确保节点高度至少为NODE_MIN_HEIGHT
        const nodeHeight = Math.max(NODE_MIN_HEIGHT, portsCount * 20);

        /** 处理生命周期下过程节点的样式 */
        const processNode = this.graph.createNode({
          shape: 'lane-rect',
          label: nodeInfValue?.label,
          x: lane.x + (LANE_WIDTH - NODE_WIDTH) / 2,
          y: lane.currentY,
          width: NODE_WIDTH,
          height: nodeHeight,
          id: nodeInfValue?.id,
          parent: nodeInfValue?.parent,
          attrs: {
            header: {
              fill: '#fff',
            },
            'name-text': {
              text: nodeInfValue?.label,
            },
            image: {
              'xlink:href': `data:image/svg+xml;utf8,${encodeURIComponent(
                CustomLifeCycleIconSVG,
              )}`,
            },
          },
          ports: {
            groups: {
              in: {
                position: 'left',
                label: {
                  position: 'inside',
                },
                attrs: {
                  circle: {
                    r: 3,
                    magnet: true,
                    stroke: '#D2D6DA',
                    fill: '#D2D6DA',
                  },
                },
              },
              out: {
                position: 'right',
                label: {
                  position: 'inside',
                },
                attrs: {
                  circle: {
                    r: 3,
                    magnet: true,
                    stroke: '#D2D6DA',
                    fill: '#D2D6DA',
                  },
                },
              },
            },
            items: nodeInfValue.ports?.map(port => ({
              id: port?.id,
              group: port?.group,
              attrs: {
                text: {
                  text: port?.attrs?.label,
                  fill: '#6C757D',
                  fontSize: 12,
                  textWrap: {
                    width: 100,
                    height: 20,
                    ellipsis: true,
                    breakWord: true,
                  },
                },
              },
            })),
          },
        });
        this.cells.push(processNode);
        lane.currentY += nodeHeight + this.NODE_VERTICAL_GAP;
        this.nodeBoundaries.push(processNode.getBBox());
      }
    });
  }

  // createEdage
  createEdage = () => {
    this.diagramData.edges?.forEach((edge: { target: unknown }) => {
      const edgeInfo = edge.target as unknown as { cell: string; port: string };
      if (edgeInfo?.cell || edgeInfo?.port) {
        this.cells.push(
          this.graph.createEdge({
            shape: 'edge',
            ...edge,
            connector: { name: this.uniqueName },
            // router: {
            //   name: 'customRouter',
            //   args: {}, // 传递自定义路由器参数
            // },
          }),
        );
      }
    });
  };

  //  连接线高亮
  edageClick = () => {
    // 注册事件监听器
    this.graph.on('edge:click', ({ edge }: { edge: EdgeType }) => {
      // 先清除所有连接线的高亮效果
      this.graph
        .getEdges()
        .forEach(
          (e: { attr: (arg0: string, arg1: string | number) => void }) => {
            e.attr('line/stroke', '#999EA4');
            e.attr('line/strokeWidth', 1);
          },
        );

      // 设置被点击连接线的高亮效果
      edge?.attr('line/stroke', 'rgba(52, 145, 250, 1)'); // 红色高亮
      edge?.attr('line/strokeWidth', 2);
    });
  };

  edageHover = () => {
    // 注册事件监听器
    this.graph.on('edge:mouseenter', ({ edge }: { edge: EdgeType }) => {
      edge?.attr('line/stroke', 'rgba(52, 145, 250, 1)'); // 红色高亮
      edge?.attr('line/strokeWidth', 2);
      // edge?.attr('line/strokeDasharray', ''); // 实线
      // 获取边的起点和终点节点
      // const sourceNode = edge.getSourceNode();
      // const targetNode = edge.getTargetNode();
      // // 将输入节点（起点）的边框设置为橙色
      // sourceNode?.attr('body/stroke', '#FFA500'); // 橙色
      // sourceNode?.attr('body/strokeWidth', 2); // 设置边框宽度

      // // 将输出节点（终点）的边框设置为灰色
      // targetNode?.attr('body/stroke', '#808080'); // 灰色
      // targetNode?.attr('body/strokeWidth', 2); // 设置边框宽度
    });

    this.graph.on('edge:mouseleave', ({ edge }: { edge: EdgeType }) => {
      console.log(edge, 'edge-edge');
      edge?.attr('line/stroke', 'rgba(52, 145, 250, 0.56)'); // 恢复原始颜色
      edge?.attr('line/strokeWidth', 1);
      // edge?.attr('line/strokeDasharray', '5,5'); // 恢复为虚线
      // 获取边的起点和终点节点
      // const sourceNode = edge.getSourceNode();
      // const targetNode = edge.getTargetNode();

      // // 将输入节点（起点）的边框设置为橙色
      // sourceNode?.attr('body/stroke', '#FFA500'); // 橙色
      // sourceNode?.attr('body/strokeWidth', 2); // 设置边框宽度

      // // 将输出节点（终点）的边框设置为灰色
      // targetNode?.attr('body/stroke', '#808080'); // 灰色
      // targetNode?.attr('body/strokeWidth', 2); // 设置边框宽度
    });
  };

  // const;
  init() {
    this.uniqueName = `connector-${Math.random().toString(36)}`;
    this.map = new Map();
    // 生成基础 节点
    this.registerCustomNodes();
    this.returnLifeCycleData();
    this.createEdage();

    this.edageClick();
    this.edageHover();

    /** 重新设置数据 */
    this.graph.resetCells(this.cells);

    /** 画布居中 */
    this.graph.centerContent();
    //  添加监听  连接线的方法

    console.log(this.cells, 'this.cells');
  }

  disPoseFN = () => {
    this.graph.dispose();
    this.diagramData = [];
    console.log('xiaohuile');
  };

  getcells() {
    return this.cells;
  }
}

export default newGraph;
