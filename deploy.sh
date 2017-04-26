PROJ_DIR=~/workspace/procedural-pokemon
BUILD_DIR=$PROJ_DIR/build
DEPLOY_DIR=$PROJ_DIR/../procedural_pokemon_build
set -o errexit
npm run build
if [ -d $DEPLOY_DIR ]; then
  rm -rf $DEPLOY_DIR
fi
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR
git init
git remote add origin git@github.com:davlia/procedural-pokemon.git
cp -R $BUILD_DIR/* $DEPLOY_DIR
rm -rf $BUILD_DIR
git checkout -b gh-pages
git add -A
git commit -am "deploying"
git push -f origin gh-pages
cd $PROJ_DIR
rm -rf $DEPLOY_DIR
