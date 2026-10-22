# Register two scheduled tasks for the current user (no admin rights needed):
#   Owlery start  - at log-on, start the processes pm2 saved (pm2 resurrect)
#   Owlery backup - every night at 02:00, back up the database (backup-db.ps1)
# Usage: powershell -ExecutionPolicy Bypass -File deploy\windows\register-tasks.ps1
$ErrorActionPreference = 'Stop'
$pm2 = (Get-Command pm2.cmd -ErrorAction Stop).Source
$backup = Join-Path $PSScriptRoot 'backup-db.ps1'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName 'Owlery start' -Force -Settings $settings `
  -Trigger (New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME) `
  -Action (New-ScheduledTaskAction -Execute $pm2 -Argument 'resurrect') | Out-Null

Register-ScheduledTask -TaskName 'Owlery backup' -Force -Settings $settings `
  -Trigger (New-ScheduledTaskTrigger -Daily -At 2am) `
  -Action (New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$backup`"") | Out-Null

Write-Host 'Registered: Owlery start (at log-on) and Owlery backup (daily 02:00).'
