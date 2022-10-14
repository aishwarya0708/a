import Head from 'next/head'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import slugify from 'slugify'

import { Text } from '@/components/RenderNotion'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getDatabase } from '@/lib/notion'
import { baseUrl } from '../../seo.config'

const databaseId = process.env.NOTION_BLOG_DB_ID

function Article({ article }) {
  const articleTitle = article.properties.name.title[0].plain_text
  const articleDescription = article.properties.description.rich_text
  const status = article.properties.Status.status.name
  const slug = slugify(articleTitle).toLowerCase()
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${slug}`}>{articleTitle}</Card.Title>
        <Card.Eyebrow className="md:hidden" decorate>
          <span className="text-sm font-bold text-lime-400 dark:text-green-200">
            {status}
          </span>
        </Card.Eyebrow>
        <Card.Description>
          <Text text={articleDescription} />
        </Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow className="mt-1 hidden md:block">
        <span className="font-bold text-lime-400 dark:text-green-200">
          {status}
        </span>
      </Card.Eyebrow>
    </article>
  )
}

export default function ArticlesIndex({ articles }) {
  return (
    <div className="h-full">
      <NextSeo
        title="Blog"
        description="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
        canonical={`${baseUrl}blog/`}
        openGraph={{
          url: `${baseUrl}blog/`,
          title: 'Blog',
        }}
      />
      <SimpleLayout
        title="Welcome to my"
        postTitle="Digital Garden."
        intro="This is a collection of my long-form thoughts on Web Dev, Data Science, Blockchains, and more in various stages of completion from Seedling to Evergreen. I hope you find something that piques your interest."
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {articles.map((article) => (
              <Article key={article.id} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
    </div>
  )
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId, 'date', 'descending')
  return {
    props: {
      articles: database,
    },
    revalidate: 1,
  }
}