import type { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export const addLogo = async (doc: jsPDF, logoPath: string | null | undefined, startY: number): Promise<number> => {
  if (!logoPath) return startY;

  try {
    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(logoPath);
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = data.publicUrl;
    });

    const imgWidth = 80;
    const imgHeight = (img.height * imgWidth) / img.width;
    doc.addImage(
      img,
      'PNG',
      (doc.internal.pageSize.width - imgWidth) / 2,
      startY,
      imgWidth,
      imgHeight
    );

    return startY + imgHeight + 5;
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    return startY;
  }
};