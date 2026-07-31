$ErrorActionPreference = "Stop"

$KONG_ADMIN = "http://localhost:8001"

Write-Host "Dang cho Kong Admin API..." -ForegroundColor Cyan

$maxRetries = 30
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    try {
        Invoke-RestMethod -Uri $KONG_ADMIN -Method Get | Out-Null
        Write-Host "Kong Admin API da san sang." -ForegroundColor Green
        break
    }
    catch {
        $retryCount++

        if ($retryCount -ge $maxRetries) {
            throw "Khong the ket noi Kong Admin API sau $maxRetries lan thu."
        }

        Start-Sleep -Seconds 2
    }
}

function Ensure-KongService {
    param(
        [string]$Name,
        [string]$Url
    )

    try {
        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/services/$Name" `
            -Method Get | Out-Null

        Write-Host "Service '$Name' da ton tai. Dang cap nhat..." -ForegroundColor Yellow

        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/services/$Name" `
            -Method Patch `
            -ContentType "application/x-www-form-urlencoded" `
            -Body @{
                url = $Url
            } | Out-Null
    }
    catch {
        Write-Host "Dang tao service '$Name'..." -ForegroundColor Cyan

        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/services" `
            -Method Post `
            -ContentType "application/x-www-form-urlencoded" `
            -Body @{
                name = $Name
                url  = $Url
            } | Out-Null
    }
}

function Ensure-KongRoute {
    param(
        [string]$ServiceName,
        [string]$RouteName,
        [string]$Path
    )

    try {
        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/routes/$RouteName" `
            -Method Get | Out-Null

        Write-Host "Route '$RouteName' da ton tai. Dang cap nhat..." -ForegroundColor Yellow

        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/routes/$RouteName" `
            -Method Patch `
            -ContentType "application/x-www-form-urlencoded" `
            -Body @{
                "paths[]"   = $Path
                strip_path  = "false"
            } | Out-Null
    }
    catch {
        Write-Host "Dang tao route '$RouteName'..." -ForegroundColor Cyan

        Invoke-RestMethod `
            -Uri "$KONG_ADMIN/services/$ServiceName/routes" `
            -Method Post `
            -ContentType "application/x-www-form-urlencoded" `
            -Body @{
                name        = $RouteName
                "paths[]"   = $Path
                strip_path  = "false"
            } | Out-Null
    }
}

# Auth microservice
Ensure-KongService `
    -Name "auth-service" `
    -Url "http://host.docker.internal:3002"

Ensure-KongRoute `
    -ServiceName "auth-service" `
    -RouteName "auth-route" `
    -Path "/api/auth"

# Backend / Crypto microservice
Ensure-KongService `
    -Name "crypto-service" `
    -Url "http://host.docker.internal:3001"

Ensure-KongRoute `
    -ServiceName "crypto-service" `
    -RouteName "crypto-route" `
    -Path "/api/crypto"

Ensure-KongRoute `
    -ServiceName "crypto-service" `
    -RouteName "ai-route" `
    -Path "/api/ai"

Write-Host ""
Write-Host "Cau hinh Kong hoan tat!" -ForegroundColor Green
Write-Host "Auth:   http://localhost:8000/api/auth"
Write-Host "Crypto: http://localhost:8000/api/crypto"
Write-Host "AI:     http://localhost:8000/api/ai/chat"



# Script trên có tính idempotent tương đối: nếu service hoặc route đã tồn tại thì cập nhật, chưa tồn tại thì tạo. Vì vậy bạn có thể chạy nhiều lần mà không tạo hàng loạt route trùng nhau.

# Không cần chạy lại khi:
# docker compose restart
# hoặc:
# docker compose down
# docker compose up -d

# Cần chạy lại khi:
# docker compose down -v
# Lệnh -v xóa các named volumes, trong đó có:
# kong_db_data

# Lúc đó toàn bộ database Kong bị reset, nên bạn chạy lại:
# docker compose up -d
# powershell -ExecutionPolicy Bypass -File .\scripts\setup-kong.ps1