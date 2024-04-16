/*
 * @@description: 排行榜入口页
 */

import icon_PR_total from '@src/image/carbonAccount/icon-个人减排:总榜.svg';
import icon_PR_day from '@src/image/carbonAccount/icon-个人减排:日榜.svg';
import icon_PS_total from '@src/image/carbonAccount/icon-个人积分:总榜.svg';
import icon_PS_day from '@src/image/carbonAccount/icon-个人积分:日榜.svg';
import icon_P_honor from '@src/image/carbonAccount/icon-个人荣誉.svg';
import icon_TR_total from '@src/image/carbonAccount/icon-团队减排:总榜.svg';
import icon_TR_day from '@src/image/carbonAccount/icon-团队减排:日榜.svg';
import icon_TS_total from '@src/image/carbonAccount/icon-团队积分:总榜.svg';
import icon_TS_day from '@src/image/carbonAccount/icon-团队积分:日榜.svg';
import icon_T_honor from '@src/image/carbonAccount/icon-团队荣誉.svg';
import { useNavigate } from 'react-router-dom';
import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { CaRouteMaps } from '@/router/utils/caEmums';
import { virtualLinkTransform } from '@/router/utils/enums';

import style from './index.module.less';
import { PANELDATAProps } from '../util/type';

const PANELDATA: PANELDATAProps[] = [
  {
    title: '个人积分榜',
    type: '总榜',
    src: icon_PS_total,
    honor: icon_P_honor,
  },
  {
    title: '个人积分榜',
    type: '日榜',
    src: icon_PS_day,
    honor: icon_P_honor,
  },
  {
    title: '个人减排榜',
    type: '总榜',
    src: icon_PR_total,
    honor: icon_P_honor,
  },
  {
    title: '个人减排榜',
    type: '日榜',
    src: icon_PR_day,
    honor: icon_P_honor,
  },
  {
    title: '团队积分榜',
    type: '总榜',
    src: icon_TS_total,
    honor: icon_T_honor,
  },
  {
    title: '团队积分榜',
    type: '日榜',
    src: icon_TS_day,
    honor: icon_T_honor,
  },
  {
    title: '团队减排榜',
    type: '总榜',
    src: icon_TR_total,
    honor: icon_T_honor,
  },
  {
    title: '团队减排榜',
    type: '日榜',
    src: icon_TR_day,
    honor: icon_T_honor,
  },
];
const PanelList = () => {
  const navigate = useNavigate();

  const cList = (item: PANELDATAProps) => {
    navigate(
      virtualLinkTransform(
        CaRouteMaps.rankList,
        [':title', ':type'],
        [item.title, item.type],
      ),
    );
  };

  return (
    <Page title='排行榜' wrapperClass={style.panel_page}>
      <div className={style.panel_list}>
        {PANELDATA.map(item => (
          <div
            className={style.list}
            key={item.src}
            onClick={() => cList(item)}
          >
            <div className={style.list_title}>{item.title}</div>
            <div className={style.list_content}>
              <img src={item.src} alt={item.src} className={style.list_img} />
              <span className={style.list_type}>{item.type}</span>
              <img
                src={item.honor}
                alt={item.honor}
                className={style.list_honor}
              />
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default withTable(PanelList);
