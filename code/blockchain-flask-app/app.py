from flask import Flask
from flask import request

from ethereum.rinkebyUtils import trigger, create_wallet, ether_send

app = Flask(__name__)


@app.route('/add_coins', methods=['POST'])
def add_coins():
    weight = int(request.form['weight'])
    data = [100, 150, 200]
    # type = 0 -> vidrio
    # type = 1 -> plastico
    # type = 2 -> papel

    type = int(request.form['type'])
    address = request.form['address']

    coins = (weight / data[type]) + 1

    params = []
    params.append(address)
    params.append(int(coins))
    datos = trigger(False, "mint", params, "")

    return "{\"tx_hash\": \"" + datos + "\"}"


@app.route('/transfer_coins', methods=['POST'])
def transfer_coins():
    coins = int(request.form['coins'])
    to_address = request.form['to_address']
    p_key_from = request.form['p_key_from']
    concept = request.form['concept']

    params = []
    params.append(to_address)
    params.append(coins)
    params.append(concept)

    datos = trigger(False, "transfer", params, p_key_from)

    return "{\"tx_hash\": \"" + datos + "\"}"


@app.route('/get_balance', methods=['POST'])
def get_balance():
    address = request.form['address']

    params = []
    params.append(address)
    datos = trigger(True, "getBalance", params, "")

    print(datos)

    return "{\"balance\": " + str(datos) + "}"


@app.route('/new_wallet', methods=['GET'])
def new_wallet():
    address, p_key = create_wallet()

    print(address)

    return "{\"address\": \"" + str(address) + "\", \"p_key\": \"" + str(p_key.hex()) + "\"}"


@app.route('/activate_wallet', methods=['POST'])
def activate_wallet():
    address = request.form['address']

    params = []
    params.append(address)
    datos = ether_send(address, 0.1)

    return str(datos    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=True)
