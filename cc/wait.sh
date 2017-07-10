echo ">>> Making sure Mongo DB is up"
MONGO_UP=NO
try=0
while [ $try -lt 40 ]; do
    try=$(( $try + 1 ))
    RES=$(/wait-for-it.sh -h mongodb -p 27017 -t 5 2>&1 >/dev/null | grep timeout)
    if [[ -n ${RES} ]] ; then
       echo "Mongo DB not (yet) ready"
    else
        MONGO_UP=YES
        echo "Mongo DB up: ${MONGO_UP} on http://data:27017"
        break
    fi
done
echo "<<< Done checking on Mongo DB"
