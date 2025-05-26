export type ValidChainId = 656476 | 84532 | 421614 | 2810;

export const contracts: Record<ValidChainId, {
    tUSDCAddress: `0x${string}`;
    sablierLinearV2LockUpAddress: `0x${string}`;
}> = {
    //OPEN CAMPUS
    656476: {
        tUSDCAddress: "0x8c88F4205D24619cB3F11B3925312Df0d484F4e7",
        sablierLinearV2LockUpAddress: "0x6B2Dbd50b57c0b3D4324734076248A3A81A92270"
    },
    //BASE SEPOLIA
    84532: {
        tUSDCAddress: "0xf6dC757C9F7E5e5eE5787c31f2aBEa4B19001015",
        sablierLinearV2LockUpAddress: "0xFE7fc0Bbde84C239C0aB89111D617dC7cc58049f"
    },
    //ARBITRUM SEPOLIA
    421614: {
        tUSDCAddress: "0x37ff5b5f37038db083957c415d5b105ee2e27e4f",
        sablierLinearV2LockUpAddress: "0x9D1C257d9bc09E6E6B8E7e7c2496C12000f55457"
    },
    //MORPH holesky
    2810: {
        tUSDCAddress: "0x06e6eAd6899F44441a187d4bA907D1f527C7536c",
        sablierLinearV2LockUpAddress: "0x4b4126036726085636BC2A4788a448d5C26705E4"
    }
};