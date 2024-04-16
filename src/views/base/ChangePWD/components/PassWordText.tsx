/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-05-30 11:00:45
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-30 18:53:22
 */
import style from '../index.module.less';

export const PassWordText = () => {
  return (
    <div className={style.paswordText}>
      <p className={style.paswordTextTitle}> 密码需满足以下要求：</p>
      <p> 1、至少3种字符的组合：大写字母、小写字母、数字、特殊字符；</p>
      <p> 2、密码长度至少8个字符；</p>
      <p> 3、不是常见密码，不能和用户名一样；</p>
    </div>
  );
};
