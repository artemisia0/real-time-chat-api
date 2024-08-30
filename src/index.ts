import dotenv from 'dotenv';
dotenv.config();
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import context from './graphql/context';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import { makeExecutableSchema } from '@graphql-tools/schema';
 
const server = new WebSocketServer({
  port: 4000,
  path: '/graphql',
});
 
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

useServer({ schema, context }, server);
 
console.log('Listening to port 4000');

