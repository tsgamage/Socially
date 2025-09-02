// app/signup/sso-callback/page.tsx (App Router)
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function Page() {
  return <AuthenticateWithRedirectCallback />;
}
