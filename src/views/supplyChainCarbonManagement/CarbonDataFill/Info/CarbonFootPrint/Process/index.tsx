/*
 * @@description:  供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹-核算过程
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Modal, Table } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { compact, differenceWith, isEqual, uniqBy } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  FootprintBase,
  getSupplychainDataFillFootprintApplyInfoId,
  getSupplychainDataProcessFootprintApplyInfoId,
  postSupplychainDataProcessFootprintSave,
  postSupplychainDataProcessFootprintSaveAndSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, changeTableColumsNoText, modalText, updateUrl } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';
import Report from '@/views/supplyChainCarbonManagement/components/Report';
import { onUploadFileFn } from '@/views/supplyChainCarbonManagement/utils';
import {
  CarbonDataPropsType,
  TypeFootprintResult,
} from '@/views/supplyChainCarbonManagement/utils/type';

import { columns } from './utils/columns';
import { schema } from './utils/schemas';
import { getAuditConfig } from '../../../service';
import style from '../Result/index.module.less';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

function Process({ cathRecord }: CarbonDataPropsType) {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 表格加载 */
  const [loading, changeLoading] = useState(false);

  /** 产品碳足迹核算果过程列表 */
  const [footprintProcessList, setFootprintProcessList] =
    useState<FootprintBase[]>();

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 详情获取的文件列表 */
  const [fileListDetail, setFileListDetail] = useState<FileListType[]>([]);

  /** 删除的文件列表 */
  const [delFileList, setDelFileList] = useState<FileListType[]>([]);

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 获取产品名称、核算单位、规格/型号 */
  useEffect(() => {
    if (cathRecord) {
      form.setValues({
        ...cathRecord,
      });
    }
  }, [cathRecord]);

  /** 获取产品碳足迹过程列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainDataProcessFootprintApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setFootprintProcessList(data.data ? [data.data] : []);
          changeLoading(false);
        }
      });
    }
  }, [id]);

  /** 获取报告 */
  useEffect(() => {
    if (id && !isAdd) {
      getSupplychainDataFillFootprintApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data.data as TypeFootprintResult;
          const report = JSON.parse(result.report || '[]');
          setFileList(report);
          setFileListDetail(report);
        }
      });
    }
  }, [id, pageTypeInfo]);

  /** 文件上传 */
  const changeFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newArr: FileListType[] = [];
    info.fileList.forEach(item => {
      if (item.status === 'done' && item.originFileObj) {
        if (item.response?.code === 200) {
          const nameArr = item.name.split('.');
          newArr.push({
            suffix: nameArr[nameArr.length - 1],
            name: item.name,
            url: item.response.data.url,
            uid: item.uid,
          });
        }
      }
    });
    const allList = [
      ...uniqBy([...newArr, ...fileListDetail, ...delFileList], 'uid'),
    ];

    setFileList([
      ...differenceWith(allList, delFileList, isEqual),
    ] as FileListType[]);
  };

  /** 文件删除 */
  const onRemoveList = (item: FileListType) => {
    const arr = fileList.filter(v => v.uid !== item.uid);
    setDelFileList([...delFileList, item]);
    setFileList([...arr]);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.content_buttonWrapper}>
          <h4>产品碳足迹核算过程</h4>
          {!isDetail && (
            <Button
              type='primary'
              onClick={() => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoProductSelect,
                    [PAGE_TYPE_VAR, ':id', ':pageType'],
                    [pageTypeInfo, id, 'processSelect'],
                  ),
                );
                updateUrl({ likeProductionName: cathRecord?.productName });
              }}
            >
              选择核算产品
            </Button>
          )}
        </div>

        <div className={style.content_main}>
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={schema()} />
          </Form>
          <Table
            loading={loading}
            columns={changeTableColumsNoText(
              columns({ pageTypeInfo, id, navigate }),
              '-',
            )}
            scroll={{ x: 1600 }}
            dataSource={footprintProcessList}
            pagination={false}
          />
        </div>
      </div>
      <div className={style.content}>
        <h4>产品碳足迹报告</h4>
        {!isDetail && (
          <p>
            支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M
          </p>
        )}
        <Report
          fileList={fileList}
          fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
          maxCount={10}
          maxSize={10 * 1024 * 1024}
          errorTip='文件大小不能超过10M'
          disabled={isDetail}
          changeFileChange={changeFileChange}
          removeList={onRemoveList}
        />
      </div>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存并提交',
            type: 'primary',
            onClick: async () => {
              if (!footprintProcessList || footprintProcessList.length === 0) {
                Toast('error', '请选择核算产品');
                return;
              }
              const { data } = await getAuditConfig({
                applyInfoId: Number(id),
              });

              const { auditRequired, nodeList } = data?.data || {};

              Modal.confirm({
                title: '提示',
                icon: '',
                content:
                  /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                  auditRequired === NOT_REQUIRED ? (
                    <span>
                      确认提交该数据：
                      <span className={modalText}>
                        {cathRecord?.productName}: 产品碳核算过程？
                      </span>
                    </span>
                  ) : (
                    <AuditConfigTable dataSource={nodeList} />
                  ),
                ...modelFooterBtnStyle,
                onOk: () => {
                  postSupplychainDataProcessFootprintSaveAndSubmit({
                    req: { applyInfoId: Number(id) },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      onUploadFileFn(Number(id), JSON.stringify(fileList));
                      Toast('success', '已提交，请等待客户反馈');
                      history.back();
                    }
                  });
                },
              });
            },
          },
          !isDetail && {
            title: '保存',
            onClick: async () => {
              if (!footprintProcessList || footprintProcessList.length === 0) {
                Toast('error', '请选择核算产品');
                return;
              }
              postSupplychainDataProcessFootprintSave({
                req: { applyInfoId: Number(id) },
              }).then(({ data }) => {
                if (data.code === 200) {
                  onUploadFileFn(Number(id), JSON.stringify(fileList));
                  Toast('success', '保存成功');
                  history.back();
                }
              });
            },
          },
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default Process;
