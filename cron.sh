speedtest=/home/tatsuki/.pyenv/shims/speedtest-cli
$speedtest --list | grep "OPEN Project" | cut -d' ' -f1 | rev | cut -c 2- | rev | xargs $speedtest --csv --no-upload --server >> csv/speed.csv
