import dotenv from 'dotenv'
dotenv.config()
import { ApolloServer } from '@apollo/server';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import context from './graphql/context';
import type { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express()

const httpServer = createServer(app);

const apolloServer = new ApolloServer({
  schema,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

const wsServer = new WebSocketServer({
	server: httpServer,
	path: '/',
});

wsServer.on('connection', () => {
	console.log('New WebSocket connection');
});

wsServer.on('error', (err: any) => {
	console.error('WebSocket server error: ', err);
});

/* eslint-disable react-hooks/rules-of-hooks */
useServer({ schema, context }, wsServer);

const startServer = async () => {
	await apolloServer.start()

	app.use(cors<cors.CorsRequest>({
		// origin: process.env.ENV_PRODUCTION === 'true' ? process.env.CLIENT_PRODUCTION_URI : 'http://localhost:3000',
		origin: '*',
		credentials: true
	}))
	app.use(express.json())
	app.use(expressMiddleware(apolloServer, { context }))

	const port = 4000
	await new Promise((resolve, reject) => httpServer.listen({ port }, () => resolve(undefined)))
	console.log(`Server listens on port ${port}`)
}

startServer()

