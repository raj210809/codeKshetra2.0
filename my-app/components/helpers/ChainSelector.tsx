import React, { useState } from 'react';
import Image from 'next/image';
import { chainInfo, ValidChainId } from '@/utils/multi-chain/MultiChainSelectOptions';

interface ChainSelectorProps {
  onSelectionChange: (selectedChain: ValidChainId | null) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ onSelectionChange }) => {
  const [selectedChain, setSelectedChain] = useState<ValidChainId | null>(null);

  const selectChain = (chainId: ValidChainId) => {
    setSelectedChain(chainId);
    onSelectionChange(chainId);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Please select the chain on which you would like to get paid:</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(chainInfo).map(([chainId, info]) => (
          <button
            key={chainId}
            onClick={() => selectChain(Number(chainId) as ValidChainId)}
            className={`flex items-center p-2 border rounded-md ${
              selectedChain === Number(chainId)
                ? 'bg-primary/10 border-primary'
                : 'bg-background border-input'
            }`}
          >
            <Image
              src={info.logoUrl}
              alt={`${info.name} logo`}
              width={24}
              height={24}
              className="w-6 h-6 mr-2"
            />
            <span>{info.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChainSelector;