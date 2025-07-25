// Helper function to create a generic "guest" user so that people don't have to sign up
import { faker } from "@faker-js/faker";
import crypto from "crypto"

export default function generateGuestCredentials() {
  const firstName = faker.company.buzzAdjective();
  const lastName = faker.animal.type();

  const guest = {
    email: faker.internet.email({ firstName, lastName }),
    name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    surname: lastName.charAt(0).toUpperCase() + lastName.slice(1),
    password: faker.internet.password(),
    handle:
      faker.science.chemicalElement().name.charAt(0).toUpperCase() +
      lastName.slice(1)+crypto.randomBytes(3).toString('hex'),
    profilePicUrl: faker.image.url(),
    createdAt: faker.date.past(),
  };

  return guest;
}
