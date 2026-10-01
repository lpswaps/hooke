import { useCallback, useMemo, useState } from 'react';

const HOOK_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+$/i;
const SYMBOL_RE = /^[A-Z0-9]{2,11}$/;

export const INITIAL_STATE = {
  name: '',
  symbol: '',
  logo: null,
  website: '',
  twitter: '',
  telegram: '',
  pairToken: 'BNB',
  graduationTier: 24,
  hookAddress: '',
  buyTax: '',
  sellTax: '',
  firstBuyAmount: '',
  slippage: '',
};

// 创建 Token 表单：统一管理字段状态 + 分模式的校验规则
// mode: 'normal' | 'hook'
export default function useCreateTokenForm(mode) {
  const [values, setValues] = useState(INITIAL_STATE);
  const [touched, setTouched] = useState({});
  const [logoError, setLogoError] = useState(null);
  const [result, setResult] = useState(null); // 提交成功后的模拟结果

  const isHook = mode === 'hook';
  // 首次买入 / 配对代币 / 毕业目标 两种模式都有，只有 Hook 地址和税费是 Hook 代币独有的
  const hasFirstBuy = values.firstBuyAmount !== '' && Number(values.firstBuyAmount) > 0;

  const setField = useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const setLogo = useCallback((val, err) => {
    setValues((prev) => ({ ...prev, logo: val }));
    setLogoError(err ?? null);
  }, []);

  const markTouched = useCallback((key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const touchAll = useCallback(() => {
    const all = {};
    Object.keys(INITIAL_STATE).forEach((k) => {
      all[k] = true;
    });
    setTouched(all);
  }, []);

  const reset = useCallback(() => {
    setValues(INITIAL_STATE);
    setTouched({});
    setLogoError(null);
    setResult(null);
  }, []);

  const errors = useMemo(() => {
    const e = {};

    const name = values.name.trim();
    if (!name) e.name = '请输入代币名称';
    else if (name.length > 32) e.name = '名称请控制在 32 个字符以内';

    const symbol = values.symbol.trim().toUpperCase();
    if (!symbol) e.symbol = '请输入代币符号';
    else if (!SYMBOL_RE.test(symbol)) e.symbol = '符号需为 2-11 位英文字母或数字';

    if (!values.logo) e.logo = logoError || '请上传代币 Logo';
    else if (logoError) e.logo = logoError;

    if (values.website && !URL_RE.test(values.website.trim())) {
      e.website = '请输入正确的网址，例如 https://example.com';
    }
    if (values.twitter && values.twitter.trim().length > 100) e.twitter = '链接过长';
    if (values.telegram && values.telegram.trim().length > 100) e.telegram = '链接过长';

    // 配对代币 / 毕业目标：普通代币与 Hook 代币都需要填写
    if (!values.pairToken) e.pairToken = '请选择配对代币';
    if (!values.graduationTier) e.graduationTier = '请选择毕业目标';

    // Hook 地址 / 买卖税：仅 Hook 代币需要
    if (isHook) {
      const hookAddr = values.hookAddress.trim();
      if (!hookAddr) e.hookAddress = '请输入 Hook 地址';
      else if (!HOOK_ADDRESS_RE.test(hookAddr)) {
        e.hookAddress = 'Hook 地址格式不正确，需为 0x 开头的 42 位十六进制地址';
      }

      if (values.buyTax === '' || values.buyTax === null) {
        e.buyTax = '请输入买入税';
      } else {
        const bt = Number(values.buyTax);
        if (Number.isNaN(bt) || bt < 0 || bt > 10) e.buyTax = '买入税范围为 0% - 10%';
      }

      if (values.sellTax === '' || values.sellTax === null) {
        e.sellTax = '请输入卖出税';
      } else {
        const st = Number(values.sellTax);
        if (Number.isNaN(st) || st < 0 || st > 10) e.sellTax = '卖出税范围为 0% - 10%';
      }
    }

    // 首次买入 / 滑点：普通代币与 Hook 代币都可以填写
    if (values.firstBuyAmount !== '') {
      const fb = Number(values.firstBuyAmount);
      if (Number.isNaN(fb) || fb < 0) e.firstBuyAmount = '请输入有效的 BNB 数量';
    }

    if (hasFirstBuy) {
      const bt = isHook ? Number(values.buyTax) || 0 : 0;
      if (values.slippage === '' || values.slippage === null) {
        e.slippage = '请输入滑点';
      } else {
        const sp = Number(values.slippage);
        if (Number.isNaN(sp) || sp < 0 || sp > 50) e.slippage = '滑点范围为 0% - 50%';
        else if (isHook && sp < bt) e.slippage = `滑点不能低于买入税（${bt}%），否则交易可能失败`;
      }
    }

    return e;
  }, [values, isHook, hasFirstBuy, logoError]);

  const isValid = Object.keys(errors).length === 0;

  const submit = useCallback(() => {
    touchAll();
    if (!isValid) return false;

    setResult({
      name: values.name.trim(),
      symbol: values.symbol.trim().toUpperCase(),
      mode,
      address: `0x${Array.from({ length: 40 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('')}`,
    });
    return true;
  }, [isValid, mode, touchAll, values.name, values.symbol]);

  return {
    values,
    errors,
    touched,
    isValid,
    isHook,
    hasFirstBuy,
    result,
    setField,
    setLogo,
    markTouched,
    submit,
    reset,
  };
}
