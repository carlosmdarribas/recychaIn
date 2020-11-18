import os
import json
import configparser
import time
import threading
import datetime
import random

from eth_account import Account

from web3 import Web3
from web3.middleware import geth_poa_middleware

file_config = 'conf/config.ini'
config = configparser.ConfigParser()
config.read(file_config)
eth_cfg = config['rinkeby']

provider = Web3.WebsocketProvider(eth_cfg['ws_provider'])
w3 = Web3(provider)
w3.middleware_onion.inject(geth_poa_middleware, layer=0)


def load_contract():
    print(os.path.abspath(os.getcwd()))
    with open(os.path.join(os.path.abspath(os.getcwd()), eth_cfg['contract_address'] + '.json'), 'r') as f:
        contract = json.load(f)
        contract_address = eth_cfg['contract_address']
        print(contract_address)
        return contract_address, contract


def get_contract():
    contract_addres, abi = load_contract()
    return w3.eth.contract(
        address=contract_addres,
        abi=abi,
    )

def prepare_transaction(pKey, gas):
    contract = get_contract()
    acct = Account.privateKeyToAccount(pKey)
    nonce = w3.eth.getTransactionCount(acct.address)
    data = {'gas': gas, 'gasPrice': w3.eth.gasPrice, 'nonce': nonce}
    return contract, acct, data


def sign_and_send_transaction(acct, tx):
    signed = acct.signTransaction(tx)
    tx_hash = w3.eth.sendRawTransaction(signed.rawTransaction)
    print("Sending transaction")
    while True:
        try:
            w3.eth.getTransactionReceipt(tx_hash)
            break
        except:
            time.sleep(3)
            print('Waiting on Transaction')

    print('tx_hash: ' + w3.toHex(tx_hash))
    return w3.eth.getTransactionReceipt(tx_hash), w3.toHex(tx_hash)


def trigger(view, method, params, pKey):
    if view:
        contract = get_contract()
        contract_func = contract.functions[method]
        result = contract_func(*params).call()
        return result
    else:
        if (pKey == ""):
            contract, acct, data = prepare_transaction(eth_cfg['private_key'], 4000000)
        else:
            contract, acct, data = prepare_transaction(pKey, 4000000)
        contract_func = contract.functions[method]
        tx = contract_func(*params).buildTransaction(data)
        tx_receipt, tx_hash = sign_and_send_transaction(acct, tx)
        return tx_hash


def ether_send(address, etherAmount):
    acct = w3.eth.account.privateKeyToAccount(eth_cfg['private_key'])
    signed_txn = w3.eth.account.signTransaction({
        'nonce': w3.eth.getTransactionCount(acct.address),
        'gasPrice': w3.eth.gasPrice,
        'to': address,
        'value': w3.toWei(etherAmount, 'ether'),
        'gas': w3.eth.estimateGas({'to': address, 'from': acct.address, 'value': w3.toWei(etherAmount, 'ether')})
    }, acct.privateKey)

    tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

    while True:
        try:
            w3.eth.getTransactionReceipt(tx_hash)
            break
        except:
            time.sleep(3)
            print('Waiting on Transaction')

    return tx_hash


def create_wallet():
    acct = w3.eth.account.create()
    ether_send(address=acct.address, etherAmount=0.01)
    return acct.address, acct.privateKey
