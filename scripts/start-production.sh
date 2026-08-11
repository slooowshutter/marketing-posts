#!/bin/zsh
set -e
export HOME=/Users/marclamy
export PATH=/Users/marclamy/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin
export NODE_ENV=production
cd "${0:A:h}/.."
exec node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3000
