import axios from 'axios';

//get user events by github user name
const res = await axios.get(
  'https://api.github.com/users/rahuldev7583/events/public',
  {
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
      Accept: 'application/vnd.github+json',
    },
  },
);

const events = res.data;

console.log({ events });

//get commit msg by repo name , commit hash which is repo.name and payload.head
const commit_res = await axios.get(
  'https://api.github.com/repos/rahuldev7583/rahuldev7583/commits/f0b280656b14395bb3e7cef16fd8d45b9d0f55ec',
  {
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
      Accept: 'application/vnd.github+json',
    },
  },
);

console.log({ commit_data: commit_res.data });
