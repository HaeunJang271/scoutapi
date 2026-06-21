import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: '🌲 Girl Scout Community Analyzer',
    entry: 'default',
  });
};
