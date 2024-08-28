#!/usr/bin/env bash

# if [[ "$@" == "--skip" ]]
# then
#    echo "Skipping package installs and unlinking (good to unlink when change common lib code for example)."
    cd ..
# else

#    echo Unlinking packages in each build.json folder in case changed code in $1
#    echo skip this option using --skip flag

#    cd ../$1

#    echo unlinking packages

#    cdt2 package unlink sap-decision-rules
#    cdt2 package unlink eso-commonlib

#    cdt2 package install --autofill
#    cd ..
# fi

cdt2 build --packages eso-commonlib,sap-execution-log,sap-decision-rules,sap-logout \
            --output sap-ui.tar.gz --prop-version 0.0.0 --deploy target/deploymentRoot/sap

cp -f sap-execution-log/container.config.js target/deploymentRoot/sap/config.js

