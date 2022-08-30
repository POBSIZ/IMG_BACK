import { TranslationServiceClient } from '@google-cloud/translate';

export const setTranslate = () => {
  const translationClient = new TranslationServiceClient();
  const projectId = 'img-ls';
  const location = 'global';

  const sourceLang = 'en';
  const targetLang = 'ko';

  return async (_text: string) => {
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [_text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLang,
      targetLanguageCode: targetLang,
    };

    const [response] = await translationClient.translateText(request);

    const data = response.translations.map((tr) => tr.translatedText);

    return data;
  };
};
