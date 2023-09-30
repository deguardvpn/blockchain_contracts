// const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
// const tokenABI = require('../artifacts/contracts/DeGuardNFT.sol/DeGuardNFT.json');

describe('DeGuard NFT', function () {
  // let factory;
  let token1;
  let owner;
  let client;

  const rate = ethers.parseUnits('1.25', 18);
  const price = ethers.parseUnits('3', 18);

  async function deployContractsFixture() {
    const Initializer = await ethers.getContractFactory(
      'AsterizmInitializerV1'
    );
    const Transalor = await ethers.getContractFactory('AsterizmTranslatorV1');
    const Token = await ethers.getContractFactory('DeGuardNFT'); // NFT
    const Nonce = await ethers.getContractFactory('AsterizmNonce');
    const Gas = await ethers.getContractFactory('GasStationUpgradeableV1');
    [owner] = await ethers.getSigners();
    const currentChainIds = [1, 2];
    const chainTypes = { EVM: 1, TVM: 2 };

    const translator1 = await upgrades.deployProxy(
      Transalor,
      [currentChainIds[0], chainTypes.EVM],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await translator1.deployed();
    await translator1.waitForDeployment();
    await translator1.addChains(currentChainIds, [
      chainTypes.EVM,
      chainTypes.EVM,
    ]);
    await translator1.addRelayer(owner.address);

    const translator2 = await upgrades.deployProxy(
      Transalor,
      [currentChainIds[1], chainTypes.EVM],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await translator2.deployed();
    await translator2.waitForDeployment();
    await translator2.addChains(currentChainIds, [
      chainTypes.EVM,
      chainTypes.EVM,
    ]);
    await translator2.addRelayer(owner.address);

    // Initializer1 deployment
    const initializer1 = await upgrades.deployProxy(
      Initializer,
      // [translator1.address],
      [translator1.target],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await initializer1.deployed();
    await initializer1.waitForDeployment();
    // Initializer Nonce deployment
    // const outboundInitializer1Nonce = await Nonce.deploy(initializer1.address);
    const outboundInitializer1Nonce = await Nonce.deploy(initializer1.target);
    // await outboundInitializer1Nonce.deployed();
    await outboundInitializer1Nonce.waitForDeployment();
    // const inboundInitializer1Nonce = await Nonce.deploy(initializer1.address);
    const inboundInitializer1Nonce = await Nonce.deploy(initializer1.target);
    // await inboundInitializer1Nonce.deployed();
    await inboundInitializer1Nonce.waitForDeployment();
    // await initializer1.setInBoundNonce(inboundInitializer1Nonce.address);
    await initializer1.setInBoundNonce(inboundInitializer1Nonce.target);
    // await initializer1.setOutBoundNonce(outboundInitializer1Nonce.address);
    await initializer1.setOutBoundNonce(outboundInitializer1Nonce.target);

    // Initializer2 deployment
    const initializer2 = await upgrades.deployProxy(
      Initializer,
      // [translator2.address],
      [translator2.target],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await initializer2.deployed();
    await initializer2.waitForDeployment();
    // Initializer Nonce deployment
    // const outboundInitializer2Nonce = await Nonce.deploy(initializer2.address);
    const outboundInitializer2Nonce = await Nonce.deploy(initializer2.target);
    // await outboundInitializer2Nonce.deployed();
    await outboundInitializer2Nonce.waitForDeployment();
    // const inboundInitializer2Nonce = await Nonce.deploy(initializer2.address);
    const inboundInitializer2Nonce = await Nonce.deploy(initializer2.target);
    // await inboundInitializer2Nonce.deployed();
    await inboundInitializer2Nonce.waitForDeployment();
    // await initializer2.setInBoundNonce(inboundInitializer2Nonce.address);
    await initializer2.setInBoundNonce(inboundInitializer2Nonce.target);
    // await initializer2.setOutBoundNonce(outboundInitializer2Nonce.address);
    await initializer2.setOutBoundNonce(outboundInitializer2Nonce.target);

    // await translator1.setInitializer(initializer1.address);
    await translator1.setInitializer(initializer1.target);
    // await translator2.setInitializer(initializer2.address);
    await translator2.setInitializer(initializer2.target);

    token1 = await Token.deploy(
      // initializer1.address,
      initializer1.target
      // TOKEN_AMOUNT.toString()
    );
    // await token1.deployed();
    await token1.waitForDeployment();
    const token2 = await Token.deploy(
      // initializer2.address
      initializer2.target
      // TOKEN_AMOUNT.toString()
    );
    // await token2.deployed();
    await token2.waitForDeployment();
    // await token1.addTrustedAddresses(currentChainIds, [
    //   token1.address,
    //   token2.address,
    // ]);
    await token1.addTrustedAddresses(currentChainIds, [
      token1.target,
      token2.target,
    ]);
    // await token2.addTrustedAddresses(currentChainIds, [
    //   token1.address,
    //   token2.address,
    // ]);
    await token2.addTrustedAddresses(currentChainIds, [
      token1.target,
      token2.target,
    ]);

    const gas_sender1 = await upgrades.deployProxy(
      Gas,
      // [initializer1.address, true],
      [initializer1.target, true],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await gas_sender1.deployed();
    await gas_sender1.waitForDeployment();
    const gas_sender2 = await upgrades.deployProxy(
      Gas,
      // [initializer2.address, true],
      [initializer2.target, true],
      {
        initialize: 'initialize',
        kind: 'uups',
      }
    );
    // await gas_sender2.deployed();
    await gas_sender2.waitForDeployment();
    await gas_sender1.addTrustedAddresses(currentChainIds, [
      // gas_sender1.address,
      // gas_sender2.address,
      gas_sender1.target,
      gas_sender2.target,
    ]);
    await gas_sender2.addTrustedAddresses(currentChainIds, [
      // gas_sender1.address,
      // gas_sender2.address,
      gas_sender1.target,
      gas_sender2.target,
    ]);

    // Fixtures can return anything you consider useful for your tests
    return {
      Initializer,
      initializer1,
      initializer2,
      Transalor,
      translator1,
      translator2,
      Token,
      token1,
      token2,
      owner,
      currentChainIds,
    };
  }

  before(async function () {
    // const { token1, owner } = await loadFixture(deployContractsFixture);
    await loadFixture(deployContractsFixture);

    //   [owner, client] = await ethers.getSigners();
    //   const DGtoken = await ethers.getContractFactory('DeGuardNFT');
    //   token = await DGtoken.connect(owner).deploy(
    //     '0xcD57Bfd5B75e0C82c0a4F85fE95a5cE13459dd8B'
    //   );
    //   await token.waitForDeployment();

    //   console.log(`DeGuard deployed to ${token.target}`);
  });

  it('Token owner validation', async function () {
    [client] = await ethers.getSigners();
    const address = await token1.owner();
    expect(address).to.equal(owner.address);
  });

  it('Token symbol and name', async function () {
    expect(await token1.name()).to.equal('DeGuardPlan');
    expect(await token1.symbol()).to.equal('DGP');
  });

  it('Update currency rate', async function () {
    await token1.connect(owner).updateRate(rate);
    const updatedRate = await token1.rate();
    expect(updatedRate.value).to.equal(rate);
  });

  it('Add new plan to the token', async function () {
    const range = 30;
    const receipt = await token1.connect(owner).addPlan(price, range);
    expect(receipt).to.emit(token1, 'PlanUpdated').withArgs(price, range);
  });

  it('Get plan list from token', async function () {
    const plans = await token1.connect(owner).getPlanList();
    plans.forEach((plan, index) => {
      const [price, range] = plan;
      console.log(
        `Plan ${index + 1}: price is ${ethers.formatEther(
          price
        )} USD, date range ${range} days.`
      );
    });
    expect(plans.length).to.equal(1);
  });

  it('Buy plan by user', async function () {
    const planId = 0;
    const value = (rate * price) / ethers.parseEther('1.0');
    console.log(
      `Value for transfer ${ethers.formatEther(value)} of native tokens`
    );
    const receipt = await token1.connect(client).buyPlan(planId, { value });
    expect(receipt).to.emit(token1, 'PlanSold').withArgs(client, planId);
  });

  it('Plan balance', async function () {
    expect(await token1.balanceOf(client)).to.equal(2);
  });

  it('Plan range check', async function () {
    const tokens = await token1.tokensOfOwner(client);
    console.log(`User has ${tokens.length} NFTs`);

    // const userPlan = await token.tokenOfOwnerByIndex(client, tokens[0]);
    // console.log(userPlan);
    const [start, end, range] = await token1.getRange(client, tokens[0]);
    console.log(
      `User plan starts at ${start} and ends in ${end}. Plan active for ${range} days.`
    );

    // expect(await token.balanceOf(client)).to.equal(1);
  });

  it('Plan validity check', async function () {
    const tokens = await token1.tokensOfOwner(client);
    const [id] = tokens;

    expect(await token1.isValid(client, id)).to.equal(true);
  });

  it('Add plan ', async function () {
    const price2 = ethers.parseUnits('6', 18);
    const receipt = await token1.connect(owner).addPlan(price2, 60);
    const plans = await token1.connect(owner).getPlanList();
    plans.forEach((plan, index) => {
      const [price, range] = plan;
      console.log(
        `Plan ${index + 1}: price is ${ethers.formatEther(
          price
        )} USD, date range ${range} days.`
      );
    });
    expect(receipt).to.emit(token1, 'PlanUpdated').withArgs(price2, 60);
  });

  it('Remove plan', async function () {
    const plans = await token1.connect(owner).getPlanList();

    const [price, range] = plans[0];

    const receipt = await token1.connect(owner).removePlan(0);
    expect(receipt).to.emit(token1, 'PlanRemoved').withArgs(price, range);

    const updatePlans = await token1.connect(owner).getPlanList();

    console.log('After remove method');
    const updatedPlans = await token1.connect(owner).getPlanList();
    updatedPlans.forEach((plan, index) => {
      const [price, range] = plan;
      console.log(
        `Plan ${index + 1}: price is ${ethers.formatEther(
          price
        )} USD, date range ${range} days.`
      );
    });

    expect(updatePlans.length).to.equal(1);
  });

  it('Withdraw balance from token ', async function () {
    console.log(
      'Token balance is %s ETH',
      ethers.formatEther(await ethers.provider.getBalance(token1.target))
    );
    const receipt = await token1.connect(owner).withdraw();

    expect(await ethers.provider.getBalance(token1.target)).to.equal(0);
  });
});
