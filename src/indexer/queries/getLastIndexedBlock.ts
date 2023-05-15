import { gql } from 'graphql-request';

export const GetLastIndexedBlockQuery = gql`
  query GetLastIndexedBlockQuery {
    withdraws(limit: 1) {
      blockHeight
    }
  }
`;
