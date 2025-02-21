import {
    RainbowKitProvider,
    getDefaultConfig,
    Chain,
  } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';


const opencampus = {
    id: 656476,
    name: 'Open Campus',
    iconUrl: 'https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg',
    iconBackground: '#fff',
    nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: '	https://opencampus-codex.blockscout.com/' },
    },

  } as const satisfies Chain;

  const morphholesky = {
    id: 2810,
    name: 'Morph Holesky',
    iconUrl: '/morph-logo.png',
    iconBackground: '#fff',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc-quicknode-holesky.morphl2.io'] },
    },
    blockExplorers: {
      default: { name: 'BlockScout', url: 'https://explorer-holesky.morphl2.io/' },
    },

  } as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    baseSepolia,
    opencampus,
    arbitrumSepolia,
    morphholesky
  ],
  ssr: true,
});
