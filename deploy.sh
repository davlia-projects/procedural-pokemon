PROJ_DIR=~/workspace/procedural-pokemon
BUILD_DIR=$PROJ_DIR/build
DEPLOY_DIR=$PROJ_DIR/../procedural_pokemon_build
set -o errexit

printf "Building...\n"
npm run build > /dev/null

printf "Creating deploy environment...\n"
if [ -d $DEPLOY_DIR ]; then
  rm -rf $DEPLOY_DIR > /dev/null
  printf "Deploy directory already exists, removing...\n"
fi

mkdir -p $DEPLOY_DIR
cp -R $BUILD_DIR/* $DEPLOY_DIR
cd $DEPLOY_DIR

printf "Deploying...\n"
git init > /dev/null
git remote add origin git@github.com:davlia/procedural-pokemon.git > /dev/null
git checkout -b gh-pages 1>/dev/null 2>/dev/null
git add -A > /dev/null
git commit -am "deploying" > /dev/null
git push -f origin gh-pages 1>/dev/null 2>/dev/null
printf "Success!\n"

printf "Cleaning up...\n"
rm -rf $BUILD_DIR
rm -rf $DEPLOY_DIR
