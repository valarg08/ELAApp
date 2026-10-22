# Nightly backup of the production database (pg_dump custom format), keeping the last 14.
# Usage: powershell -ExecutionPolicy Bypass -File deploy\windows\backup-db.ps1
# BACKUP_DIR in .env picks the folder (a OneDrive folder keeps a copy off this PC).
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$settings = @{}
Get-Content (Join-Path $root '.env') | Where-Object { $_ -match '^\s*[A-Z_][A-Z0-9_]*\s*=' } | ForEach-Object {
  $name, $value = $_ -split '=', 2
  $settings[$name.Trim()] = $value.Trim().Trim('"')
}
$dir = if ($settings.BACKUP_DIR) { $settings.BACKUP_DIR } else { Join-Path $root 'backups' }
New-Item -ItemType Directory -Force $dir | Out-Null

$pgDump = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\pg_dump.exe' | Sort-Object FullName | Select-Object -Last 1
if (-not $pgDump) { throw 'pg_dump.exe not found under C:\Program Files\PostgreSQL' }

$file = Join-Path $dir ("owlery-{0}.dump" -f (Get-Date -Format 'yyyy-MM-dd-HHmm'))
& $pgDump.FullName --format=custom --no-owner --file=$file "--dbname=$($settings.DATABASE_URL)"
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed (exit $LASTEXITCODE)" }

Get-ChildItem $dir -Filter 'owlery-*.dump' | Sort-Object Name -Descending | Select-Object -Skip 14 | Remove-Item
Write-Host "Backed up to $file"
