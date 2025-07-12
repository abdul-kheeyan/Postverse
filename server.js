const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// In-memory posts array
let posts = [];

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create a new post (POST)
app.post('/api/posts', (req, res) => {
  const { username, caption, imageUrl } = req.body;

  if (!username || !caption) {
    return res.status(400).json({ error: 'Username and caption are required' });
  }

  const newPost = {
    id: Date.now(),  // Unique ID
    username,
    caption,
    imageUrl
  };

  posts.unshift(newPost);

  res.json({ message: 'Post created!', post: newPost });
});

// Get all posts (GET)
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Update a post (PUT)
app.put('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { caption, imageUrl } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (caption) post.caption = caption;
  if (imageUrl) post.imageUrl = imageUrl;

  res.json({ message: 'Post updated!', post });
});

// Delete a post (DELETE)
app.delete('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.json({ message: 'Post deleted!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
