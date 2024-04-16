/*
 * @@description:
 */
import { message } from 'antd';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { MessageInstance } from 'antd/lib/message';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';

export type JointContent = MessageInstance['info'] extends (
  arg: infer T,
  ...a: any
) => any
  ? T
  : never;

export const Toast = (
  type: 'success' | 'error',
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction,
) => {
  message[type](content, duration, onClose);
};
/**
 * @description column ellipsis
 */
export const addEllipsisToColumn = <T>(
  columns: ColumnType<T>[],
  dealFn?: (c: ColumnType<T>) => boolean,
): ColumnType<T>[] =>
  columns.map(c => ({ ...c, ellipsis: dealFn?.(c) ?? true }));

const keyStr = 'g98uezzumgv2wsbs';
const AESKey = CryptoJS.enc.Utf8.parse(keyStr);
const AESOptions = {
  mode: CryptoJS.mode.CBC,
  iv: CryptoJS.enc.Utf8.parse('qwe1231231231231'),
  padding: CryptoJS.pad.Pkcs7,
};

/**
 * @description 数据加密 aes
 * 接口数据加密后 key 统一为 requestData
 */
export const encrypt = (msg: string): string => {
  const srcs = CryptoJS.enc.Utf8.parse(msg);
  const result = CryptoJS.AES.encrypt(srcs, AESKey, AESOptions);
  const base64 = CryptoJS.enc.Base64;
  return result.ciphertext.toString(base64);
};

/**
 * @description 解密
 */
export const deCrypt = <T = string>(msg: string): T => {
  const de = CryptoJS.AES.decrypt(msg, AESKey, AESOptions);

  // eslint-disable-next-line
  // @ts-ignore
  return CryptoJS.enc.Utf8.stringify(de);
};

/** 获取URL中的search字段 */
export const getSearchParams = <SearchParams = Record<string, string>>() => {
  const search = new URLSearchParams(window.location.search);
  const result = Object.fromEntries(search.entries()) as SearchParams;

  return [result, search] as const;
};
/**
 *
 * @param obj search 参数
 * @param keepOldSearch  是否保留原有的search字段 default FALSE 不保留
 */
export function updateUrl(obj?: Record<string, any>, keepOldSearch?: boolean) {
  const { search, pathname, hash } = window.location;
  let searchObj = new URLSearchParams(search);
  // 默认保留原有的search
  if (!obj || !keepOldSearch) searchObj = new URLSearchParams();
  Object.keys(obj || {}).forEach(key => {
    const value = obj?.[key] || '';
    if (typeof value === 'string' || typeof value === 'number')
      searchObj.set(key, `${value}`);
    else searchObj.set(key, JSON.stringify(value));
  });

  const searchStr = searchObj.toString() ? `?${searchObj.toString()}` : '';
  const newUrl = pathname + searchStr + hash;
  // 向当前url添加参数，没有历史记录
  window.history.replaceState(
    Object.fromEntries(searchObj.entries()),
    '',
    newUrl,
  );
}

/**
 * // fixme 这里类型有问题
 * 将表单字段值改为安全值
 * remove null NaN
 * @param val (object | 基础类型 「不对 array 做处理」) 表单数据
 */
export const keepFormValueSafe = <SafeVal = any>(
  val: any,
  safeVal?: any,
): SafeVal => {
  const usedSafeVal = safeVal || undefined;
  // 空值处理
  if ([NaN, null].includes(val)) return usedSafeVal as SafeVal;
  // object 空值处理
  const res = {} as SafeVal;
  if (typeof val === 'object') {
    Object.keys(val).forEach(key => {
      // @ts-ignore
      res[key] = keepFormValueSafe(val[key], usedSafeVal);
    });

    return res;
  }
  return val as SafeVal;
};

export const chineseNumber = {
  small: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  upper: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
};

export const chineseNumberUnit = {
  small: [
    '亿',
    '万',
    '千',
    '百',
    '十',
    '亿',
    '万',
    '千',
    '百',
    '十',
    '万',
    '千',
    '百',
    '十',
    '',
  ].reverse(),
  upper: [
    '亿',
    '万',
    '仟',
    '佰',
    '拾',
    '亿',
    '万',
    '仟',
    '佰',
    '拾',
    '万',
    '仟',
    '佰',
    '拾',
    '',
  ].reverse(),
};

/**
 * 将正整数转为中文大写
 * max 万亿，过大返回 ''
 */
