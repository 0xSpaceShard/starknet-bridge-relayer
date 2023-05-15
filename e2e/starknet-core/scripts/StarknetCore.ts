import { ethers } from 'hardhat';
import { IStarknetCoreProxy, Starknet } from '../typechain-types';

async function main() {
  const network: string = process.env.NETWORK_ID || 'goerli';
  const StarknetDAO: any = {
    mainnet: '0xd5fb66caee881367df4409b17fd53a2ef0d9b263',
    goerli: '0xb4b6c01d3ee2ac2c992e87cae89b3278c42a5c59',
  };
  const StarknetCoreAddress: any = {
    mainnet: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
    goerli: '0xde29d060D45901Fb19ED6C6e959EB22d8626708e',
  };

  const StarknetDAOSigner = await ethers.getImpersonatedSigner(StarknetDAO[network]);
  const newImpl = await ethers.deployContract('Starknet');

  const starknet = (await ethers.getContractAt('Starknet', StarknetCoreAddress[network])) as Starknet;
  const starknetProxy = (await ethers.getContractAt(
    'IStarknetCoreProxy',
    StarknetCoreAddress[network],
  )) as IStarknetCoreProxy;

  await starknetProxy
    .connect(StarknetDAOSigner)
    .addImplementation(newImpl.address, ethers.utils.hexZeroPad('0x', 32), false);
  await starknetProxy.connect(StarknetDAOSigner).upgradeTo(newImpl.address, ethers.utils.hexZeroPad('0x', 32), false);

  if ((await starknetProxy.implementation()) != newImpl.address) {
    throw new Error('Upgrade invalid');
  }

  console.log('network:', network);
  console.log('status:', await starknet.relayer());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
