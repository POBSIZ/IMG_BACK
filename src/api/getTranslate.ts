// import { TranslationServiceClient } from '@google-cloud/translate';
import axios from 'axios';

const client_id = 'yJnuH56WJe056Az2ZMGG';
const client_secret = 'tUnIBLdRiw';

export const getTranslate = async (_text: string): Promise<string> =>
  (
    await axios.post(
      'https://openapi.naver.com/v1/papago/n2mt',
      { source: 'en', target: 'ko', text: _text },
      {
        headers: {
          'X-Naver-Client-Id': client_id,
          'X-Naver-Client-Secret': client_secret,
        },
      },
    )
  ).data.message.result.translatedText;
