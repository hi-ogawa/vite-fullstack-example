#!/bin/bash

# based on https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs

# usage:
#   bash misc/dot-env.sh [dot-env-file] [command...]

dot_env_file="$1"
shift

# shellcheck disable=SC2046
env $(grep -v '^#' "$dot_env_file") "${@}"
