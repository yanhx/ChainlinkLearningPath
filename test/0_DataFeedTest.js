const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { assert } = require("chai");


describe("单元测试:Chainlink Data feed", async function() {

    /**
     * the function is to deploy smart contracts
     * MockV3Aggregator and DataFeedTaskLocal to the hardhat environment
     */

    async function deployDataFeedFixture() {
        const [deployer] = await ethers.getSigners();

        const DECIMALS = "18";
        const LINK_INITIAL_PRICE = "100000000000000000000";
        const BTC_INITIAL_PRICE = "200000000000000000000";
        const ETH_INITIAL_PRICE = "300000000000000000000";

        const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator");
        const mockV3AggregatorLink = await mockV3AggregatorFactory
            .connect(deployer)
            .deploy(DECIMALS, LINK_INITIAL_PRICE);
        
        const mockV3AggregatorBtc = await mockV3AggregatorFactory
            .connect(deployer)
            .deploy(DECIMALS, BTC_INITIAL_PRICE);

        const mockV3AggregatorEth = await mockV3AggregatorFactory
            .connect(deployer)
            .deploy(DECIMALS, ETH_INITIAL_PRICE);
        
        const dataFeedFactory = await ethers.getContractFactory("DataFeedTask");
        
        const dataFeed = await dataFeedFactory
            .connect(deployer)
            .deploy(
                mockV3AggregatorLink.target,
                mockV3AggregatorBtc.target,
                mockV3AggregatorEth.target
            );

        return { dataFeed, mockV3AggregatorLink, mockV3AggregatorBtc, mockV3AggregatorEth }
    };

    // check if the contract is deployed successfully
    // check if the address of aggregator in the DataFeed is the same as aggregator
    it("单元测试 0-0:LINK aggregator 地址配置正确", async () => {
        const { dataFeed, mockV3AggregatorLink } = await loadFixture(
            deployDataFeedFixture
        )
        const response = await dataFeed.getLinkPriceFeed();
        assert.equal(response, mockV3AggregatorLink.target);
    })


    it("单元测试 0-1:BTC aggregator 地址配置正确", async () => {
        const { dataFeed, mockV3AggregatorBtc } = await loadFixture(
            deployDataFeedFixture
        )
        const response = await dataFeed.getBtcPriceFeed();
        assert.equal(response, mockV3AggregatorBtc.target);
    })
      

    it("单元测试 0-2:ETH aggregator 地址配置正确", async () => {
        const { dataFeed, mockV3AggregatorEth } = await loadFixture(
            deployDataFeedFixture
        )
        const response = await dataFeed.getEthPriceFeed();
        assert.equal(response, mockV3AggregatorEth.target);
    })


    // check if the contract is able to fetched the corrected price data defined when the contract deployed
    it("单元测试 0-3: 成功取得 LINK 价格数据", async () => {
        const { dataFeed, mockV3AggregatorLink } = await loadFixture(
            deployDataFeedFixture
        );
        const dataFeedLatestPrice = await dataFeed.getLinkLatestPrice();
        const dataFeedRound = (await mockV3AggregatorLink.latestRoundData()).answer;
        assert.equal(dataFeedLatestPrice.toString(), dataFeedRound.toString())
    })

    it("单元测试 0-4: 成功取得 BTC 价格数据", async () => {
        const { dataFeed, mockV3AggregatorBtc } = await loadFixture(
            deployDataFeedFixture
        );
        const dataFeedLatestPrice = await dataFeed.getBtcLatestPrice();
        const dataFeedRound = (await mockV3AggregatorBtc.latestRoundData()).answer;
        assert.equal(dataFeedLatestPrice.toString(), dataFeedRound.toString())
    })
        
    it("单元测试 0-5: 成功取得 ETH 价格数据", async () => {
        const { dataFeed, mockV3AggregatorEth } = await loadFixture(
            deployDataFeedFixture
        );
        const dataFeedLatestPrice = await dataFeed.getEthLatestPrice();
        const dataFeedRound = (await mockV3AggregatorEth.latestRoundData()).answer;
        assert.equal(dataFeedLatestPrice.toString(), dataFeedRound.toString())
    })
});