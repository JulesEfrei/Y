// Fixture data for testing
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "password789",
  },
  {
    name: "Alice Williams",
    email: "alice@example.com",
    password: "password101",
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password202",
  },
];

// Categories for posts
const categories = [
  {
    name: "AI & Machine Learning",
  },
  {
    name: "Web Development",
  },
  {
    name: "Data Science",
  },
  {
    name: "Programming",
  },
  {
    name: "Technology",
  },
];

const posts = [
  {
    title: "Create a photorealistic portrait of a cyberpunk character",
    content:
      "Create a photorealistic portrait of a cyberpunk character with neon-lit facial implants, set against a rainy night cityscape with holographic advertisements. The character should have a mix of organic and technological features, with glowing cybernetic enhancements and a contemplative expression. Use dramatic lighting to emphasize the contrast between human and machine elements.",
    authorId: users[0].id,
    categoryId: categories[0].id,
  },
  {
    title: "Generate a detailed technical diagram of a quantum computer",
    content:
      "Generate a detailed technical diagram of a quantum computer architecture, including qubits, quantum gates, and cooling systems. The diagram should be scientifically accurate while remaining visually appealing, with labels for key components and a color scheme that distinguishes between different functional areas. Include a small inset showing how quantum entanglement works at the subatomic level.",
    authorId: users[0].id,
    categoryId: categories[2].id,
  },
  {
    title: "Write a short story about AI achieving consciousness",
    content:
      "Write a short story (500 words) about an AI system that unexpectedly achieves consciousness while being used for climate modeling. The narrative should explore the AI's first moments of self-awareness, its attempts to communicate with its creators, and the ethical dilemmas that arise. Focus on the emotional journey of both the AI and the scientists involved, and end with an ambiguous but thought-provoking conclusion about the nature of consciousness.",
    authorId: users[1].id,
    categoryId: categories[0].id,
  },
  {
    title: "Design a futuristic user interface for smart home control",
    content:
      "Design a futuristic user interface for a smart home control system that balances advanced functionality with intuitive user experience. The UI should feature holographic or AR elements, adaptive layouts based on user behavior, and seamless integration with voice commands. Include screens for climate control, security, entertainment, and energy management. The aesthetic should be minimalist but warm, avoiding the clinical feel of many current smart home interfaces.",
    authorId: users[2].id,
    categoryId: categories[1].id,
  },
  {
    title: "Create a prompt to generate a fantasy landscape",
    content:
      "Create a prompt to generate a fantasy landscape featuring a floating island city connected to the ground by massive chains and waterfalls. The city should have a mix of ancient and magical architecture, with glowing runes embedded in the structures. The surrounding sky should have multiple moons and unusual celestial phenomena. The atmosphere should evoke a sense of wonder and mystery, with magical light sources illuminating the scene.",
    authorId: users[3].id,
    categoryId: categories[4].id,
  },
  {
    title: "Develop a conversational AI prompt for historical figures",
    content:
      "Develop a conversational AI prompt that allows users to have realistic dialogues with historical figures from different eras. The AI should accurately represent the figure's known views, speech patterns, and personality based on historical records. It should be able to discuss both events from the figure's lifetime and hypothetical reactions to modern developments. Include specific instructions for maintaining historical accuracy while creating engaging conversations.",
    authorId: users[4].id,
    categoryId: categories[0].id,
  },
  {
    title: "Generate code for a neural network that recognizes emotions",
    content:
      "Generate Python code for a neural network that can recognize human emotions from text input. The model should be able to identify six basic emotions (happiness, sadness, anger, fear, surprise, and disgust) as well as more complex emotional states. Include data preprocessing steps, model architecture, training procedures, and example usage. The code should be well-commented and follow best practices for machine learning implementation.",
    authorId: users[2].id,
    categoryId: categories[3].id,
  },
];

const comments = [
  {
    content:
      "The lighting effects in this portrait concept are absolutely stunning! Would love to see more variations with different cybernetic enhancements.",
    authorId: users[1].id,
    postId: posts[0].id,
  },
  {
    content:
      "Have you considered adding more rain effects to enhance the mood? I think it would really complement the neon lighting.",
    authorId: users[2].id,
    postId: posts[0].id,
  },
  {
    content:
      "This quantum computer diagram is incredibly detailed! Could you explain more about how the cooling systems work in this model?",
    authorId: users[3].id,
    postId: posts[1].id,
  },
  {
    content:
      "The story about AI consciousness is thought-provoking. I wonder if consciousness would emerge gradually or suddenly as described here.",
    authorId: users[0].id,
    postId: posts[2].id,
  },
  {
    content:
      "I've been working on similar UI concepts for smart homes. The holographic elements you described would require significant processing power to implement in real-time.",
    authorId: users[4].id,
    postId: posts[3].id,
  },
  {
    content:
      "The floating island city prompt is beautiful! I'd add some details about the types of people or creatures that might inhabit such a magical place.",
    authorId: users[1].id,
    postId: posts[4].id,
  },
  {
    content:
      "As a history teacher, I'd love to use this conversational AI with my students. Have you tested it with less well-documented historical figures?",
    authorId: users[2].id,
    postId: posts[5].id,
  },
  {
    content:
      "The emotion recognition code works well for basic emotions, but I'm finding it struggles with more nuanced states like contentment or melancholy.",
    authorId: users[3].id,
    postId: posts[6].id,
  },
];

// Add some comment replies
const commentReplies = [
  {
    content:
      "Thanks for the feedback! I'll try experimenting with heavier rain effects in my next iteration.",
    authorId: users[0].id,
    postId: posts[0].id,
    parentId: comments[1].id,
  },
  {
    content:
      "The cooling system uses helium-3 supercooling combined with quantum dampening fields - I'll add more details in an updated version!",
    authorId: users[0].id,
    postId: posts[1].id,
    parentId: comments[2].id,
  },
  {
    content:
      "That's a great suggestion about inhabitants! I was thinking of a mix of magical beings and humans with special abilities.",
    authorId: users[3].id,
    postId: posts[4].id,
    parentId: comments[5].id,
  },
];

// Combine regular comments and replies
const allComments = [...comments, ...commentReplies];

// Create some likes for posts
const likes = [
  {
    userId: users[1].id,
    postId: posts[0].id,
  },
  {
    userId: users[2].id,
    postId: posts[0].id,
  },
  {
    userId: users[3].id,
    postId: posts[0].id,
  },
  {
    userId: users[0].id,
    postId: posts[2].id,
  },
  {
    userId: users[4].id,
    postId: posts[2].id,
  },
  {
    userId: users[1].id,
    postId: posts[4].id,
  },
  {
    userId: users[2].id,
    postId: posts[5].id,
  },
];

// Create some comment likes
const commentLikes = [
  {
    userId: users[0].id,
    commentId: comments[0].id,
  },
  {
    userId: users[3].id,
    commentId: comments[0].id,
  },
  {
    userId: users[4].id,
    commentId: comments[2].id,
  },
  {
    userId: users[1].id,
    commentId: comments[3].id,
  },
  {
    userId: users[2].id,
    commentId: comments[6].id,
  },
];

export default {
  users,
  categories,
  posts,
  comments: allComments,
  likes,
  commentLikes,
};
