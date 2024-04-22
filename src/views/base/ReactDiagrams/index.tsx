import { CanvasWidget } from '@projectstorm/react-canvas-core';
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  DefaultLinkModel,
} from '@projectstorm/react-diagrams';
import React from 'react';

const SimpleDiagram = () => {
  // 创建引擎
  const engine = createEngine();

  // 设置模型
  const model = new DiagramModel();

  // 创建第一个节点
  const node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
  node1.setPosition(100, 100);
  // 添加一个名为'out'的输出端口
  const port1 = node1.addPort(new DefaultPortModel(false, 'out', 'Out'));

  // 创建第二个节点
  const node2 = new DefaultNodeModel('Node 2', 'rgb(0,192,255)');
  node2.setPosition(400, 100);
  // 添加一个名为'in'的输入端口
  const port2 = node2.addPort(new DefaultPortModel(true, 'in', 'In'));

  // 创建链接并设置端口
  const link = new DefaultLinkModel();
  link.setSourcePort(port1);
  link.setTargetPort(port2);

  // 添加节点和链接到模型
  model.addAll(node1, node2, link);

  // 加载模型到引擎
  engine.setModel(model);

  // 渲染图表
  return <CanvasWidget engine={engine} className='diagram-container' />;
};

export default SimpleDiagram;
