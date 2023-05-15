import { gql } from 'graphql-request';

export const getWithdrawalsQuery = gql`
  query GetWithdrawsQuery($limit: Int, $offset: Int!, $startBlock: Int!, $endBlock: Int!) {
    withdraw(startBlock: $startBlock, endBlock: $endBlock, limit: $limit, offset: $offset) {
      bridgeAddress
      l1Recipient
      amount
      callerAddress
      transfers{
        from_
        to
        value
      }
      timestamp
    }
  }
`;
