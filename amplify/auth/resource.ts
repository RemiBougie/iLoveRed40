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
        'https://dev.d15ghfl73jb9i6.amplifyapp.com/' // replace w env variable
      ],
      logoutUrls: [
        'http://localhost:5173',
        'https://dev.d15ghfl73jb9i6.amplifyapp.com/' // replace w env variable
      ],
    }
  },
  userAttributes: {
    fullname: {
      mutable: true,
      required: false,
    },
    email: {
      mutable: true,
      required: true
    },
    "custom:email-notifications": {
      dataType: "Boolean",
      mutable: true
    },
    phoneNumber: {
      mutable: true,
      required: false
    },
    "custom:text-notifications": {
      dataType: "Boolean",
      mutable: true
    }
  },
  groups: ["USERS", "ADMINS"] // probably don't need Users group, this is created by default
});
