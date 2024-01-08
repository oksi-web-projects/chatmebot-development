import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server';

import { prisma } from "@chatmebot/db";
import querystring from 'querystring';

import { auth } from "@chatmebot/auth";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {


  const IG_APP_CLIENT_SECRET = process.env.IG_APP_CLIENT_SECRET;
  const NEXT_PUBLIC_IG_APP_CLIENT_ID = process.env.NEXT_PUBLIC_IG_APP_CLIENT_ID;
  const NEXT_PUBLIC_IG_APP_CALLBACK_URL = process.env.NEXT_PUBLIC_IG_APP_CALLBACK_URL;

  console.log('NEXT_PUBLIC_IG_APP_CLIENT_ID', NEXT_PUBLIC_IG_APP_CLIENT_ID);
  console.log('IG_APP_CLIENT_SECRET', IG_APP_CLIENT_SECRET);
  console.log('NEXT_PUBLIC_IG_APP_CALLBACK_URL', NEXT_PUBLIC_IG_APP_CALLBACK_URL);

  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    console.log('code not found');
    return NextResponse.json({ error: 'code not found' }, { status: 400 })
  }

  const shortLivedAccessTokenResponse = await fetch(`https://api.instagram.com/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: querystring.stringify({
      client_id: NEXT_PUBLIC_IG_APP_CLIENT_ID,
      client_secret: IG_APP_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: NEXT_PUBLIC_IG_APP_CALLBACK_URL,
      code: code
    })
  });

  const shortLivedAccessToken = await shortLivedAccessTokenResponse.json();

  console.log('shortLivedAccessToken', shortLivedAccessToken);

  if (shortLivedAccessToken.access_token) {
    const longLivedAccessTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${IG_APP_CLIENT_SECRET}&access_token=${shortLivedAccessToken.access_token}`,
    );

    const longLivedAccessToken = await longLivedAccessTokenResponse.json();

    if (longLivedAccessToken.access_token) {
      console.log('longLivedAccessToken', longLivedAccessToken);
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          instagramToken: longLivedAccessToken.access_token,
        },
      });
    }
  }

  return redirect("/dashboard/my-portfolio");
}