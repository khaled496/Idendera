import {
  Client,
  Hbar,
  AccountCreateTransaction,
  PrivateKey,
  AccountId
} from '@hashgraph/sdk';

// Task 1
export async function createAccount() {
  const myAccountId = AccountId.fromString("0.0.5902618");
  const myAccountKey = PrivateKey.fromString("3030020100300706052b8104000a0422042047865a505bf0f0708f4291cf1a9620dd8a8fdc9cb3bf7482a468712a45db9c37");
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myAccountKey);

  const account1pvk = await PrivateKey.generate();
  const accountpbk = account1pvk.publicKey;

  const account1T = await new AccountCreateTransaction()
    .setKey(accountpbk)
    .setInitialBalance(new Hbar(10))
    .execute(client);

  const rec = await account1T.getReceipt(client);
  const account1 = rec.accountId;

  return {
    account1: account1.toString(),
    accountpbk: accountpbk.toString(),
    account1pvk: account1pvk.toString()
  };
}

