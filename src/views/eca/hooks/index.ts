/*
 * @@description: 企业碳核算 需要的Options
 */
import { useEffect, useState } from 'react';

import {
  EnumResp,
  getComputationLibGwpList,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import {
  OrgPojo,
  Tree,
  getSystemLibAddressTree,
  getSystemOrgUserList,
} from '@/sdks/systemV2ApiDocs';
import {
  EmissionSource,
  getComputationDataSourceDetail,
  getComputationEmissionSourceId,
} from '@/sdks_v2/new/computationV2ApiDocs';

export interface EnumOptionResp {
  value?: number;
  label?: string;
  score?: number;
  children?: EnumOptionResp[];
}

export const getEnumOption = (
  arr: EnumResp[],
  newArr: EnumOptionResp[] = [],
) => {
  arr?.forEach(item => {
    newArr.push({
      label: item?.name || '',
      value: item?.code || 0,
      score: Number(item?.score) || 0,
      children: item?.subList ? getEnumOption(item?.subList) : undefined,
    });
  });
  return newArr;
};
/** 获取用户下的所有组织 */
export const UseOrgs = () => {
  const [orgs, setOrgs] = useState<OrgPojo[]>([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getSystemOrgUserList({
      likeOrgName: '',
    }).then(({ data }) => {
      setOrgs(data?.data || []);
    });
  }, []);
  return orgs;
};
/**
 * 减排场景 单位枚举值
 * **/
export const ReturnEmissionReductionScenarioOPtion = () => {
  const [option, getOPtion] = useState<{ label: string; value: number }[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName: 'ReductionUnit',
    }).then(({ data }) => {
      if (data.code === 200) {
        const newArr = data?.data?.map(item => {
          return {
            label: item?.name || '',
            value: item?.code || 0,
          };
        });
        getOPtion([...(newArr || [])]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 获取枚举值
export const ComputationEnums = (enumName: string) => {
  const [option, getOPtion] = useState<EnumOptionResp[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName,
    }).then(({ data }) => {
      if (data.code === 200) {
        const newArr = getEnumOption(data?.data || []);
        getOPtion([...newArr]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 多层级枚举值
export const FistComputationEnums = (enumName: string) => {
  const [option, getOPtion] = useState<EnumResp[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName,
    }).then(({ data }) => {
      if (data.code === 200) {
        getOPtion([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 获取审核状态
export const apiGetOrgListFn = async (enumName: string) => {
  return getComputationEnumsEnumName({
    enumName,
  }).then(({ data }) => {
    if (data.code === 200) {
      const newArr = data?.data?.map(item => {
        return {
          label: item?.name || '',
          value: item?.code || 0,
          score: item?.score || 0,
        };
      });
      return newArr;
    }
    return [];
  });
};

// 获取地址树

export const AddressTree = () => {
  const [option, getOPtion] = useState<Tree[]>([]);
  const Fn = async () => {
    await getSystemLibAddressTree({ level: 3 }).then(({ data }) => {
      if (data.code === 200) {
        getOPtion([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    Fn();
  }, []);
  return option;
};
// 获取GWP
export const useGwpOption = () => {
  const [option, setOption] = useState<{ [key: string | number]: number }>({});
  const getGwpOptionFn = async () => {
    await getComputationLibGwpList({ level: 3 }).then(({ data }) => {
      if (data.code === 200) {
        const newObj: { [key: string | number]: number } = {};
        data.data?.forEach(item => {
          newObj[item?.gas || 0] = item?.gwpValue || 0;
        });
        setOption({ ...newObj });
      }
    });
  };
  useEffect(() => {
    getGwpOptionFn();
  }, []);
  return option;
};

/**
 * 设置排放源详情
 * @param emissionSourceId 排放源ID
 * @returns
 */
export const useSetEmissionSourceInfo = (emissionSourceId?: number) => {
  const [info, setInfo] = useState<EmissionSource>();
  useEffect(() => {
    if (emissionSourceId) {
      getComputationEmissionSourceId({
        id: emissionSourceId,
      }).then(({ data }) => {
        setInfo(data?.data);
      });
    }
  }, [emissionSourceId]);
  return info;
};
/**
 * 排放源详情带有活动数据
 * @param computationDataId 排放源数据Id
 * @param emissionSourceId 排放源id
 * @returns
 */
export const useSetEmissionDetailWithActivityData = (
  computationDataId?: number,
  emissionSourceId?: number,
) => {
  const [info, setInfo] = useState<EmissionSource>();
  useEffect(() => {
    if (computationDataId && emissionSourceId) {
      getComputationDataSourceDetail({
        computationDataId,
        emissionSourceId,
      }).then(({ data }) => {
        setInfo(data.data);
      });
    }
  }, [computationDataId, emissionSourceId]);
  return info;
};
