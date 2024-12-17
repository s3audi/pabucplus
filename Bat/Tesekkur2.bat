@echo off
:: PDF dosyasının tam yolu
set pdf_path="C:\Users\ZEO\Desktop\TesekkurTurqstore.pdf"

:: Yazıcının adı (Denetim Masası > Yazıcılar ve Tarayıcılar'da görünen ad)
set printer_name="Samsung ML-2160 Series (USB001)"

:: Yazdırılacak kopya sayısı
set copy_count=2

:: Adobe Acrobat Reader'ın yüklü olduğu yer (standart yol, gerekirse düzenleyin)
set acrobat_path="C:\Program Files\Adobe\Acrobat DC\Acrobat\Acrobat.exe"

:: PDF'yi yazıcıya gönder
for /L %%i in (1,1,%copy_count%) do (
    "%acrobat_path%" /t %pdf_path% %printer_name%
)