@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "" "http://127.0.0.1:8766/index.html"
echo 이 창을 열어두면 키오스크 미리보기가 실행됩니다.
echo 종료하려면 이 창을 닫아 주세요.
python -m http.server 8766 --bind 127.0.0.1
pause
