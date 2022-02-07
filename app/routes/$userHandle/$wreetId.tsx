import { Heading } from '@chakra-ui/react'
import { FunctionComponent } from 'react'
import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix'

import { Container } from '~/components'
import { WreetCardDetailed } from '~/features'
import { kontenbaseServer } from '~/lib'
import { getTrimmedWreet, getUserName } from '~/utils'

interface UserWreetIdProps {}

export const meta: MetaFunction = ({ data }) => {
  const wreet = data.data
  const user = data.data.createdBy

  return {
    title: `${getUserName(user)} on Writter: "${getTrimmedWreet(
      wreet.content
    )}"`,
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const { data, error } = await kontenbaseServer
    .service('wreets')
    .getById(params?.wreetId as string)

  if (error) {
    return json({ error }, { status: 404 })
  }
  return json({
    data,
    error,
  })
}

const UserWreetId: FunctionComponent<UserWreetIdProps> = () => {
  const { data, error } = useLoaderData()

  return (
    <Container headingText="Wreet">
      {data && <WreetCardDetailed wreet={data} />}
      {error && <p>Error: Detailed Wreet {error?.message}</p>}
    </Container>
  )
}

export default UserWreetId
