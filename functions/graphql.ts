

import { ApolloServer, gql } from "apollo-server-lambda"

import sha256 from 'sha256'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { hostname } from "os";



const typeDefs = gql`
  type Book {
    url: String
    hostName: String
    header: String
  }
  type Query {
    books: [Book]
  }
  
`

let host 
let head
const resolvers = {
    Query: {
      books:  () => {

        const API_ENDPOINT = '/pg/v1/pay'
  const SALT_INDEX = '1'
  const SALT_KEY ='ecd68e5f-e451-4599-9f31-982f13555824'
  const MERCHANT_ID = 'M22XBIS6G0YTH'


  const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: uuidv4().slice(0,4),
      merchantUserId:"MUID123",
      amount: '100',
      redirectUrl: "https://garages.dehustle.institute",
      redirectMode: "REDIRECT",
      callbackUrl: "https://dehustle.institute",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    }

    const base64Payload = Buffer.from(JSON.stringify(payload,null,2)).toString('base64')
    const hashedChecksum = sha256(base64Payload+API_ENDPOINT+SALT_KEY)
    console.log('hash', hashedChecksum)
    const xVerify = hashedChecksum+'###'+SALT_INDEX
    
const options = {
  method: 'post',
  url: `https://api.phonepe.com/apis/hermes${API_ENDPOINT}`,
  headers: {
        'Content-Type': 'application/json',
        'X-VERIFY' : xVerify
				},
data: {
    request : base64Payload
}

}
return axios
.request(options)
    .then(function (response) {
      
      return  [{ url : response.data.data.instrumentResponse.redirectInfo.url.toString(), hostName: host, header: head}]
})
.catch(function (error) {
  console.error(error);
});

    }


    }
  }


  // this is our lambda function

// this is our lambda function
const getHandler = (event, context) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ctx => {
     const a = JSON.stringify(ctx.event.headers)
      host =   ctx.express.req.hostname
      head = a
      return ctx;
    },
    introspection: true,
    debug: true,
  });
  const graphqlHandler = server.createHandler();
  // this fixes an issue
  if (!event.requestContext) {
    event.requestContext = context;
  }
  return graphqlHandler(event, context,null);
}
  
export const handler = getHandler;