#!/bin/bash

# Frontend 앱 목록 및 API URL 설정
# Format: app_name:api_url_value
# docker-compose.frontend.yml의 값을 그대로 반영함
APPS=(
  "shell:VITE_API_GATEWAY_URL=http://localhost:8080"
  "system-mfe:VITE_API_URL=http://localhost:3001"
  "hr-mfe:VITE_API_URL=http://localhost:3002"
  "payroll-mfe:VITE_API_URL=http://localhost:3003"
  "attendance-mfe:VITE_API_URL=http://localhost:3004"
  "budget-mfe:VITE_API_URL=http://localhost:3005"
  "treasury-mfe:VITE_API_URL=http://localhost:3006"
  "accounting-mfe:VITE_API_URL=http://localhost:3007"
  "asset-mfe:VITE_API_URL=http://localhost:3008"
  "inventory-mfe:VITE_API_URL=http://localhost:3009"
  "general-affairs-mfe:VITE_API_URL=http://localhost:3010"
)

echo "Starting Frontend .env migration..."

for entry in "${APPS[@]}"; do
  # Split logic (handling the first colon only)
  app_name="${entry%%:*}"
  env_var="${entry#*:}"
  
  # Parsing env_var name and value
  var_name="${env_var%%=*}"
  var_value="${env_var#*=}"

  dir="apps/frontend/$app_name"
  
  if [ ! -d "$dir" ]; then
    echo "Warning: Directory $dir does not exist. Skipping."
    continue
  fi

  echo "Processing $app_name in $dir..."

  # Create .env
  cat > "$dir/.env" <<EOF
# [Frontend] $app_name Environment Variables
VITE_ENV=development
$var_name=$var_value
EOF

  # Create .env.sample
  cat > "$dir/.env.sample" <<EOF
# [Frontend] $app_name Environment Variables Sample
VITE_ENV=development
$var_name=http://localhost:3000
EOF

done

echo "Frontend .env files generated successfully."
