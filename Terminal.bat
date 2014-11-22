@echo off
setlocal
:loop
set /P command="Terminal>"
%command%
goto loop
endlocal