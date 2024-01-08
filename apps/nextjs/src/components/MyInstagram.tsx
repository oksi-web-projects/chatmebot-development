"use client";

import { useState, useEffect } from "react";
import { Container } from "~/components/Container";

import { api } from "~/utils/api";

export function MyInstagram() {

  const IG_AUTH_URL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_IG_APP_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_IG_APP_CALLBACK_URL}&scope=user_profile,user_media&response_type=code`;

  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const instagramData = api.instagram.getMyInstagramData.useQuery();

  const instagramDisconnect = api.instagram.disconnect.useMutation();

  async function handleDisconnect() {
    await instagramDisconnect.mutateAsync();
    setPosts([]);
    setIsConnected(false);
  }

  useEffect(() => {
    if (instagramData.data?.isTokenValid) {
      setIsConnected(true);
      setPosts(instagramData.data.posts);
    }
  }, [instagramData.isLoading])

  type Post = {
    id: string;
    media_type: string;
    media_url: string;
    timestamp: string;
  };

  return (
    <>
      <Container className="pb-32 pt-8 text-center">
        <div className="mx-auto max-w-2xl text-center">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  My Portfolio
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the users in your account including their name,
                  title, email and role.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                {isConnected ?

                  <button
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleDisconnect}
                    disabled={instagramDisconnect.isLoading}
                  >
                    Disconnect instagram
                  </button>
                  :
                  <a
                    href={IG_AUTH_URL}
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Connect instagram
                  </a>
                }

              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className='grid gap-2 grid-cols-3'>
                {posts &&
                  posts.map((post: Post) => (
                    <div key={post.id}>
                      <img
                        alt='post'
                        src={post.media_url}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}