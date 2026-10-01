import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';

import FrogFrame from '../features/create/FrogFrame';
import FieldLabel from '../features/create/FieldLabel';
import ModeToggle from '../features/create/ModeToggle';
import LogoUploadField from '../features/create/LogoUploadField';
import PairTokenSelect from '../features/create/PairTokenSelect';
import GraduationTierSelect from '../features/create/GraduationTierSelect';
import useCreateTokenForm from '../features/create/hooks/useCreateTokenForm';
import { colors } from '../styles/theme';

const inputSx = {
    bgcolor: colors.bgElevated,
    borderRadius: 2,
    '& .MuiOutlinedInput-root': { fontSize: 13.5, borderRadius: 2 },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
};

export default function CreateTokenPage() {
    const [mode, setMode] = useState('normal');
    const {
        values,
        errors,
        touched,
        hasFirstBuy,
        result,
        setField,
        setLogo,
        markTouched,
        submit,
        reset,
    } = useCreateTokenForm(mode);

    const [snackOpen, setSnackOpen] = useState(false);

    const handleModeChange = (next) => {
        setMode(next);
    };

    const handleSubmit = () => {
        const ok = submit();
        setSnackOpen(!ok);
    };

    const showError = (key) => (touched[key] ? errors[key] : undefined);

    if (result) {
        return (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 2, py: 6 }}>
                <FrogFrame sx={{ maxWidth: 520 }}>
                    <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                        <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1.5 }} />
                        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
                            代币创建成功
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: 13, mt: 0.75 }}>
                            {values.name}（{values.symbol.toUpperCase()}）已提交上链，可前往市场查看进度
                        </Typography>
                        <Box
                            sx={{
                                mt: 2.5,
                                p: 1.25,
                                bgcolor: colors.bgElevated,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                fontSize: 12,
                                color: colors.textTertiary,
                                wordBreak: 'break-all',
                                fontFamily: 'monospace',
                            }}
                        >
                            {result.address}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={reset}
                                sx={{ borderColor: 'divider', color: 'text.secondary' }}
                            >
                                再创建一个
                            </Button>
                            <Button component={RouterLink} to="/market" variant="contained" color="primary">
                                前往市场
                            </Button>
                        </Box>
                    </Box>
                </FrogFrame>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: 2, py: { xs: 3, sm: 5 } }}>
            <Box sx={{ width: '100%', maxWidth: 640 }}>
                <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'text.secondary',
                        fontSize: 12.5,
                        textDecoration: 'none',
                        mb: 2,
                        '&:hover': { color: 'primary.main' },
                    }}
                >
                    <ArrowBackRoundedIcon sx={{ fontSize: 15 }} />
                    返回首页
                </Box>

                <FrogFrame>
                    <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
                        {/* 标题 */}
                        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800 }}>
                                创建 Token
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: 12.5, mt: 0.5 }}>
                                基于 Bonding Curve 公平发射，人人都可以创建自己的代币
                            </Typography>
                        </Box>

                        {/* 模式切换 */}
                        <ModeToggle mode={mode} onChange={handleModeChange} />

                        {/* ===== 基础信息 ===== */}
                        <SectionTitle sx={{ mt: 3.5 }}>基础信息</SectionTitle>

                        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, mt: 1.5 }}>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="代币名称" required tip="代币的完整显示名称，例如 Hooke Frog" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="例如 Hooke Frog"
                                    value={values.name}
                                    onChange={(e) => setField('name', e.target.value)}
                                    onBlur={() => markTouched('name')}
                                    error={!!showError('name')}
                                    helperText={showError('name')}
                                    inputProps={{ maxLength: 32 }}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="代币符号" required tip="2-11 位英文字母或数字，将自动转为大写，例如 HOOKE" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="例如 HOOKE"
                                    value={values.symbol}
                                    onChange={(e) => setField('symbol', e.target.value.toUpperCase())}
                                    onBlur={() => markTouched('symbol')}
                                    error={!!showError('symbol')}
                                    helperText={showError('symbol')}
                                    inputProps={{ maxLength: 11 }}
                                    sx={inputSx}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2 }} onBlur={() => markTouched('logo')}>
                            <LogoUploadField value={values.logo} error={showError('logo')} onChange={setLogo} />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                flexDirection: { xs: 'column', sm: 'row' },
                                mt: 2,
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="官网" tip="项目官方网站，选填" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="https://"
                                    value={values.website}
                                    onChange={(e) => setField('website', e.target.value)}
                                    onBlur={() => markTouched('website')}
                                    error={!!showError('website')}
                                    helperText={showError('website')}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="X（Twitter）" tip="项目 X / Twitter 主页链接，选填" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="https://x.com/..."
                                    value={values.twitter}
                                    onChange={(e) => setField('twitter', e.target.value)}
                                    onBlur={() => markTouched('twitter')}
                                    error={!!showError('twitter')}
                                    helperText={showError('twitter')}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="电报" tip="Telegram 群组或频道链接，选填" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="https://t.me/..."
                                    value={values.telegram}
                                    onChange={(e) => setField('telegram', e.target.value)}
                                    onBlur={() => markTouched('telegram')}
                                    error={!!showError('telegram')}
                                    helperText={showError('telegram')}
                                    sx={inputSx}
                                />
                            </Box>
                        </Box>

                        {/* ===== 交易配置：普通代币与 Hook 代币都需要 ===== */}
                        <Divider sx={{ my: 3, borderColor: 'divider' }} />
                        <SectionTitle>交易配置</SectionTitle>

                        <Box sx={{ mt: 1.5 }} onBlur={() => markTouched('pairToken')}>
                            <PairTokenSelect
                                value={values.pairToken}
                                error={showError('pairToken')}
                                onChange={(v) => setField('pairToken', v)}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }} onBlur={() => markTouched('graduationTier')}>
                            <GraduationTierSelect
                                value={values.graduationTier}
                                error={showError('graduationTier')}
                                onChange={(v) => setField('graduationTier', v)}
                            />
                        </Box>

                        {mode === 'hook' && (
                            <>
                                {/* ===== Hook 独有配置：地址 + 税费 ===== */}
                                <Box sx={{ mt: 2 }}>
                                    <FieldLabel
                                        label="Hook 地址"
                                        required
                                        tip="部署好的 Hook 合约地址，需为 0x 开头的 42 位地址，将用于自定义交易逻辑"
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="0x..."
                                        value={values.hookAddress}
                                        onChange={(e) => setField('hookAddress', e.target.value)}
                                        onBlur={() => markTouched('hookAddress')}
                                        error={!!showError('hookAddress')}
                                        helperText={showError('hookAddress')}
                                        sx={{
                                            ...inputSx,
                                            '& .MuiOutlinedInput-root': {
                                                ...inputSx['& .MuiOutlinedInput-root'],
                                                fontFamily: 'monospace',
                                            },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, mt: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel label="买入税" required tip="用户买入代币时收取的税费，最高 10%" />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            placeholder="0"
                                            value={values.buyTax}
                                            onChange={(e) => setField('buyTax', e.target.value)}
                                            onBlur={() => markTouched('buyTax')}
                                            error={!!showError('buyTax')}
                                            helperText={showError('buyTax')}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                inputProps: { min: 0, max: 10, step: 0.1 },
                                            }}
                                            sx={inputSx}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel label="卖出税" required tip="用户卖出代币时收取的税费，最高 10%" />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            placeholder="0"
                                            value={values.sellTax}
                                            onChange={(e) => setField('sellTax', e.target.value)}
                                            onBlur={() => markTouched('sellTax')}
                                            error={!!showError('sellTax')}
                                            helperText={showError('sellTax')}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                inputProps: { min: 0, max: 10, step: 0.1 },
                                            }}
                                            sx={inputSx}
                                        />
                                    </Box>
                                </Box>
                            </>
                        )}

                        {/* ===== 首次买入：普通代币与 Hook 代币都可以填 ===== */}
                        <Divider sx={{ my: 3, borderColor: 'divider' }} />
                        <SectionTitle>首次买入（可选）</SectionTitle>
                        <Typography sx={{ fontSize: 11.5, color: colors.textTertiary, mt: 0.5 }}>
                            填写后，你将成为该代币的第一个买家；填写金额后可继续设置滑点
                            {mode === 'hook' && '（滑点不能低于买入税，否则可能失败）'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, mt: 1.5 }}>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel label="首次买入金额" tip="创建成功后立即买入的 BNB 数量，选填" />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="0.0"
                                    value={values.firstBuyAmount}
                                    onChange={(e) => setField('firstBuyAmount', e.target.value)}
                                    onBlur={() => markTouched('firstBuyAmount')}
                                    error={!!showError('firstBuyAmount')}
                                    helperText={showError('firstBuyAmount')}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">BNB</InputAdornment>,
                                        inputProps: { min: 0, step: 0.01 },
                                    }}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel
                                    label="滑点"
                                    required={hasFirstBuy}
                                    tip={
                                        mode === 'hook'
                                            ? '最高 50%；滑点不能低于买入税，否则交易可能因税费导致失败'
                                            : '最高 50%，用于设置买入时可接受的最大价格偏差'
                                    }
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder={hasFirstBuy ? '0' : '填写首次买入金额后可设置'}
                                    value={values.slippage}
                                    onChange={(e) => setField('slippage', e.target.value)}
                                    onBlur={() => markTouched('slippage')}
                                    disabled={!hasFirstBuy}
                                    error={!!showError('slippage')}
                                    helperText={showError('slippage')}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        inputProps: { min: 0, max: 50, step: 0.1 },
                                    }}
                                    sx={inputSx}
                                />
                            </Box>
                        </Box>

                        {/* ===== 提交 ===== */}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            startIcon={<RocketLaunchRoundedIcon />}
                            sx={{ mt: 3.5, py: 1.25, fontSize: 14.5, borderRadius: 2.5 }}
                        >
                            {mode === 'hook' ? '创建 Hook 代币' : '创建 Token'}
                        </Button>
                    </Box>
                </FrogFrame>
            </Box>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3200}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" variant="filled" onClose={() => setSnackOpen(false)}>
                    请检查并完善表单中标红的必填项
                </Alert>
            </Snackbar>
        </Box>
    );
}

function SectionTitle({ children, sx }) {
    return (
        <Typography
            sx={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.textTertiary,
                letterSpacing: 0.5,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
}
