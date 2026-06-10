import { adminRouter } from './src/routes/admin.js';

// Mock Express request, response, and next
const req = {
  body: {
    prompt: 'Write a short post about clean minimalist code.',
    category: 'design', // category name or id
  },
  auth: {
    userId: 'mock-user-id',
    role: 'admin',
  },
};

const res = {
  json(data) {
    console.log('SUCCESS response:', JSON.stringify(data, null, 2));
  },
  status(code) {
    console.log('STATUS:', code);
    return this;
  },
};

const next = (err) => {
  console.error('ERROR handled by Express error handler:', err);
};

// Find the '/generate-blog' POST route handler
const layer = adminRouter.stack.find(l => l.route && l.route.path === '/generate-blog' && l.route.methods.post);
const handler = layer.route.stack[layer.route.stack.length - 1].handle;

console.log('Invoking route handler directly...');
try {
  await handler(req, res, next);
} catch (err) {
  console.error('CRASHED execution:', err);
}
