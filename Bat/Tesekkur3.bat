

@echo off
:: PDF dosyasının tam yolu
set pdf_path="C:\Users\ZEO\Desktop\TesekkurTurqstore.pdf"

:: Yazıcının adı
set printer_name="SamsungML2160"

:: SumatraPDF'nin kurulu olduğu yer
set sumatra_path="C:\Users\ZEO\AppData\Local\SumatraPDF\SumatraPDF.ex"

:: Yazdırma işlemi
"%sumatra_path%" -print-to "%printer_name%" %pdf_path%