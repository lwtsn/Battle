import { getWallets } from './helpers/contract';
import { PepemonCardOracle } from '../typechain';
import CardArtifact from '../artifacts/contracts/PepemonCardOracle.sol/PepemonCardOracle.json';

import { expect } from 'chai';
import { deployContract } from 'ethereum-waffle';

const [alice, bob] = getWallets();

describe('Card', async () => {
  let cardContract: PepemonCardOracle;

  beforeEach(async () => {
    cardContract = (await deployContract(alice, CardArtifact)) as PepemonCardOracle;
  });

  describe('::BattleCard', async () => {
    beforeEach(async () => {
      await cardContract.addBattleCard({
        battleCardId: 1,
        element: 0,
        name: 'Pepesaur',
        hp: 450,
        spd: 10,
        inte: 5,
        def: 10,
        atk: 10,
        sAtk: 20,
        sDef: 20,
      });
    });

    describe('#addBattleCard', async () => {
      it('should be able to add battleCard', async () => {
        await cardContract.addBattleCard({
          battleCardId: 2,
          element: 0,
          name: 'Pepemander',
          hp: 300,
          spd: 20,
          inte: 6,
          def: 8,
          atk: 12,
          sAtk: 24,
          sDef: 16,
        });
        await cardContract.battleCardStats(2).then((battleCard: any) => {
          expect(battleCard['name']).to.eq('Pepemander');
        });
      });

      describe('reverts if', async () => {
        it('battle card id is duplicated', async () => {
          await expect(
            cardContract.addBattleCard({
              battleCardId: 1,
              element: 0,
              name: 'Pepemander',
              hp: 300,
              spd: 20,
              inte: 6,
              def: 8,
              atk: 12,
              sAtk: 24,
              sDef: 16,
            })
          ).to.be.revertedWith('PepemonCard: BattleCard already exists');
        });
      });
    });

    describe('#updateBattleCard', async () => {
      it('should be able to update battleCard', async () => {
        await cardContract.updateBattleCard({
          battleCardId: 1,
          element: 0,
          name: 'Pepesaurrrrrr',
          hp: 500,
          spd: 10,
          inte: 5,
          def: 10,
          atk: 10,
          sAtk: 20,
          sDef: 20,
        });
        await cardContract.battleCardStats(1).then((battleCard: any) => {
          expect(battleCard['name']).to.eq('Pepesaurrrrrr');
          expect(battleCard['hp']).to.eq(500);
        });
      });

      describe('reverts if', async () => {
        it('battleCard id is not found', async () => {
          await expect(
            cardContract.updateBattleCard({
              battleCardId: 2,
              element: 0,
              name: 'Pepesaur',
              hp: 500,
              spd: 10,
              inte: 5,
              def: 10,
              atk: 10,
              sAtk: 20,
              sDef: 20,
            })
          ).to.be.revertedWith('PepemonCard: BattleCard not found');
        });
      });
    });

    describe('#getBattleCard', async () => {
      it('should be able to get battleCard by id', async () => {
        await cardContract.getBattleCardById(1).then((battleCard: any) => {
          expect(battleCard['name']).to.eq('Pepesaur');
        });
      });

      describe('reverts if', async () => {
        it('battleCard id is not found', async () => {
          await expect(cardContract.getBattleCardById(2)).to.be.revertedWith(
            'PepemonCard: BattleCard not found'
          );
        });
      });
    });
  });

  describe('::SupportCard', async () => {
    beforeEach(async () => {
      await cardContract.addSupportCard({
        supportCardId: 1,
        supportCardType: 0,
        name: 'Fast Attack',
        effectOne: {
            basePower: 2,
            triggeredPower: 2,
            effectTo: 0,
            effectFor: 0,
            reqCode: 0,
        },
        effectMany: {
          power: 0,
          numTurns: 0,
          effectTo: 0,
          effectFor: 0,
          reqCode: 0,
        },
        unstackable: true,
        unresettable: true,
      });
    });

    describe('#addSupportCard', async () => {
      it('should be able to add support card', async () => {
        await cardContract.addSupportCard({
          supportCardId: 2,
          supportCardType: 0,
          name: 'Mid Attack',
          effectOne: {
              basePower: 3,
              triggeredPower: 3,
              effectTo: 0,
              effectFor: 0,
              reqCode: 0,
          },
          effectMany: {
            power: 0,
            numTurns: 0,
            effectTo: 0,
            effectFor: 0,
            reqCode: 0,
          },
          unstackable: true,
          unresettable: true,
        });
        await cardContract.supportCardStats(2).then((supportCard: any) => {
          expect(supportCard['supportCardId']).to.eq(2);
          expect(supportCard['name']).to.eq('Mid Attack');
        });
      });
      describe('reverts if', async () => {
        it('support card id is duplicated', async () => {
          await expect(
            cardContract.addSupportCard({
              supportCardId: 1,
              supportCardType: 0,
              name: 'Fast Attack',
              effectOne: {
                  basePower: 2,
                  triggeredPower: 2,
                  effectTo: 0,
                  effectFor: 0,
                  reqCode: 0,
              },
              effectMany: {
                power: 0,
                numTurns: 0,
                effectTo: 0,
                effectFor: 0,
                reqCode: 0,
              },
              unstackable: true,
              unresettable: true,
            })
          ).to.be.revertedWith('PepemonCard: SupportCard already exists');
        });
      });
    });

    describe('#updateSupportCard', async () => {
      it('should be able to update support card', async () => {
        await cardContract.updateSupportCard({
          supportCardId: 1,
          supportCardType: 0,
          name: 'Fast Attackkkkk',
          effectOne: {
              basePower: 20,
              triggeredPower: 20,
              effectTo: 0,
              effectFor: 0,
              reqCode: 0,
          },
          effectMany: {
            power: 0,
            numTurns: 0,
            effectTo: 0,
            effectFor: 0,
            reqCode: 0,
          },
          unstackable: true,
          unresettable: true,
        });
        await cardContract.supportCardStats(1).then((supportCard: any) => {
          expect(supportCard['name']).to.eq('Fast Attackkkkk');
        });
      });
      describe('reverts if', async () => {
        it('support card id is not found', async () => {
          await expect(
            cardContract.updateSupportCard({
              supportCardId: 2,
              supportCardType: 0,
              name: 'Fast Attackkkkk',
              effectOne: {
                  basePower: 20,
                  triggeredPower: 20,
                  effectTo: 0,
                  effectFor: 0,
                  reqCode: 0,
              },
              effectMany: {
                power: 0,
                numTurns: 0,
                effectTo: 0,
                effectFor: 0,
                reqCode: 0,
              },
              unstackable: true,
              unresettable: true,
            })
          ).to.be.revertedWith('PepemonCard: SupportCard not found');
        });
      });
    });

    describe('#getSupportCard', async () => {
      it('should be able to get support card by id', async () => {
        await cardContract.getSupportCardById(1).then((supportCard: any) => {
          expect(supportCard['name']).to.eq('Fast Attack');
        });
      });
    });
  });
});
