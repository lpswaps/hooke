import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal }) => {
        const connected = !!account;

        return (
          <button
            onClick={connected ? openChainModal : openConnectModal}
            style={{
              height: 38,
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#0E1010',
              color: '#F5F6F3',
              border: '1px solid rgba(199,248,76,.35)',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: connected ? '#8FD14F' : '#C7F84C'
            }}/>
            {connected ? `${chain?.name || ''} ${account.displayName}` : '连接钱包'}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
