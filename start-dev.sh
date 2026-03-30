#!/bin/bash
export PATH="/Users/rickfrederick/.nvm/versions/node/v20.20.2/bin:$PATH"
cd /Users/rickfrederick/native-archival/website-build
exec npx next dev --port 3000
