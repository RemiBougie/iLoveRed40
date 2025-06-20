import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'mediaGallery', 
    access: (allow) => ({
        'media/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read']),
            allow.groups(["ADMINS"]).to(['read','write','delete'])
        ]
    })
});