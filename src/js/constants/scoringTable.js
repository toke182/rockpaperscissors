export const scoringTable = {
  classic: [
    {
      handShape: 'rock',
      defeats: ['scissors']
    },
    {
      handShape: 'scissors',
      defeats: ['paper']
    },
    {
      handShape: 'paper',
      defeats: ['rock']
    }
  ],
  extended: [
    {
      handShape: 'rock',
      defeats: ['lizzard', 'scissors']
    },
    {
      handShape: 'scissors',
      defeats: ['paper', 'lizzard']
    },
    {
      handShape: 'paper',
      defeats: ['rock', 'spock']
    },
    {
      handShape: 'lizzard',
      defeats: ['spock', 'paper']
    },
    {
      handShape: 'spock',
      defeats: ['scissors', 'rock']
    }
  ]
};