// Helper function to create a generic "guest" user so that people don't have to sign up
import crypto from "crypto";

const adjectives = [
  "Amazing", "Brilliant", "Creative", "Dynamic", "Elegant", "Fantastic", 
  "Graceful", "Happy", "Incredible", "Joyful", "Kind", "Lovely", 
  "Magnificent", "Noble", "Outstanding", "Perfect", "Quick", "Radiant",
  "Spectacular", "Talented", "Unique", "Vibrant", "Wonderful", "Excellent"
];

const animals = [
  "Lion", "Eagle", "Dolphin", "Tiger", "Wolf", "Bear", "Fox", "Hawk",
  "Owl", "Deer", "Rabbit", "Horse", "Cat", "Dog", "Bird", "Fish",
  "Butterfly", "Bee", "Turtle", "Penguin", "Elephant", "Giraffe", "Panda", "Koala"
];

const elements = [
  "Hydrogen", "Helium", "Lithium", "Carbon", "Nitrogen", "Oxygen", "Fluorine",
  "Neon", "Sodium", "Magnesium", "Silicon", "Phosphorus", "Sulfur", "Chlorine",
  "Argon", "Potassium", "Calcium", "Iron", "Copper", "Silver", "Gold", "Mercury"
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateEmail(firstName, lastName) {
  const domains = ['example.com', 'test.com', 'demo.com', 'guest.com'];
  const domain = getRandomItem(domains);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generateProfilePicUrl() {
  // Using a reliable placeholder service
  const size = 200;
  const seed = Math.floor(Math.random() * 10000);
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

function generatePastDate() {
  // Generate a date within the last 2 years
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  return new Date(randomTime);
}

export default function generateGuestCredentials() {
  const firstName = getRandomItem(adjectives);
  const lastName = getRandomItem(animals);
  const element = getRandomItem(elements);

  const guest = {
    email: generateEmail(firstName, lastName),
    name: firstName,
    surname: lastName,
    password: generateRandomPassword(),
    handle: element + lastName + crypto.randomBytes(3).toString('hex'),
    profilePicUrl: generateProfilePicUrl(),
    createdAt: generatePastDate(),
  };

  return guest;
}