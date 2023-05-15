import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { IStarknetCoreProxy, Starknet } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Starknet', function () {
  let starknet: Starknet;
  let starknetProxy: IStarknetCoreProxy;
  let StarknetDAOSigner: SignerWithAddress

  beforeEach(async function () {
    const StarknetDAO = '0xd5fb66caee881367df4409b17fd53a2ef0d9b263';
    const StarknetCoreAddress = '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4';


     // DAO signer impersonateAccount
     {
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [StarknetDAO],
      });

      await hre.network.provider.send("hardhat_setBalance", [
        StarknetDAO,
        ethers.utils.parseEther("1000").toHexString(),
      ]);

      StarknetDAOSigner = await ethers.getSigner(StarknetDAO);
    }

    const newImpl = await ethers.deployContract('Starknet');

    starknet = (await ethers.getContractAt('Starknet', StarknetCoreAddress)) as Starknet;
    starknetProxy = (await ethers.getContractAt('IStarknetCoreProxy', StarknetCoreAddress)) as IStarknetCoreProxy;

    await starknetProxy
      .connect(StarknetDAOSigner)
      .addImplementation(newImpl.address, ethers.utils.hexZeroPad('0x', 32), false);
    await starknetProxy.connect(StarknetDAOSigner).upgradeTo(newImpl.address, ethers.utils.hexZeroPad('0x', 32), false);
    expect((await starknetProxy.implementation()) != newImpl.address);
  });

  it('Upgrade the contract', async function () {
    console.log("upgraded")
  });
});
