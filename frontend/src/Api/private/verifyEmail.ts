import { PagesURl, privateInstance } from '@/Api';

export async function sendVerifyEmail(email: string) {
  await privateInstance.post(
    PagesURl.VERIFY_EMAIL + '/send_verify_code',
    {},
    {
      params: { email },
    }
  );
}

export async function verifyEmail(email: string, code: string) {
  await privateInstance.post(
    PagesURl.VERIFY_EMAIL + '/verify_code',
    {},
    {
      params: { email, code },
    }
  );
}
