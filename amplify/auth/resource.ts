import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['profile', 'email', 'openid']
      },
      callbackUrls: [
        'http://localhost:5173',
        // 'https://dev.d3vw0e89hvsub7.amplifyapp.com/'
      ],
      logoutUrls: [
        'http://localhost:5173',
        // 'https://dev.d3vw0e89hvsub7.amplifyapp.com/'
      ],
    }
  },
  // userAttributes: {
  //   email: {
  //     mutable: true,
  //     required: true
  //   },
  //   fullname: {
  //     mutable: true,
  //     required: false,
  //   },
  //   phoneNumber: {
  //     mutable: true,
  //     required: false
  //   }
  // },
  groups: ["USERS", "ADMINS"]
});
