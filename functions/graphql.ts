import { ApolloServer, gql } from "apollo-server-lambda";

import { MongoClient, ServerApiVersion } from "mongodb";

import Product from "../models/product";
import User from "../models/user";
import Payment from "../models/payment";

import sha256 from "sha256";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const MONGO_USER_NAME = "garages";
const MONGO_PWD = "FBt1V37Ai6JVamLc";
const DB_USER = "admin_garages";
const DB_PWD = "garagesdb22admin";
const DB_STRING = `mongodb+srv://${DB_USER}:${DB_PWD}@garages.aks9ktk.mongodb.net/garages?retryWrites=true&w=majority&appName=Garages`;

const typeDefs = gql`
  type Product {
    _id: ID!
    title: String!
    brief: String!
    price: Float!
    creator: User!
  }

  type Payment {
    _id: ID!
    name: String!
    email: String!
    mobile: String!
    amount: Float!
    product: String!
    userID: String!
    txnID: String!
    status: String!
    url: String!
  }

  input ProductInput {
    title: String!
    brief: String!
    price: Float!
  }

  input PaymentInput {
    product: String!
    txnID: String!
    userID: String!
    amount: Float!
    name: String!
    email: String!
    mobile: String!
    status: String
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    mobile: String!
    createdProducts: [Product!]
  }

  input UserInput {
    name: String!
    email: String!
    mobile: String!
  }

  type RootQuery {
    products: [Product!]!
    users: [User!]!
  }

  type RootMutation {
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
    makePayment(paymentInput: PaymentInput): Payment
    initiateRefund(paymentID: ID!): Product!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

const getPaymentLink = async (args: any) => {
  const API_ENDPOINT = "/pg/v1/pay";
  const SALT_INDEX = "1";
  const SALT_KEY = "ecd68e5f-e451-4599-9f31-982f13555824";
  const MERCHANT_ID = "M22XBIS6G0YTH";
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: args.txnID,
    merchantUserId: args.userID,
    amount: args.amount,
    redirectUrl: "https://portal.dehustle.institute/payments/success",
    redirectMode: "REDIRECT",
    callbackUrl: "https://dehustle.institute",
    mobileNumber: args.mobile,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  const base64Payload = Buffer.from(JSON.stringify(payload, null, 2)).toString(
    "base64"
  );
  const hashedChecksum = sha256(base64Payload + API_ENDPOINT + SALT_KEY);
  console.log("hash", hashedChecksum);
  const xVerify = hashedChecksum + "###" + SALT_INDEX;
  const options = {
    method: "post",
    url: `https://api.phonepe.com/apis/hermes${API_ENDPOINT}`,
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
    },
    data: {
      request: base64Payload,
    },
  };
  const response = await axios.request(options);
  return response.data.data.instrumentResponse.redirectInfo.url.toString();
};

const resolvers = {
  products: async () => {
    const result = await Product.find();
    return result.map((product) => {
      return { ...product._doc };
    });
  },
  users: async (args: any) => {
    const result = await User.find();
    return result.map((user) => {
      return { ...user._doc };
    });
  },
  createUser: (args: any) => {
    const user = new User({
      name: args.userInput.name,
      email: args.userInput.email,
      mobile: +args.userInput.mobile,
    });

    user.save();
    return { ...user._doc };
  },
  createProduct: async (args: any) => {
    const product = new Product({
      title: args.productInput.title,
      brief: args.productInput.brief,
      price: +args.productInput.price,
    });
    product.save();
    return { ...product._doc };
  },
  makePayment: async (args: any) => {
    const txnPayload = {
      amount: args.paymentInput.amount,
      txnID: args.paymentInput.txnID,
      userID: args.paymentInput.userID,
      mobile: args.paymentInput.mobile,
    };

    const res = await getPaymentLink(txnPayload);

    if (res) {
      const payment = new Payment({
        txnID: args.paymentInput.txnID,
        userID: args.paymentInput.userID,
        mobile: args.paymentInput.mobile,
        name: args.paymentInput.name,
        email: args.paymentInput.email,
        product: args.paymentInput.product,
        status: args.paymentInput.status,
        amount: args.paymentInput.amount,
        url: res,
      });
      payment.save().then(() => {
        return { ...payment._doc };
      });
    }
  },
  initiateRefund: async () => {
    return {};
  },
};

// this is our lambda function

// this is our lambda function
const getHandler = async (event, context) => {
  const server = new ApolloServer({
    typeDefs,
    rootValue: resolvers,
    introspection: true,
    debug: true,
  });
  mongoose.connect(DB_STRING).then(() => console.log("Connected!"));
  const graphqlHandler = server.createHandler();
  // this fixes an issue
  if (!event.requestContext) {
    event.requestContext = context;
  }
  return graphqlHandler(event, context, null);
};

export const handler = getHandler;
