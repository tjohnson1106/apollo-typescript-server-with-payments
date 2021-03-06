import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as session from "express-session";

import { typeDefs } from "./typeDef";
import { resolvers } from "./resolvers";

const startServer = async () => {
  const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({
      req
    })
  });

  await createConnection();

  const app = express();

  // remember cookie behaviour props availble with session
  app.use(
    session({
      secret: "secretsecret",
      resave: false,
      saveUninitialized: false
    })
  );

  // credentials must be boolean value in TypeScript
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "http://localhost:3000"
    }
  }); 

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