export function convertToChineseUpper(
  num: number,
  options?: { type?: 'small' | 'upper' },
) {
  let upperNum = '';
  const inputNumberStr = num.toString().split('').reverse();
  if (inputNumberStr.length >= 15) return '';

  const upperUnit = chineseNumberUnit[options?.type || 'small'];
  const upperDigit = chineseNumber[options?.type || 'small'];

  for (let i = 0; i < inputNumberStr.length; i++) {
    upperNum += upperUnit[i] + upperDigit[Number(inputNumberStr[i])];
  }
  return upperNum.split('').reverse().join('');
}

// js 随机生成 字符串+时间戳
export const randomString = () => {
  return `${dayjs().get('year')}${dayjs().get('M') + 1}${dayjs().get(
    'D',
  )}${dayjs().get('h')}${dayjs().get('minute')}${dayjs().get('s')}${dayjs().get(
    'millisecond',
  )}`;
};

/** 移除对象中的 空值 '' null undefined  */
export const shakingObj = <T = Record<string, any>, Result = Required<T>>(
  obj: T,
): Result => {
  const o = {} as Result;
  // @ts-ignore
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    if (obj[key] || typeof obj[key] === 'boolean' || obj[key] === 0)
      // @ts-ignore
      o[key] = obj[key];
  });
  return o;
};

export const returnNoIconModalStyle = {
  className: 'modal_del',
  centered: true,
  closable: true,
} as const;
export const returnDelModalStyle = {
  okType: 'default',
  okButtonProps: {
    style: { background: '#ED5555', color: '#fff' },
  },
  closable: true,
  okText: '确认',
  cancelText: '取消',
} as const;

export const modalText = 'modal_text' as const;
export const listShowMobile = 'list_showMobile' as const;

/** 弹窗底部按钮样式 */
export const modelFooterBtnStyle = {
  ...returnDelModalStyle,
  ...returnNoIconModalStyle,
  okButtonProps: {
    style: {
      background: '#0CBF9F',
      color: '#fff',
    },
  },
};

// 开启定时任务
export const useInterval = (callback: () => void, delay?: number | null) => {
  const savedCallback = useRef(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
};
//

/** 年份 默认1990-今年 */
export const getYear = (start?: number, end?: number) => {
  const startT = start ?? 1990;
  const endT = end ?? new Date().getFullYear();
  let result = [startT];
  while (result[result.length - 1] < endT) {
    result = result.concat(result[result.length - 1] + 1);
  }
  return result.reverse();
};

/**
 * 表格 --- 如果返回值为空则设置文本表格显示对应传递过来的newText
 * @param val 当前返回的替换内容
 * @param newText 显示替换的文本内容
 */
export const noValueBackText = (
  val: string | number,
  newText: string,
): string => {
  if (val || val === 0) {
    return `${val}`;
  }
  return newText || '-';
};
/**
 * 处理表格中没有render，并且没有数据的时候的展示
 * @param columns 当前的表头
 * @param text 传入为空的文案,默认是'-'
 * @returns 返回最新的表头
 */
export const changeTableColumnsNoText = <T>(
  columns: {
    children?: ColumnsType & { children?: ColumnsType[]; title: string }[];
    render?: () => JSX.Element;
  } & ColumnsType<T>,
  text: string,
) => {
  return columns.map(colum => {
    if (colum.title === '操作') {
      colum!.fixed = 'right';
    }
    if (!colum.render) {
      colum.render = (value: string | number) => {
        return noValueBackText(value, text || '-');
      };
    }
    colum!.ellipsis = true;
    return colum;
  });
};

/**
 * 根据图片后缀获取对应的icon
 * @param suffix
 * @returns
 */
export const getSuffix = (suffix: string) => {
  if (['png', 'PNG', 'jpg', 'JPG', 'JPEG', 'jpeg'].includes(suffix)) {
    return 'icon-icon-tupian';
  }
  if (['pdf', 'PDF'].includes(suffix)) {
    return 'icon-a-icon-PDF';
  }
  if (['doc', 'DOC', 'docx', 'DOCX'].includes(suffix)) {
    return 'icon-icon-Word';
  }
  if (['xlsx', 'XLSX', 'XLS', 'xls'].includes(suffix)) {
    return 'icon-icon-Excel';
  }
  if (['rar', 'RAR'].includes(suffix)) {
    return 'icon-icon-rar';
  }
  if (['zip', 'ZIP'].includes(suffix)) {
    return 'icon-icon-ZIP';
  }
  return 'icon-a-icon-PDF';
};

/**
 * 处理表格中没有render，并且没有数据的时候的展示
 * @param colnums 当前的表头
 * @param text 传入为空的文案,默认是'-'
 * @returns 返回最新的表头
 */
export const changeTableColumsNoText = <T>(
  colnums: {
    children?: ColumnsType & { children?: ColumnsType[]; title: string }[];
    render?: () => JSX.Element;
  } & ColumnsType<T>,
  text: string,
  disableEllipsis = false,
) => {
  return colnums.map(colnum => {
    if (colnum.title === '操作') {
      colnum!.fixed = 'right';
    }
    if (!colnum.render) {
      colnum.render = (value: string | number) => {
        return noValueBackText(value, text || '-');
      };
    }
    if (!disableEllipsis) {
      colnum!.ellipsis = true;
    }

    return colnum;
  });
};

export const fileToBase64 = (file: File, callback: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file); // 开始读取文件内容并将其编码为Base64
  reader.onload = () => {
    callback(reader.result); // 读取成功后，将结果回调
  };
};

