#!/bin/bash

# Fix missing url in schema.prisma for all services

PROJECT_ROOT="/data/all-erp"
echo "🚀 Starting Prisma Schema Fix..."

find "$PROJECT_ROOT/apps" -name "schema.prisma" | while read -r schema; do
    # Check if url is defined in datasource block
    # We look for "datasource db" then scan for "url" inside it roughly.
    # Simpler: just grep "url" in the file if the file is small (it is). 
    # But checking context is safer?
    # All schemas seen have "datasource db" at top.
    
    if grep -q "url" "$schema"; then
        echo "  ✅ url already exists in $(basename $(dirname $(dirname "$schema")))"
    else
        echo "  🔧 Adding url to $(basename $(dirname $(dirname "$schema")))"
        # Insert url = env("DATABASE_URL") after provider = "postgresql"
        sed -i '/provider = "postgresql"/a \    url      = env("DATABASE_URL")' "$schema"
    fi
done

echo "🎉 Schema Fix Complete."
