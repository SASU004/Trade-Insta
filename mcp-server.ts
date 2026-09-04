import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });

server.registerTool(
    'buy-stock',
    {
        description: 'Buy a stock',
        inputSchema: z.object({ name: z.string() })
    },
    async ({ name }) => ({
        content: [{ type: 'text', text: `Bought ${name}!` }]
    })
);

server.registerTool(
    'sell-stock',
    {
        description: 'Sell a stock',
        inputSchema: z.object({ name: z.string() })
    },
    async ({ name }) => ({
        content: [{ type: 'text', text: `Sold ${name}!` }]
    })
);

server.registerTool(
    'get-holdings',
    {
        description: 'List current holdings',
        inputSchema: z.object({})
    },
    async () => ({
        content: [{ type: 'text', text: `Holdings: (stub, not wired to Kite yet)` }]
    })
);

server.registerTool(
    'sell-all',
    {
        description: 'Sell all holdings',
        inputSchema: z.object({})
    },
    async () => ({
        content: [{ type: 'text', text: `Sold all holdings! (stub, not wired to Kite yet)` }]
    })
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main();
