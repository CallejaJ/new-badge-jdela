import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../CSS/MintNFT.css";
import abi from "../abis/contractABI.json";

const contractAddress = "0x6084E11e0617692982A37d42DfF1Fa197CCcc7aF";

export default function MintNFT({ account, saveImageUrl }) {
    const [contract, setContract] = useState(null);

    const randomNumber = Math.floor(Math.random() * 1000)
    const imageURL = `https://picsum.photos/200/300?random=${randomNumber}`;

    useEffect(() => {
        const initContract = async () => {
            if (!window.ethereum) {
                console.error('Ethereum object not found');
                alert("Please install MetaMask");
                return;
            }

            if (!account) {
                console.error('Account not found');
                return;
            }

            try {
                console.log('Initializing provider...');
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                console.log('Signer:', signer);
                const tempContract = new ethers.Contract(contractAddress, abi, signer);
                setContract(tempContract);
                console.log('Contract set:', tempContract);
            } catch (error) {
                console.error('Error creating contract instance:', error);
            }
        };

        if (account) {
            initContract();
        }
    }, [account]);



    const handleMintNftClick = async () => {
        if (!contract) {
            alert("Contract not initialized.");
            return;
        }

        if (!account) {
            alert("Account not connected.");
            return;
        }

        mintNft();
    };

    const mintNft = async () => {
        try {
            console.log('Attempting to mint NFT...');
            const tx = await contract.mint(account);
            console.log('Transaction:', tx);
            await tx.wait();
            alert("NFT Minted!");
            saveImageUrl(imageURL);
        } catch (error) {
            console.error("Error minting NFT", error);
            alert(`Error minting NFT: ${error.message}`);
        }
    }

    return (
        <div className="MintNFT">
            <header className="MintNFT-header">
                {account ? (
                    <>
                        <div>
                            <img src={imageURL} alt="NFT" className="nft-image" />
                        </div>
                        <button onClick={handleMintNftClick} className="mint-button">Mint NFT</button>
                    </>
                ) : (
                    <p>Please connect your wallet to mint an NFT.</p>
                )}
            </header>
        </div>
    );
}