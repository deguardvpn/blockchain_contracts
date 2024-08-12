const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { BigNumber } = require('ethers');

describe('Crosschain token', function () {
  async function deployContractsFixture() {
    const Initializer = await ethers.getContractFactory(
      'AsterizmInitializerV1'
    );
    const Transalor = await ethers.getContractFactory('AsterizmTranslatorV1');
    const Token = await ethers.getContractFactory('DeGuardNFT'); // NFT
    const Nonce = await ethers.getContractFactory('AsterizmNonce');
    const Gas = await ethers.getContractFactory('GasStationUpgradeableV1');
    const [owner] = await ethers.getSigners();
    const currentChainIds = [1, 2];
    const chainTypes = { EVM: 1, TVM: 2 };



    //#endregion
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

    const token1 = await Token.deploy(
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

  it('Should successfuly deploy contracts', async function () {
    const {
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
    } = await loadFixture(deployContractsFixture);
  });
  it('Should emit event from Translator', async function () {
    let dstChainId, dstAddress, txId, transferHash, payload;
    const {
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
    } = await loadFixture(deployContractsFixture);
    await expect(
      token1.crossChainTransfer(
        currentChainIds[1],
        owner.address,
        '0x89F5C7d4580065fd9135Eff13493AaA5ad10A168',
        0,
      )
    )
      .to.emit(token1, 'InitiateTransferEvent')
      .withArgs(
        (value) => {
          dstChainId = value;
          return true;
        },
        (value) => {
          dstAddress = value;
          return true;
        },
        (value) => {
          txId = value;
          return true;
        },
        (value) => {
          transferHash = value;
          return true;
        },
        (value) => {
          payload = value;
          return true;
        }
      );
    expect(dstChainId).to.equal(currentChainIds[1]);
    // expect(dstAddress).to.equal(token2.address);
    expect(dstAddress).to.equal(token2.target);
    expect(txId).to.equal(0);
    expect(transferHash).to.not.null;
    expect(payload).to.not.null;
    await expect(
      token1.initAsterizmTransfer(dstChainId, txId, transferHash, payload)
    ).to.emit(translator1, 'SendMessageEvent');
  });

  it('Plan validity check', async function () {
    const {
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
    } = await loadFixture(deployContractsFixture);
    const tokens = await token2.tokensOfOwner(owner);
    const [id] = tokens;

    expect(await token2.isValid(owner, id)).to.equal(true);
  });

  it('Should burn token', async function () {
    let dstChainId, dstAddress, txId, transferHash, payload;
    const {
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
    } = await loadFixture(deployContractsFixture);
    await expect(
      token1.crossChainTransfer(
        currentChainIds[1],
        owner.address,
        '0x89F5C7d4580065fd9135Eff13493AaA5ad10A168',
        0,
      )
    )
      .to.emit(token1, 'InitiateTransferEvent')
      .withArgs(
        (value) => {
          dstChainId = value;
          return true;
        },
        (value) => {
          dstAddress = value;
          return true;
        },
        (value) => {
          txId = value;
          return true;
        },
        (value) => {
          transferHash = value;
          return true;
        },
        (value) => {
          payload = value;
          return true;
        }
      );
    expect(dstChainId).to.equal(currentChainIds[1]);
    expect(dstAddress).to.equal(token2.target);
    expect(txId).to.equal(0);
    expect(transferHash).to.not.null;
    expect(payload).to.not.null;
    await expect(
      token1.initAsterizmTransfer(dstChainId, txId, transferHash, payload)
    ).to.emit(translator1, 'SendMessageEvent');
    // expect(await token1.balanceOf(owner.address)).to.equal(
    //   TOKEN_AMOUNT.sub(value)
    // );
    // expect(await token1.totalSupply()).to.equal(TOKEN_AMOUNT.sub(value));
  });

  // it('Should burn and then mint token', async function () {
  //   let feeValue,
  //     packetValue,
  //     dstChainId,
  //     dstAddress,
  //     txId,
  //     transferHash,
  //     payload;
  //   let addressTo = '0x89F5C7d4580065fd9135Eff13493AaA5ad10A168';
  //   let value = 100;
  //   const {
  //     Initializer,
  //     initializer1,
  //     initializer2,
  //     Transalor,
  //     translator1,
  //     translator2,
  //     Token,
  //     token1,
  //     token2,
  //     owner,
  //     currentChainIds,
  //   } = await loadFixture(deployContractsFixture);
  //   await expect(
  //     token1.crossChainTransfer(
  //       currentChainIds[1],
  //       owner.address,
  //       addressTo,
  //       value
  //     )
  //   )
  //     .to.emit(token1, 'InitiateTransferEvent')
  //     .withArgs(
  //       (value) => {
  //         dstChainId = value;
  //         return true;
  //       },
  //       (value) => {
  //         dstAddress = value;
  //         return true;
  //       },
  //       (value) => {
  //         txId = value;
  //         return true;
  //       },
  //       (value) => {
  //         transferHash = value;
  //         return true;
  //       },
  //       (value) => {
  //         payload = value;
  //         return true;
  //       }
  //     );
  //   expect(dstChainId).to.equal(currentChainIds[1]);
  //   expect(dstAddress).to.equal(token2.address);
  //   expect(txId).to.equal(0);
  //   expect(transferHash).to.not.null;
  //   expect(payload).to.not.null;
  //   await expect(
  //     token1.initAsterizmTransfer(dstChainId, txId, transferHash, payload)
  //   )
  //     .to.emit(translator1, 'SendMessageEvent')
  //     .withArgs(
  //       (value) => {
  //         feeValue = value;
  //         return true;
  //       },
  //       (value) => {
  //         packetValue = value;
  //         return true;
  //       }
  //     );
  //   let decodedValue = ethers.utils.defaultAbiCoder.decode(
  //     [
  //       'uint',
  //       'uint64',
  //       'uint',
  //       'uint64',
  //       'uint',
  //       'bool',
  //       'uint',
  //       'bytes32',
  //       'bytes',
  //     ],
  //     packetValue
  //   );
  //   expect(decodedValue[0]).to.not.null; // nonce
  //   expect(decodedValue[1]).to.equal(currentChainIds[0]); // srcChainId
  //   expect(decodedValue[2]).to.equal(token1.address); // srcAddress
  //   expect(decodedValue[3]).to.equal(currentChainIds[1]); // dstChainId
  //   expect(decodedValue[4]).to.equal(token2.address); // dstAddress
  //   expect(feeValue).to.equal(0); // feeValue
  //   expect(decodedValue[5]).to.equal(true); // useForceOrder
  //   expect(decodedValue[6]).to.equal(0); // txId
  //   expect(decodedValue[7]).to.not.null; // transferHash
  //   expect(decodedValue[8]).to.not.null; // payload
  //   expect(await token1.balanceOf(owner.address)).to.equal(
  //     TOKEN_AMOUNT.sub(value)
  //   );
  //   await expect(translator2.transferMessage(300000, packetValue)).to.emit(
  //     token2,
  //     'PayloadReceivedEvent'
  //   );
  //   await expect(
  //     token2.asterizmClReceive(
  //       currentChainIds[0],
  //       token1.address,
  //       decodedValue[0],
  //       decodedValue[6],
  //       decodedValue[7],
  //       decodedValue[8]
  //     )
  //   ).to.not.reverted;
  //   expect(await token1.balanceOf(owner.address)).to.equal(
  //     TOKEN_AMOUNT.sub(value)
  //   );
  //   expect(await token2.balanceOf(addressTo)).to.equal(value);
  //   expect(await token1.totalSupply()).to.equal(TOKEN_AMOUNT.sub(value));
  //   expect(await token2.totalSupply()).to.equal(TOKEN_AMOUNT.add(value));
  // });
});
