# Install or update the production copy of Owlery Academy, then (re)start it with pm2.
# Run from the production copy's root:  powershell -ExecutionPolicy Bypass -File deploy\windows\update.ps1
# See deploy\windows\README.md.
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $root

if (-not (Test-Path '.env')) { throw 'No .env here. Copy deploy\windows\env.production.example to .env and fill it in.' }

function Invoke-Step($label, [scriptblock]$step) {
  Write-Host "==> $label"
  & $step
  if ($LASTEXITCODE -ne 0) { throw "$label failed (exit $LASTEXITCODE)" }
}

Invoke-Step 'Get the latest code' { git pull --ff-only }
# Install before NODE_ENV=production is set: the build needs the dev dependencies.
Invoke-Step 'Install packages' { pnpm install --frozen-lockfile }

# Load .env into this session so the build sees WEB_ORIGIN, API_INTERNAL_URL and friends.
Get-Content '.env' | Where-Object { $_ -match '^\s*[A-Z_][A-Z0-9_]*\s*=' } | ForEach-Object {
  $name, $value = $_ -split '=', 2
  Set-Item -Path "env:$($name.Trim())" -Value $value.Trim().Trim('"')
}
$env:NODE_ENV = 'production'

Invoke-Step 'Build' { pnpm build }
Invoke-Step 'Update the database' { pnpm db:migrate:deploy }
Invoke-Step 'Load the curriculum' { node apps/api/dist/cli/content-sync.js }

$ecosystem = Join-Path $PSScriptRoot 'ecosystem.config.cjs'
Invoke-Step 'Start or restart the site' { pm2 startOrReload $ecosystem --update-env }
Invoke-Step 'Remember the processes' { pm2 save }
Write-Host "Done. Check: pm2 status, and http://localhost:$(if ($env:WEB_PORT) { $env:WEB_PORT } else { '3200' })/status"
