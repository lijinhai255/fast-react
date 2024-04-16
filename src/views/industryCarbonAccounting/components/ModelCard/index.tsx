/**
 * @description 模型卡片
 */

import { Col, Row, Typography } from 'antd';
import classNames from 'classnames';

import { IconFont } from '@/components/IconFont';
import { enterpriseBusinessModel } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import ModelIcon from './icon-model.svg';
import style from './index.module.less';

const { Text, Paragraph } = Typography;

const ModelCard = ({
  currentSelectedCard,
  dataSource,
  onSelect,
}: {
  currentSelectedCard?: number;
  dataSource?: enterpriseBusinessModel[];
  onSelect: (data?: enterpriseBusinessModel) => void;
}) => {
  return (
    <div className={style.wrapper}>
      <Row gutter={[16, 16]}>
        {dataSource?.map(item => {
          const { id, businessName, businessInfo } = item || {};
          return (
            <Col key={id} span={6}>
              <div
                className={classNames(style.contentWrapper, {
                  [style.selected]: id === currentSelectedCard,
                })}
                onClick={() => {
                  onSelect(item);
                }}
              >
                <div className={style.headerSection}>
                  <img className={style.tagIcon} src={ModelIcon} alt='' />
                  <Text className={style.title} ellipsis={{ tooltip: false }}>
                    {businessName}
                  </Text>
                  <IconFont
                    className={style.selectIcon}
                    icon='icon-icon-xuanzhong'
                  />
                </div>
                <div className={style.contentSection}>
                  <Paragraph ellipsis={{ rows: 5 }} className={style.content}>
                    {businessInfo}
                  </Paragraph>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default ModelCard;
