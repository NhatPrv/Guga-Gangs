@echo off
chcp 65001 > nul
title Guga Gangs - JLPT Master (N5 - N3)
color 0B
cls

echo ==============================================================================
echo        🌸 GUGA GANGS - HỆ THỐNG HỌC & LUYỆN THI JLPT MASTER (N5 - N3) 🌸
echo ==============================================================================
echo.

:: 1. Kiểm tra môi trường Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] CẢNH BÁO: Máy tính của bạn chưa cài đặt Node.js!
    echo.
    echo     Ứng dụng cần Node.js (phiên bản 16 trở lên) để chạy máy chủ học tập.
    echo     Vui lòng tải và cài đặt Node.js tại trang chủ:
    echo     👉 https://nodejs.org/
    echo.
    echo Đang tự động mở trình duyệt tải Node.js cho bạn...
    start https://nodejs.org/
    echo.
    echo Sau khi cài đặt xong Node.js, bạn chỉ cần mở lại file này để bắt đầu học!
    echo ==============================================================================
    pause
    exit /b 1
)

:: 2. Thông báo địa chỉ truy cập
echo [v] Đã phát hiện môi trường Node.js thành công.
echo.
echo ==============================================================================
echo  🎓 ĐỊA CHỈ TRUY CẬP HỌC TẬP CỦA BẠN:
echo.
echo        👉  http://localhost:48921
echo.
echo ==============================================================================
echo.
echo [*] Đang tự động mở trình duyệt web của bạn...
echo [*] Máy chủ tĩnh đang lắng nghe tại cổng 48921 (Độc lập & không lo trùng cổng).
echo.
echo (*) Lưu ý: Để dừng ứng dụng, bạn chỉ cần đóng cửa sổ đen này lại hoặc nhấn Ctrl+C.
echo ------------------------------------------------------------------------------
echo.

:: 3. Chờ 1 giây rồi tự động mở trình duyệt đến cổng 48921
timeout /t 2 /nobreak > nul
start http://localhost:48921

:: 4. Khởi chạy máy chủ Node.js (Zero-dependency)
node server.js

pause
