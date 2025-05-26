import Image from 'next/image';

export type ValidChainId = 656476 | 84532 | 421614 | 2810;

export const chainInfo: Record<ValidChainId, {
    name: string;
    logoUrl: string;
}> = {
    421614: {
        name: "Arbitrum Sepolia",
        logoUrl: "/arbitrum-logo.png" // Replace with actual Arbitrum logo URL
    },
    84532: {
        name: "Base Sepolia",
        logoUrl: "/base-logo.png" // Replace with actual Base logo URL
    },
    656476: {
        name: "EDU Chain",
        logoUrl: "https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg"
    },
    2810: {
        name: "Morph Holesky",
        logoUrl: "/morph-logo.png"
    }

};

export const getChainOptions = () => {
    return Object.entries(chainInfo).map(([chainId, info]) => ({
        value: chainId,
        label: info.name,
        icon: (
            <Image
                src={info.logoUrl}
                alt={`${info.name} logo`}
                width={24}
                height={24}
                className="w-6 h-6 mr-2"
            />
        )
    }));
};