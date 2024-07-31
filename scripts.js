
document.getElementById('infoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const rank = formData.get('rank');
    const id = formData.get('id');
    const photoFile = formData.get('photo');

    if (!photoFile) {
        alert('Please upload a photo.');
        return;
    }

    const photoBlob = URL.createObjectURL(photoFile);
    const photoResponse = await fetch(photoBlob);
    const photoArrayBuffer = await photoResponse.arrayBuffer();

    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    
    
    const image = await pdfDoc.embedPng(photoArrayBuffer);
    const imageDims = image.scale(0.3); 
    
    page.drawImage(image, {
        x: 50,
        y: height - imageDims.height - 50,
        width: imageDims.width,
        height: imageDims.height,
    });

   
    const textX = 50 + imageDims.width + 20; 

    page.drawText(`Name: ${name}`, { x: textX, y: height - 100, size: 20 });
    page.drawText(`Rank: ${rank}`, { x: textX, y: height - 140, size: 20 });
    page.drawText(`ID Number: ${id}`, { x: textX, y: height - 180, size: 20 });

    
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    
    const pdfContainer = document.getElementById('pdfContainer');
    const pdfIframe = document.getElementById('pdfIframe');
    pdfIframe.src = pdfUrl;
    pdfContainer.style.display = 'block';
});
