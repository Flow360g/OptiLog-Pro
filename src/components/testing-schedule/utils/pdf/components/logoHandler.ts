import { SupabaseClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";

export const addLogoToDocument = async (
  doc: jsPDF,
  logoPath: string | null,
  supabase: SupabaseClient,
  pageWidth: number,
  currentY: number
): Promise<{ newY: number; error?: string }> => {
  if (!logoPath) return { newY: currentY };

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
      (pageWidth - imgWidth) / 2,
      currentY,
      imgWidth,
      imgHeight
    );

    return { newY: imgHeight + 40 };
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    return { newY: 45, error: 'Failed to add logo' };
  }
};