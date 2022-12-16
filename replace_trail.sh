#!/bin/bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

sed -i "s/_d__[0-9\-]*__d_/_d__$(sed -e 's/ //g' <<< "$(od -An -N4 -i /dev/random)")__d_/g" public/index.html;
echo "Replaced sequence";
