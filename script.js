// Fotoğraf kuralları: Türkçe metinlere göre fotoğraflar
const photoRules = [
    { text: "FİNİSH ULTİMATE DİSHWASHER DETERGENT- 75 COUNT - WİTH CYCLESYNC TECHNOLOGY - GTIP 340290900015", photoUrl: "https://via.placeholder.com/100/FF0000/FFFFFF?text=Fatura" },
    { text: "rapor", photoUrl: "https://via.placeholder.com/100/00FF00/FFFFFF?text=Rapor" },
    { text: "özet", photoUrl: "https://via.placeholder.com/100/0000FF/FFFFFF?text=Özet" },
  ];
  
  // PDF.js ve Tesseract.js ile PDF işleme
  async function processPDFWithOCR(file) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = ''; // Önceki içeriği temizle
  
    // PDF dosyasını oku
    const fileReader = new FileReader();
    fileReader.onload = async function (e) {
      const typedarray = new Uint8Array(e.target.result);
  
      // PDF'yi yükle
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
  
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
  
        // Canvas oluştur ve PDF sayfasını görüntüye dönüştür
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2 });
  
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
  
        // OCR ile metin çıkarma
        const imageData = canvas.toDataURL('image/png');
        const ocrResult = await Tesseract.recognize(imageData, 'tur', {
          logger: info => console.log(info), // İşlem ilerlemesi için log
        });
  
        const extractedText = ocrResult.data.text.toLowerCase().trim();
        console.log(`Sayfa ${pageNum} metni:`, extractedText);
  
        // Fotoğraf kuralları
        const matchingRule = photoRules.find(rule => extractedText.includes(rule.text));
        const photoUrl = matchingRule
          ? matchingRule.photoUrl
          : "https://via.placeholder.com/100/CCCCCC/000000?text=Eşleşme+Yok";
  
        // Sayfa kapsayıcısını oluştur
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('pdf-page');
  
        // Sayfaya bir fotoğraf ekle
        const photoOverlay = document.createElement('div');
        photoOverlay.classList.add('photo-overlay');
        photoOverlay.style.backgroundImage = `url('${photoUrl}')`;
  
        // Canvas ve fotoğrafı sayfa kapsayıcısına ekle
        pageContainer.appendChild(canvas);
        pageContainer.appendChild(photoOverlay);
  
        pdfContainer.appendChild(pageContainer);
      }
    };
  
    fileReader.readAsArrayBuffer(file);
  }
  
  // Dosya seçme etkinliği
  document.getElementById('file-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      processPDFWithOCR(file);
    } else {
      alert('Lütfen geçerli bir PDF dosyası seçin.');
    }
  });
  