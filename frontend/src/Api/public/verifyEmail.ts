import instance, { PagesURl } from '@/Api';

export async function sendVerifyEmail(email: string) {
  await instance.post(
    PagesURl.VERIFY_EMAIL + '/send_verify_code',
    {},
    {
      params: { email },
    }
  );
}

export async function verifyEmail(email: string, code: string) {
  await instance.post(
    PagesURl.VERIFY_EMAIL + '/verify_code',
    {},
    {
      params: { email, code },
    }
  );
}