export const extractWordsFromTables = (data: {
  tables_result: { body: any[] }[];
}) => {
  const wordsArray: any[] = [];

  // Assuming data is the JSON object that contains the tables_result array
  data.tables_result.forEach((table: { body: any[] }) => {
    // Iterate over each body element in the table
    table.body.forEach(cell => {
      // Add the words from each cell to the wordsArray
      if (cell.words) {
        // Check if words exist to avoid undefined entries
        wordsArray.push(cell.words);
      }
    });
  });

  return wordsArray;
};

export const TableUploadProps = (
  setFileList: (data: any) => void,
  setWorld: (data: any) => void,
  url?: string,
) => {
  return {
    name: 'file',
    multiple: false,
    onChange(info: { file: { name?: any; status?: any }; fileList: any }) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
    beforeUpload(file: File) {
      fileToBase64(file, (base64: any) => {
        const Imagedata = {
          filename: file.name,
          image: base64,
        };

        // 这里可以进行自定义上传操作，如使用fetch API
        fetch(`http://localhost:3000/api/ai/${url || 'getTable'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Imagedata),
        })
          .then(response => response.json())
          .then(data => {
            message.success(`${file.name} file uploaded successfully.`);
            setFileList({ ...Imagedata });
            // setResultData({ ...data });
            // const finalData = extractWordsFromTables(data);
            setWorld(data);
          })
          .catch(error => {
            message.error(`${file.name} file upload failed.${error}`);
          });

        // 返回 false 以停止自动上传
        return false;
      });

      return false;
    },
  };
};

export const generateObjectsFromTemplate = (data: any[], template: string) => {
  return data.map((item: { [key: string]: any }) => {
    try {
      let result = template;
      Object.keys(item).forEach(key => {
        // JSON.stringify the value to ensure correct formatting and escaping
        const value = JSON.stringify(item[key]);
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        result = result?.replace(regex, value?.slice(1, -1)); // remove the added quotes
      });
      return result;
    } catch (error) {
      return null;
    }
  });
};
export const generateResultTemplate = (
  tempStr: string,
  insterStr: string,
  key: string,
) => {
  return tempStr.replace(key, insterStr);
};
// 传入路径path 获取对象的值

export const extractChineseWords = (data: any, path: string) => {
  const pathParts = path.split('.');
  const propertyToExtract: any = pathParts.pop(); // Remove and capture the last part as the key to extract
  const result = pathParts.reduce((acc, part) => {
    if (acc === undefined) {
      return undefined;
    }
    // Handle numeric indices for arrays
    if (Array.isArray(acc) && /^\d+$/.test(part)) {
      return acc[parseInt(part, 10)];
    }
    return acc[part];
  }, data);

  if (result === undefined) {
    return []; // Path was not correct or data does not exist
  }

  // Check if the final navigated part is an array and extract the specified property
  if (Array.isArray(result)) {
    return result.map(item => {
      return item[propertyToExtract] || 'N/A';
    }); // Extract specified property or mark as 'N/A' if undefined
  }
  if (result && result[propertyToExtract] !== undefined) {
    return [result[propertyToExtract]]; // Return the value in an array if it's a single object
  }
  // If the last navigated result is not an array but an object, check for the property directly

  return []; // Return empty if the final target is not as expected
};
