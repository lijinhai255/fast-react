/*
 * @@description: 添加、编辑、查看
 */

import { Descriptions } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { checkAuth } from '@/layout/utills';
import { getAccountsystemUserBehaviorId } from '@/sdks_v2/new/accountsystemV2ApiDocs';

import style from './index.module.less';
import { PictureUpload } from '../../components/PictureUpload';
import { RevokeModel } from '../model';

const OrgInfo = () => {
  const { id } = useParams<{
    id: string;
  }>();
  // 控制弹窗 显隐
  const [visable, changeVisAble] = useState(false);
  // 弹窗表单赋值
  const [initValue, changeInitValue] = useState({});
  const [data, setData] = useState<any>();
  // 撤销
  const onRevoke = () => {
    changeInitValue({ ...data });
    changeVisAble(true);
  };

  /** 产品详情 */
  useEffect(() => {
    getAccountsystemUserBehaviorId({ id: Number(id) }).then(({ data }) => {
      const result = data?.data;
      setData(result);
    });
  }, [id]);

  return (
    <div className={style.wrapper}>
      <Descriptions bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label='姓名'>
          {data?.realName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='手机号'>
          {data?.mobile || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='活动数据'>
          {data?.changeValue || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='活动数据单位'>
          {data?.sceneUnitName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='低碳场景'>
          {data?.sceneName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='完成时间'>
          {data?.behaviorTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='积分状态'>
          {data?.behaviorStatus_name || '-'}
          {checkAuth(
            '/carbonAccount/activityDataRecord/revoke',
            data?.behaviorStatus !== 1 && (
              <span className={style.revoke} onClick={onRevoke}>
                撤销
              </span>
            ),
          )}
        </Descriptions.Item>
        <Descriptions.Item label='用户ID'>
          {data?.userNumber || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='撤销原因'>
          {data?.cancelMsg || '-'}
        </Descriptions.Item>
        <Descriptions.Item label='上传图片'>
          {data?.imgPath ? (
            <PictureUpload
              disabled
              maxCount={1}
              maxSize={1 * 1024 * 1024}
              fileType={[
                'png',
                'PNG',
                'jpg',
                'JPG',
                'jpeg',
                'JPEG',
                'gif',
                'GIF',
              ]}
              fileList={[
                {
                  uid: data?.imgPath,
                  name: data?.imgPath,
                  url: data?.imgPath,
                  suffix: '',
                },
              ]}
              changeImageChange={() => {}}
            />
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
      <RevokeModel
        status='ADD'
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          history.back();
        }}
        initValue={initValue}
      />
    </div>
  );
};

export default OrgInfo;
