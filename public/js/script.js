// Get form and posts container
const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');

// Load existing posts on page load
window.addEventListener('DOMContentLoaded', loadPosts);

// Form submit handler
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const caption = document.getElementById('caption').value.trim();
  const imageUrl = document.getElementById('imageUrl').value.trim();

  if (!username || !caption) {
    alert('Username and caption are required!');
    return;
  }

  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, caption, imageUrl })
    });

    const data = await res.json();
    console.log('Post created:', data);

    loadPosts();
    postForm.reset();

  } catch (err) {
    console.error('Error creating post:', err);
  }
});

// Load posts from backend
async function loadPosts() {
  try {
    const res = await fetch('/api/posts');
    const allPosts = await res.json();

    postsContainer.innerHTML = ''; // Clear existing posts

    allPosts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');

      postDiv.innerHTML = `
        <h3>${post.username}</h3>
        <p>${post.caption}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image" />` : ''}
        <button onclick="editPost(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      `;

      postsContainer.appendChild(postDiv);
    });

  } catch (err) {
    console.error('Error loading posts:', err);
  }
}

// Delete post
async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  } catch (err) {
    console.error('Error deleting post:', err);
  }
}

// Edit post
async function editPost(id) {
  const newCaption = prompt('Enter new caption:');
  const newImageUrl = prompt('Enter new image URL (or leave blank):');

  try {
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: newCaption, imageUrl: newImageUrl })
    });
    loadPosts();
  } catch (err) {
    console.error('Error editing post:', err);
  }
}
