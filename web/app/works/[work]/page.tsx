import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { Layout } from "@/components/layout";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import { Picture } from "@/components/picture";

interface Props {
  params: {
    work: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const work = allPosts.find((post) => post._raw.flattenedPath === params.work);

  if (!work) {
    throw new Error(`Could not find work with path ${params.work}`);
  }

  return {
    title: { absolute: work.title },
    description: work.title,
    openGraph: {
      images: [work.cover],
    },
  };
}

const components = {
  img: (props: any) => (
    <div className="mt-5">
      <Picture {...props} width={1920} height={1080} />
    </div>
  ),
};

export default function WorkDetailPage({ params }: Props) {
  const work = allPosts.find(
    (post) => post._raw.flattenedPath === params.work
  )!;
  const Content = getMDXComponent(work.body.code);
  const nextworkkey = work.related?.[0];
  const nextwork = allPosts.find(
    (post) => post._raw.flattenedPath === nextworkkey
  );

  return (
    <div>
      <Layout
        meta={{
          ...work,
          next: nextwork,
        }}
      >
        <Content components={components} />
      </Layout>
    </div>
  );
}
