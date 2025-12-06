#!/bin/bash

PROJECT_ROOT="/data/all-erp"
echo "🚀 Reverting Prisma Schema Fix..."

find "$PROJECT_ROOT/apps" -name "schema.prisma" | while read -r schema; do
    if grep -q 'url *= *env("DATABASE_URL")' "$schema"; then
        echo "  🔧 Removing url from $(basename $(dirname $(dirname "$schema")))"
        # Remove line containing url = env("DATABASE_URL")
        # Be careful not to remove other urls if any (unlikely in datasource block)
        sed -i '/url *= *env("DATABASE_URL")/d' "$schema"
    fi
done

echo "🎉 Schema Revert Complete."
