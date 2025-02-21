import { NextResponse } from 'next/server';
import { createPublicClient, http, decodeEventLog, Chain, Hex } from 'viem';
import { abi } from '@/abi/SablierLinear';
import { baseSepolia, arbitrumSepolia } from 'viem/chains';
import { contracts, ValidChainId } from '@/utils/contracts/contracts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



const MAX_RETRIES = 60;
const INITIAL_RETRY_INTERVAL = 500;
const MAX_RETRY_INTERVAL = 5000;

const chains: Record<ValidChainId, Chain> = {
    656476: {
        id: 656476,
        name: 'Open Campus',
        nativeCurrency: { name: 'EDU', symbol: 'EDU', decimals: 18 },
        rpcUrls: {
            default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
        },
    } as const,
    84532: baseSepolia,
    421614: arbitrumSepolia,
    2810: {
        id: 2810,
        name: 'Morph Holesky',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: {
            default: { http: ['https://rpc-quicknode-holesky.morphl2.io'] },
        },
    } as const,
};

function logObject(label: string, obj: any) {
    console.log(`${label}:`, JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));
}



async function addStreamIdToInvoice(requestId: string, streamId: string) {
    const baseUrl ='http://localhost:3000/api/add-stream-id'

   
    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, streamId }),
    });

    if (!response.ok) {
        throw new Error('Failed to add stream ID to invoice');
    }

    

    return await response.json();
}

function extractStreamIdFromLog(log: any): string | null {
    logObject('Attempting to extract stream ID from log', log);

    try {
        const decodedLog = decodeEventLog({ abi, data: log.data, topics: log.topics as [Hex, ...Hex[]] });
        logObject('Decoded log', decodedLog);
        //@ts-ignore
        if (decodedLog.eventName === 'MetadataUpdate' && decodedLog.args?._tokenId) {
            //@ts-ignore
            return decodedLog.args._tokenId.toString();
        }
        //@ts-ignore
        if (decodedLog.eventName === 'CreateLockupLinearStream' && decodedLog.args?.streamId) {
            //@ts-ignore
            return decodedLog.args.streamId.toString();
        }
    } catch (decodeError) {
        console.error('Error decoding log:', decodeError);
    }

    // Fallback methods
    if (log.topics[0] === '0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7') {
        return BigInt(log.data).toString();
    }

    if (log.topics[0] === '0x44cb432df42caa86b7ec73644ab8aec922bc44c71c98fc330addc75b88adbc7c') {
        return BigInt('0x' + log.data.slice(2, 66)).toString();
    }

    if (log.data && log.data.length >= 66) {
        const streamId = BigInt('0x' + log.data.slice(2, 66)).toString();
        return streamId !== '0' ? streamId : null;
    }

    return null;
}

export async function POST(request: Request) {
    try {
        const { transactionHash, chainId, requestId } = await request.json();

        if (!transactionHash || !chainId || !requestId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const chain = chains[chainId as ValidChainId];
        if (!chain) {
            return NextResponse.json({ error: 'Unsupported chain' }, { status: 400 });
        }

        const client = createPublicClient({ chain, transport: http() });
        const contractAddress = contracts[chainId as ValidChainId].sablierLinearV2LockUpAddress?.toLowerCase();

        let retries = 0;
        let retryInterval = INITIAL_RETRY_INTERVAL;

        while (retries < MAX_RETRIES) {
            try {
                const receipt = await client.getTransactionReceipt({ hash: transactionHash as `0x${string}` });

                if (receipt) {
                    logObject('Transaction receipt found', receipt);

                    const logsToProcess = contractAddress
                        ? receipt.logs.filter(log => log.address.toLowerCase() === contractAddress)
                        : receipt.logs;

                    for (const log of logsToProcess) {
                        const streamId = extractStreamIdFromLog(log);
                        if (streamId) {
                            await addStreamIdToInvoice(requestId, streamId);
                            return NextResponse.json({ streamId, message: 'Stream ID added to invoice successfully' });
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing transaction receipt:', error);
            }

            retries++;
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            retryInterval = Math.min(retryInterval * 1.5, MAX_RETRY_INTERVAL);
        }

        return NextResponse.json({ error: 'Stream ID not found after maximum retries' }, { status: 404 });
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}