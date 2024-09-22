#!/bin/bash

#W=800
#H=600
W=1000
H=750

declare -a NUMS=("52" "58" "65" "66" "69" "487" "421" "502")

for NN in "${NUMS[@]}"; do
    URL=https://picsum.photos/id/$NN/$W/$H
    FN=bgs/${NN}_${W}_${H}.jpg
    wget $URL -O $FN
done
