@echo off

REM Load common environment variables from BaseTask.bat
if exist BaseTask.bat call BaseTask.bat %*

set TASK_NAME=Recovery Ts

echo.
echo.
echo *****************************************************
echo *** Running %TASK_NAME%...
echo *****************************************************

REM Set task-specific parameters
set COMMANDLET_NAME=RecoveryTs

REM Set arguments
set ARGS=-ProjectDir="%PROJECT_DIR%"
	
echo %PACKAGE_TASK_EXE% %PROJECT_FILE% -Run=%COMMANDLET_NAME% %ARGS%

REM Call commandlet with parameters
call %PACKAGE_TASK_EXE% %PROJECT_FILE% -Run=%COMMANDLET_NAME% %ARGS%

REM Set error code based on success or failure
if %ERRORLEVEL% == 0 (
	echo %TASK_NAME% succeeded.
	exit /B 0
) else (
	echo %TASK_NAME% failed.
	exit /B 1
)