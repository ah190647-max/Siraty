let fontsLoaded = false;

export async function initFonts(pdfMake) {
  if (fontsLoaded) return;
  try {
    const [cairoRegular, cairoBold, robotoRegular, robotoBold] = await Promise.all([
      fetch('/fonts/Cairo-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Cairo-Bold.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Roboto-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/Roboto-Bold.ttf').then(r => r.arrayBuffer()),
    ]);
    pdfMake.vfs = {
      ...pdfMake.vfs,
      'Cairo-Regular.ttf': cairoRegular,
      'Cairo-Bold.ttf': cairoBold,
      'Roboto-Regular.ttf': robotoRegular,
      'Roboto-Bold.ttf': robotoBold,
    };
    pdfMake.fonts = {
      Cairo: { normal: 'Cairo-Regular.ttf', bold: 'Cairo-Bold.ttf' },
      Roboto: { normal: 'Roboto-Regular.ttf', bold: 'Roboto-Bold.ttf' },
    };
    fontsLoaded = true;
  } catch (error) {
    console.error('Failed to load fonts', error);
    alert('تعذر تحميل الخطوط. تأكد من وجود ملفات الخط في public/fonts/');
  }
}

export function isFontsLoaded() {
  return fontsLoaded;
}