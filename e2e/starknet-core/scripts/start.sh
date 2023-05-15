#!/bin/bash
source ../../e2e/e2e.env
yarn && yarn typechain && yarn e2e:node & sleep 15 && yarn e2e:setup && tail -f /dev/null