// PDF.js Global Configuration
const pdfjsLib = window['pdfjs-dist/build/pdf'];

// PDF'yi render etme fonksiyonu
async function renderPDFWithText(file) {
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

      // Sayfanın metnini al
      const textContent = await page.getTextContent();
      const allText = textContent.items.map(item => item.str).join(' ');
      console.log(`Page ${pageNum} text:`, allText);

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

      // Sayfa kapsayıcısını oluştur
      const pageContainer = document.createElement('div');
      pageContainer.classList.add('pdf-page');

      // Sayfaya bir resim ekle
      const photoOverlay = document.createElement('div');
      photoOverlay.classList.add('photo-overlay');
      photoOverlay.style.backgroundImage = "url('https://via.placeholder.com/100')"; // Fotoğraf URL'si

      // Canvas ve fotoğrafı sayfa kapsayıcısına ekle
      pageContainer.appendChild(canvas);
      pageContainer.appendChild(photoOverlay);

      pdfContainer.appendChild(pageContainer);

      // Metni kullanmak için bir değişkende tutabilirsiniz
      console.log(`Extracted text from page ${pageNum}:`, allText);
    }
  };

  fileReader.readAsArrayBuffer(file);
}

// Dosya seçme etkinliği
document.getElementById('file-input').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    renderPDFWithText(file);
  } else {
    alert('Please select a valid PDF file.');
  }
});
