#!/bin/bash
set -eu -o pipefail

for ((i=0; ;i++)); do
  echo "[wait-for:$i] ${*}"
  sleep "$i"
  if "${@}"; then
    echo "[wait-for:$i:success] ${*}"
    break;
  fi
done
