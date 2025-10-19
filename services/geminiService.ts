
import { GoogleGenAI, Modality } from "@google/genai";

export const enhanceImage = async (
  imageDataUrl: string,
  preserveFaces: boolean
): Promise<string> => {
  if (!process.env.API_KEY) {
    // This is a placeholder for environments where API_KEY might not be set.
    // In the target runtime, it is assumed to be available.
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = imageDataUrl.split(',')[1];
  const mimeType = imageDataUrl.match(/data:(.*);base64,/)?.[1];

  if (!mimeType || !['image/jpeg', 'image/png', 'image/jpg'].includes(mimeType)) {
      throw new Error('Unsupported image format. Please use JPG or PNG.');
  }

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType,
    },
  };

  let prompt = "Act as a professional photo editor. Enhance this image to 4K resolution. Increase clarity, sharpness, and detail. Remove any noise, grain, and blurriness. Ensure the final result looks natural and high-quality, without any artificial textures or over-sharpening. Maintain the original color balance and accuracy.";
  if (preserveFaces) {
    prompt += " Pay special attention to faces: enhance them with realistic skin tones and textures, keeping them natural and avoiding any plastic-like appearance.";
  }

  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      const resultMimeType = part.inlineData.mimeType;
      return `data:${resultMimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Image enhancement failed. Could not retrieve the enhanced image from the AI response.");
};
