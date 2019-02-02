from flask import Flask, render_template
import csv
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/speed.json')
def speed_json():
    # data = load_speed_csv('./csv/speed_test.csv')
    data = load_speed_csv('./csv/speed.csv')
    data_res = create_response_data(data)
    return json.dumps(data_res)


def create_response_data(data):
    data_res = {}
    data_res['Timestamp'] = data['Timestamp']
    data_res['Download'] = data['Download']
    return data_res


def load_speed_csv(csv_path):
    with open(csv_path, 'r') as f:
        rows = [row for row in csv.reader(f)]

    header = ['Server ID', 'Sponsor', 'Server Name', 'Timestamp',
              'Distance', 'Ping', 'Download', 'Upload', 'Share', 'IP Address']
    data = {}
    for i, key in enumerate(header):
        data[key] = [rows[j][i] for j in range(len(rows))]
    return data


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=15000)
