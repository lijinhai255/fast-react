class Calculator {
  [x: string]: any;

  nodeData: any;

  siwmeData: any;

  // 构造函数
  constructor(data?: any, isInit = true) {
    this.data = data;
    this.siwmeData = [];
    this.nodeData = {};
    this.siwmeDataObj = {};
    this.isInit = isInit;
    this.siwmeDataConfig = {
      width: 500,
      height: 800,
    };
    this.nodeDataConfig = {
      width: 400,
      height: 150,
    };
    this.init();
  }

  init() {
    if (this.isInit) {
      this.getsiwme();
      this.handleDiagramData();
    }
  }

  // 生成泳道图的方法
  createSiwmeFn(item: { lifeCycleId: any; lifeCycle: any }) {
    return {
      id: item.lifeCycleId,
      shape: 'lane',
      ...this.siwmeDataConfig,
      position: {
        x: 600,
        y: 10,
      },
      label: item.lifeCycle,
    };
  }

  // 计算泳道图的位置
  culSiwmePosition(item: any, index: number) {
    const x = this.siwmeDataConfig.width * index;
    return {
      x,
      y: 10,
    };
  }

  // 处理泳道图的方法
  getsiwme() {
    const siwmeData: any[] = [];
    this.data?.nodes.forEach((item: { lifeCycleId: any; lifeCycle: any }) => {
      if (
        siwmeData.length === 0 ||
        siwmeData.some(siwmeItem => siwmeItem.id !== item.lifeCycleId)
      ) {
        siwmeData.push(this.createSiwmeFn(item));
      }
    });
    // 处理泳道图的 距离
    const newsiwmeData = siwmeData.map((item, index) => {
      const positioObj = this.culSiwmePosition(item, index);
      return {
        ...item,
        position: { ...positioObj },
      };
    });
    this.siwmeData = newsiwmeData;
  }

  /** 处理过程结构图链接桩数据 */
  // eslint-disable-next-line class-methods-use-this
  handleDiagramPorts(ports: any[]) {
    if (ports && ports.length) {
      return ports.map(item => {
        const { attrs } = item;
        return {
          ...item,
          attrs: {
            label: attrs?.label,
            text: {
              text: attrs?.label,
            },
          },
        };
      });
    }
    return [];
  }

  // 处理 处理过程结构图数据
  handleDiagramData() {
    const { nodes = [], edges = [] } = this.data;
    const newNodes = nodes?.map(
      (node: { lifeCycleId: any; lifeCycle: any; ports: any }) => {
        const { ports } = node;
        if (ports && ports.length) {
          node.ports = this.handleDiagramPorts(ports);
        }
        return {
          ...node,
        };
      },
    );
    const handledDiagramData = {
      nodes: [...newNodes],
      edges,
    } as unknown as any;
    // return handledDiagramData;
    this.nodeData = handledDiagramData;
  }

  culNodePosition() {
    const keyArr = Object.keys(this.siwmeDataObj);
    keyArr.forEach(key => {
      const newNodeArr: any[] = [];
      // 获取泳道元素
      const currentSiwmeData = this.siwmeData.filter(
        (item: { id: string }) => +item.id === +key,
      );
      this.siwmeDataObj[key].forEach((item: { id: any }, index: number) => {
        const newItem = {
          ...item,
          ...this.nodeDataConfig,
          position: {
            x:
              currentSiwmeData[0].position.x +
              this.siwmeDataConfig.width / 2 -
              this.nodeDataConfig.width / 2,
            y:
              (this.siwmeDataConfig.height /
                this.siwmeDataObj[key].length /
                2) *
              (index + 1),
          },
        };
        newNodeArr.push(newItem);
      });
      this.siwmeDataObj[key] = newNodeArr;
    });
    this.nodeData = {
      ...this.nodeData,
      nodes: Object.values(this.siwmeDataObj).flat(),
    };
  }

  // 根据泳道图数据和过程结构数据 生成 过程结构数据 位置
  getCulNodePosition() {
    const { nodes } = this.nodeData;
    // 添加父级元素
    const nodeWithParentIdData = nodes.map((node: { lifeCycleId: any }) => {
      return {
        ...node,
        parent: node.lifeCycleId,
      };
    });
    this.nodeData = {
      ...this.nodeData,
      nodes: [...nodeWithParentIdData],
    };
    const siwmeDataObj: { [key: string]: any } = {};
    // 根据父级元素 确实 位置  遍历泳道图 假设 泳道图 第一泳道 把节点 parentId 是1 的挑出来  然后根据泳道图的位置 给节点添加位置
    this.siwmeData.forEach((siwmeObj: any) => {
      // 挑出parentId 是1 的节点
      const nodeArr = this.nodeData.nodes.filter((node: { parent: any }) => {
        return +node.parent === +siwmeObj.id;
      });
      siwmeDataObj[siwmeObj.id] = [...nodeArr];
    });
    this.siwmeDataObj = siwmeDataObj;
    this.culNodePosition();
  }

  // 生成对象的方法
  generateIdParentMap() {
    const idParentMap: { [key: string]: any } = {};
    this.nodeData.nodes.forEach(
      (item: { id: string | number; parent: any }) => {
        idParentMap[item.id] = item.parent;
      },
    );
    return idParentMap;
  }

  culResourceTargetNodePosition(item: any, targetId: string) {
    const targetNode = this.nodeData.nodes.find(
      (node: { id: string }) => node.id === targetId,
    );
    if (
      targetNode?.position?.y !== undefined &&
      item?.position?.x !== undefined
    ) {
      return {
        x: item.position.x,
        y: targetNode.position.y - this.nodeDataConfig.height * 1,
      };
    }
    return null;
  }

  // 资源节点 目标节点
  culResourceTargetNode(sourceId: string, targetId: string) {
    const nodeArr = this.nodeData.nodes.map((item: { id: string }) => {
      if (item.id === sourceId) {
        return {
          ...item,
          position: this.culResourceTargetNodePosition(item, targetId),
        };
      }
      return {
        ...item,
      };
    });
    this.nodeData = {
      ...this.nodeData,
      nodes: [...nodeArr],
    };
  }

  // 计算输出的端点 链接输入的端点
  culPortPosition() {
    this.getCulNodePosition();
    const idParentMap = this.generateIdParentMap();
    // const nodeMap = nodeArr.reduce((acc, cur) => {
    this.nodeData.edges.forEach((edge: { source: any; target: any }) => {
      const { source, target } = edge;
      if (idParentMap[source.cell] - idParentMap[target.cell] >= 0) {
        console.log('表示当前节点 向后链接', edge);
        this.culResourceTargetNode(source.cell, target.cell);
      }
    });
  }

  // 传递方法
  getData() {
    this.culPortPosition();
    return {
      ...this.nodeData,
      nodes: [...this.siwmeData, ...this.nodeData.nodes],
    };
  }

  //  获取基础数据
  getBasicData() {
    return {
      siwmeDataConfig: this.siwmeDataConfig,
      nodeDataConfig: this.nodeDataConfig,
    };
  }
}

export default Calculator;
