import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Image } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { data } from './data';

const { Dragger } = Upload;

const App: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [resultData, setResultData] = useState(data);
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  // console.log(data, 'data-data');
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status, originFileObj } = info.file;

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }

      if (originFileObj && originFileObj.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(originFileObj);
        reader.onload = () => {
          // @ts-ignore
          setBaseUrl(reader.result);
          // @ts-ignore
          localStorage.setItem('baseUrl', reader.result);
          // 这里可以将 reader.result 发送到服务器或者存储在状态中
        };
        reader.onerror = error => {
          console.error('Error converting image to base64:', error);
        };
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const requestPostFn = (
    url: any,
    bodys: any,
    headers: AxiosRequestConfig<any> | undefined,
  ) => {
    axios
      .post(url, bodys, headers)
      .then(({ data }) => {
        console.log(data);
        setResultData(data.data);
      })
      .catch(function (error) {
        console.log(error, 'error-error');
      });
  };
  useEffect(() => {
    const AK = '7baba8a6d9914cfeb50113dcc0f0905e';
    const SK = '29d3dd8780fd4ca5a651d7b0cf47bd26';
    const URL = 'https://aiopen.zhongzaiyuntu.com/rest/v1/hard_number';

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${AK}:${SK}`,
      },
    };
    const bodys = {
      images: [baseUrl],
    };
    if (!baseUrl) return;
    requestPostFn(URL, bodys, headers);
  }, [baseUrl]);
  const url = localStorage.getItem('baseUrl');
  // 结果
  const svgImage = () => {
    const img = document.getElementById('img');
    const svg = document.getElementById('svg');
    console.log(img, 'img');
    svg && svg.setAttribute('viewBox', `0 0 ${300} ${300}`);
  };
  const renderPolygonFn = info => {
    // 创建用来包裹多边形的容器
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // 创建多边形元素
    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    );
    // 创建鼠标悬停时提示信息的元素
    const title = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'title',
    );
    const { point, width, height } = info.location;
    const points = [
      // 左上角
      [point.x, point.y],
      // 右上角
      [point.x + width, point.y],
      // 右下角
      [point.x + width, point.y + height],
      // 左下角
      [point.x, point.y + height],
    ];
    // 设置多边形绘制路径点
    polygon.setAttribute('points', points.map(p => p.join(',')).join(' '));
    // 设置多边形填充颜色
    polygon.setAttribute('fill', '#ff000080');
    // 设置多边形边框颜色
    polygon.setAttribute('stroke', '#ff0000');
    // 设置多边形边框厚度
    polygon.setAttribute('stroke-width', '1');
    // 设置
    polygon.setAttribute('title', info.score);
    // 设置鼠标悬停时的提示信息
    title.innerHTML = info.score;
    // 将三个元素添加到 svg 中
    g.appendChild(title);
    g.appendChild(polygon);
    svg.appendChild(g);
  };
  useEffect(() => {
    svgImage();
    resultData.forEach(item => {
      item.result.forEach(info => {
        renderPolygonFn(info);
      });
    });
  }, [resultData]);
  return (
    <div>
      <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <div
        id='container'
        style={{ display: 'inline-block', position: 'relative' }}
      >
        <img
          ref={imgRef}
          style={{ width: '300px', height: '300px' }}
          id='img'
          src={url || baseUrl}
        />
        <svg
          ref={svgRef}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          id='svg'
        />
      </div>
    </div>
  );
};

export default App;
