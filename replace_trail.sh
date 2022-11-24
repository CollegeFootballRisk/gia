sed -i "s/_d__[0-9\-]*__d_/_d__$(sed -e 's/ //g' <<< "$(od -An -N4 -i /dev/random)")__d_/g" public/index.html;
echo "Replaced sequence";
