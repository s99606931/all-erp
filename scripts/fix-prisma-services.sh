#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Starting PrismaService Fix..."

# Apps directory
APPS_DIR="$PROJECT_ROOT/apps"

# Iterate over categories (system, hr, finance, general, platform, ai)
for category in "$APPS_DIR"/*; do
  if [ -d "$category" ]; then
    for service in "$category"/*; do
      if [ -d "$service" ] && [ -f "$service/src/prisma.service.ts" ]; then
        SERVICE_NAME=$(basename "$service")
        echo "Processing $SERVICE_NAME..."

        PRISMA_SERVICE_FILE="$service/src/prisma.service.ts"
        
        # 1. Extract Client Package Name
        CLIENT_PKG=$(grep "from '.prisma/" "$PRISMA_SERVICE_FILE" | cut -d"'" -f2)
        
        if [ -z "$CLIENT_PKG" ]; then
             echo "  ⚠️  Could not find client package in $PRISMA_SERVICE_FILE. Skipping rewrite."
        else
             echo "  ✅ Found client: $CLIENT_PKG"

             # 2. Rewrite prisma.service.ts
             cat > "$PRISMA_SERVICE_FILE" <<EOF
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '$CLIENT_PKG';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.\$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.\$disconnect();
    this.logger.log('Database disconnected successfully');
  }
}
EOF
             echo "  ✨ Rewrote prisma.service.ts"
        fi

        # 3. Fix Imports in src/app/**/*
        # Find files using shared PrismaService
        grep -l "import { PrismaService } from '@all-erp/shared/infra';" -r "$service/src/app" | while read -r file; do
            # Calculate depth relative to src/
            # file is absolute or relative from root? grep -r from $service/src/app returns finding path relative to CWD if not absolute path given?
            # actually grep -r "$service/src/app" returns full path provided.
            
            # Determine replacement based on depth
            REL_PATH="${file#$service/src/}"
            DEPTH=$(echo "$REL_PATH" | tr -cd '/' | wc -c)
            
            # depth 1 (src/app/foo.ts) -> ../prisma.service
            # depth 2 (src/app/foo/bar.ts) -> ../../prisma.service
            # depth 3 (src/app/foo/bar/baz.ts) -> ../../../prisma.service
            
            IMPORT_PATH=""
            if [ "$DEPTH" -eq 1 ]; then
                IMPORT_PATH="../prisma.service"
            elif [ "$DEPTH" -eq 2 ]; then
                IMPORT_PATH="../../prisma.service"
            elif [ "$DEPTH" -eq 3 ]; then
                IMPORT_PATH="../../../prisma.service"
            else
                IMPORT_PATH="../../prisma.service" # Default fallback
            fi
            
            # Replace the import line
            # Using | as delimiter to avoid conflict with /
            sed -i "s|import { PrismaService } from '@all-erp/shared/infra';|import { PrismaService } from '$IMPORT_PATH';|g" "$file"
            echo "  🔧 Fixed import in $REL_PATH"
        done
        
        # Also check for RabbitMQ service combined import
        # import { RabbitMQService, PrismaService } from '@all-erp/shared/infra';
        grep -l "import {.*PrismaService.*} from '@all-erp/shared/infra';" -r "$service/src/app" | while read -r file; do
             # This is harder to regex safely with sed. 
             # We assume standard structure "RabbitMQService, PrismaService" or swapped.
             # We will just warn for manual check if complex
             echo "  ⚠️  Complex import found in $file. Attempting crude fix."
             
             REL_PATH="${file#$service/src/}"
             DEPTH=$(echo "$REL_PATH" | tr -cd '/' | wc -c)
             if [ "$DEPTH" -eq 2 ]; then
                IMPORT_PATH="../../prisma.service"
             else
                IMPORT_PATH="../prisma.service"
             fi

             # If RabbitMQService is also there
             if grep -q "RabbitMQService" "$file"; then
                 # Remove PrismaService from the list
                 sed -i "s/, PrismaService//g" "$file"
                 sed -i "s/PrismaService, //g" "$file"
                 # Add new import line after the shared/infra line
                 sed -i "/@all-erp\/shared\/infra/a import { PrismaService } from '$IMPORT_PATH';" "$file"
             fi
        done

      fi
    done
  fi
done

echo "🎉 Fix complete."
