import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import PostSkeleton from 'src/components/util/PostSkeleton';
import { Card } from 'src/ui/Card';
import Image from 'next/image';
import { Avatar } from 'src/ui/Avatar';
import useTopics, { fetchTopics } from '../../hooks/topic-query/useTopics';

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['topics'], fetchTopics);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

function AllTopics() {
  const { isLoading, data: topics } = useTopics();

  if (isLoading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Discover Topics</title>
        <meta name="description" content="View today's top growing Reddit communities. Filter by category to view top communities in sports, gaming, television and more." />
      </Head>
      <div className="bg-white dark:bg-gray-850 h-24 mt-12 flex items-center">
        <div className="container mx-auto max-w-5xl sm:px-5">
          <div className="font-medium text-2xl">
            Discover Topics
          </div>
          <small className="text-gray-500 dark:text-gray-400">
            Browse all the topics that Crappit has to offer.
          </small>
        </div>
      </div>
      <div className="mt-4 container mx-auto max-w-5xl sm:px-5">
        <Card>
          {topics?.map((topic, i) => (
            <Link key={topic.title} passHref href={`t/${topic.title}`}>
              <a className={`flex items-center gap-2 p-3 border-gray-300 dark:border-gray-700 ${i === 0 ? '' : 'border-t'}`}>
                <div className=" h-10 w-10 rounded-full">
                  {!topic.icon_image_name ? <Avatar /> : <Image alt="topic icon" src={topic.icon_image_name} width={40} height={40} className="rounded-full" />}
                </div>
                <div className="font-medium">
                  t/
                  {topic.title}
                </div>
              </a>
            </Link>
          ))}
        </Card>
      </div>
    </>
  );
}

export default AllTopics;
