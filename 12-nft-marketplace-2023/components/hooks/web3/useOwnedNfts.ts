import { useCallback } from "react";
import useSWR from "swr";
import { ethers } from "ethers";
import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { PINATA_GATEWAY_TOKEN } from "@providers/web3/utils";

type UseOwnedNftsResponse = {
    listNft: (token: number, price: number) => Promise<void>
}

type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: OwnedNftsHookFactory = ({ contract }) => () => {
    const { data, ...swr } = useSWR(
        contract ? "web3/useOwnedNfts" : null,
        async () => {
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getOwnedNfts();

            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(`${tokenURI}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                });

            }

            return nfts;
        }
    )
		const _contract = contract;
    const listNft = useCallback(async (tokenId: number, price: number) => {
        try {
            const result = await _contract!.placeNftOnSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                {
                    value: ethers.utils.parseEther(0.025.toString())
                }
            );

            await result?.wait();
            alert("Item has been listed!");
        } catch (e: any) {
            console.error(e.message);
        }
    }, [_contract])

    return {
        ...swr,
        listNft,
        data: data || [],
    };
}