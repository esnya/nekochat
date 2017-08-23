const BCDice = module.exports = jest.fn();
BCDice.prototype = {
    setDiceBot: jest.fn(),
    setMessage: jest.fn(),
    diceCommand: jest.fn(),
};

const DiceBotLoader = jest.fn();
DiceBotLoader.collectDiceBots = jest.fn();
DiceBotLoader.loadUnknownGame = jest.fn();

BCDice.DiceBotLoader = DiceBotLoader;
BCDice.BCDice = BCDice;
