// PDF.js Global Configuration
const pdfjsLib = window['pdfjs-dist/build/pdf'];

// PDF'yi render etme fonksiyonu
async function renderPDF(file) {
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

      // Canvas oluştur ve PDF sayfasını çiz
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Canvas'ı sayfa kapsayıcısına ekle
      const pageContainer = document.createElement('div');
      pageContainer.classList.add('pdf-page');
      pageContainer.appendChild(canvas);

      pdfContainer.appendChild(pageContainer);
    }
  };

  fileReader.readAsArrayBuffer(file);
}

// Dosya seçme etkinliği
document.getElementById('file-input').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    renderPDF(file);
  } else {
    alert('Please select a valid PDF file.');
  }
});
