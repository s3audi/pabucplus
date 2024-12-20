// PDF.js Global Configuration
const pdfjsLib = window['pdfjs-dist/build/pdf'];

// Fotoğraf seçim kuralları (metne göre)
const photoRules = [
  { text: "Fotoğrafla", photoUrl: "https://via.placeholder.com/100/FF0000/FFFFFF?text=Invoice" },
  { text: "Fsiz", photoUrl: "https://via.placeholder.com/100/00FF00/FFFFFF?text=Report" },
  { text: "Hatalı", photoUrl: "https://via.placeholder.com/100/0000FF/FFFFFF?text=Summary" },
];

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

      // Uygun fotoğrafı seç
      const matchingRule = photoRules.find(rule => allText.includes(rule.text));
      const photoUrl = matchingRule ? matchingRule.photoUrl : "https://via.placeholder.com/100/CCCCCC/000000?text=No+Match";

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
      photoOverlay.style.backgroundImage = `url('${photoUrl}')`;

      // Canvas ve fotoğrafı sayfa kapsayıcısına ekle
      pageContainer.appendChild(canvas);
      pageContainer.appendChild(photoOverlay);

      pdfContainer.appendChild(pageContainer);

      // Konsola çıkarılan metni yazdır
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
