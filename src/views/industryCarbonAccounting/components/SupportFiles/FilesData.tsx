/**
 * @description 支撑材料类型的排放数据列表文件展示
 */
import { Col, Modal, Row, Typography, Tag } from 'antd';

import { IconFont } from '@/components/IconFont';
import {
  postEnterprisesystemSysSupportFileDelete,
  SysSupportFile,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';

import style from './index.module.less';

const { Text } = Typography;

export const FilesData = ({
  isViewMode,
  fileList,
  onRemove,
}: {
  /** 是否为查看模式 */
  isViewMode: boolean;
  /** 文件列表 */
  fileList?: SysSupportFile[];
  /** 删除文件的方法 */
  onRemove: (data?: SysSupportFile) => void;
}) => {
  return (
    <Row gutter={8} className={style.fileDataWrapper}>
      {fileList?.map(item => {
        const { id, fileName } = item || {};
        const nameArr = fileName?.split('.');
        const suffix = nameArr?.[nameArr.length - 1] || '';
        const name = fileName?.slice(0, fileName.length - suffix.length);
        return (
          <Col key={id} span={12}>
            <Tag
              className={style.fileItemWrapper}
              closable={!isViewMode}
              closeIcon={
                <IconFont
                  className={style.removeIcon}
                  icon='icon-icon-guanbi'
                />
              }
              onClose={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: '确认删除该文件？',
                  ...modelFooterBtnStyle,
                  onOk: async () => {
                    if (id) {
                      await postEnterprisesystemSysSupportFileDelete({
                        req: item,
                      });
                      onRemove();
                    }
                  },
                });
              }}
            >
              <a
                className={style.nameWrapper}
                href={item.fileUrl}
                target='_blank'
                rel='noreferrer'
              >
                <Text className={style.name} ellipsis={{ suffix }}>
                  {name}
                </Text>
              </a>
            </Tag>
          </Col>
        );
      })}
    </Row>
  );
};
