//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IViolet is IERC721 {
    // Violet minting

    function mintViolet(address) external payable;

    function mintViolets(address, uint256) external payable;

    function mintVioletFromGlassVideo(address, uint256) external;

    // Violet data

    function mintingPrice() external view returns (uint256);

    function MINTING_START_DATE() external view returns (uint256);

    function maxPublicMintingSupply() external view returns (uint256);

    function publicMintingTokensMinted() external view returns (uint256);

    function tokensLeftToMint() external view returns (uint256);

    function isFirstMintingPeriodActive() external view returns (bool);

    function glassVideo() external view returns (address);

    function usedGlassVideoTokenForMinting(uint256)
        external
        view
        returns (bool);

    // ERC721 extensions

    function totalSupply() external view returns (uint256);

    function tokenURI(uint256) external view returns (string memory);

    function contractURI() external view returns (string memory);

    function exists(uint256) external view returns (bool);

    // Only Owner

    function setContractURI(string memory) external;

    function setGlassVideoContract(address) external;

    function updateMintingPrice(uint256) external;

    function updateMaxPublicMintingSupply(uint256) external;

    // Ownable

    function owner() external view returns (address);

    function transferOwnership(address) external;

    function renounceOwnership() external;

    // Withdraw

    function withdrawETH() external;

    function withdrawERC20(address) external;
}
