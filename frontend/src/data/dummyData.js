// Dummy / placeholder data for Deliverable 1.
// No backend/database calls yet — this stands in until Deliverable 2.

export const currentUser = {
  id: 'u1',
  name: 'Janke R.',
  username: 'jankedoodles',
  bio: 'Second-year multimedia student. I doodle in colour and photograph everything else.',
  avatarColor: 'var(--color-peach)',
  links: ['instagram', 'portfolio site'],
  friends: ['u2', 'u3'],
};

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Mia R.',
    username: 'mia.snaps',
    bio: 'Picnic-day chaser, film photography fan.',
    avatarColor: 'var(--color-blue)',
    links: ['instagram'],
    friends: ['u1', 'u3'],
  },
  {
    id: 'u3',
    name: 'Theo K.',
    username: 'theok',
    bio: 'Sunsets and skateparks.',
    avatarColor: 'var(--color-mint)',
    links: ['portfolio site'],
    friends: ['u1', 'u2'],
  },
  {
    id: 'u4',
    name: 'Priya D.',
    username: 'priyadoodles',
    bio: 'Studio doodles, always with a coffee nearby.',
    avatarColor: 'var(--color-yellow)',
    links: ['instagram', 'portfolio site'],
    friends: [],
  },
];

export const posts = [
  {
    id: 'p1',
    authorId: 'u2',
    imageColor: 'var(--color-blue)',
    caption: 'Golden hour at the picnic spot, worth the ants.',
    hashtags: ['#picnicday', '#goldenhour'],
    comments: [
      { id: 'c1', authorId: 'u3', text: 'This light is unreal.' },
      { id: 'c2', authorId: 'u1', text: 'Take me next time!' },
    ],
    createdAt: '2026-08-30T14:00:00Z',
  },
  {
    id: 'p2',
    authorId: 'u3',
    imageColor: 'var(--color-peach)',
    caption: 'Good hair day, bad wifi day.',
    hashtags: ['#sunsets', '#weekend'],
    comments: [
      { id: 'c3', authorId: 'u4', text: 'Iconic.' },
    ],
    createdAt: '2026-08-30T09:00:00Z',
  },
  {
    id: 'p3',
    authorId: 'u4',
    imageColor: 'var(--color-yellow)',
    caption: 'Studio doodles from this afternoon.',
    hashtags: ['#doodles'],
    comments: [],
    createdAt: '2026-08-29T18:00:00Z',
  },
  {
    id: 'p4',
    authorId: 'u1',
    imageColor: 'var(--color-mint)',
    caption: 'Beach day with the crew.',
    hashtags: ['#beachday', '#colourfulalbums'],
    comments: [
      { id: 'c4', authorId: 'u2', text: 'Missed this!' },
    ],
    createdAt: '2026-08-28T11:00:00Z',
  },
];

export const albums = [
  {
    id: 'a1',
    ownerId: 'u2',
    name: 'Picnic Day',
    description: 'Snacks, sun, and slightly too many photos of clouds.',
    hashtags: ['#picnicday', '#outdoors'],
    postIds: ['p1'],
  },
  {
    id: 'a2',
    ownerId: 'u4',
    name: 'Studio Doodles',
    description: 'A growing collection of sketchbook photos.',
    hashtags: ['#doodles'],
    postIds: ['p3'],
  },
];

export const getUserById = (id) => users.find((user) => user.id === id);

export const getPostsByUser = (userId) => posts.filter((post) => post.authorId === userId);

export const getAlbumsByUser = (userId) => albums.filter((album) => album.ownerId === userId);

export const getPostById = (id) => posts.find((post) => post.id === id);
