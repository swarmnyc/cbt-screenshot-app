echo "Start building..."

# npm build
if [[ ! -e app/build/index.html ]]
then
    echo "There is no index.html, run script:"
    npm run build
fi

# copy build files to app
cp -r build app/build

# copy eletron files to app
cp -r electron app/electron

# yarn dist:electron
echo "Cooking App... ^_^"
npm run electron:dist

# clear app/
rm -rv app/build
rm -rv app/electron

echo "--- Finish Build :) ---"
