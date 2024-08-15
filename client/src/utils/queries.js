// client/src/utils/queries.js
import { gql } from '@apollo/client';

export const GET_ME = gql`
query Me {
  me {
    id
    username
    email
    bookCount
    savedBooks {
      bookId
      title
      authors
      description
      image
      link
    }
  }
}`

