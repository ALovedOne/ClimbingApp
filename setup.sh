#!/bin/bash

virtualenv -p python3 climbingAppVenv/

ln -s ../../../secret_settings.py climbingAppVenv/lib/python3.5/

. climbingAppVenv/bin/activate

pip install -r climbingApp/requirements.txt

./climbingApp/manage.py migrate

./climbingApp/manage.py loaddata climbingApp/climbingApp/fixtures/ascentOutcomes.json
./climbingApp/manage.py loaddata climbingApp/climbingApp/fixtures/color.json
./climbingApp/manage.py loaddata climbingApp/climbingApp/fixtures/difficulty.json
