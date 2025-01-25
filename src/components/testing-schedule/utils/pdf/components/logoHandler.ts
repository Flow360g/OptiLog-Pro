import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export const addLogoToDocument = async (
  doc: jsPDF,
  userId: string,
  startY: number = 10
): Promise<number> => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('logo_path')
    .eq('id', userId)
    .single();

  if (!profile?.logo_path) {
    return startY;
  }

  try {
    const { data } = supabase.storage
      .from('logos')
      .getPublicUrl(profile.logo_path);
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = data.publicUrl;
    });

    const imgWidth = 200; // 250% bigger than original 80px
    const imgHeight = (img.height * imgWidth) / img.width;
    doc.addImage(
      img,
      'PNG',
      (doc.internal.pageSize.width - imgWidth) / 2,
      startY,
      imgWidth,
      imgHeight
    );
    return imgHeight + 40; // Return new Y position with spacing
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    return startY;
  }
};