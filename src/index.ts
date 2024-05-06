// import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { ApolloServer, gql } from "apollo-server-lambda";


import sha256 from 'sha256'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';





export const handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    try {
      // Process the GET request as needed
      const data = require('./db.json');

      // Return the data as the response
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      // Return an error response if there was an issue processing the request
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to process GET request' }),
      };
    }
  }
}
// const typeDefs = `
//   type Book {
//     url: String
//   }
//   type Query {
//     books: [Book]
//   }
// `

// const resolvers = {
//     Query: {
//       books:  () => {

//         const API_ENDPOINT = '/pg/v1/pay'
//   const SALT_INDEX = '1'
//   const SALT_KEY ='ecd68e5f-e451-4599-9f31-982f13555824'
//   const MERCHANT_ID = 'M22XBIS6G0YTH'


//   const payload = {
//       merchantId: MERCHANT_ID,
//       merchantTransactionId: uuidv4().slice(0,4),
//       merchantUserId:"MUID123",
//       amount: '100',
//       redirectUrl: "https://garages.dehustle.institute",
//       redirectMode: "REDIRECT",
//       callbackUrl: "https://dehustle.institute",
//       mobileNumber: "9999999999",
//       paymentInstrument: {
//         type: "PAY_PAGE"
//       }
//     }

//     const base64Payload = Buffer.from(JSON.stringify(payload,null,2)).toString('base64')
//     const hashedChecksum = sha256(base64Payload+API_ENDPOINT+SALT_KEY)
//     console.log('hash', hashedChecksum)
//     const xVerify = hashedChecksum+'###'+SALT_INDEX
    
// const options = {
//   method: 'post',
//   url: `https://api.phonepe.com/apis/hermes${API_ENDPOINT}`,
//   headers: {
//         'Content-Type': 'application/json',
//         'X-VERIFY' : xVerify
// 				},
// data: {
//     request : base64Payload
// }

// }
// return axios
// .request(options)
//     .then(function (response) {
//       return  [{ url : response.data.data.instrumentResponse.redirectInfo.url.toString()}]
// })
// .catch(function (error) {
//   console.error(error);
// });

//     }


//     }
//   }
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });
  
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 8080 },
  // });
  
  // console.log(`🚀  Server ready at: ${url}`);