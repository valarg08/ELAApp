# Empty the pm2 log files of the Owlery processes, so they never grow large. The scheduled task
# "Owlery logs" (register-tasks.ps1) runs it every night at 02:10, after the backup; the admin Logs
# page then shows what happened since.
# Usage: powershell -ExecutionPolicy Bypass -File deploy\windows\clear-logs.ps1
$ErrorActionPreference = 'Stop'
foreach ($app in 'owlery-api', 'owlery-worker', 'owlery-web', 'owlery-tunnel') {
  pm2 flush $app | Out-Null
}
Write-Host 'Cleared the Owlery log files.'
